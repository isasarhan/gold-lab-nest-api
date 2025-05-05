import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SupplyPayment } from './schema/supply-payment.schema';
import { Model, Types } from 'mongoose';
import { CreateSupplyPaymentDto } from './dto/create.dto';
import { UpdateSupplyPaymentDto } from './dto/update.dto';
import { IFilter } from 'src/common/types/filter';
import { GetPaymentsFilterDto } from './dto/getAll.dto';

@Injectable()
export class SupplyPaymentService {
  constructor(@InjectModel(SupplyPayment.name) private readonly model: Model<SupplyPayment>) { }

  create(dto: CreateSupplyPaymentDto) {
    return this.model.create(dto);
  }

  filter(args: GetPaymentsFilterDto): IFilter {
    return {
      ...args.customer && { customer: new Types.ObjectId(args.customer) },
      ...args.startDate && args.endDate && { date: { $gte: args.startDate, $lt: args.endDate } }
    }
  }

  findAll(filters: IFilter) {
    return this.model.find(filters).populate('supplier');
  }

  findOne(id: string) {
    return this.model.findById(id).populate('supplier');
  }

  async update(id: string, dto: UpdateSupplyPaymentDto) {
    const updated = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Supply payment not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.model.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Supply payment not found');
    return deleted;
  }
}
