import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Customer } from './schema/customer.schema';
import { CreateCustomerDto } from './dto/create.dto';
import { UpdateCustomerDto } from './dto/update.dto';
import { BalanceService } from '../balance/balance.service';
import { IFilter } from 'src/common/types/filter';
import { GetCustomerFilterDto } from './dto/getAll.dto';

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

  filter(args: GetCustomerFilterDto): IFilter {
    return {
      ...args.name && { name: args.name },
      ...args.email && { email: args.name },
      ...args.phone && { phone: args.name },
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
      this.customerModel.find(filters).limit(filters.pageSize || limit).skip(skip).exec(),
      this.customerModel.countDocuments(),
    ]);

    return {
      data: events,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
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
