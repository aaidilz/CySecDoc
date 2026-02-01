"use client";
import { useSearchParams } from "next/navigation";
// IMPORT SEMUA SECTIONS KAMU
import HomeDashboard from "./sections/home-dashboard";
import KelolaProject from "./sections/kelola-project";
import KelolaBlog from "./sections/kelola-blog";
import KelolaExperience from "./sections/kelola-experience";
import KelolaSkills from "./sections/kelola-skills";
import KelolaContact from "./sections/kelola-contact";

export default function AdminPage() {
  const searchParams = useSearchParams();
  const currentMenu = searchParams.get("menu") || "home"; // Default ke home [cite: 21]

  // LOGIKA RENDER MENU
  const renderContent = () => {
    switch (currentMenu) {
      case "home":
        return <HomeDashboard />;
      case "project":
        return <KelolaProject />;
      case "blog":
        return <KelolaBlog />;
      case "experience":
        return <KelolaExperience />;
      case "skills":
        return <KelolaSkills />;
      case "contact":
        return <KelolaContact />;
      default:
        return <HomeDashboard />;
    }
  };

  return <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-10">{renderContent()}</div>;
}
