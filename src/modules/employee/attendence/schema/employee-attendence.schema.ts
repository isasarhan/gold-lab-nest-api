import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Employee } from '../../schema/employee.schema';

@Schema({ timestamps: true })
export class EmployeeAttendence {
    @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
    employee: Types.ObjectId | Employee;

    @Prop()
    arrival: Date;

    @Prop()
    departure: Date

}

export const EmployeeAttendenceSchema = SchemaFactory.createForClass(EmployeeAttendence);
