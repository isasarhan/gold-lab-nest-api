import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Put,
    Delete,
  } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { Customer } from './schema/customer.schema';
import { CreateCustomerDto } from './dto/create.dto';
import { UpdateCustomerDto } from './dto/update.dto';

  
  @Controller('customers')
  export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}
  
    @Post('add')
    create(@Body() createCustomerDto: CreateCustomerDto): Promise<Customer> {
      return this.customerService.create(createCustomerDto);
    }
  
    @Get()
    findAll(): Promise<Customer[]> {
      return this.customerService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id') id: string): Promise<Customer> {
      return this.customerService.findOne(id);
    }
  
    @Put(':id')
    update(
      @Param('id') id: string,
      @Body() updateCustomerDto: UpdateCustomerDto,
    ): Promise<Customer> {
      return this.customerService.update(id, updateCustomerDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
      return this.customerService.remove(id);
    }
  }
  