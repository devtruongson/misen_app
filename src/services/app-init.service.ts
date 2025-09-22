import { Injectable, OnModuleInit } from '@nestjs/common';
import { setShopifyConfigService } from '../utils/graphqlQuery';
import { ShopifyConfigService } from './shopify-config.service';

@Injectable()
export class AppInitService implements OnModuleInit {
  constructor(private readonly shopifyConfigService: ShopifyConfigService) {}

  async onModuleInit() {
    // Initialize the global service instance for graphqlQuery
    setShopifyConfigService(this.shopifyConfigService);
  }
}
