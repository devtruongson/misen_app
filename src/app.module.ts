/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TemplateManagerModule } from './template-manager/template-manager.module';
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
    WebhookModule,
    TemplateManagerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
