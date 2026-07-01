import Container from "@/components/Container";
import FooterTop from "./FooterTop";
import Logo from "./Logo";
import Socialmedia from "./Socialmedia";
import { SubText, SubTitle } from "./Title";
import { categoriesData, quickLinks } from "@/constants/data";
import Link from "next/link";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const Footer = () => {

  return (
    <footer className="bg-white border-t">
      <Container>
        <FooterTop />
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* footer logo and social media links*/}
          <div className="space-y-4">
            <Logo />
            <SubText>
              Discover the best online shopping experience with our wide range of products with best prices. Shop with confidence and convenience today!
            </SubText>
            <Socialmedia 
              className="text-darkColor/60 mt-4" 
              iconClassName="border-darkColor/90 hover:border-shop_light_green"
              tooltipClassName="bg-darkColor text-white"
            />
          </div>

          {/* footer quick links */}
          <div>
            <SubTitle>
              Quick Links
            </SubTitle>
            <ul className="mt-4 space-y-3">
              {quickLinks?.map((item) => (
                <li key = {item?.title}>
                  <Link
                    href={item?.href}
                    className="hover:text-shop_light_green hoverEffect font-medium"
                  >
                    <SubText>
                      {item?.title}
                    </SubText>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* footer categories Data*/}
          <div>
            <SubTitle>
              Categories
            </SubTitle>
            <ul className="mt-4 space-y-3">
              {categoriesData?.map((item) => (
                <li key = {item?.title}>
                  <Link
                    href={`/categories/${item?.href}`}
                    className="hover:text-shop_light_green hoverEffect font-medium"
                  >
                    <SubText>
                      {item?.title}
                    </SubText>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* footer Newsletter */}
          <div className="space-y-4">
            <SubTitle className="mb-4">
              Newsletter
            </SubTitle>
            <SubText className="mb-4">
              Subscribe to our newsletter to receive updates and exclusive offers.
            </SubText>
            <form className="space-y-4">
              <Input type="email" placeholder="Enter your email" required className="mb-4 p-4" />
              <Button className="w-full p-5 bg-darkColor">Subscribe</Button>
            </form>
          </div>
        </div>

          {/* footer copyright and reserved */}
          <div className="py-6 border-t text-center text-sm text-gray-600 tracking-wider">
            <div>
              &copy; {new Date().getFullYear()}  
              <Logo className="text-sm"/>
              . All rights reserved.
            </div>
          </div>
      </Container>
    </footer>
  )
}

export default Footer