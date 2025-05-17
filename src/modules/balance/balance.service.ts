import { forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Balance, BalanceDocument } from './schema/balance.schema';
import { CreateBalanceDto } from './dto/create.dto';
import { UpdateBalanceDto } from './dto/update.dto';
import { CustomerService } from '../customer/customer.service';
import { GetBalanceFilterDto } from './dto/getAll.dto';
import { IFilter } from 'src/common/types/filter';

@Injectable()
export class BalanceService {
  constructor(
    @InjectModel(Balance.name) private readonly model: Model<Balance>,
    @Inject(forwardRef(() => CustomerService)) private customerService: CustomerService,

  ) { }

  async create(dto: CreateBalanceDto): Promise<BalanceDocument> {
    if (!dto?.customer)
      throw new NotFoundException('Customer Not Provided!');

    const customer = await this.customerService.findOne(dto.customer);
    if (!customer)
      throw new NotFoundException('Customer Not Found!');

    const balance = new this.model({ ...dto, customer: customer._id });
    return balance.save();
  }

  filter(args: GetBalanceFilterDto): IFilter {
    return {
      ...args.searchTerm && {
        $or: [
          { name: { $regex: args.searchTerm, $options: 'i' } },
          { email: { $regex: args.searchTerm, $options: 'i' } },
          { phone: { $regex: args.searchTerm, $options: 'i' } },
        ],
      },
    }
  }
  async findAll(filters: IFilter, page: number = 1, limit: number = 30) {
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      this.model.find().limit(filters.pageSize || limit).skip(skip).populate('customer').exec(),
      this.model.countDocuments(),
    ]);

    return {
      data: events,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<BalanceDocument> {

    const balance = await this.model.findById(id).populate('customer').exec();
    if (!balance) throw new NotFoundException('Balance not found');
    return balance;
  }

  async findByCustomer(customer: string) {
    if (!customer)
      throw new NotFoundException('Customer Not Provided!');

    const result = await this.customerService.findOne(customer);
    if (!result)
      throw new NotFoundException('Customer Not Found!');
    return await this.model.findOne({ customer: result._id }).exec();
  }

  async getTotal() {
    const result = await this.model.aggregate([
      {
        $group: {
          _id: null,
          totalGoldPositive: {
            $sum: {
              $cond: [{ $gt: ['$gold', 0] }, '$gold', 0],
            },
          },
          totalGoldNegative: {
            $sum: {
              $cond: [{ $lt: ['$gold', 0] }, '$gold', 0],
            },
          },
          totalCashPositive: {
            $sum: {
              $cond: [{ $gt: ['$cash', 0] }, '$cash', 0],
            },
          },
          totalCashNegative: {
            $sum: {
              $cond: [{ $lt: ['$cash', 0] }, '$cash', 0],
            },
          },
        },
      },
    ]);

    return result[0] || { totalGoldPositive: 0, totalGoldNegative: 0, totalCashPositive: 0, totalCashNegative: 0 };
  }

  async update(id: string, dto: UpdateBalanceDto): Promise<BalanceDocument> {
    if (!dto?.customer)
      throw new NotFoundException('Customer Not Provided!');

    const customer = await this.customerService.findOne(dto.customer);
    if (!customer)
      throw new NotFoundException('Customer Not Found!');

    const balance = await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!balance) throw new NotFoundException('Balance not found');
    return balance;
  }

  async updateByCustomer(customerId: string, gold?: number, cash?: number) {

    try {
      const customer = await this.customerService.findOne(customerId);
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      const balance = await this.findByCustomer(customerId);
      if (!balance) {
        throw new NotFoundException('Balance not found');
      }

      const updatedBalance = await this.model.findByIdAndUpdate(
        balance._id,
        {
          $inc: {
            gold,
            cash,
          },
        },
        { new: true },
      );

      return updatedBalance;
    } catch (error) {
      throw new InternalServerErrorException('Unable to update balance');
    }
  }

  async remove(id: string | Types.ObjectId): Promise<void> {
    const result = await this.model.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Balance not found');
  }

  async removeByCustomer(customerId: string) {
    try {
      const balance = await this.findByCustomer(customerId);

      if (!balance) {
        throw new NotFoundException('Balance not found');
      }

      await this.remove(balance._id);
    } catch (error) {
      throw new InternalServerErrorException('Unable to delete balance');
    }
  }


}
