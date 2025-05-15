import { forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import { Balance, BalanceDocument } from './schema/balance.schema';
import { CreateBalanceDto } from './dto/create.dto';
import { UpdateBalanceDto } from './dto/update.dto';
import { CustomerService } from '../customer/customer.service';

@Injectable()
export class BalanceService {
  constructor(
    @InjectModel(Balance.name) private readonly balanceModel: Model<Balance>,
    @Inject(forwardRef(() => CustomerService)) private customerService: CustomerService,

  ) { }

  async create(dto: CreateBalanceDto): Promise<BalanceDocument> {
    if (!dto?.customer)
      throw new NotFoundException('Customer Not Provided!');

    const customer = await this.customerService.findOne(dto.customer);
    if (!customer)
      throw new NotFoundException('Customer Not Found!');

    const balance = new this.balanceModel(dto);
    return balance.save();
  }

  async findAll(): Promise<Balance[]> {
    return this.balanceModel.find().populate('customer').exec();
  }

  async findOne(id: string): Promise<BalanceDocument> {
    const balance = await this.balanceModel.findById(id).populate('customer').exec();
    if (!balance) throw new NotFoundException('Balance not found');
    return balance;
  }

  async findByCustomer(customer: string) {
    if (!customer)
      throw new NotFoundException('Customer Not Provided!');

    const result = await this.customerService.findOne(customer);
    if (!result)
      throw new NotFoundException('Customer Not Found!');

    return await this.balanceModel.findById({ customer: result._id }).exec();
  }

  async getTotal() {
    const result = await this.balanceModel.aggregate([
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

    const balance = await this.balanceModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!balance) throw new NotFoundException('Balance not found');
    return balance;
  }

  async updateByCustomer(customerId: string, gold?: number, cash?: number) {
    console.log('customerId',customerId);
    
    try {
      const customer = await this.customerService.findOne(customerId);
      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      const balance = await this.findByCustomer(customerId);
      if (!balance) {
        throw new NotFoundException('Balance not found');
      }

      const updatedBalance = await this.balanceModel.findByIdAndUpdate(
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
      console.error('Failed to update balance:', error);
      throw new InternalServerErrorException('Unable to update balance');
    }
  }

  async remove(id: string | Types.ObjectId): Promise<void> {
    const result = await this.balanceModel.findByIdAndDelete(id).exec();
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
      console.error('Failed to delete balance:', error);
      throw new InternalServerErrorException('Unable to delete balance');
    }
  }


}
