import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './schema/customer-payment.schema';
import { Model, Types } from 'mongoose';
import { CreateCustomerPaymentDto } from './dto/create.dto';
import { UpdateCustomerPaymentDto } from './dto/update.dto';
import { GetPaymentsFilterDto } from './dto/getAll.dto';
import { IFilter } from 'src/common/types/filter';

@Injectable()
export class CustomerPaymentService {
  constructor(
    @InjectModel(Payment.name)
    private model: Model<Payment>
  ) { }

  create(dto: CreateCustomerPaymentDto) {
    return this.model.create(dto);
  }
  
  filter(args: GetPaymentsFilterDto): IFilter {
    return {
      ...args.customer && { customer: new Types.ObjectId(args.customer) },
      ...args.startDate && args.endDate && { date: { $gte: args.startDate, $lt: args.endDate } }
    }
  }

  findAll(filters: IFilter) {
    return this.model.find(filters).populate('customer')
  }

  findOne(id: string) {
    return this.model.findById(id).populate('customer');
  }

  async update(id: string, dto: UpdateCustomerPaymentDto) {
    const updated = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Customer Payment not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.model.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Customer Payment not found');
    return deleted;
  }
}
