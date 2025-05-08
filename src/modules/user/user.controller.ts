import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update.dto';
import { GetUserDto } from './dto/getOne.dto';
import { CreateUserDto } from './dto/create.dto';
import { GetUsersFilterDto } from './dto/getAll.dto';
import { UserService } from './user.service';
import { Role } from './schema/user.schema';

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
        const result =  await this.userService.findAll(filters)                
        return result
    }

    @Post('add')
    async add(@Body() createUserDto: CreateUserDto) {        
        console.log('createUserDto', createUserDto);
        
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
