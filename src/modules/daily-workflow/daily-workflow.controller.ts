import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CreateDailyWorkflowDto } from './dto/create.dto';
import { DailyWorkflowService } from './daily-workflow.service';
import { UpdateDailyWorkflowDto } from './dto/update.dto';

@Controller('daily-workflow')
export class DailyWorkflowController {
    constructor(private readonly service: DailyWorkflowService) { }

    @Post('add')
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
    update(
        @Param('id') id: string,
        @Body() dto: UpdateDailyWorkflowDto,
    ){
        return this.service.update(id, dto);
    }
}
