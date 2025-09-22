import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShopifyConfig, ShopifyConfigDocument } from '../schemas/shopify-config.schema';

@Injectable()
export class ShopifyConfigService implements OnModuleInit {
  private activeConfig: ShopifyConfig | null = null;

  constructor(
    @InjectModel(ShopifyConfig.name) 
    private shopifyConfigModel: Model<ShopifyConfigDocument>
  ) {}

  async onModuleInit() {
    // Load active config when module initializes
    await this.loadActiveConfig();
    
    // If no config exists, create default one with current hardcoded values
    if (!this.activeConfig) {
      await this.createDefaultConfig();
    }
  }

  async loadActiveConfig(): Promise<void> {
    this.activeConfig = await this.shopifyConfigModel.findOne({ isActive: true }).exec();
  }

  async createDefaultConfig(): Promise<ShopifyConfig> {
    const defaultConfig = new this.shopifyConfigModel({
      storeDomain: 'misen-developer.myshopify.com',
      accessToken: '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',
      apiVersion: '2025-07',
      isActive: true,
      description: 'Default configuration migrated from hardcoded values'
    });

    const savedConfig = await defaultConfig.save();
    this.activeConfig = savedConfig;
    return savedConfig;
  }

  async getActiveConfig(domain: string): Promise<ShopifyConfig> {
    this.activeConfig = await this.shopifyConfigModel.findOne({ storeDomain: domain }).exec();
    
    if (!this.activeConfig) {
      throw new Error('No active Shopify configuration found');
    }
    
    return this.activeConfig;
  }

  async updateConfig(configData: Partial<ShopifyConfig>): Promise<ShopifyConfig> {
    // Deactivate current active config
    await this.shopifyConfigModel.updateMany({ isActive: true }, { isActive: false });
    
    // Create new active config
    const newConfig = new this.shopifyConfigModel({
      ...configData,
      isActive: true
    });
    
    const savedConfig = await newConfig.save();
    this.activeConfig = savedConfig;
    return savedConfig;
  }

  async updateConfigById(id: string, configData: Partial<ShopifyConfig>): Promise<ShopifyConfig> {
    const updatedConfig = await this.shopifyConfigModel.findByIdAndUpdate(
      id, 
      configData, 
      { new: true }
    ).exec();
    
    if (!updatedConfig) {
      throw new Error('Configuration not found');
    }
    
    // If this config is now active, update the cached config
    if (updatedConfig.isActive) {
      this.activeConfig = updatedConfig;
    }
    
    return updatedConfig;
  }

  async getAllConfigs(): Promise<ShopifyConfig[]> {
    return this.shopifyConfigModel.find().sort({ createdAt: -1 }).exec();
  }

  async deleteConfig(id: string): Promise<void> {
    const config = await this.shopifyConfigModel.findById(id);
    if (config && config.isActive) {
      throw new Error('Cannot delete active configuration');
    }
    
    await this.shopifyConfigModel.findByIdAndDelete(id);
  }
}
