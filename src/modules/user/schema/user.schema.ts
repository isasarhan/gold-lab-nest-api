import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { ObjectId, Types } from 'mongoose';

export enum Role {
  Admin = 'admin',
  User = 'user',
  Manager = 'manager',
  Moderator = 'moderator',
}

@Schema({ _id: false })
class Address {
  @Prop()
  street: string;

  @Prop()
  building: string;

  @Prop()
  floor: string;

  @Prop()
  country: string;

  @Prop()
  city: string;
}

@Schema()
export class User {
  @Prop({ required: true })
  username: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phone: string;

  @Prop()
  isSuperAdmin: boolean;

  @Prop({ type: Address })
  @Type(() => Address)
  address: Address

  @Prop()
  nationality: string;

  @Prop()
  profileUrl: string;

  @Prop({ type: String, enum: Role, default: Role.User })
  role: Role;

  @Prop({ type: Boolean, default: false })
  isApproved: boolean;
  
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
