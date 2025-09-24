import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import axios from 'axios';
import type { Request, Response } from 'express';
import { WebhookService } from './webhook.service';

@Controller('webhook')
export class WebhookController {
    constructor(private readonly webhookService: WebhookService) {}


    @Post("n8n")
    handleN8nWebhook(@Body() payload: any) {
        return this.webhookService.handleProductUpdateMetafileds(payload as any);
    }

    @Get("/image")
    async handleImageWebhook(
        @Req() req: Request,
        @Res() resExpress: Response,
        @Query("url") url: string,
        @Query("as") asMode?: string,
        @Query("referer") referer?: string,
        @Query("ua") uaOverride?: string,
        @Query("origin") originOverride?: string,
        @Query("cookie") cookieOverride?: string,
        @Query("accept") acceptOverride?: string,
        @Query("debug") debugFlag?: string,
    ) {
        // Some clients do not URL-encode the nested URL, causing Express to split it by '&'.
        // To be robust, reconstruct the target URL from the raw original URL if needed.
        let targetUrl = url;
        if (!targetUrl) {
            const originalUrl = (req as any).originalUrl as string | undefined;
            if (originalUrl) {
                const marker = "?url=";
                const idx = originalUrl.indexOf(marker);
                if (idx !== -1) {
                    targetUrl = originalUrl.substring(idx + marker.length);
                }
            }
        }
        if (!targetUrl) {
            return { error: 'Missing url parameter' };
        }
        try {
            // Compose aggressive browser-like headers, forwarding many from the client
            const forwardHeaderNames = [
                'accept',
                'accept-language',
                'sec-ch-ua',
                'sec-ch-ua-mobile',
                'sec-ch-ua-platform',
                'sec-fetch-dest',
                'sec-fetch-mode',
                'sec-fetch-site',
                'sec-fetch-user',
                'upgrade-insecure-requests',
                'accept-encoding',
            ];
            const headers: Record<string, string> = {};
            for (const name of forwardHeaderNames) {
                const v = req.headers[name] as string | undefined;
                if (v) headers[name] = v;
            }
            headers['user-agent'] = uaOverride || (req.headers['user-agent'] as string) ||
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
            headers['accept'] = acceptOverride || headers['accept'] ||
                'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8';
            if (referer) headers['referer'] = referer;
            if (originOverride) headers['origin'] = originOverride;
            if (cookieOverride) headers['cookie'] = cookieOverride;

            // In debug mode, return what we are about to request
            if ((debugFlag || '').toString() === '1') {
                const debugHeaders: Record<string, string> = {};
                for (const [k, v] of Object.entries(headers)) debugHeaders[k] = v;
                resExpress.status(200).json({ mode: asMode || 'json', targetUrl, headers: debugHeaders });
                return;
            }

            const res = await fetch(targetUrl, {
                headers,
                redirect: 'follow',
            } as any);
            if (!res.ok) {
                // Try to read response text for clearer diagnostics
                let bodyText: string | undefined;
                try { bodyText = await res.text(); } catch {}
                throw new Error(`HTTP ${res.status} ${res.statusText}${bodyText ? ` - ${bodyText}` : ''}`);
            }
            const contentType = res.headers.get('content-type') || 'application/octet-stream';
            const arrayBuffer = await res.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Stream mode: return raw bytes with headers
            if ((asMode || '').toLowerCase() === 'stream') {
                resExpress.setHeader('content-type', contentType);
                // A small cache for identical URLs (SAS usually short-lived)
                resExpress.setHeader('cache-control', 'private, max-age=60');
                resExpress.status(200).send(buffer);
                return;
            }

            const base64 = buffer.toString('base64');
            // JSON mode: base64 + dataUrl
            resExpress.status(200).json({
                contentType,
                base64,
                dataUrl: `data:${contentType};base64,${base64}`,
            });
            return;
        } catch (err) {
            // If explicit redirect mode is requested, fallback to redirecting the client.
            if ((asMode || '').toLowerCase() === 'redirect') {
                // Express response is available via req.res
                resExpress.redirect(302, targetUrl);
                return;
            }
            resExpress.status(400).json({ error: (err as Error).message });
            return;
        }
    }

    @Get("/image-base64")
    async handleImageWebhookBase64(
        @Query("url") url: string,
    ) {
        console.log(url);
        axios.get(url).then((res) => {
            return res.data;
        }).catch((err) => {
            return { error: (err as Error).message };
        });
    }
    
}
