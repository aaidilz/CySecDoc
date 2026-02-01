import BlogDetailContent from "@/components/bloger/blogdetail";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  // Ambil slug dari URL artikel
  const slug = (await params).slug;

  return (
    <main className="min-h-screen bg-black">
      {/* Panggil komponen dari folder components/bloger */}
      <BlogDetailContent slug={slug} />
    </main>
  );
}
