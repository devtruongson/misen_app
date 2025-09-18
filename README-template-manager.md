# Template Field Manager

Công cụ này giúp bạn quản lý và chỉnh sửa các fields trong template JSON dễ dàng thông qua giao diện người dùng đồ họa.

## Hướng dẫn cài đặt

1. Cài đặt các dependencies:
```bash
npm install express cors
```

2. Chạy API server:
```bash
node template-api.js
```

3. Mở trình duyệt và truy cập: http://localhost:3001

## Các tính năng

### 1. Quản lý Templates
- Xem danh sách tất cả templates
- Tạo template mới
- Chỉnh sửa thông tin template (tiêu đề, SKU, AI prompt)
- Xem trước template

### 2. Quản lý Fields
- Thêm field mới
- Chỉnh sửa field hiện có
- Xóa field
- Tự động cập nhật key prefix khi thay đổi SKU

### 3. JSON Editor
- Chỉnh sửa field dưới dạng JSON
- Kiểm tra lỗi syntax

## Cấu trúc thư mục
```
misen_app/
├── src/
│   ├── DATA/
│   │   ├── config-fields.json     # File JSON chứa dữ liệu template
│   │   └── template.html          # Template HTML
│   └── template-manager.html      # Giao diện người dùng
├── template-api.js                # API server
└── README.md                      # Hướng dẫn này
```

## Cấu trúc dữ liệu

Mỗi template có cấu trúc như sau:
```json
{
  "key": "unique_key",
  "title": "Template Title",
  "sku": "TEMPLATE_SKU",
  "ai_prompt": "Mô tả cho AI...",
  "fields": [
    {
      "key": "TEMPLATE_SKU_field_name",
      "label": "Field Label",
      "name": "field_name",
      "type": "text|textarea|file",
      "required": 1|0,
      "default_value": "..."
    }
  ]
}
```

## Lưu ý
- Mỗi field key nên bắt đầu bằng SKU của template để dễ quản lý
- Khi thay đổi SKU, tất cả field keys sẽ được tự động cập nhật
- Các thay đổi sẽ được lưu trực tiếp vào file `config-fields.json`