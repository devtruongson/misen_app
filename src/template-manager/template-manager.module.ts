import { Module } from '@nestjs/common';
import { TemplateManagerController, TemplateManagerViewController } from './template-manager.controller';
import { TemplateManagerService } from './template-manager.service';

@Module({
  controllers: [TemplateManagerController, TemplateManagerViewController],
  providers: [TemplateManagerService],
  exports: [TemplateManagerService],
})
export class TemplateManagerModule {}