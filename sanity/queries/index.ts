import { Category } from "@/sanity.types";
import { sanityFetch } from "../lib/live";
import { BRAND_QUERY, BRANDNAME_QUERY, DEAL_PRODUCTS, LATEST_BLOG_QUERY, PRODUCT_BY_SLUG_QUERY } from "./query";

const getCategories = async (quantity?: number): Promise<Category[]> => {
  try {
    const query  = quantity 
    ?`*[_type == 'category'] | order(name asc) [0...$quantity] {
        ...,
        "productCount": count(*[_type == "product" && references(^._id)])
      }`
    :   
      `*[_type == 'category'] | order(name asc) {
        ...,
        "productCount": count(*[_type == "product" && references(^._id)])
      }`;
      const {data} = await sanityFetch({
        query, 
        params: quantity ? {quantity} : {}
      });
      return data as Category[];
  } catch (error) {
    console.log("Error Fetcghing categories", error);
    return[];
  }
};

const getAllBrands = async() => {
  try {
    const {data} = await sanityFetch({query: BRAND_QUERY});
    return data ?? [];
  } catch (error) {
    console.log("Error in fetchinng all Brand", error);
    return[];
  }
};

const getAlllatestBLog = async() => {
  try {
    const {data} = await sanityFetch({query: LATEST_BLOG_QUERY});
    return data ?? []
  } catch (error) {
    console.log("Error in fetching Latest Blogs", error);
    return[]
  }
};

const getAllDealProducts = async() => {
  try {
    const {data} = await sanityFetch({query: DEAL_PRODUCTS});
    return data ?? []
  } catch (error) {
    console.log("Error in fetching Deal Products", error);
    return[]
  }
};


const getProductsBySlugQuery = async(slug: string) => {
  try {
    const product = await sanityFetch({
      query: PRODUCT_BY_SLUG_QUERY, 
      params: {
        slug,
      },
    });
    return product?.data || null
  } catch (error) {
    console.log("Error in fetching Products BY SLUG QUERY", error);
    return null;
  }
};

const getBrandName = async(slug: string) => {
  try {
    const product = await sanityFetch({
      query: BRANDNAME_QUERY, 
      params: {
        slug,
      },
    });
    return product?.data || null
  } catch (error) {
    console.log("Error in fetching Products BY Id:", error);
    return null;
  }
};

export {getCategories, getAllBrands, getAlllatestBLog, getAllDealProducts, getProductsBySlugQuery, getBrandName };