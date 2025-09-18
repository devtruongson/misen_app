import graphqlQuery from "./graphqlQuery";

export default async function getMetafield(productId: string, key: string) {
    const operation = `query getProductMetafield($productId: ID!) {
        product(id: $productId) {
            id
            metafield(namespace: "custom", key: "${key}") {
                id
                key
                namespace
                type
                value
            }
        }
    }`;

    const { data } = await graphqlQuery({
        operation,
        variables: {
            variables: { productId }
        }
    });
    return data;
}
