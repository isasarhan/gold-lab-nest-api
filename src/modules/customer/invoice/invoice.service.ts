import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice } from './schema/invoice.schema';
import { Model } from 'mongoose';
import { CreateInvoiceDto } from './dto/create.dto';
import { UpdateInvoiceDto } from './dto/update.dto';

@Injectable()
export class InvoiceService {
  constructor(@InjectModel(Invoice.name) private model: Model<Invoice>) {}

  create(dto: CreateInvoiceDto) {
    return this.model.create(dto);
  }

  findAll() {
    return this.model.find().populate('customer').populate('orders');
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
