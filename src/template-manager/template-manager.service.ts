import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class TemplateManagerService {
  private readonly configPath = join(process.cwd(), 'src', 'DATA', 'config-fields.json');

  // Get all templates
  getAllTemplates() {
    try {
      const data = readFileSync(this.configPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Failed to read templates: ${error.message}`);
    }
  }

  // Update a template
  updateTemplate(index: number, updatedTemplate: any) {
    try {
      const templates = this.getAllTemplates();

      if (index < 0 || index >= templates.length) {
        throw new Error('Template not found');
      }

      templates[index] = updatedTemplate;
      writeFileSync(this.configPath, JSON.stringify(templates, null, 2), 'utf8');

      return updatedTemplate;
    } catch (error) {
      throw new Error(`Failed to update template: ${error.message}`);
    }
  }

  // Create a new template
  createTemplate(newTemplate: any) {
    try {
      const templates = this.getAllTemplates();

      templates.push(newTemplate);
      writeFileSync(this.configPath, JSON.stringify(templates, null, 2), 'utf8');

      return newTemplate;
    } catch (error) {
      throw new Error(`Failed to create template: ${error.message}`);
    }
  }

  // Delete a template
  deleteTemplate(index: number) {
    try {
      const templates = this.getAllTemplates();

      if (index < 0 || index >= templates.length) {
        throw new Error('Template not found');
      }

      templates.splice(index, 1);
      writeFileSync(this.configPath, JSON.stringify(templates, null, 2), 'utf8');

      return { message: 'Template deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete template: ${error.message}`);
    }
  }
}