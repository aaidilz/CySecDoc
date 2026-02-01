// src/app/(main)/blog/layout.tsx
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    // Div ini akan menutupi/menggantikan layout (main) khusus untuk rute blog
    <div className="relative z-[100] bg-black min-h-screen">{children}</div>
  );
}
