import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee } from './schema/employee.schema';
import { CreateEmployeeDto } from './dto/create.dto';
import { UpdateEmployeeDto } from './dto/update.dto';
import { IFilter } from 'src/common/types/filter';
import { GetEmployeeFilterDto } from './dto/getAll.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private readonly model: Model<Employee>,
  ) { }

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const employee = new this.model(dto);
    return employee.save();
  }
  filter(args: GetEmployeeFilterDto): IFilter {
    return {
      ...args.name && { name: args.name },
      ...args.email && { email: args.name },
      ...args.phone && { phone: args.name },
      ...args.searchTerm && {
        $or: [
          { name: { $regex: args.searchTerm, $options: 'i' } },
          { email: { $regex: args.searchTerm, $options: 'i' } },
          { phone: { $regex: args.searchTerm, $options: 'i' } },
        ],
      },
    }
  }
  async findAll(filters: IFilter, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      this.model.find(filters).limit(filters.pageSize || limit).skip(skip).exec(),
      this.model.countDocuments(),
    ]);

    return {
      data: events,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.model.findById(id).exec();
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }
  async findByPhone(phone: string) {
    const employee = await this.model.findOne({ phone }).exec();
    if (!employee) throw new NotFoundException(`Employee not found with number ${phone}`);
    return employee;
  }

  async update(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.model.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async remove(id: string): Promise<void> {
    const result = await this.model.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Employee not found');
  }
}
