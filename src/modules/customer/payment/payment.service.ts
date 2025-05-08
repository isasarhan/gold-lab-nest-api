import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from './schema/customer-payment.schema';
import { Model, Types } from 'mongoose';
import { CreateCustomerPaymentDto } from './dto/create.dto';
import { UpdateCustomerPaymentDto } from './dto/update.dto';
import { GetPaymentsFilterDto } from './dto/getAll.dto';
import { IFilter } from 'src/common/types/filter';

@Injectable()
export class CustomerPaymentService {
  constructor(
    @InjectModel(Payment.name)
    private model: Model<Payment>
  ) { }

  create(dto: CreateCustomerPaymentDto) {
    return this.model.create(dto);
  }
  
  filter(args: GetPaymentsFilterDto): IFilter {
    return {
      ...args.customer && { customer: new Types.ObjectId(args.customer) },
      ...args.startDate && args.endDate && { date: { $gte: args.startDate, $lt: args.endDate } }
    }
  }

  findAll(filters: IFilter) {
    return this.model.find(filters).populate('customer')
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
    const deleted = await this.model.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Customer Payment not found');
    return deleted;
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
