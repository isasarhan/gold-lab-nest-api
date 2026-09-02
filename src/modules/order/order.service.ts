import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from './schema/order.schema';
import { CreateOrderDto } from './dto/create.dto';
import { UpdateOrderDto } from './dto/update.dto';
import { InvoiceService } from '../invoice/invoice.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private readonly model: Model<Order>,
    @Inject(forwardRef(() => InvoiceService)) private invoiceService: InvoiceService,
  ) { }

  create(dto: CreateOrderDto) {
    return this.model.create(dto);
  }

  createMany(dto: CreateOrderDto[]) {
    const orders = dto.map((order) => {
      return {
        ...order,
        customer: new Types.ObjectId(order.customer),
      };
    });

    return this.model.insertMany(orders);

  }

  findAll() {
    return this.model.find().populate('customer').exec();
  }

  findOne(id: string) {
    return this.model.findById(id).populate('customer').exec();
  }

  async findByCustomerId(id: string) {
    return await this.model.find().where({ customer: id }).populate("customer");
  }

  aggregateTypeBreakdown(customerId: string | null, start: Date, end: Date) {
    const match: Record<string, any> = { date: { $gte: start, $lt: end } };
    if (customerId) {
      match.customer = new Types.ObjectId(customerId);
    }
    return this.model.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$quantity' },
          totalWeight: { $sum: '$weight' },
          totalCash: {
            $sum: {
              $add: [
                { $multiply: ['$weight', '$perGram'] },
                { $multiply: ['$perItem', '$quantity'] },
              ],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  async update(id: string, dto: UpdateOrderDto) {
    const updated = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Order not found');
    return updated;
  }

  async remove(id: string, invoiceId?: string) {
    const order = await this.model.findById(id)
    if (!order)
      throw new NotFoundException('order not found!')

    if (!invoiceId) {
      const deleted = await this.model.findByIdAndDelete(order._id);
      if (!deleted) throw new NotFoundException('order not found');
      return deleted;
    }

    await this.invoiceService.detachOrder(invoiceId, order)

    const deleted = await this.model.findByIdAndDelete(order._id);
    if (!deleted) throw new NotFoundException('order not found');
    return deleted;
  }
}
