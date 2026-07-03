import Container from "@/components/Container";
import HomeBanner from "@/components/HomeBanner";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <Container className="bg-shop">
      <HomeBanner />
      <Button size="lg" variant="destructive">
        checkout
      </Button>
    </Container>
  );
};
export default Home;