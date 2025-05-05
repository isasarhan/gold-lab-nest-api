import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Supplier } from './schema/supplier.schema';
import { CreateSupplierDto } from './dto/create.dto';
import { UpdateSupplierDto } from './dto/update.dto';

@Injectable()
export class SupplierService {
  constructor(
    @InjectModel(Supplier.name) private readonly model: Model<Supplier>,
  ) {}

  create(dto: CreateSupplierDto) {
    return this.model.create(dto);
  }

  findAll() {
    return this.model.find().exec();
  }

  findOne(id: string) {
    return this.model.findById(id).exec();
  }

  async update(id: string, dto: UpdateSupplierDto) {
    const updated = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Supplier not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.model.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Supplier not found');
    return deleted;
  }
}
