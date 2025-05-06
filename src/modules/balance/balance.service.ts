import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Balance } from './schema/balance.schema';
import { CreateBalanceDto } from './dto/create.dto';
import { UpdateBalanceDto } from './dto/update.dto';
import { CustomerService } from '../customer/customer.service';

@Injectable()
export class BalanceService {
  constructor(
    @InjectModel(Balance.name) private readonly balanceModel: Model<Balance>,
    private customerService: CustomerService,

  ) { }

  async create(dto: CreateBalanceDto): Promise<Balance> {
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

  async findOne(id: string): Promise<Balance> {
    const balance = await this.balanceModel.findById(id).populate('customer').exec();
    if (!balance) throw new NotFoundException('Balance not found');
    return balance;
  }

  async findByCustomer(customer: string){
    if (!customer)
      throw new NotFoundException('Customer Not Provided!');
    
    const result = await this.customerService.findOne(customer);
    if (!result)
      throw new NotFoundException('Customer Not Found!');

    const balance = await this.balanceModel.findById({ customer:result._id }).populate('customer').exec();
    if (!balance) throw new NotFoundException('Balance not found');
    return balance;
  }

  async update(id: string, dto: UpdateBalanceDto): Promise<Balance> {
    if (!dto?.customer)
      throw new NotFoundException('Customer Not Provided!');
    
    const customer = await this.customerService.findOne(dto.customer);
    if (!customer)
      throw new NotFoundException('Customer Not Found!');

    const balance = await this.balanceModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!balance) throw new NotFoundException('Balance not found');
    return balance;
  }

  async remove(id: string): Promise<void> {
    const result = await this.balanceModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Balance not found');
  }

  async updateCustomerBalance(customerId: string, gold: number, cash: number) {
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
}
