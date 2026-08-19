import Container from '@/components/Container'
import BackButton from '@/components/BackButton'
import ProductCard from '@/components/ProductCard'
import SearchInput from '@/components/SearchInput'
import { Separator } from '@/components/ui/separator'
import { sanityFetch } from '@/sanity/lib/live'
import type { Product } from '@/sanity.types'
import { defineQuery } from 'next-sanity'
import SearchHistory from '@/components/SearchHistory'

const SEARCH_PRODUCTS_QUERY = defineQuery(`
  *[
    _type == "product" &&
    (
      name match $searchTerm ||
      description match $searchTerm ||
      brand->title match $searchTerm ||
      count(categories[@->title match $searchTerm]) > 0
    )
  ] | order(name asc) {
    ...,
    "categories": categories[]->title
  }
`)

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>
}

const page = async ({ searchParams }: SearchPageProps) => {
  const { q } = await searchParams
  const searchTerm = q?.trim() ?? ''
  const { data } = searchTerm
    ? await sanityFetch({
        query: SEARCH_PRODUCTS_QUERY,
        params: { searchTerm: `*${searchTerm}*` },
      })
    : { data: [] }
  const products = (data ?? []) as Product[]

  return (
    <div>
      <Container>
        <div className='flex items-center gap-5 bg-gray-50 p-4 mt-10'>
          <BackButton />
          <SearchInput key={searchTerm} defaultValue={searchTerm} />
        </div>
        <Separator />

        {searchTerm ? (
          <h1 className='mt-8 text-xl font-semibold'>Search results for &quot;{searchTerm}&quot;</h1>
        ) : (
          <h1 className='mt-8 mb-5 text-xl font-semibold'>Search products</h1>
        )}

        {searchTerm && products.length > 0 ? (
          <div className='mt-6 grid grid-cols-2 gap-2.5 md:grid-cols-3 lg:grid-cols-5'>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : searchTerm ? (
          <p className='mt-8 rounded-md bg-gray-50 py-16 text-center text-gray-600'>
            Nothing match with the keyword &quot;
            <span className='text-red-500'>{searchTerm}</span>
            &quot;. Please try something else.
          </p>
        ) : (
          <SearchHistory />
        )}
      </Container>
    </div>
  )
}

export default page