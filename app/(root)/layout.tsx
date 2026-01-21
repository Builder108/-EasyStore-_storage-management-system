"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import MobileNavigation from "@/components/MobileNavigation";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/toaster";

type User = {
  id: string;
  email: string;
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/sign-in");
      return;
    }

    fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("access_token");
        router.replace("/sign-in");
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!user) return null;

  return (
    <main className="flex h-screen">
      <Sidebar
        fullName={user.email.split("@")[0]}
        avatar="/assets/icons/avatar.png"
        email={user.email}
      />

      <section className="flex h-full flex-1 flex-col">
        <MobileNavigation
          ownerId={user.id}
          accountId={user.id}
          fullName={user.email.split("@")[0]}
          avatar="/assets/icons/avatar.svg"
          email={user.email}
        />

        <Header userId={user.id} accountId={user.id} />

        <div className="main-content">{children}</div>
      </section>

      <Toaster />
    </main>
  );
};

export default Layout;
