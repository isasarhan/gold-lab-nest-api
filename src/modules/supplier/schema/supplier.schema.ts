import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Supplier {
  @Prop({ required: true })
  name: string;

  @Prop({ default: 0 })
  gold: number;
  
  @Prop({ default: 0 })
  silver: number;

  @Prop({ default: 0 })
  cash: number;

  @Prop()
  description: string;
}

export const SupplierSchema = SchemaFactory.createForClass(Supplier);
