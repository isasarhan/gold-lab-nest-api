import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EmployeeAttendence } from './schema/employee-attendence.schema';
import { CreateEmployeeAttendenceDto } from './dto/create.dto';
import { UpdateEmployeeAttendenceDto } from './dto/update.dto';
import * as XLSX from 'xlsx';
import { EmployeeService } from '../employee.service';
import { dateFormatter, excelDateToJSDate } from 'src/utils/date-utilities';
import { IFilter } from 'src/common/types/filter';
import { GetAttendenceFilterDto } from './dto/getAll.dto';

@Injectable()
export class EmployeeAttenndenceService {
    constructor(
        @InjectModel(EmployeeAttendence.name) private readonly model: Model<EmployeeAttendence>,
        private employeeService: EmployeeService,
    ) { }

    async create(dto: CreateEmployeeAttendenceDto): Promise<EmployeeAttendence> {
        const employeeAttenndence = new this.model(dto);
        return employeeAttenndence.save();
    }

    async createMany(dto: CreateEmployeeAttendenceDto[]) {

        const attendances = await Promise.all(
            dto.map(async (attendence) => {
                const employee = await this.employeeService.findOne(attendence.employee);
                if (employee) {
                    return {
                        ...attendence,
                        employee: new Types.ObjectId(attendence.employee),
                    };
                } else {
                    console.warn(`Employee not found: ${attendence.employee}`);
                    return null;
                }
            }),
        );

        const validAttendances = attendances.filter(Boolean);

        return this.model.insertMany(validAttendances);
    }

    async parseUploadedAttendence(file: Express.Multer.File) {
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });

        const worksheets = workbook.SheetNames.map(sheetName => {
            return {
                sheetName,
                data: XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]),
            };
        });
        let parseResult = worksheets[0].data

        const attendances = await Promise.all(parseResult.map(async (row: any) => {
            const { date, arrival, departure, phone } = row;

            const employee = await this.employeeService.findByPhone(phone)

            const baseDate = excelDateToJSDate(date)

            const arrivalTime = excelDateToJSDate(arrival)
            const departureTime = excelDateToJSDate(departure)

            const arrivalDateTime = new Date(baseDate.setHours(arrivalTime.getHours(), arrivalTime.getMinutes(), arrivalTime.getSeconds()));
            const departureDateTime = new Date(baseDate.setHours(departureTime.getHours(), departureTime.getMinutes(), departureTime.getSeconds()));

            return {
                employee: employee._id.toString(),
                arrival: arrivalDateTime,
                departure: departureDateTime,
            };
        }));

        return await this.createMany(attendances)

    }

    filter(args: GetAttendenceFilterDto): IFilter {
        const filter: IFilter = {};

        if (args.employee) {
            filter.employee = new Types.ObjectId(args.employee);
        }

        if (args.startDate && args.endDate) {
            filter.arrival = {
                $gte: new Date(args.startDate),
                $lt: new Date(args.endDate),
            };
        } else if (args.year && args.month) {
            const start = new Date(args.year, args.month - 1, 1); // months are 0-indexed
            const end = new Date(args.year, args.month, 1); // next month
            filter.arrival = {
                $gte: start,
                $lt: end,
            };
        } else if (args.year) {
            const start = new Date(args.year, 0, 1);
            const end = new Date(args.year + 1, 0, 1);
            filter.arrival = {
                $gte: start,
                $lt: end,
            };
        }

        return filter;
    }


    async findAll(filters: IFilter, page: number = 1, limit: number = 20) {
        const finalLimit = filters.pageSize || limit;

        if (!filters.employee) {
            return {
                data: [],
                total: 0,
                page: 1,
                pages: 0,
            };
        }

        const skip = (page - 1) * finalLimit;

        const [attendences, total] = await Promise.all([
            this.model.find(filters).limit(finalLimit).skip(skip).exec(),
            this.model.countDocuments(filters),
        ]);

        return {
            data: attendences.map((entry) => {
                const date = new Date(entry.arrival)
                const departureDate = new Date(entry.departure)
                return {
                    date: dateFormatter(date.toString()),
                    arrival: date.getHours() + date.getMinutes() / 60, // e.g. 5.5 = 5:30 AM
                    departure: departureDate.getHours() + departureDate.getMinutes() / 60, // e.g. 5.5 = 5:30 AM
                }
            }),
            total,
            page,
            pages: Math.ceil(total / finalLimit),
        };
    }

    async findOne(id: string): Promise<EmployeeAttendence> {
        const EmployeeAttenndence = await this.model.findById(id).exec();
        if (!EmployeeAttenndence) throw new NotFoundException('EmployeeAttenndence not found');
        return EmployeeAttenndence;
    }

    async update(id: string, dto: UpdateEmployeeAttendenceDto): Promise<EmployeeAttendence> {
        const employeeAttenndence = await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
        if (!employeeAttenndence) throw new NotFoundException('Employee attenndence not found');
        return employeeAttenndence;
    }

    async remove(id: string): Promise<void> {
        const result = await this.model.findByIdAndDelete(id).exec();
        if (!result) throw new NotFoundException('Employee attenndence not found');
    }
}
