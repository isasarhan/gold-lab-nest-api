import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersFilterDto } from './dto/get-users.dto';
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

    @Roles(Role.ADMIN)
    @Get()
    async findAll(@Query() args: GetUsersFilterDto) {
        const filters = this.userService.filter(args)
        const result =  await this.userService.findAll(filters)                
        return result
    }
    @Roles()
    @Post('add')
    async add(@Body() createUserDto: CreateUserDto) {        
        return await this.userService.create(createUserDto)
    }

    @Roles(Role.ADMIN)
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return await this.userService.update(id, updateUserDto)
    }

    @Roles(Role.ADMIN)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.userService.delete(id);
    }
}
