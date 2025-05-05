import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Balance {
  @Prop({ type: Types.ObjectId, ref: 'Customer', required: true })
  customer: ObjectId;

  @Prop({ type: Number, default: 0 })
  gold: number;

  @Prop({ type: Number, default: 0 })
  cash: number;
}

export const BalanceSchema = SchemaFactory.createForClass(Balance);
