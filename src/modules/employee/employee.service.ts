import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee } from './schema/employee.schema';
import { CreateEmployeeDto } from './dto/create.dto';
import { UpdateEmployeeDto } from './dto/update.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private readonly employeeModel: Model<Employee>,
  ) { }

  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const employee = new this.employeeModel(dto);
    return employee.save();
  }

  async findAll(): Promise<Employee[]> {
    return this.employeeModel.find().exec();
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeModel.findById(id).exec();
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }
  async findByPhone(phone: string){
    const employee = await this.employeeModel.findOne({ phone }).exec();
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async update(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.employeeModel.findByIdAndUpdate(id, dto, { new: true }).exec();
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async remove(id: string): Promise<void> {
    const result = await this.employeeModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Employee not found');
  }
}
