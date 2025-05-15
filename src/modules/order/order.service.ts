import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from './schema/order.schema';
import { CreateOrderDto } from './dto/create.dto';
import { UpdateOrderDto } from './dto/update.dto';
import { InvoiceService } from '../customer/invoice/invoice.service';
import { parseKarat } from 'src/utils';

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

    const invoice = await this.invoiceService.findOne(invoiceId)
    if (!invoice)
      throw new NotFoundException('invoice not found!')

    let orders: Types.ObjectId[] = invoice.orders.filter(
      (id) => !id.equals(order._id)
    );
    let totalWeight = invoice.totalWeight
    let totalCash = invoice.totalCash

    totalCash -= order.weight * order.perGram + (order.perItem * order.quantity);
    totalWeight -= order.weight * parseKarat(order.karat) / 995;

    await this.invoiceService.update(invoiceId, { orders, totalWeight, totalCash })

    const deleted = await this.model.findByIdAndDelete(order._id);
    if (!deleted) throw new NotFoundException('order not found');
    return deleted;
  }
}
