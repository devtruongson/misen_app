import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Res } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';
import { TemplateManagerService } from './template-manager.service';

@Controller('templates')
export class TemplateManagerController {
  constructor(private readonly templateManagerService: TemplateManagerService) {}

  @Get()
  getAllTemplates() {
    try {
      return this.templateManagerService.getAllTemplates();
    } catch (error) {
      throw new HttpException(
        { error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':index')
  updateTemplate(
    @Param('index', ParseIntPipe) index: number,
    @Body() updatedTemplate: any,
  ) {
    try {
      return this.templateManagerService.updateTemplate(index, updatedTemplate);
    } catch (error) {
      if (error.message === 'Template not found') {
        throw new HttpException(
          { error: error.message },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        { error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  createTemplate(@Body() newTemplate: any) {
    try {
      return this.templateManagerService.createTemplate(newTemplate);
    } catch (error) {
      throw new HttpException(
        { error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':index')
  deleteTemplate(@Param('index', ParseIntPipe) index: number) {
    try {
      return this.templateManagerService.deleteTemplate(index);
    } catch (error) {
      if (error.message === 'Template not found') {
        throw new HttpException(
          { error: error.message },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        { error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

@Controller('template-manager')
export class TemplateManagerViewController {
  @Get()
  getTemplateManagerPage(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'index.html'));
  }
}