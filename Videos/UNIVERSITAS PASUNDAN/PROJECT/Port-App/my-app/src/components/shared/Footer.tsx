const Footer = () => {
  return (
    <footer className="py-10 border-t border-zinc-900 text-center text-zinc-500 text-sm">
      <div className="max-w-7xl mx-auto px-6">
        <p>© {new Date().getFullYear()} Alam. All rights reserved.</p>
        <p className="mt-2 italic">"Kopi yang saya minum berbanding lurus dengan celah keamanan yang saya tutup."</p>
      </div>
    </footer>
  );
};

// WAJIB ADA BARIS INI
export default Footer;