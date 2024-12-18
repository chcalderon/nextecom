// 'use client';
import Pagination from "@/components/Pagination";
import ProductList from "@/components/product/ProductList";

async function getProducts(searchParams) {
  const sparams= await searchParams;
  const searchQuery = new URLSearchParams({
    page: sparams?.page || 1,
  }).toString();

  try {
    const response = await fetch(`${process.env.API}/product?${searchQuery}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 1 },
      // next: { cache: "no-store" },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();

    // Check if the response has products or is empty
    if (!data || !Array.isArray(data.products)) {
      throw new Error("No products returned.");
    }

    return data;
  } catch (error) {
    console.error("Error fetching search results:", error);
    // Handle the error here, such as showing an error message to the user
    // or returning a default value
    return { products: [], currentPage: 1, totalPages: 1 };
  }
}


export default async function Home({ searchParams }) {
  // console.log("searchParams in products page => ", searchParams);
  const data = await getProducts(searchParams);
  const sparams= await searchParams;
  // console.log(data);
  const { products, currentPage, totalPages } = data;
  return (
    // <div>
    //     {/* <h1 className="d-flex justify-content-center align-items-center vh-100 text-uppercase"> */}
    //     <h1 className="text-center">
    //       <strong>
    //         Latest Products
    //       </strong>
    //     </h1>
    //     <pre>{JSON.stringify(data,null,4)}</pre>
    //     <Pagination
    //             currentPage={currentPage}
    //             totalPages={totalPages}
    //             pathname="/"
    //             pathname="/shop"
    //     />
    // </div>
    <main>
    <div className="container">
      <div className="row">
        <div className="col">
          <p className="text-center lead fw-bold">Latest Products</p>
          {/* <pre>{JSON.stringify(data,null,4)}</pre> */}
          <ProductList products={products} />
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pathname="/"
        searchParams={sparams}
      />
    </div>
  </main>

  );
}
