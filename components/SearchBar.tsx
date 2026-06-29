import { Search } from "lucide-react"

const SearchBar = () => {
  return (
    <div className="flex items-center ">
      <Search className="w-5 h-5 hover:text-shop_light_green hoverEffect"/>
      {/* <Input type="text" placeholder="Search..." /> */}
    </div>
  )
}

export default SearchBar