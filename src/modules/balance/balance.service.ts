import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Balance } from './schema/balance.schema';
import { CreateBalanceDto } from './dto/create.dto';
import { UpdateBalanceDto } from './dto/update.dto';

@Injectable()
export class BalanceService {
  constructor(
    @InjectModel(Balance.name) private readonly balanceModel: Model<Balance>,
  ) {}

  async create(dto: CreateBalanceDto): Promise<Balance> {
    const balance = new this.balanceModel(dto);
    return balance.save();
  }

  async findAll(): Promise<Balance[]> {
    return this.balanceModel.find().populate('customer').exec();
  }

  async findOne(id: string): Promise<Balance> {
    const balance = await this.balanceModel.findById(id).populate('customer').exec();
    if (!balance) throw new NotFoundException('Balance not found');
    return balance;
  }

  async update(id: string, dto: UpdateBalanceDto): Promise<Balance> {
    const balance = await this.balanceModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!balance) throw new NotFoundException('Balance not found');
    return balance;
  }

  async remove(id: string): Promise<void> {
    const result = await this.balanceModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Balance not found');
  }
}
