import BlogDash from "@/components/bloger/blogdash";

export default function BlogArchivePage() {
  return (
    <main className="pt-40 pb-24 min-h-screen bg-black px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Mesin utama blog dengan search, sort, dan pagination */}
        <BlogDash />
      </div>
    </main>
  );
}