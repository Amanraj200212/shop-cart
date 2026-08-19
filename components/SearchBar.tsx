
import { Search } from "lucide-react"
import Link from "next/link"

const SearchBar = () => {
  return (
    <div className="flex items-center ">
        <Link
          href='/search'
        >
          <Search className="w-5 h-5 cursor-pointer hover:text-shop_light_green hoverEffect"/>
        </Link>
    </div>
  )
}

export default SearchBar