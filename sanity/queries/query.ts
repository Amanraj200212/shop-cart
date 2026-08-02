import { defineQuery } from "next-sanity";

const BRAND_QUERY = defineQuery(`*[_type == 'brand'] | order(name asc)`);
const LATEST_BLOG_QUERY = defineQuery(`*[_type == 'blog'] | order(name asc) {..., blogcategories[] -> {title}} `);

export {BRAND_QUERY, LATEST_BLOG_QUERY}