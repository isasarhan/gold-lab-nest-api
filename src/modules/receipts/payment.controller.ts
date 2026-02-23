import { Controller, Post, Get, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { CustomerPaymentService } from './payment.service';
import { CreateCustomerPaymentDto } from './dto/create.dto';
import { UpdateCustomerPaymentDto } from './dto/update.dto';
import { GetPaymentsFilterDto } from './dto/getAll.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '../user/schema/user.schema';

@Controller('receipts')
export class CustomerPaymentController {
  constructor(private readonly service: CustomerPaymentService) {}

  @Post("add")
  @Roles(Role.Admin, Role.Manager)
  create(@Body() dto: CreateCustomerPaymentDto) {
    return this.service.create(dto);
  }

  @Post("add/bulk")
  @Roles(Role.Admin, Role.Manager)
  createMany(@Body() dto: CreateCustomerPaymentDto[]) {
    return this.service.createMany(dto);
  }

  @Get()
  @Roles(Role.Admin, Role.Manager, Role.Moderator)
  findAll(@Query() args: GetPaymentsFilterDto) {
    const filters = this.service.filter(args)
    return this.service.findAll(filters, args.page, args.pageSize);
  }

  @Get(':id')
  @Roles(Role.Admin, Role.Manager, Role.Moderator)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Roles(Role.Admin, Role.Manager)
  update(@Param('id') id: string, @Body() dto: UpdateCustomerPaymentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.Manager)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
