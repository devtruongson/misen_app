/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppInitService } from './services/app-init.service';
import { ShopifyConfigModule } from './shopify-config/shopify-config.module';
import { WebhookModule } from './webhook/webhook.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'public'),
        exclude: ['/api*', '/api/(.*)'],
      }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/misen_app'),
    ShopifyConfigModule,
    WebhookModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppInitService],
})
export class AppModule {}
