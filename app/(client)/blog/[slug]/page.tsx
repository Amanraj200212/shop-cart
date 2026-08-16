import Container from "@/components/Container";
import { getSingleBlog } from "@/sanity/queries";
import Image from "next/image";
import { notFound } from "next/navigation";

const page = async ({params} : {params: Promise<{slug: string}>}) => {
  const {slug} = await params;
  const blog = await getSingleBlog(slug);
  if(!blog) return notFound();

  return (
  <div>
    <Container >
      <div>
        {/* {blog && (

        )} */}
      </div>
    </Container>
    </div>
  )
};

export default page
