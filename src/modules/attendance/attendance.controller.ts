import { Controller, Post, Get, Put, Delete, Param, Body, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { EmployeeAttendanceService } from './attendance.service';
import { CreateEmployeeAttendanceDto } from './dto/create.dto';
import { UpdateEmployeeAttendanceDto } from './dto/update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetAttendanceFilterDto } from './dto/getAll.dto';

@Controller('attendances')
export class EmployeeAttendanceController {
  constructor(private readonly service: EmployeeAttendanceService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadAttendanceXlsx(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.parseUploadedAttendance(file)
  }

  @Post()
  create(@Body() dto: CreateEmployeeAttendanceDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll(@Query() args: GetAttendanceFilterDto) {
    const filters = this.service.filter(args)
    return this.service.findAll(filters, args.page, args.pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeAttendanceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
