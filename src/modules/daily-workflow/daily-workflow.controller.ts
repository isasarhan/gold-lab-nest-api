import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateDailyWorkflowDto } from './dto/create.dto';
import { DailyWorkflowService } from './daily-workflow.service';
import { UpdateDailyWorkflowDto } from './dto/update.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '../user/schema/user.schema';

@Controller('daily-workflow')
export class DailyWorkflowController {
    constructor(private readonly service: DailyWorkflowService) { }

    @Post('add')
    @Roles(Role.Admin, Role.Manager)
    create(@Body() dto: CreateDailyWorkflowDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get('date/:date')
    findByDate(@Param('date') date: string) {
        return this.service.findByDate(date);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    @Roles(Role.Admin, Role.Manager)
    update(
        @Param('id') id: string,
        @Body() dto: UpdateDailyWorkflowDto,
    ){
        return this.service.update(id, dto);
    }
}
