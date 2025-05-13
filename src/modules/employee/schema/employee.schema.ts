import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Employee {
  @Prop({ required: true })
  name: string;

  @Prop()
  position: string;

  @Prop({ unique: true })
  phone: string;

  @Prop()
  email: string;

  @Prop()
  salary: number
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
