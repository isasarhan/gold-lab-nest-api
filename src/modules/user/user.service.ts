import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model, ObjectId, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUsersFilterDto } from './dto/get-users.dto';
import { IFilter } from 'src/common/types/filter';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    async create(userDto: CreateUserDto){
        
        const existingUser = await this.userModel.findOne({ email: userDto.email }).exec();

        if (existingUser) {
            throw new ConflictException(`User with email ${userDto.email} already exists.`);
        }

        const user = new this.userModel({
            ...userDto,
        });

        return await user.save();
    }

    async update(id: string | Types.ObjectId, userDto: UpdateUserDto){
        return await this.userModel.findByIdAndUpdate(id, {
            $set: userDto
        }, { new: true })
    }

    async findByEmail(email: string){
        return await this.userModel.findOne({ email })
    }

    async findById(id: string | ObjectId) {
        return await this.userModel.findById(id)
    }

    filter(args: GetUsersFilterDto): IFilter{
        return {
            ...args.phone && { phone: args.phone },
            ...args.username && { username: args.username },
            ...args.email && { email: args.email },
            ...args.searchTerm && {
                $or: [
                    { name: { $regex: args.searchTerm, $options: 'i' } },
                    { phone: { $regex: args.searchTerm, $options: 'i' } },
                    { email: { $regex: args.searchTerm, $options: 'i' } },
                ],
            },
        }
    }

    async findAll(filters: IFilter){
        return await this.userModel.find(filters)
    }

    async delete(id: string) {
        if (!await this.userModel.findById(id))
            throw new NotFoundException('User Not Found')

        return await this.userModel.findByIdAndDelete(id)
    }
}
