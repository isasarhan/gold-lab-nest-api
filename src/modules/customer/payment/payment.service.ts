import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './schema/customer-payment.schema';
import { Model, Types } from 'mongoose';
import { CreateCustomerPaymentDto } from './dto/create.dto';
import { UpdateCustomerPaymentDto } from './dto/update.dto';
import { GetPaymentsFilterDto } from './dto/getAll.dto';
import { IFilter } from 'src/common/types/filter';
import { BalanceService } from 'src/modules/balance/balance.service';

@Injectable()
export class CustomerPaymentService {
  constructor(
    @InjectModel(Payment.name)
    private model: Model<Payment>,
    private balanceService: BalanceService,

  ) { }

  create(dto: CreateCustomerPaymentDto) {
    return this.model.create(dto);
  }
  async createMany(dto: CreateCustomerPaymentDto[]) {
    const payments = dto.map((payment) => {
      return {
        ...payment,
        customer: new Types.ObjectId(payment.customer),
      };
    });
    const addedPayments = await this.model.insertMany(payments);
    await Promise.all(
      addedPayments.map((payment) => {
        this.balanceService.updateByCustomer(payment.customer.toString(),
          -(payment?.weight! * payment.karat!) / 1000, -payment.cash!)
      }))

    return addedPayments
  }

  filter(args: GetPaymentsFilterDto): IFilter {
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

  async findAll(filters: IFilter, page: number = 1, limit: number = 30) {
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

    const [receipts, total] = await Promise.all([
      this.model.find(filters).limit(finalLimit).skip(skip).exec(),
      this.model.countDocuments(filters),
    ]);

    return {
      data: receipts,
      total,
      page,
      pages: Math.ceil(total / finalLimit),
    };
  }


  findOne(id: string) {
    return this.model.findById(id).populate('customer');
  }

  async update(id: string, dto: UpdateCustomerPaymentDto) {
    const updated = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Customer Payment not found');
    return updated;
  }

  async remove(id: string) {
    const receipt = await this.model.findById(id)
    if (!receipt)
      throw new NotFoundException('receipt not found!')
    this.balanceService.updateByCustomer(receipt.customer.toString(), -(receipt?.weight! * receipt.karat!) / 1000, -receipt.cash!)
    return await this.model.findByIdAndDelete(id);
  }

  async aggregateKaserGoldRevenue(customerId: string | null, year: number) {
    const match: any = {
      createdAt: {
        $gte: new Date(year, 0, 1),
        $lt: new Date(year + 1, 0, 1),
      },
    };

    if (customerId) {
      match.customer = customerId;
    }

    return this.model.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalCash: { $sum: "$cash" },
          totalWeight18k: {
            $sum: {
              $cond: [{ $eq: ["$karat", 740] }, "$weight", 0],
            },
          },
          totalWeight21k: {
            $sum: {
              $cond: [
                { $or: [{ $eq: ["$karat", 865] }, { $eq: ["$karat", 860] }] },
                "$weight",
                0,
              ],
            },
          },
          totalWeight995: {
            $sum: {
              $cond: [{ $eq: ["$karat", 995] }, "$weight", 0],
            },
          },
          totalWeight999: {
            $sum: {
              $cond: [{ $eq: ["$karat", 999.9] }, "$weight", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          totalCash: 1,
          totalWeight18k: 1,
          totalWeight21k: 1,
          totalWeight995: 1,
          totalWeight999: 1,
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

}
