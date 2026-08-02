import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import HomeCategories from "@/components/HomeCategories";
import LatestBlog from "@/components/LatestBlog";
import ProductGrid from "@/components/ProductGrid";
import ShopByBrand from "@/components/ShopByBrand";
import { getCategories } from "@/sanity/queries";

const Home = async() => {
  const categories = await getCategories(6);


  return (
    <Container >
      <HomeBanner />
      <div className="py-4">
        <ProductGrid />
        <HomeCategories categories={categories}/>
        <ShopByBrand />     
        <LatestBlog />                                               
      </div>
      
    </Container>
  );
};
export default Home;