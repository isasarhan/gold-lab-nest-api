import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class EmployeeAttenndence {
    @Prop({ type: Types.ObjectId, ref: 'Employee', required: true })
    employee: Types.ObjectId;

    @Prop()
    arrival: Date;

    @Prop()
    departure: Date

}

export const EmployeeAttendenceSchema = SchemaFactory.createForClass(EmployeeAttenndence);
