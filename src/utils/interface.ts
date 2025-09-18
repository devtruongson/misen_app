export interface ShopifyProductVariant {
    admin_graphql_api_id: string;
    barcode: string | null;
    compare_at_price: string | null;
    created_at: string;
    id: number;
    inventory_policy: string;
    position: number;
    price: string;
    product_id: number;
    sku: string | null;
    taxable: boolean;
    title: string;
    updated_at: string;
    option1: string | null;
    option2: string | null;
    option3: string | null;
    image_id: number | null;
    inventory_item_id: number;
    inventory_quantity: number;
    old_inventory_quantity: number;
}

export interface ShopifyProductOption {
    name: string;
    id: number;
    product_id: number;
    position: number;
    values: string[];
}

export interface ShopifyProductImage {
    id: number;
    product_id: number;
    position: number;
    created_at: string;
    updated_at: string;
    alt: string;
    width: number;
    height: number;
    src: string;
    variant_ids: number[];
    admin_graphql_api_id: string;
}

export interface ShopifyProductMedia {
    id: number;
    product_id: number;
    position: number;
    created_at: string;
    updated_at: string;
    alt: string;
    status: string;
    media_content_type: string;
    preview_image: any;
    variant_ids: number[];
    admin_graphql_api_id: string;
}

export interface ShopifyProductVariantGid {
    admin_graphql_api_id: string;
    updated_at: string;
}

export interface ShopifyProductCategory {
    admin_graphql_api_id: string;
    name: string;
    full_name: string;
}

export interface ShopifyProduct {
    admin_graphql_api_id: string;
    body_html: string;
    created_at: string;
    handle: string;
    id: number;
    product_type: string;
    published_at: string;
    template_suffix: string;
    title: string;
    updated_at: string;
    vendor: string;
    status: string;
    published_scope: string;
    tags: string;
    variants: ShopifyProductVariant[];
    options: ShopifyProductOption[];
    images: ShopifyProductImage[];
    image: ShopifyProductImage;
    media: ShopifyProductMedia[];
    variant_gids: ShopifyProductVariantGid[];
    has_variants_that_requires_components: boolean;
    category: ShopifyProductCategory;
}
