import { Category } from "@/sanity.types";
import { sanityFetch } from "../lib/live";
import { BRAND_QUERY, LATEST_BLOG_QUERY } from "./query";

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
}

export {getCategories, getAllBrands, getAlllatestBLog};