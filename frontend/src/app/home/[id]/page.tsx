"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "/home/metehan/Sites/GraphQl/frontend/my-next-app/src/app/UserProductsPage.module.css"; // CSS dosyasını ekleyin

interface Product {
  productName: string;
  productPrice: number;
  productStock: number;
}

interface Order {
  orderId: number;
  orderDate: string;
  products: Product[];
}

const UserProductsPage = ({ params }: { params: { id: string } }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = params.id;

  useEffect(() => {
    if (!userId) return;

    const fetchUserProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              {
                userProducts(userId: ${userId}) {
                  orders {
                    orderId
                    orderDate
                    products {
                      productName
                      productPrice
                      
                    }
                  }
                }
              }
            `,
          }),
        });

        if (!res.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await res.json();
        setOrders(data.data.userProducts.orders);
      } catch (error) {
        setError(
          "Bir hata oluştu: " +
            (error instanceof Error ? error.message : "Bilinmeyen hata")
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserProducts();
  }, [userId]);

  return (
    <div className={styles.container}>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <>
          <h1 className={styles.title}>Kullanıcı Siparişleri</h1>
          <ul className={styles.orderList}>
            {orders.map((order) => (
              <li key={order.orderId} className={styles.orderItem}>
                <h2>Sipariş ID: {order.orderId}</h2>
                <p>Tarih: {order.orderDate}</p>
                <h3>Ürünler:</h3>
                <ul className={styles.productList}>
                  {order.products.map((product, index) => (
                    <li key={index} className={styles.productItem}>
                      {product.productName} - {product.productPrice} TL
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default UserProductsPage;
