import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu"
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import FavoriteBtn from "./FavoriteBtn";
import SignIn from "./SignIn";
import MobileMenu from "./MobileMenu";
import { currentUser } from "@clerk/nextjs/server";
import { ClerkLoaded, UserButton } from "@clerk/nextjs";

 const Header = async() =>  {
  const user = await currentUser();
  console.log(user,"user");
  
  return (
    <header className= "bg-white py-5">
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
            {/* {user ? <UserButton /> : <SignIn />} */} 
              <UserButton />
          </ClerkLoaded>
          {!user && <SignIn />}

        </div>
      </Container>
    </header>
  );
};

export default Header