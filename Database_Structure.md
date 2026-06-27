## Table `categories`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `name` | `text` |  |
| `slug` | `text` |  Unique |
| `description` | `text` |  Nullable |
| `banner_image_url` | `text` |  Nullable |
| `active` | `bool` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

## Table `products`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `name` | `text` |  |
| `slug` | `text` |  Unique |
| `code` | `text` |  Unique |
| `description` | `text` |  Nullable |
| `category_id` | `uuid` |  Nullable |
| `price` | `numeric` |  Nullable |
| `offer_price` | `numeric` |  Nullable |
| `featured` | `bool` |  Nullable |
| `sold_out` | `bool` |  Nullable |
| `active` | `bool` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

## Table `product_images`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `product_id` | `uuid` |  |
| `image_url` | `text` |  |
| `sort_order` | `int4` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |

## Table `banners`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `title` | `text` |  Nullable |
| `subtitle` | `text` |  Nullable |
| `image_url` | `text` |  Nullable |
| `button_text` | `text` |  Nullable |
| `button_link` | `text` |  Nullable |
| `active` | `bool` |  Nullable |
| `sort_order` | `int4` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |

## Table `whatsapp_leads`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `product_id` | `uuid` |  Nullable |
| `customer_name` | `text` |  Nullable |
| `phone` | `text` |  Nullable |
| `message` | `text` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |

## Table `profiles`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `user_id` | `uuid` |  Nullable Unique |
| `name` | `text` |  Nullable |
| `role` | `text` |  |
| `created_at` | `timestamptz` |  Nullable |

## Table `site_settings`

### Columns

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int4` | Primary |
| `whatsapp_number` | `text` |  Nullable |
| `facebook_url` | `text` |  Nullable |
| `instagram_url` | `text` |  Nullable |
| `email` | `text` |  Nullable |
| `about_eyebrow` | `text` |  Nullable |
| `about_heading` | `text` |  Nullable |
| `about_body` | `text` |  Nullable |
| `contact_eyebrow` | `text` |  Nullable |
| `contact_heading` | `text` |  Nullable |
| `contact_body` | `text` |  Nullable |
| `contact_phone` | `text` |  Nullable |
| `contact_address` | `text` |  Nullable |
| `catalogue_heading` | `text` |  Nullable |
| `catalogue_subheading` | `text` |  Nullable |
| `updated_at` | `timestamptz` |  Nullable |

