import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/data/mock";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card py-10">
      <div className="container text-center space-y-3">
        <p className="font-display text-xl font-semibold text-primary">
          Bottega MaSal
        </p>
        <p className="text-sm text-muted-foreground">Madera con historia</p>
        <p className="text-sm text-muted-foreground">
          Zona Oeste &amp; Gran Buenos Aires
        </p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
        >
          <MessageCircle size={16} />
          Contactanos por WhatsApp
        </a>
        <p className="text-xs text-muted-foreground pt-2">
          © 2026 Bottega MaSal
        </p>
      </div>
    </footer>
  );
}
