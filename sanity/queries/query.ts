import { defineQuery } from "next-sanity";

const BRAND_QUERY = defineQuery(`*[_type == 'brand'] | order(name asc)`);
const LATEST_BLOG_QUERY = defineQuery(`*[_type == 'blog'] | order(name asc) {..., blogcategories[] -> {title}} `);
const DEAL_PRODUCTS = defineQuery(`*[_type == 'product' && status == "hot"] | order(name asc) {...,"categories": categories[] -> title} `);

export {BRAND_QUERY, LATEST_BLOG_QUERY, DEAL_PRODUCTS}