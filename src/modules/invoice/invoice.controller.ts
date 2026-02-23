import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create.dto';
import { UpdateInvoiceDto } from './dto/update.dto';
import { GetInvoicesFilterDto } from './dto/getAll.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '../user/schema/user.schema';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly service: InvoiceService) {}

  @Post('add')
  @Roles(Role.Admin, Role.Manager)
  create(@Body() dto: CreateInvoiceDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(Role.Admin, Role.Manager, Role.Moderator)
  findAll(@Query() args:GetInvoicesFilterDto) {
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
  update(@Param('id') id: string, @Body() dto: UpdateInvoiceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.Manager)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}