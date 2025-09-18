import { createAdminApiClient } from '@shopify/admin-api-client';
const { API_VERSION } = process.env;

type graphqlQuery = {
    operation: string,
    variables?: object | undefined
}

const graphqlQuery = async ({  operation, variables }: graphqlQuery) => {
    const client = createAdminApiClient({
        storeDomain: 'misen-developer.myshopify.com',
        apiVersion: '2025-07',
        accessToken: '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',
    });

    const { data, errors } = await client.request(operation, variables);
    if (errors) {
        throw new Error(JSON.stringify(errors));
    }

    return { data };
}

export default graphqlQuery