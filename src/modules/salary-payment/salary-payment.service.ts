import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SalaryReport } from './schema/salary-payment.schema';
import { Model, Types } from 'mongoose';
import { CreateSalaryPaymentDto } from './dto/create.dto';
import { EmployeeService } from '../employee/employee.service';
import { GetByEmployeeArgs } from './dto/get-by-employee';

@Injectable()
export class SalaryPaymentService {
    constructor(
        @InjectModel(SalaryReport.name) private readonly model: Model<SalaryReport>,
        @Inject() private employeeService: EmployeeService,

    ) { }

    async create(dto: CreateSalaryPaymentDto) {
        const employee = await this.employeeService.findOne(dto.employee);

        if (!employee) throw new NotFoundException('employee not found!');

        const report = await this.model.findOne({
            'date.month': dto.month,
            'date.year': dto.year,
            'employee._id': employee._id
        });

        const payment = {
            date: dto.date,
            amount: dto.amount,
            type: dto.type,
            description: dto.description
        };

        if (!report) {
            return this.model.create({
                date: {
                    month: dto.month,
                    year: dto.year
                },
                employee: {
                    _id: new Types.ObjectId(employee._id),
                    name: employee.name,
                    salary: employee.salary
                },
                payments: [payment]
            });
        }

        report.payments.push(payment);
        await report.save();
        return report;
    }

    async findAll() {
        return this.model.find()
    }

    async findByEmployeeId(employee: string, args: GetByEmployeeArgs) {
        const query: any = {
            'employee._id': new Types.ObjectId(employee)
        };

        query['date.year'] = args.year;

        if (args.month) {
            query['date.month'] = args.month;
        }

        return this.model.find(query);
    }
    
    async findByMonthAndYear(args: GetByEmployeeArgs) {
        const query: any = {
            'date.year': args.year
        };

        if (args.month) {
            query['date.month'] = args.month;
        }

        return this.model.find(query);
    }

}
