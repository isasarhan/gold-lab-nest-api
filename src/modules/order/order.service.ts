import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schema/order.schema';
import { CreateOrderDto } from './dto/create.dto';
import { UpdateOrderDto } from './dto/update.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly model: Model<Order>,
  ) {}

  create(dto: CreateOrderDto) {
    return this.model.create(dto);
  }

  findAll() {
    return this.model.find().populate('customer').exec();
  }

  findOne(id: string) {
    return this.model.findById(id).populate('customer').exec();
  }

  async update(id: string, dto: UpdateOrderDto) {
    const updated = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Order not found');
    return updated;
  }

  async remove(id: string) {
    const deleted = await this.model.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Order not found');
    return deleted;
  }
}
