import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UpdateUserDto } from './dto/update.dto';
import { GetUserDto } from './dto/getOne.dto';
import { CreateUserDto } from './dto/create.dto';
import { GetUsersFilterDto } from './dto/getAll.dto';
import { UserService } from './user.service';

@UseGuards(RolesGuard)
@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Get(':id')
    async findById(@Param() params: GetUserDto) {
        return await this.userService.findById(params.id)
    }

    @Get()
    async findAll(@Query() args: GetUsersFilterDto) {
        const filters = this.userService.filter(args)
        return await this.userService.findAll(filters)
    }

    @Post('add')
    async add(@Body() createUserDto: CreateUserDto) {
        return await this.userService.create(createUserDto)
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return await this.userService.update(id, updateUserDto)
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.userService.delete(id);
    }
}
