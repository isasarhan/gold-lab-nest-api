import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SupplyPayment } from './schema/supply-payment.schema';
import { Model, Types } from 'mongoose';
import { CreateSupplyPaymentDto } from './dto/create.dto';
import { UpdateSupplyPaymentDto } from './dto/update.dto';
import { IFilter } from 'src/common/types/filter';
import { GetPaymentsFilterDto } from './dto/getAll.dto';
import { SupplierService } from 'src/modules/supplier/supplier.service';
import { Karat } from 'src/modules/order/schema/order.schema';

@Injectable()
export class SupplyPaymentService {
  constructor(@InjectModel(SupplyPayment.name) private readonly model: Model<SupplyPayment>,
    private supplierService: SupplierService,
  ) { }

  getKaratValue = (karat: Karat) => {
    switch (karat) {
      case Karat.K18:
        return 750
      case Karat.K21:
        return 875
      case Karat.K24:
        return 995
    }
  }
  create(dto: CreateSupplyPaymentDto) {
    return this.model.create(dto);
  }
  async createMany(dto: CreateSupplyPaymentDto[]) {
    const supplies = dto.map((supply) => {
      return {
        ...supply,
        supplier: new Types.ObjectId(supply.supplier),
      };
    });
    const addedPayments = await this.model.insertMany(supplies);
    await Promise.all(
      addedPayments.map((payment) => {
        const karat = this.getKaratValue(payment.karat)
        this.supplierService.updateBalance(payment.supplier.toString(),
          -(payment?.weight! * karat) / 995, -(payment?.cash || 0))
      }))

    return addedPayments
  }
  filter(args: GetPaymentsFilterDto): IFilter {
    return {
      ...args.supplier && { supplier: new Types.ObjectId(args.supplier) },
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

    const skip = (page - 1) * finalLimit;

    const [payments, total] = await Promise.all([
      this.model.find(filters).limit(finalLimit).skip(skip).populate('supplier').exec(),
      this.model.countDocuments(filters),
    ]);

    return {
      data: payments,
      total,
      page,
      pages: Math.ceil(total / finalLimit),
    };
  }

  findOne(id: string) {
    return this.model.findById(id).populate('supplier');
  }

  async update(id: string, dto: UpdateSupplyPaymentDto) {
    const updated = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Supply payment not found');
    return updated;
  }

  async remove(id: string) {
     const payment = await this.model.findById(id)
    if (!payment) throw new NotFoundException('Supply not found');
    
    const karat = this.getKaratValue(payment.karat)
    this.supplierService.updateBalance(payment.supplier.toString(),
          (payment?.weight! * karat) / 995, (payment.cash))
          
    return await this.model.findByIdAndDelete(id);

  }
}
