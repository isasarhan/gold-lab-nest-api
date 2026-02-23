import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './schema/customer.schema';
import { CreateCustomerDto } from './dto/create.dto';
import { UpdateCustomerDto } from './dto/update.dto';
import { GetCustomerFilterDto } from './dto/getAll.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '../user/schema/user.schema';


@Controller('customers')
export class CustomerController {
  constructor(private readonly service: CustomerService) { }

  @Post('add')
  @Roles(Role.Admin, Role.Manager)
  create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
    return this.service.create(createCustomerDto);
  }

  @Get()
  findAll(@Query() args: GetCustomerFilterDto) {
    const filters = this.service.filter(args)
    return this.service.findAll(filters, args.page, args.pageSize);
  }

  @Get('types')
  getCustomerTypeAnalytics() {
    return this.service.getCustomerTypeAnalytics()
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Customer> {
    return this.service.findOne(id);
  }

  @Put(':id')
  @Roles(Role.Admin, Role.Manager)
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.service.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.Manager)
  remove(@Param('id') id: string): Promise<void> {
    return this.service.remove(id);
  }
}
