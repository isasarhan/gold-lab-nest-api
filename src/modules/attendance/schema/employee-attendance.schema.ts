import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Employee } from 'src/modules/employee/schema/employee.schema';

@Schema({ timestamps: true })
export class EmployeeAttendance {
    @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
    employee: Types.ObjectId | Employee;

    @Prop()
    arrival: Date;

    @Prop()
    departure: Date

}

export const EmployeeAttendanceSchema = SchemaFactory.createForClass(EmployeeAttendance);
