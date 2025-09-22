import graphqlQuery from "./graphqlQuery";

export default async function updateProductMetafieldViaSet(
  ownerId: string,
  namespace: string,
  key: string,
  type: string,
  value: string,
  domain: string
) {
  const operation = `
    mutation updateMetafields(
      $ownerId: ID!
      $namespace: String!
      $key: String!
      $type: String!
      $value: String!
    ) {
      metafieldsSet(metafields: [
        {
          ownerId: $ownerId
          namespace: $namespace
          key: $key
          type: $type
          value: $value
        }
      ]) {
        metafields {
          id
          key
          namespace
          type
          value
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const { data } = await graphqlQuery({
    operation,
    variables: {
      variables: { ownerId, namespace, key, type, value }
    },
    domain
  });

  return data;
}
