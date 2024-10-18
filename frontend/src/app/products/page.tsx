"use client";

import { useEffect, useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
                    {
                        products {
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
      setProducts(data.data.products);
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Ürünler</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.price} TL (Stok: {product.stock})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductsPage;
