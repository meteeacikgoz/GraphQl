"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

const ProductDetail = ({ params }: { params: { id: string } }) => {
  const [product, setProduct] = useState<Product | null>(null);

  // URL'den id parametresini al
  const productId = params.id;

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await fetch(`http://localhost:3000/graphql`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            {
              product(id: "${productId}") {
                id
                name
                price
                stock
              }
            }
          `,
        }),
      });

      const data = await res.json();
      setProduct(data.data.product);
    };

    fetchProduct();
  }, [productId]);

  return (
    <div>
      {product ? (
        <>
          <h1>{product.name}</h1>
          <p>Fiyat: {product.price} TL</p>
          <p>Stok: {product.stock}</p>
        </>
      ) : (
        <p>Yükleniyor...</p>
      )}
    </div>
  );
};

export default ProductDetail;
