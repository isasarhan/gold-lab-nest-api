import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Supply } from './schema/supply.schema';
import { Model } from 'mongoose';
import { CreateSupplyDto } from './dto/create.dto';
import { UpdateSupplyDto } from './dto/update.dto';

@Injectable()
export class SupplyService {
  constructor(@InjectModel(Supply.name) private readonly model: Model<Supply>) {}

  create(dto: CreateSupplyDto) {
    return this.model.create(dto);
  }

  findAll() {
    return this.model.find().populate('supplier').exec();
  }

  findOne(id: string) {
    return this.model.findById(id).populate('supplier').exec();
  }

  async update(id: string, dto: UpdateSupplyDto) {
    const updated = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Supply not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.model.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Supply not found');
    return deleted;
  }
}
