import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
    constructor(private readonly webhookService: WebhookService) {}


    @Post("n8n")
    handleN8nWebhook(@Body() payload: any) {
        return this.webhookService.handleProductUpdateMetafileds(payload as any);
    }

    @Get("/image")
    async handleImageWebhook(@Query("url") url: string) {
        if (!url) {
            return { error: 'Missing url parameter' };
          }
      
          try {
            const res = await fetch(url);
      
            if (!res.ok) {
              throw new Error(`HTTP ${res.status} ${res.statusText}`);
            }
      
            const contentType = res.headers.get('content-type') || 'application/octet-stream';
            const arrayBuffer = await res.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64 = buffer.toString('base64');
      
            // Có thể trả base64 thuần hoặc data URL
            return {
              contentType,
              base64,
              dataUrl: `data:${contentType};base64,${base64}`,
            };
          } catch (err) {
            return { error: (err as Error).message };
          }
    }
    
}
