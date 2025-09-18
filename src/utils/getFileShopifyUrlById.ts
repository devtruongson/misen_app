import graphqlQuery from "./graphqlQuery";

export async function getFileShopifyUrlById(fileId: string, maxRetries = 5, retryDelay = 1000) {
    // Input validation
    if (!fileId) {
        throw new Error('Missing required parameter: fileId is required');
    }

    if (!fileId.startsWith('gid://shopify/')) {
        throw new Error('Invalid fileId format: must be a valid Shopify GID');
    }

    // GraphQL query
    const operation = `#graphql
        query getFileShopifyUrlById($id: ID!) {
            node(id: $id) {
                __typename
                ... on MediaImage {
                    id
                    status
                    image {
                        url
                        altText
                        width
                        height
                    }
                }
                ... on GenericFile {
                    id
                    fileStatus
                    url
                }
            }
        }
    `;
    const variables = {
        variables: {
            id: fileId,
        }
    }
    let retries = 0;
    while (retries < maxRetries) {
        const response = await graphqlQuery({
            operation,
            variables
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as { data: any; errors?: { message: string }[] };

        if ('errors' in response && response.errors) {
            const errorMessage = response.errors[0]?.message || 'Unknown error';
            throw new Error(`GraphQL query failed: ${errorMessage}`);
        }

        // Extract the file node
        const file = response.data.node;
        if (!file) {
            throw new Error('No file found for the provided ID');
        }

        // Check file status (handle MediaImage and GenericFile)
        const status = file.status || file.fileStatus;
        if (!status) {
            throw new Error('File status is undefined. Check the response for details.');
        }

        // Check if the status is valid
        if (status === 'READY' || status === 'UPLOADED') {
            // Try to get the CDN URL
            const cdnUrl = file.image?.url || file.url;
            if (!cdnUrl) {
                throw new Error('No CDN URL found for the file. Check the response for details.');
            }
            return cdnUrl;
        }

        // If status is invalid (e.g., PROCESSING), retry after delay
        if (status === 'PROCESSING') {
            retries++;
            if (retries >= maxRetries) {
                throw new Error(`File is not ready after ${maxRetries} retries: status is ${status}`);
            }
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        } else {
            // Handle unexpected statuses
            throw new Error(`Invalid file status: ${status}`);
        }
    }

    // This line should never be reached due to the maxRetries check, but included for completeness
    throw new Error('Failed to retrieve CDN URL after maximum retries');
}