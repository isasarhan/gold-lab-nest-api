import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Inventory {
  @Prop({ type: String, unique: true, required: true })
  name: string;

  @Prop({ type: Number, default: 0 })
  weight: number;

  @Prop({ type: Number, default: 0 })
  cash: number;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
