'use client'

import { BRAND_QUERY_RESULT, Category, Product } from "@/sanity.types"
import React, { useEffect, useState } from "react"
import Container from "./Container"
import CategoryList from "./shop/CategoryList"
import { useSearchParams } from "next/navigation"
import BrandList from "./shop/BrandList"
import PriceList from "./shop/PriceList"
import { client } from "@/sanity/lib/client"
2
interface Props {
  categories: Category[],
  brands: BRAND_QUERY_RESULT

}
const Shop = ({categories, brands}: Props) => {
  const searchParams = useSearchParams();
  const brandParams = searchParams?.get('brand');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(brandParams || null);
  const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

  const fetchProducts = async() => {
    setLoading(true);
    try {
      let minPrice = 0;
      let maxPrice = 10000;
      if(selectedPrice) {
        const [min, max] = selectedPrice.split("-").map(Number);
        minPrice = min;
        maxPrice = max;
      }

      //this query is based on price{min and max price}, brand and categroey . just for filter produxt and get accrding to ure filter
      const query = `
      *[_type == 'product' 
        && (!defined($selectedCategory) || references(*[_type == "category" && slug.current == $selectedCategory]._id))
        && (!defined($selectedBrand) || references(*[_type == "brand" && slug.current == $selectedBrand]._id))
        && price >= $minPrice && price <= $maxPrice
      ] 
      | order(name asc) {
        ...,"categories": categories[]->title
      }
      `;
      const data = await client.fetch(query, {selectedCategory, selectedBrand, selectedPrice, minPrice, maxPrice}, {next: {revalidate: 0}});
      // setProducts(data);
      console.log("data", data)
    } catch (error) {
      console.log('Shop product fetching Error', error)
    } finally {
      setLoading(false);
    }
  };  

  useEffect(  () => {
    async function fetchdata () {
      await fetchProducts();
    }
    fetchdata()
  }, [selectedCategory, selectedBrand, selectedPrice])



  return (
    <div className="border-t">
      <Container className="mt-5">
        <div className="sticky top-0 z-10 mb-5">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg uppercase tracking-wide">
              GET THE PRODUCTS AS YOUR NEEDS
            </h2>
            {(selectedCategory !== null ||
              selectedBrand !== null ||
              selectedPrice !== null) && (
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedBrand(null);
                    setSelectedPrice(null);
                  }}
                  className="text-shop_dark_green underline text-sm mt-2 font-medium hover:text-red-800 hoverEffect"
                >
                  Reset Filters
                </button>
              )
            }
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-5 border-t border-t-shop_dark_green/50">
          <div 
            className="md:sticky md:top-20 md:self-start md:h-[calc(100vh-160px)] md:overflow-y-auto md:min-w-64 pb-5 scrollbar-hide md:border-r border-r-shop_btn_dark_green/50"
          >
            <CategoryList 
              categories = {categories} 
              selectedCategory = {selectedCategory} 
              setSelectedCategory = {setSelectedCategory} 
            />
            <BrandList 
              brands = {brands}
              selectedBrand = {selectedBrand}
              setSelectedBrand = {setSelectedBrand}
            />
            <PriceList
              selectedPrice = {selectedPrice}
              setSelectedPrice = {setSelectedPrice}
            />
          </div>

          <div>g</div>
        </div>

      </Container>
    </div>
  )
}

export default Shop