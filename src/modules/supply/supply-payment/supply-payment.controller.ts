import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { SupplyPaymentService } from './supply-payment.service';
import { CreateSupplyPaymentDto } from './dto/create.dto';
import { UpdateSupplyPaymentDto } from './dto/update.dto';

@Controller('supply-payments')
export class SupplyPaymentController {
  constructor(private readonly service: SupplyPaymentService) {}

  @Post()
  create(@Body() dto: CreateSupplyPaymentDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateSupplyPaymentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
