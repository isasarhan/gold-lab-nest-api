import { Controller, Post, Get, Put, Delete, Param, Body, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { EmployeeAttendanceService } from './attendance.service';
import { CreateEmployeeAttendanceDto } from './dto/create.dto';
import { UpdateEmployeeAttendanceDto } from './dto/update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetAttendanceFilterDto } from './dto/getAll.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '../user/schema/user.schema';

@Controller('attendances')
export class EmployeeAttendanceController {
  constructor(private readonly service: EmployeeAttendanceService) { }

  @Post('upload')
  @Roles(Role.Admin, Role.Manager)
  @UseInterceptors(FileInterceptor('file'))
  uploadAttendanceXlsx(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.parseUploadedAttendance(file)
  }

  @Post()
  @Roles(Role.Admin, Role.Manager)
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
  @Roles(Role.Admin, Role.Manager)
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeAttendanceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.Admin, Role.Manager)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
