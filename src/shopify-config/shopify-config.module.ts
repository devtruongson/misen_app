import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShopifyConfig, ShopifyConfigSchema } from '../schemas/shopify-config.schema';
import { ShopifyConfigService } from '../services/shopify-config.service';
import { ShopifyConfigController } from './shopify-config.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ShopifyConfig.name, schema: ShopifyConfigSchema }
    ])
  ],
  controllers: [ShopifyConfigController],
  providers: [ShopifyConfigService],
  exports: [ShopifyConfigService]
})
export class ShopifyConfigModule {}
