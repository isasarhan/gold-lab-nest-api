import { Controller, Post, Body, Get, Param, Put, Delete, Query } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { CreateBalanceDto } from './dto/create.dto';
import { UpdateBalanceDto } from './dto/update.dto';
import { GetBalanceFilterDto } from './dto/getAll.dto';

@Controller('balances')
export class BalanceController {
  constructor(private readonly service: BalanceService) { }

  @Post()
  create(@Body() dto: CreateBalanceDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() dto: GetBalanceFilterDto) {
    const sort = this.service.sort(dto.sort);
    const filter = this.service.filter(dto);
    return this.service.findAll(sort, filter, dto.page, dto.pageSize);
  }

  @Get('total')
  getTotals() {
    return this.service.getTotal();
  }


  @Get('customer/:id')
  findByCustomer(@Param('id') id: string) {
    return this.service.findByCustomer(id);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBalanceDto) {
    return this.service.update(id, dto);
  }

  @Put('customer/:id')
  updateByCustomer(@Param('id') id: string, @Body() dto: UpdateBalanceDto) {
    return this.service.updateByCustomer(id, dto.gold, dto.cash);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
