import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import HomeCategories from "@/components/HomeCategories";
import ProductGrid from "@/components/ProductGrid";
import { getCategories } from "@/sanity/queries";

const Home = async() => {
  const categories = await getCategories(6);
  console.log(categories);
  console.log("cat")

  return (
    <Container >
      <HomeBanner />
      <div className="py-4">
        <ProductGrid />
        <HomeCategories categories={categories}/>
      </div>
      
    </Container>
  );
};
export default Home;