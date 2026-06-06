import { forwardRef, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Invoice } from './schema/invoice.schema';
import { Connection, Model, Types } from 'mongoose';
import { escapeRegex } from 'src/utils/escape-regex';
import { CreateInvoiceDto } from './dto/create.dto';
import { UpdateInvoiceDto } from './dto/update.dto';
import { IFilter } from 'src/common/types/filter';
import { GetInvoicesFilterDto } from './dto/getAll.dto';
import { OrderService } from 'src/modules/order/order.service';
import { parseKarat } from 'src/utils';
import { Karat } from 'src/modules/order/schema/order.schema';
import { BalanceService } from 'src/modules/balance/balance.service';

type OrderTotalsInput = {
  weight: number;
  perGram: number;
  perItem: number;
  quantity: number;
  karat: Karat;
};

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private model: Model<Invoice>,
    @InjectConnection() private connection: Connection,
    @Inject(forwardRef(() => OrderService)) private orderService: OrderService,
    private balanceService: BalanceService,
  ) { }

  async create(dto: CreateInvoiceDto) {
    const { orders, ...rest } = dto
    const orderResult = await this.orderService.createMany(dto.orders)

    const ordersIds = orderResult.map((order) => order._id)
    const { totalWeight, totalCash } = this.computeTotals(orderResult)

    const session = await this.connection.startSession()
    try {
      let invoice: any
      await session.withTransaction(async () => {
        await this.balanceService.updateByCustomer(dto.customer.toString(), totalWeight, totalCash)
        const [created] = await this.model.create(
          [{ ...rest, orders: ordersIds, customer: new Types.ObjectId(dto.customer), totalCash, totalWeight }],
          { session },
        )
        invoice = created
      })
      return invoice
    } catch (error) {
      await Promise.all(ordersIds.map(id => this.orderService.remove(id.toString())))
      throw new InternalServerErrorException('Failed to create invoice')
    } finally {
      await session.endSession()
    }
  }

  private computeTotals(orders: OrderTotalsInput[]) {
    return orders.reduce(
      (totals, order) => ({
        totalCash:
          totals.totalCash +
          (order.weight * order.perGram + order.perItem * order.quantity),
        totalWeight:
          totals.totalWeight + (order.weight * parseKarat(order.karat)) / 995,
      }),
      { totalCash: 0, totalWeight: 0 },
    );
  }

  filter(args: GetInvoicesFilterDto): IFilter {
    return {
      ...args.customer && { customer: new Types.ObjectId(args.customer) },
      ...args.startDate && args.endDate && { date: { $gte: new Date(args.startDate), $lt: new Date(args.endDate) } },
      ...args.searchTerm && {
        $or: [
          { invoiceNb: { $regex: escapeRegex(args.searchTerm), $options: 'i' } },
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
    const existing = await this.model.findById(id);
    if (!existing) throw new NotFoundException('Invoice not found');

    const { orders, customer, ...rest } = dto;
    const newCustomerId = (customer ?? existing.customer).toString();

    const session = await this.connection.startSession();
    let createdOrderIds: Types.ObjectId[] = [];
    try {
      let invoice: any;
      await session.withTransaction(async () => {
        // Reverse the existing invoice: undo its balance impact and drop its orders.
        await this.balanceService.updateByCustomer(
          existing.customer.toString(),
          -(existing.totalWeight ?? 0),
          -(existing.totalCash ?? 0),
        );
        await Promise.all(
          existing.orders.map((orderId) =>
            this.orderService.remove(orderId.toString()),
          ),
        );

        // Apply the new line items: recreate orders, recompute totals, re-credit balance.
        const created = await this.orderService.createMany(orders ?? []);
        createdOrderIds = created.map((order) => order._id);
        const { totalWeight, totalCash } = this.computeTotals(created);
        await this.balanceService.updateByCustomer(
          newCustomerId,
          totalWeight,
          totalCash,
        );

        invoice = await this.model.findByIdAndUpdate(
          id,
          {
            ...rest,
            orders: createdOrderIds,
            customer: new Types.ObjectId(newCustomerId),
            totalWeight,
            totalCash,
          },
          { new: true, session },
        );
      });
      return invoice;
    } catch (error) {
      await Promise.all(
        createdOrderIds.map((orderId) =>
          this.orderService.remove(orderId.toString()),
        ),
      );
      throw new InternalServerErrorException('Failed to update invoice');
    } finally {
      await session.endSession();
    }
  }

  // Removes a single order from an invoice: pulls it from the order list and
  // reverses just that line's contribution to the invoice totals and balance.
  async detachOrder(
    invoiceId: string,
    order: OrderTotalsInput & { _id: Types.ObjectId },
  ) {
    const invoice = await this.model.findById(invoiceId);
    if (!invoice) throw new NotFoundException('invoice not found!');

    const { totalWeight, totalCash } = this.computeTotals([order]);

    const session = await this.connection.startSession();
    try {
      await session.withTransaction(async () => {
        await this.balanceService.updateByCustomer(
          invoice.customer.toString(),
          -totalWeight,
          -totalCash,
        );
        await this.model.findByIdAndUpdate(
          invoiceId,
          {
            $pull: { orders: order._id },
            $inc: { totalWeight: -totalWeight, totalCash: -totalCash },
          },
          { session },
        );
      });
    } finally {
      await session.endSession();
    }
  }

  async remove(id: string) {
    const invoice = await this.model.findById(id)
    if (!invoice)
      throw new NotFoundException('invoice not found!')

    const session = await this.connection.startSession()
    try {
      await session.withTransaction(async () => {
        await Promise.all(
          invoice.orders.map((order) =>
            this.orderService.remove(order._id.toString())
          )
        )
        await this.balanceService.updateByCustomer(invoice.customer.toString(), -invoice.totalWeight, -invoice.totalCash)
        await this.model.findByIdAndDelete(id, { session })
      })
    } finally {
      await session.endSession()
    }
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
