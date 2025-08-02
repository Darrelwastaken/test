-- Verify Products Catalog
-- Run this after executing the complete_products_catalog.sql to verify all products were inserted

-- Check if table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'products_catalog'
) as table_exists;

-- Count total products
SELECT COUNT(*) as total_products FROM products_catalog;

-- Count products by category
SELECT 
    category,
    COUNT(*) as product_count
FROM products_catalog 
GROUP BY category 
ORDER BY product_count DESC;

-- Count products by subcategory
SELECT 
    category,
    subcategory,
    COUNT(*) as product_count
FROM products_catalog 
GROUP BY category, subcategory 
ORDER BY category, subcategory;

-- Count Islamic vs Conventional products
SELECT 
    is_islamic,
    COUNT(*) as product_count
FROM products_catalog 
GROUP BY is_islamic;

-- Count active vs inactive products
SELECT 
    is_active,
    COUNT(*) as product_count
FROM products_catalog 
GROUP BY is_active;

-- Show sample products from each category
SELECT 
    category,
    subcategory,
    name,
    product_id,
    is_islamic,
    is_active
FROM products_catalog 
ORDER BY category, subcategory, name
LIMIT 20;

-- Check for any products with missing required fields
SELECT 
    product_id,
    name,
    category,
    subcategory
FROM products_catalog 
WHERE name IS NULL 
   OR category IS NULL 
   OR subcategory IS NULL 
   OR product_id IS NULL; 