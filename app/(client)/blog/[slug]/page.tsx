import Container from "@/components/Container";
import React from "react";

const page = async ({params} : {params: Promise<{slug: string}>}) => {
  const {slug} = await params;
  return <div>
    <Container >
      {/* <h2 className='text-2xl font-semibold  pb-3'>Latest Blog</h2> */}
      <p>{slug}</p>
    
    </Container>
    </div>;
};

export default page
