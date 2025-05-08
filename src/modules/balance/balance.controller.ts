import { Controller, Post, Body, Get, Param, Put, Delete } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { CreateBalanceDto } from './dto/create.dto';
import { UpdateBalanceDto } from './dto/update.dto';

@Controller('balances')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) { }

  @Post()
  create(@Body() dto: CreateBalanceDto) {
    return this.balanceService.create(dto);
  }

  @Get()
  findAll() {
    return this.balanceService.findAll();
  }

  @Get('total')
  getTotals() {
    return this.balanceService.getTotal();
  }


  @Get('customer/:id')
  findByCustomer(@Param('id') id: string) {
    return this.balanceService.findByCustomer(id);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.balanceService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBalanceDto) {
    return this.balanceService.update(id, dto);
  }

  @Put('customer/:id')
  updateByCustomer(@Param('id') id: string, @Body() dto: UpdateBalanceDto) {
    return this.balanceService.updateByCustomer(id, dto.gold, dto.cash);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.balanceService.remove(id);
  }
}
