import { Injectable, NotFoundException } from '@nestjs/common';
import { DailyWorkflow, ReportBalance } from './schema/daily-workflow.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDailyWorkflowDto } from './dto/create.dto';
import { UpdateDailyWorkflowDto } from './dto/update.dto';

@Injectable()
export class DailyWorkflowService {
    constructor(
        @InjectModel(DailyWorkflow.name) private readonly model: Model<DailyWorkflow>,
    ) { }

    async create(dto: CreateDailyWorkflowDto) {
        const balanceMap = new Map<string, ReportBalance>();

        for (const report of dto.reports) {
            const { from, to, karat, weight = 0, quantity = 0 } = report;

            const fromKey = `${from}_${karat}`;
            const toKey = `${to}_${karat}`;

            if (!balanceMap.has(fromKey)) {
                balanceMap.set(fromKey, {
                    sector: from,
                    karat,
                    weight: 0,
                    quantity: 0,
                });
            }
            const fromBalance = balanceMap.get(fromKey)!;
            fromBalance.weight -= weight;
            fromBalance.quantity -= quantity;

            if (!balanceMap.has(toKey)) {
                balanceMap.set(toKey, {
                    sector: to,
                    karat,
                    weight: 0,
                    quantity: 0,
                });
            }
            const toBalance = balanceMap.get(toKey)!;
            toBalance.weight += weight;
            toBalance.quantity += quantity;
        }

        const balances = Array.from(balanceMap.values());

        const created = new this.model({
            ...dto,
            balances,
        });

        return created.save();
    }

    async update(id: string, dto: UpdateDailyWorkflowDto) {
        const workflow = await this.model.findById(id)
        if (!workflow)
            throw new NotFoundException('workflow not found!')

        if (!dto.reports)
            throw new NotFoundException('workflow has no reports!')

        const balanceMap = new Map<string, ReportBalance>();

        for (const report of dto.reports) {
            const { from, to, karat, weight = 0, quantity = 0 } = report;

            const fromKey = `${from}_${karat}`;
            const toKey = `${to}_${karat}`;

            if (!balanceMap.has(fromKey)) {
                balanceMap.set(fromKey, {
                    sector: from,
                    karat,
                    weight: 0,
                    quantity: 0,
                });
            }
            const fromBalance = balanceMap.get(fromKey)!;
            fromBalance.weight -= weight;
            fromBalance.quantity -= quantity;

            if (!balanceMap.has(toKey)) {
                balanceMap.set(toKey, {
                    sector: to,
                    karat,
                    weight: 0,
                    quantity: 0,
                });
            }
            const toBalance = balanceMap.get(toKey)!;
            toBalance.weight += weight;
            toBalance.quantity += quantity;
        }

        const balances = Array.from(balanceMap.values());
        return this.model.findByIdAndUpdate(id, {
            ...dto,
            balances,
        })
    }

    findAll() {
        return this.model.find().exec()
    }
    findOne(id: string) {
        return this.model.findById(id).exec();
    }
    async findByDate(dateStr: string) {
        const date = new Date(dateStr);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        const report = await this.model.findOne({
            date: { $gte: startOfDay, $lte: endOfDay },
        }).exec();

        return report || null;
    }

}
