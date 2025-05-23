import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice } from './schema/invoice.schema';
import { Model, Types } from 'mongoose';
import { CreateInvoiceDto } from './dto/create.dto';
import { UpdateInvoiceDto } from './dto/update.dto';
import { IFilter } from 'src/common/types/filter';
import { GetInvoicesFilterDto } from './dto/getAll.dto';
import { OrderService } from 'src/modules/order/order.service';
import { Karat } from 'src/modules/order/schema/order.schema';
import { parseKarat } from 'src/utils';
import { BalanceService } from 'src/modules/balance/balance.service';

@Injectable()
export class InvoiceService {
  constructor(@InjectModel(Invoice.name) private model: Model<Invoice>,
    @Inject(forwardRef(() => OrderService)) private orderService: OrderService,
    private balanceService: BalanceService,
  ) { }

  async create(dto: CreateInvoiceDto) {
    const { orders, ...rest } = dto
    const orderResult = await this.orderService.createMany(dto.orders)

    let ordersIds: Types.ObjectId[] = []
    let totalWeight = 0
    let totalCash = 0

    orderResult.forEach((order) => {
      ordersIds.push(order._id)
      totalCash += order.weight * order.perGram + (order.perItem * order.quantity);
      totalWeight += order.weight * parseKarat(order.karat) / 995;
    })
    await this.balanceService.updateByCustomer(dto.customer.toString(), totalWeight, totalCash)
    return this.model.create({ ...rest, orders: ordersIds, customer: new Types.ObjectId(dto.customer), totalCash, totalWeight });
  }

  filter(args: GetInvoicesFilterDto): IFilter {
    return {
      ...args.customer && { customer: new Types.ObjectId(args.customer) },
      ...args.startDate && args.endDate && { date: { $gte: new Date(args.startDate), $lt: new Date(args.endDate) } },
      ...args.searchTerm && {
        $or: [
          { invoiceNb: { $regex: args.searchTerm, $options: 'i' } },
        ],
      },
    }
  }

  async findAll(filters: IFilter, page: number = 1, limit: number = 20) {
    const finalLimit = filters.pageSize || limit;

    if (!filters.customer) {
      return {
        data: [],
        total: 0,
        page: 1,
        pages: 0,
      };
    }

    const skip = (page - 1) * finalLimit;

    const [invoices, total] = await Promise.all([
      this.model.find(filters).limit(finalLimit).skip(skip).exec(),
      this.model.countDocuments(filters),
    ]);

    return {
      data: invoices,
      total,
      page,
      pages: Math.ceil(total / finalLimit),
    };
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
    const invoice = await this.model.findById(id)
    if (!invoice)
      throw new NotFoundException('invoice not found!')

    await Promise.all(
      invoice.orders.map((order) =>
        this.orderService.remove(order._id.toString())
      )
    );
    await this.balanceService.updateByCustomer(invoice.customer.toString(), -invoice.totalWeight, -invoice.totalCash)

    return await this.model.findByIdAndDelete(id);
  }

  async aggregateYearlyRevenue(customerId: string | null, year: number) {
    const start = new Date(Date.UTC(year, 0, 1));
    const end = new Date(Date.UTC(year + 1, 0, 1));
    const match: any = {
      date: {
        $gte: start,
        $lt: end,
      },
    };

    if (customerId) {
      match.customer = new Types.ObjectId(customerId);
    }

    return this.model.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $month: "$date" },
          totalCash: { $sum: "$totalCash" },
          totalWeight: { $sum: "$totalWeight" },
        },
      },
      {
        $project: {
          _id: 1,
          totalCash: 1,
          totalWeight: 1,
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  async findGroupedByCustomerAndDate(startDate: Date, endDate: Date) {

    const result = await this.model.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
      },
      {
        $group: {
          _id: {
            customerId: '$customer'
          },
          totalWeight: { $sum: '$totalWeight' },
          totalCash: { $sum: '$totalCash' }
        }
      },
      {
        $lookup: {
          from: 'customers',
          localField: '_id.customerId',
          foreignField: '_id',
          as: 'customerDetails'
        }
      },
      {
        $unwind: {
          path: '$customerDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 0,
          customer: '$customerDetails.name',
          totalWeight: { $ifNull: ['$totalWeight', 0] },
          totalCash: { $ifNull: ['$totalCash', 0] }
        }
      },
      {
        $sort: { customer: 1 }
      }
    ]);
    return result;

  }
}
