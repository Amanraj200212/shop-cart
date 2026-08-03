import { defineQuery } from "next-sanity";

const BRAND_QUERY = defineQuery(`*[_type == 'brand'] | order(name asc)`);
const LATEST_BLOG_QUERY = defineQuery(`*[_type == 'blog'] | order(name asc) {..., blogcategories[] -> {title}} `);
const DEAL_PRODUCTS = defineQuery(`*[_type == 'product' && status == "hot"] | order(name asc) {...,"categories": categories[] -> title} `);
const PRODUCT_BY_SLUG_QUERY = defineQuery(`*[_type == 'product' && slug.current == $slug] | order(name asc) [0]`);
export {BRAND_QUERY, LATEST_BLOG_QUERY, DEAL_PRODUCTS, PRODUCT_BY_SLUG_QUERY}  