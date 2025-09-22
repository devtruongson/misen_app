import { createAdminApiClient } from '@shopify/admin-api-client';
import { ShopifyConfigService } from '../services/shopify-config.service';

const { API_VERSION } = process.env;

type graphqlQuery = {
    operation: string,
    variables?: object | undefined,
    domain: string
}

let shopifyConfigService: ShopifyConfigService;

export const setShopifyConfigService = (service: ShopifyConfigService) => {
    shopifyConfigService = service;
};

const graphqlQuery = async ({  operation, variables, domain }: graphqlQuery) => {
    if (!shopifyConfigService) {
        throw new Error('ShopifyConfigService not initialized');
    }

    const config = await shopifyConfigService.getActiveConfig(domain);

    const client = createAdminApiClient({
        storeDomain: config.storeDomain,
        apiVersion: config.apiVersion,
        accessToken: config.accessToken,
    });

    const { data, errors } = await client.request(operation, variables);
    if (errors) {
        throw new Error(JSON.stringify(errors));
    }

    return { data };
}

export default graphqlQuery