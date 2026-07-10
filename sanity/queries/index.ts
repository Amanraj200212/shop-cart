import { Category } from "@/sanity.types";
import { sanityFetch } from "../lib/live";

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

export {getCategories};