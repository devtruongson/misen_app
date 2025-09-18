import { Body, Controller, Post } from '@nestjs/common';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
    constructor(private readonly webhookService: WebhookService) {}


    @Post("n8n")
    handleN8nWebhook(@Body() payload: any) {
        return this.webhookService.handleProductUpdateMetafileds(payload as any);
    }

}
