import { Controller, Post, Get, Param, Put, Delete, Body, Query } from '@nestjs/common';
import { SupplyService } from './supply.service';
import { CreateSupplyDto } from './dto/create.dto';
import { UpdateSupplyDto } from './dto/update.dto';
import { GetSupplyFilterDto } from './dto/getAll.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '../user/schema/user.schema';

@Controller('supplies')
export class SupplyController {
  constructor(private readonly service: SupplyService) {}

  @Post()
  @Roles(Role.Admin, Role.Manager)
  create(@Body() dto: CreateSupplyDto) {
    return this.service.create(dto);
  }

  @Post("add/bulk")
  @Roles(Role.Admin, Role.Manager)
  createMany(@Body() dto: CreateSupplyDto[]) {
    return this.service.createMany(dto);
  }

  @Get()
  findAll(@Query() args: GetSupplyFilterDto) {
    const filters = this.service.filter(args)
    return this.service.findAll(filters, args.page, args.pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Roles(Role.Admin, Role.Manager)
  update(@Param('id') id: string, @Body() dto: UpdateSupplyDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.Manager)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
