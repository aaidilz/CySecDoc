// src/app/(admin)/layout.tsx
import "../globals.css"; // NAIK SATU TINGKAT KE APP FOLDER
import AdminNavbar from "@/app/(admin)/admin/shared/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-black">
      {/* Sidebar Admin */}
      <AdminNavbar />

      {/* Area Konten Dashboard */}
      <main className="flex-1 relative min-w-0">
        <div className="fixed inset-0 bg-[radial-gradient(circle_at_30%_20%,_var(--tw-gradient-stops))] from-red-950/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 p-5 md:p-8 lg:p-12 text-zinc-300">
          {children}
        </div>
      </main>
    </div>
  );
}