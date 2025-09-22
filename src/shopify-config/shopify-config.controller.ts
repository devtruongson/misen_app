import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ShopifyConfig } from '../schemas/shopify-config.schema';
import { ShopifyConfigService } from '../services/shopify-config.service';

@Controller('shopify-config')
export class ShopifyConfigController {
  constructor(private readonly shopifyConfigService: ShopifyConfigService) {}

  @Get()
  async getAllConfigs(): Promise<ShopifyConfig[]> {
    return this.shopifyConfigService.getAllConfigs();
  }

  @Get('active')
  async getActiveConfig(@Query('domain') domain: string): Promise<ShopifyConfig> {
    return this.shopifyConfigService.getActiveConfig(domain);
  }

  @Post()
  async createConfig(@Body() configData: Partial<ShopifyConfig>): Promise<ShopifyConfig> {
    if (!configData.storeDomain || !configData.accessToken) {
      throw new BadRequestException('storeDomain and accessToken are required');
    }
    
    return this.shopifyConfigService.updateConfig(configData);
  }

  @Put(':id')
  async updateConfig(@Param('id') id: string, @Body() configData: Partial<ShopifyConfig>): Promise<ShopifyConfig> {
    return this.shopifyConfigService.updateConfigById(id, configData);
  }

  @Delete(':id')
  async deleteConfig(@Param('id') id: string): Promise<{ message: string }> {
    await this.shopifyConfigService.deleteConfig(id);
    return { message: 'Configuration deleted successfully' };
  }
}
