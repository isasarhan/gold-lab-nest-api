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
    @InjectModel(Customer.name) private readonly model: Model<Customer>,
    @Inject(forwardRef(() => BalanceService)) private balanceService: BalanceService,
  ) { }

  async create(createCustomerDto: CreateCustomerDto) {
    const createdCustomer = new this.model(createCustomerDto);
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
  async findAll(filters: IFilter, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      this.model.find(filters).sort({ name: 1 }).limit(filters.pageSize || limit).skip(skip).exec(),
      this.model.countDocuments(),
    ]);

    return {
      data: events,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async getCustomerTypeAnalytics() {
    return this.model.aggregate([
      {
        $group: {
          _id: '$type',  
          count: { $sum: 1 }  
        }
      },
      { $sort: { _id: 1 } }
    ])
  }


  async findOne(id: string) {
    const customer = await this.model.findById(id).exec();
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.model.findByIdAndUpdate(id, updateCustomerDto, {
      new: true,
      runValidators: true,
    }).exec();
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async remove(id: string): Promise<void> {
    const result = await this.model.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Customer not found');
  }
}
