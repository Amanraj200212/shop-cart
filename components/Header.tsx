import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu"
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import FavoriteBtn from "./FavoriteBtn";
import SignIn from "./SignIn";
import MobileMenu from "./MobileMenu";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ClerkLoaded, UserButton } from "@clerk/nextjs";
import { getMyOrders } from "@/sanity/queries";
import Link from "next/link";
import { Logs} from "lucide-react";

 const Header = async() =>  {
  const user = await currentUser();
  const {userId} = await auth();
  let orders = null;
  if(userId) {
    orders = await getMyOrders(userId);
  }
  
  return (
    <header className= "bg-white/70 py-5 sticky top-0 z-50 backdrop-blur-md">
      <Container className="flex items-center justify-between text-lg">
        {/* Logo */}
        <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
          <MobileMenu />
          <Logo />
        </div>

        {/* nav Button */}
        <HeaderMenu />
        
        {/* right button */}
        <div className="w-auto md:w-1/3 flex items-center justify-end gap-5">
          <SearchBar />
          <CartIcon />
          <FavoriteBtn />

          <ClerkLoaded>
              <Link href="/orders" className=" group relative">
                <Logs className="w-5 h-5 hover:text-shop_light_green hoverEffect"/>
                <span className="absolute -top-1 -right-1 bg-shop_dark_green text-white text-xs font-semibold rounded-full w-3.5 h-3.5 flex items-center justify-center">{orders?.length ? orders?.length : 0}</span>
              </Link>
              <UserButton />
          </ClerkLoaded>
          {!user && <SignIn />}
        </div>
      </Container>
    </header>
  );
};

export default Header