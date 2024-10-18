"use client"; // Sayfanın Client Component olduğunu belirtir

import { useEffect, useState } from "react";

interface User {
  id: number;
  email: string;
  name: string; // Kullanıcı adı gibi ek bilgi varsa
}

const UserProfilePage = () => {
  const [users, setUsers] = useState<User[]>([]); // Burayı User dizisi olarak ayarlıyoruz
  const [loading, setLoading] = useState<boolean>(true); // Yüklenme durumu

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            {
              users {
                id
                email
                name
              }
            }
          `,
        }),
      });

      if (!res.ok) {
        console.error("Hata:", res.status, res.statusText);
        setLoading(false); // Hata durumunda yüklenmeyi bitir
        return;
      }

      const data = await res.json();
      console.log("Dönen veri:", data); // Yanıtı kontrol et
      setUsers(data.data.users); // users dizisini set et
      setLoading(false); // Yüklenme tamamlandığında durumu güncelle
    };

    fetchUsers();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Yükleniyor...</p>
      ) : users.length > 0 ? ( // Kullanıcı verisi varsa göster
        <>
          <h1>Kullanıcı Profili</h1>
          <ul>
            {users.map((user) => (
              <li key={user.id}>
                <p>Email: {user.email}</p>
                <p>Ad: {user.name}</p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        // Kullanıcı verisi yoksa göster
        <p>Kullanıcı bulunamadı.</p>
      )}
    </div>
  );
};

export default UserProfilePage;
