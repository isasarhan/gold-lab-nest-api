import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateSalaryPaymentDto } from './dto/create.dto';
import { SalaryPaymentService } from './salary-payment.service';
import { GetByEmployeeArgs } from './dto/get-by-employee';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '../user/schema/user.schema';

@Controller('salary-payment')
export class SalaryPaymentController {
  constructor(private readonly service: SalaryPaymentService) { }

    @Post('add')
    @Roles(Role.Admin, Role.Manager)
    create(@Body() dto: CreateSalaryPaymentDto){
        return this.service.create(dto)
    }

    @Get('employee/:id')
    @Roles(Role.Admin, Role.Manager, Role.Moderator)
    findByEmployee(@Param('id') id: string, @Query() args:GetByEmployeeArgs){
        return this.service.findByEmployeeId(id, args)
    }

    @Get()
    @Roles(Role.Admin, Role.Manager, Role.Moderator)
    findByMonthAndYear(@Query() args:GetByEmployeeArgs){
        console.log('args', args);

        return this.service.findByMonthAndYear(args)
    }
}
