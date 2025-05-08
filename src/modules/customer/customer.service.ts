import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Customer } from './schema/customer.schema';
import { CreateCustomerDto } from './dto/create.dto';
import { UpdateCustomerDto } from './dto/update.dto';
import { BalanceService } from '../balance/balance.service';

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(Customer.name) private readonly customerModel: Model<Customer>,
    @Inject(forwardRef(() => BalanceService)) private balanceService: BalanceService,
  ) { }

  async create(createCustomerDto: CreateCustomerDto) {
    const createdCustomer = new this.customerModel(createCustomerDto);
    const customer = await createdCustomer.save();
    this.balanceService.create({ customer: createdCustomer._id.toString() })
    return customer
  }
  
  async findAll(): Promise<Customer[]> {
    return this.customerModel.find().exec();
  }

  async findOne(id: string) {
    const customer = await this.customerModel.findById(id).exec();
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.customerModel.findByIdAndUpdate(id, updateCustomerDto, {
      new: true,
      runValidators: true,
    }).exec();
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async remove(id: string): Promise<void> {
    const result = await this.customerModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Customer not found');
  }
}
