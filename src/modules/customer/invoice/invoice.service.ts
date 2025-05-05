import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice } from './schema/invoice.schema';
import { Model, Types } from 'mongoose';
import { CreateInvoiceDto } from './dto/create.dto';
import { UpdateInvoiceDto } from './dto/update.dto';
import { IFilter } from 'src/common/types/filter';
import { GetInvoicesFilterDto } from './dto/getAll.dto';

@Injectable()
export class InvoiceService {
  constructor(@InjectModel(Invoice.name) private model: Model<Invoice>) { }

  create(dto: CreateInvoiceDto) {
    return this.model.create(dto);
  }

  filter(args: GetInvoicesFilterDto): IFilter {
    return {
      ...args.customer && { customer: new Types.ObjectId(args.customer) },
      ...args.startDate && args.endDate && { date: { $gte: args.startDate, $lt: args.endDate } }
    }
  }

  findAll(filters: IFilter) {
    return this.model.find(filters).populate('customer')
  }

  findOne(id: string) {
    return this.model.findById(id).populate('customer').populate('orders');
  }

  async update(id: string, dto: UpdateInvoiceDto) {
    const updated = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Invoice not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.model.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Invoice not found');
    return deleted;
  }
}
