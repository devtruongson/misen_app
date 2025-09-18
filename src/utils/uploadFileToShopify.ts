import FormData from "form-data";
import fetch from "node-fetch";
import { getFileShopifyUrlById } from "./getFileShopifyUrlById";
import graphqlQuery from "./graphqlQuery";

/**
 * Upload file lên Shopify và trả về URL công khai
 */
export default async function uploadFileToShopify(
  fileName: string,
  mimeType: string,
  buffer: Buffer,
  isId = false
) {
  // B1: xin staged upload URL
  const stagedUploadOp = `
    mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets {
          url
          resourceUrl
          parameters {
            name
            value
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const { data } = await graphqlQuery({
    operation: stagedUploadOp,
    variables: {
       variables: {
        input: [
        {
          filename: fileName,
          mimeType,
          httpMethod: "POST",
          resource: "IMAGE",
        },
      ],
       }
    },
  });

  const target = data.stagedUploadsCreate.stagedTargets[0];
  if (!target) throw new Error("Không lấy được staged upload target");

  // B2: upload thật sự tới S3 của Shopify
  const form = new FormData();
  target.parameters.forEach((p: any) => form.append(p.name, p.value));
  form.append("file", buffer, { filename: fileName, contentType: mimeType });

  await fetch(target.url, { method: "POST", body: form as any });

  // B3: confirm với fileCreate để lấy URL công khai
  const fileCreateOp = `
    mutation fileCreate($files: [FileCreateInput!]!) {
      fileCreate(files: $files) {
        files {
          ... on GenericFile {
            id
            url
            createdAt
          }
          ... on MediaImage {
            id
            image {
              url
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const { data: fileData } = await graphqlQuery({
    operation: fileCreateOp,
    variables: {
        variables: {
               files: [
        {
          originalSource: target.resourceUrl,
          contentType: "IMAGE",
        },
      ],
        }
    },
  });

  const uploadedFile = fileData.fileCreate.files[0];
  const fileId = uploadedFile?.id;
  if (!fileId) throw new Error("Upload thành công nhưng không lấy được URL");
  if(isId) return fileId;
  const res = await getFileShopifyUrlById(fileId)
  return res;
}
