import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminGate from "@/components/admin/AdminGate";
import { AdminSessionProvider } from "@/lib/AdminSession";

export default function AdminLayout() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.title = "Admin | Pam’s Mind Flights";
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);
    return () => {
      document.documentElement.classList.remove("dark");
      robots.remove();
    };
  }, []);

  return (
    <AdminSessionProvider>
      <AdminGate>
        <div className="min-h-screen bg-charcoal text-foreground lg:flex">
          <AdminSidebar />
          <main className="min-w-0 flex-1 px-5 py-8 md:px-10 md:py-12">
            <div className="mx-auto max-w-6xl"><Outlet /></div>
          </main>
        </div>
      </AdminGate>
    </AdminSessionProvider>
  );
}