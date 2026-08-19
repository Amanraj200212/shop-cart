import Container from "./Container";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu"
import SearchBar from "./SearchBar";
import MobileMenu from "./MobileMenu";
import HeaderRightSide from "./HeaderRightSide";

 const Header = async() =>  {
  return (
    <header className= "bg-white/70 py-5 sticky top-0 z-50 backdrop-blur-md">
      <Container className="flex items-center justify-between text-lg gap-2.5">
        {/* Logo */}
        <div className="w-auto md:w-1/3 flex items-center gap-2.5 justify-start md:gap-0">
          <MobileMenu />
          <Logo />
        </div>

        {/* nav Button */}
        <HeaderMenu />
        
        {/* right button */}
        <SearchBar />
        <HeaderRightSide />

      </Container>
    </header>
  );
};

export default Header