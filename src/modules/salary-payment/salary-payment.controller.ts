import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateSalaryPaymentDto } from './dto/create.dto';
import { SalaryPaymentService } from './salary-payment.service';
import { GetByEmployeeArgs } from './dto/get-by-employee';

@Controller('salary-payment')
export class SalaryPaymentController {
  constructor(private readonly service: SalaryPaymentService) { }

    @Post('add')
    create(@Body() dto: CreateSalaryPaymentDto){
        return this.service.create(dto)
    }

    // @Get()
    // findAll(){
    //     return this.service.findAll()
    // }
    
    @Get('employee/:id')
    findByEmployee(@Param('id') id: string, @Query() args:GetByEmployeeArgs){
        return this.service.findByEmployeeId(id, args)
    }

    @Get()
    findByMonthAndYear(@Query() args:GetByEmployeeArgs){
        console.log('args', args);
        
        return this.service.findByMonthAndYear(args)
    }
}
