import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory } from './schema/inventory.schema';
import { CreateInventoryDto } from './dto/create.dto';
import { UpdateInventoryDto } from './dto/update.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name) private readonly inventoryModel: Model<Inventory>,
  ) {}

  async create(dto: CreateInventoryDto): Promise<Inventory> {
    const item = new this.inventoryModel(dto);
    return item.save();
  }

  async findAll(): Promise<Inventory[]> {
    return this.inventoryModel.find().exec();
  }

  async findOne(id: string): Promise<Inventory> {
    const item = await this.inventoryModel.findById(id).exec();
    if (!item) throw new NotFoundException('Inventory item not found');
    return item;
  }

  async update(id: string, dto: UpdateInventoryDto): Promise<Inventory> {
    const item = await this.inventoryModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!item) throw new NotFoundException('Inventory item not found');
    return item;
  }

  async remove(id: string): Promise<void> {
    const result = await this.inventoryModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Inventory item not found');
  }
}
