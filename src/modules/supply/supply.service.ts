import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Supply } from './schema/supply.schema';
import { Model, Types } from 'mongoose';
import { CreateSupplyDto } from './dto/create.dto';
import { UpdateSupplyDto } from './dto/update.dto';
import { IFilter } from 'src/common/types/filter';
import { GetSupplyFilterDto } from './dto/getAll.dto';
import { SupplierService } from '../supplier/supplier.service';
import { Karat } from '../order/schema/order.schema';

@Injectable()
export class SupplyService {
  constructor(@InjectModel(Supply.name) private readonly model: Model<Supply>,
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
  create(dto: CreateSupplyDto) {
    return this.model.create(dto);
  }

  async createMany(dto: CreateSupplyDto[]) {
    const supplies = dto.map((supply) => {
      return {
        ...supply,
        supplier: new Types.ObjectId(supply.supplier),
      };
    });
    const addedSupplies = await this.model.insertMany(supplies);
    await Promise.all(
      addedSupplies.map((supply) => {
        const karat = this.getKaratValue(supply.karat)
        this.supplierService.updateBalance(supply.supplier.toString(),
          (supply?.weight! * karat) / 995, (supply.weight * supply.perGram)!)
      }))

    return addedSupplies
  }

  filter(args: GetSupplyFilterDto): IFilter {
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

  async findAll(filters: IFilter, page: number = 1, limit: number = 20) {
    const finalLimit = filters.pageSize || limit;

    const skip = (page - 1) * finalLimit;

    const [supplies, total] = await Promise.all([
      this.model.find(filters).limit(finalLimit).skip(skip).populate('supplier').exec(),
      this.model.countDocuments(filters),
    ]);

    return {
      data: supplies,
      total,
      page,
      pages: Math.ceil(total / finalLimit),
    };
  }


  findOne(id: string) {
    return this.model.findById(id).populate('supplier').exec();
  }

  async update(id: string, dto: UpdateSupplyDto) {
    const updated = await this.model.findByIdAndUpdate(id, dto, { new: true });
    if (!updated) throw new NotFoundException('Supply not found');
    return updated;
  }

  async remove(id: string) {
    const supply = await this.model.findById(id)
    if (!supply) throw new NotFoundException('Supply not found');
    
    const karat = this.getKaratValue(supply.karat)
    this.supplierService.updateBalance(supply.supplier.toString(),
          -(supply?.weight! * karat) / 995, -(supply.weight * supply.perGram)!)
    return await this.model.findByIdAndDelete(id);
  }
}
