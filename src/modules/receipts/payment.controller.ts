import { Controller, Post, Get, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { CustomerPaymentService } from './payment.service';
import { CreateCustomerPaymentDto } from './dto/create.dto';
import { UpdateCustomerPaymentDto } from './dto/update.dto';
import { GetPaymentsFilterDto } from './dto/getAll.dto';

@Controller('receipts')
export class CustomerPaymentController {
  constructor(private readonly service: CustomerPaymentService) {}

  @Post("add")
  create(@Body() dto: CreateCustomerPaymentDto) {
    return this.service.create(dto);
  }
  @Post("add/bulk")
  createMany(@Body() dto: CreateCustomerPaymentDto[]) {
    return this.service.createMany(dto);
  }

  @Get()
  findAll(@Query() args: GetPaymentsFilterDto) {
    const filters = this.service.filter(args)
    return this.service.findAll(filters, args.page, args.pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCustomerPaymentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
