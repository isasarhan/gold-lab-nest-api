import { Controller, Post, Get, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create.dto';
import { UpdateEmployeeDto } from './dto/update.dto';
import { GetEmployeeFilterDto } from './dto/getAll.dto';

@Controller('employees')
export class EmployeeController {
  constructor(private readonly service: EmployeeService) { }
  @Post("add")
  create(@Body() dto: CreateEmployeeDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() args: GetEmployeeFilterDto) {
    const filters = this.service.filter(args)
    return this.service.findAll(filters, args.page, args.pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
