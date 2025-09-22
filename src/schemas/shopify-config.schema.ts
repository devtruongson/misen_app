import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShopifyConfigDocument = ShopifyConfig & Document;

@Schema({ timestamps: true })
export class ShopifyConfig {
  @Prop({ required: true, unique: true })
  storeDomain: string;

  @Prop({ required: true })
  accessToken: string;

  @Prop({ default: '2025-07' })
  apiVersion: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  description?: string;
}

export const ShopifyConfigSchema = SchemaFactory.createForClass(ShopifyConfig);
