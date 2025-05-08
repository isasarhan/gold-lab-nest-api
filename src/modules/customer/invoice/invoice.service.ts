import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice } from './schema/invoice.schema';
import { Model, Types } from 'mongoose';
import { CreateInvoiceDto } from './dto/create.dto';
import { UpdateInvoiceDto } from './dto/update.dto';
import { IFilter } from 'src/common/types/filter';
import { GetInvoicesFilterDto } from './dto/getAll.dto';

@Injectable()
export class InvoiceService {
  constructor(@InjectModel(Invoice.name) private model: Model<Invoice>) { }

  create(dto: CreateInvoiceDto) {
    return this.model.create(dto);
  }

  filter(args: GetInvoicesFilterDto): IFilter {
    return {
      ...args.customer && { customer: new Types.ObjectId(args.customer) },
      ...args.startDate && args.endDate && { date: { $gte: args.startDate, $lt: args.endDate } }
    }
  }

  findAll(filters: IFilter) {
    return this.model.find(filters).populate('customer')
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
    const deleted = await this.model.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Invoice not found');
    return deleted;
  }

  async aggregateYearlyRevenue(customerId: string | null, year: number) {
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
