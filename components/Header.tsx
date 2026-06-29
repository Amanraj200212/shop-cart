import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu"
import SearchBar from "./SearchBar";
import CartIcon from "./CartIcon";
import FavoriteBtn from "./FavoriteBtn";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import MobileMenu from "./MobileMenu";

 const Header = () => {

  return (
    <header className= "bg-white py-5 border-b-black ">
      <Container className="flex items-center justify-between">
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
          <SignIn />
          <SignUp />
        </div>

      </Container>
    </header>
  )
}

export default Header