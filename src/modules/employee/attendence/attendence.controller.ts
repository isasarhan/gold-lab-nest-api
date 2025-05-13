import { Controller, Post, Get, Put, Delete, Param, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { EmployeeAttenndenceService } from './attendence.service';
import { CreateEmployeeAttendenceDto } from './dto/create.dto';
import { UpdateEmployeeAttendenceDto } from './dto/update.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('attendence')
export class EmployeeAttendenceController {
  constructor(private readonly service: EmployeeAttenndenceService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadAttendenceXlsx(
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.service.parseUploadedAttendence(file)
  }

  @Post()
  create(@Body() dto: CreateEmployeeAttendenceDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeAttendenceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
