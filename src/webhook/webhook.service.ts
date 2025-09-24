import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import getMetafield from 'src/utils/getMetaField';
import updateProductMetafieldViaSet from 'src/utils/updateMetaField';
import uploadFileToShopify from 'src/utils/uploadFileToShopify';

@Injectable()
export class WebhookService {
    
    constructor(private readonly httpService: HttpService) {}

    async handleProductUpdateMetafileds(payload: any) {
        if (!payload.metafields || !payload.product) {
            throw new BadRequestException('Missing metafields or product data in payload');
        }
        
        const metafields = payload.metafields;
        const productId = payload.product.id;
        
        if (!productId) {
            throw new BadRequestException('Missing product ID');
        }

        try {
            const metaFieldData = await getMetafield(`gid://shopify/Product/${productId}`, "template_data", payload.domain);

            if(!metaFieldData.product || !metaFieldData.product.metafield) {
                throw new BadRequestException('Missing template_data metafield');
            }
            
            for(const key in metafields) {
                if(metafields[key]?.type === "image" && metafields[key]?.url?.startsWith("data:image/jpeg;base64")) {
                    const resFile = await uploadFileToShopify(
                        `${key}_${Date.now()}.jpeg`,
                        "image/jpeg",
                        Buffer.from(metafields[key].url.split(",")[1], "base64"),
                        false,
                        payload.domain
                    );
                    if(resFile) {
                        metafields[key] = resFile;
                    }
                }

                if(metafields[key]?.type === "image" && !metafields[key]?.url?.startsWith("data:image/jpeg;base64")) {
                    metafields[key] = metafields[key].url;
                }

                if(Array.isArray(metafields[key])) {
                    metafields[key] = await Promise.all(
                        metafields[key].map(async (item) => {
                            if(item?.type === "image" && (item?.url?.startsWith("data:image/jpeg;base64") || item?.url?.startsWith("data:image/webp"))) {
                                const resFile = await uploadFileToShopify(
                                    `${key}_${Date.now()}.jpeg`,
                                    "image/jpeg",
                                    Buffer.from(item.url.split(",")[1], "base64"),
                                    false,
                                    payload.domain
                                );
                                if(resFile) {
                                    return resFile;
                                }
                            } else {
                                return item.url;
                            }
                        })
                    );
                    metafields[key] = JSON.stringify(metafields[key]);
                }
            }

           return this.handleUpdateMetafield({
                key: "template_data",
                newValue: JSON.stringify(metafields),
                productId: `gid://shopify/Product/${productId}`,
                nameSpace: "custom",
                type: "json",
                domain: payload.domain
            });
        } catch (error) {
            console.error('Error fetching metafield:', error);
            throw new BadRequestException(`Failed to update product metafields: ${error.message}`);
        }
    }
    
    async handleUpdateMetafield({
        key,
        newValue,
        productId,
        nameSpace,
        type,
        domain
    }:{
        key: string,
        newValue: string,
        productId: string,
        nameSpace: string,
        type: string,
        domain: string
    }) {
        try {
            const res = await updateProductMetafieldViaSet(productId, nameSpace, key, type, newValue, domain);
            console.log("check res: ", res)
            return res
        } catch (error) {
            console.log("check errror: ", error);
        }
    }
    
}
