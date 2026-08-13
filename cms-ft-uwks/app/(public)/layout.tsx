import PublicNavbar from "@/components/public/navbar";
import PublicFooter from "@/components/public/footer";
import WhatsappBubble from "@/components/public/whatsapp-bubble";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-slate-900 font-sans antialiased">
      {/* Google Material Symbols Font & Google Fonts for Stitch 1:1 fidelity */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <PublicNavbar />
      <div className="flex-grow w-full">{children}</div>
      <PublicFooter />
      <WhatsappBubble />
    </div>
  );
}
