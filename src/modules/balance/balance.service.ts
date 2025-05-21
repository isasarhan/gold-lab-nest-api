import { forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Balance, BalanceDocument } from './schema/balance.schema';
import { CreateBalanceDto } from './dto/create.dto';
import { UpdateBalanceDto } from './dto/update.dto';
import { CustomerService } from '../customer/customer.service';
import { BalancessSort, GetBalanceFilterDto } from './dto/getAll.dto';
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

  sort(sort?: BalancessSort): Record<string, 1 | -1> {
    const sortObject: Record<string, Record<string, 1 | -1>> = {
      HighestGold: { gold: -1 },
      HighestCash: { cash: -1 },
      LowestGold: { gold: 1 },
      LowestCash: { cash: 1 },
    }

    return sortObject[sort ?? 'HighestGold']
  }

  filter(args: GetBalanceFilterDto): Record<string, any>[] {
    const filters: any[] = [];

    if (args.searchTerm?.trim()) {
      filters.push({
        $or: [
          { 'customer.name': { $regex: args.searchTerm.trim(), $options: 'i' } }
        ]
      });
    }

    return filters;
  }
  async findAll(sort: Record<string, 1 | -1>, filters: Record<string, any>[], page: number = 1, limit: number = 30) {
    const skip = (page - 1) * limit;

    const pipeline: any[] = [
      {
        $lookup: {
          from: 'customers',
          localField: 'customer',
          foreignField: '_id',
          as: 'customer'
        }
      },
      {
        $unwind: {
          path: '$customer',
          preserveNullAndEmptyArrays: false
        }
      },
      ...(filters.length ? [{ $match: { $and: filters } }] : []),
      {
        $facet: {
          data: [
            { $sort: sort },
            { $skip: skip },
            { $limit: limit }
          ],
          totalCount: [
            { $count: 'count' }
          ]
        }
      }
    ];

    const result = await this.model.aggregate(pipeline).exec();
    const data = result[0]?.data || [];
    const total = result[0]?.totalCount[0]?.count || 0;

    return {
      data,
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
