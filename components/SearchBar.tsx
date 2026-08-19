
import { Search } from "lucide-react"
import Link from "next/link"
import { Input } from "./ui/input"

const SearchBar = () => {
  return (
    <div className="w-full max-w-md">
  <Link
    href="/search"
    className="group flex h-11 items-center gap-3 rounded-full border border-gray-200 bg-gray-50/80 px-4 transition-all duration-300 hover:border-shop_light_green hover:bg-white hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]"
  >
    <Search className="h-4.5 w-4.5 shrink-0 text-gray-400 transition-colors duration-300 group-hover:text-shop_light_green" />

    <Input
      placeholder="Search products..."
      className="h-full border-0 bg-transparent p-0 text-sm font-medium text-gray-700 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400"
    />
  </Link>
</div>
  )
}

export default SearchBar