import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EmployeeAttenndence } from './schema/employee-attendence.schema';
import { CreateEmployeeAttendenceDto } from './dto/create.dto';
import { UpdateEmployeeAttendenceDto } from './dto/update.dto';
import * as XLSX from 'xlsx';
import { EmployeeService } from '../employee.service';
import { excelDateToJSDate } from 'src/utils/date-utilities';

@Injectable()
export class EmployeeAttenndenceService {
    constructor(
        @InjectModel(EmployeeAttenndence.name) private readonly model: Model<EmployeeAttenndence>,
        private employeeService: EmployeeService,
    ) { }

    async create(dto: CreateEmployeeAttendenceDto): Promise<EmployeeAttenndence> {
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
            if (!employee)
                throw new NotFoundException('Employee not found');

            const arrivalDateTime = new Date(
                excelDateToJSDate(date).setHours(
                    excelDateToJSDate(arrival).getHours(),
                    excelDateToJSDate(arrival).getMinutes()
                )
            );

            const departureDateTime = new Date(
                excelDateToJSDate(date).setHours(
                    excelDateToJSDate(departure).getHours(),
                    excelDateToJSDate(departure).getMinutes()
                )
            );

            return {
                employee: employee._id.toString(),
                arrival: arrivalDateTime,
                departure: departureDateTime,
            };
        }));

        return await this.createMany(attendances)
    }

    async findAll(): Promise<EmployeeAttenndence[]> {
        return this.model.find().exec();
    }

    async findOne(id: string): Promise<EmployeeAttenndence> {
        const EmployeeAttenndence = await this.model.findById(id).exec();
        if (!EmployeeAttenndence) throw new NotFoundException('EmployeeAttenndence not found');
        return EmployeeAttenndence;
    }

    async update(id: string, dto: UpdateEmployeeAttendenceDto): Promise<EmployeeAttenndence> {
        const employeeAttenndence = await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
        if (!employeeAttenndence) throw new NotFoundException('Employee attenndence not found');
        return employeeAttenndence;
    }

    async remove(id: string): Promise<void> {
        const result = await this.model.findByIdAndDelete(id).exec();
        if (!result) throw new NotFoundException('Employee attenndence not found');
    }
}
