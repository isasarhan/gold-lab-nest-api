import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SupplyPayment } from './schema/supply-payment.schema';
import { Model } from 'mongoose';
import { CreateSupplyPaymentDto } from './dto/create.dto';
import { UpdateSupplyPaymentDto } from './dto/update.dto';

@Injectable()
export class SupplyPaymentService {
  constructor(@InjectModel(SupplyPayment.name) private readonly model: Model<SupplyPayment>) {}

  create(dto: CreateSupplyPaymentDto) {
    return this.model.create(dto);
  }

  findAll() {
    return this.model.find().populate('supplier');
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
