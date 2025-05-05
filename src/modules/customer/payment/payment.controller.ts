import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { CustomerPaymentService } from './payment.service';
import { CreateCustomerPaymentDto } from './dto/create.dto';
import { UpdateCustomerPaymentDto } from './dto/update.dto';

@Controller('payments')
export class CustomerPaymentController {
  constructor(private readonly service: CustomerPaymentService) {}

  @Post()
  create(@Body() dto: CreateCustomerPaymentDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
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
