import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export enum CustomerType {
    Individual = 'individual',     // فرد
    Wholesaler = 'wholesaler',     // تاجر جملة
    Retailer = 'retailer',         // بائع تجزئة
    Distributor = 'distributor',   // موزّع
    Reseller = 'reseller',         // معيد بيع
    Corporate = 'corporate',       // شركة
    Government = 'government',     // جهة حكومية
}

@Schema()
export class Customer {

    @Prop({ type: String, required: true })
    name: string

    @Prop()
    email: string

    @Prop()
    phone: string

    @Prop()
    location: string

    @Prop({ type: String, enum: CustomerType, default: CustomerType.Retailer })
    type: CustomerType;
}


export const CustomerSchema = SchemaFactory.createForClass(Customer);
