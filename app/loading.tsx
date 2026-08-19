import { Loader2 } from "lucide-react"

const Loading = () => {
  return (
    <div className="flex min-h-[50vh] text-shop_light_green items-center justify-center">
      <Loader2 className="w-5 h-6 animate-spin" />
      <p className="text-lg ">
        Shopcart  is loading, please wait...
      </p>
    </div>
  )
}

export default Loading