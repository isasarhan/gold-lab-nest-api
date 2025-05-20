import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { SupplyPaymentService } from './supply-payment.service';
import { CreateSupplyPaymentDto } from './dto/create.dto';
import { UpdateSupplyPaymentDto } from './dto/update.dto';
import { GetPaymentsFilterDto } from './dto/getAll.dto';

@Controller('supply-payments')
export class SupplyPaymentController {
  constructor(private readonly service: SupplyPaymentService) { }

  @Post()
  create(@Body() dto: CreateSupplyPaymentDto) {
    return this.service.create(dto);
  }
  @Post("add/bulk")
  createMany(@Body() dto: CreateSupplyPaymentDto[]) {
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
  update(@Param('id') id: string, @Body() dto: UpdateSupplyPaymentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
