# Shopify Configuration Management

## Tổng quan

Hệ thống đã được cập nhật để lưu trữ cấu hình Shopify (storeDomain, accessToken, apiVersion) trong MongoDB thay vì hardcode trong source code.

## Cấu trúc

### 1. Database Schema
- **File**: `src/schemas/shopify-config.schema.ts`
- **Collection**: `shopifyconfigs`
- **Fields**:
  - `storeDomain`: Tên miền Shopify store
  - `accessToken`: Access token của Shopify Admin API
  - `apiVersion`: Phiên bản API (mặc định: 2025-07)
  - `isActive`: Cấu hình đang được sử dụng
  - `description`: Mô tả cấu hình

### 2. Service Layer
- **File**: `src/services/shopify-config.service.ts`
- **Chức năng**:
  - Quản lý cấu hình active
  - Tạo cấu hình mặc định khi khởi động
  - Cập nhật, xóa cấu hình

### 3. API Endpoints
- **Base URL**: `/api/shopify-config`

#### GET `/api/shopify-config`
Lấy tất cả cấu hình

#### GET `/api/shopify-config/active`
Lấy cấu hình đang active

#### POST `/api/shopify-config`
Tạo cấu hình mới và set làm active
```json
{
  "storeDomain": "your-store.myshopify.com",
  "accessToken": "shpat_your_access_token",
  "apiVersion": "2025-07",
  "description": "Production config"
}
```

#### PUT `/api/shopify-config/:id`
Cập nhật cấu hình

#### DELETE `/api/shopify-config/:id`
Xóa cấu hình (không thể xóa config đang active)

## Khởi động

1. **MongoDB**: Đảm bảo MongoDB đang chạy
2. **Environment**: Set `MONGODB_URI` trong `.env` (tùy chọn)
3. **Auto Setup**: Khi app khởi động, nếu chưa có config nào, hệ thống sẽ tự động tạo config mặc định với giá trị cũ

## Migration từ Hardcode

Hệ thống tự động migrate:
- Khi app khởi động lần đầu, nếu không có config nào trong DB
- Tự động tạo config với giá trị cũ: `misen-developer.myshopify.com` và token cũ
- Tất cả GraphQL queries sẽ sử dụng config từ DB

## Sử dụng

### Thay đổi cấu hình
```bash
curl -X POST http://localhost:6868/api/shopify-config \
  -H "Content-Type: application/json" \
  -d '{
    "storeDomain": "new-store.myshopify.com",
    "accessToken": "shpat_new_token",
    "description": "New store config"
  }'
```

### Kiểm tra cấu hình hiện tại
```bash
curl http://localhost:6868/api/shopify-config/active
```

## Lưu ý

1. **Chỉ có 1 config active** tại một thời điểm
2. **Config mới sẽ thay thế config cũ** làm active
3. **Không thể xóa config đang active**
4. **Tất cả GraphQL operations** đều sử dụng config từ DB
5. **Backward compatible**: Nếu không có config, app sẽ tự tạo config mặc định
