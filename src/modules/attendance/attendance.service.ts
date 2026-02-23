import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EmployeeAttendance } from './schema/employee-attendance.schema';
import { CreateEmployeeAttendanceDto } from './dto/create.dto';
import { UpdateEmployeeAttendanceDto } from './dto/update.dto';
import * as XLSX from 'xlsx';
import { dateFormatter, excelDateToJSDate } from 'src/utils/date-utilities';
import { IFilter } from 'src/common/types/filter';
import { GetAttendanceFilterDto } from './dto/getAll.dto';
import { EmployeeService } from '../employee/employee.service';

@Injectable()
export class EmployeeAttendanceService {
    constructor(
        @InjectModel(EmployeeAttendance.name) private readonly model: Model<EmployeeAttendance>,
        private employeeService: EmployeeService,
    ) { }

    async create(dto: CreateEmployeeAttendanceDto): Promise<EmployeeAttendance> {
        const employeeAttendance = new this.model(dto);
        return employeeAttendance.save();
    }

    async createMany(dto: CreateEmployeeAttendanceDto[]) {

        const attendances = await Promise.all(
            dto.map(async (attendance) => {
                const employee = await this.employeeService.findOne(attendance.employee);
                if (employee) {
                    return {
                        ...attendance,
                        employee: new Types.ObjectId(attendance.employee),
                    };
                } else {
                    console.warn(`Employee not found: ${attendance.employee}`);
                    return null;
                }
            }),
        );

        const validAttendances = attendances.filter(Boolean);

        return this.model.insertMany(validAttendances);
    }

    async parseUploadedAttendance(file: Express.Multer.File) {
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

    filter(args: GetAttendanceFilterDto): IFilter {
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

        const [attendances, total] = await Promise.all([
            this.model.find(filters).limit(finalLimit).skip(skip).exec(),
            this.model.countDocuments(filters),
        ]);

        return {
            data: attendances.map((entry) => {
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

    async findOne(id: string): Promise<EmployeeAttendance> {
        const employeeAttendance = await this.model.findById(id).exec();
        if (!employeeAttendance) throw new NotFoundException('EmployeeAttendance not found');
        return employeeAttendance;
    }

    async update(id: string, dto: UpdateEmployeeAttendanceDto): Promise<EmployeeAttendance> {
        const employeeAttendance = await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
        if (!employeeAttendance) throw new NotFoundException('Employee attendance not found');
        return employeeAttendance;
    }

    async remove(id: string): Promise<void> {
        const result = await this.model.findByIdAndDelete(id).exec();
        if (!result) throw new NotFoundException('Employee attendance not found');
    }
}
