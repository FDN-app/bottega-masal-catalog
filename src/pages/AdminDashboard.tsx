import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  products as mockProducts,
  categories as mockCategories,
  faqs as mockFaqs,
  formatPrice,
  getCategory,
  type Product,
  type Category,
  type FAQ,
} from "@/data/mock";
import { LogOut, Plus, Pencil, Trash2, ImageIcon } from "lucide-react";

interface AdminDashboardProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

type Tab = "productos" | "categorias" | "faq";

export default function AdminDashboard({ isLoggedIn, onLogout }: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>("productos");

  if (!isLoggedIn) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="container flex h-14 items-center justify-between">
          <span className="font-display text-lg font-bold text-primary">Admin · Bottega MaSal</span>
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut size={16} /> Cerrar sesión
          </Button>
        </div>
      </header>

      <div className="container py-6 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-border pb-2">
          {(["productos", "categorias", "faq"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors ${
                tab === t ? "bg-card border border-b-0 border-border text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "productos" ? "Productos" : t === "categorias" ? "Categorías" : "FAQ"}
            </button>
          ))}
        </div>

        {tab === "productos" && <ProductsTab />}
        {tab === "categorias" && <CategoriesTab />}
        {tab === "faq" && <FAQTab />}
      </div>
    </div>
  );
}

function ProductsTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Productos</h2>
        <Button size="sm" className="gap-1"><Plus size={16} /> Nuevo producto</Button>
      </div>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-3 font-medium text-muted-foreground">Foto</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Nombre</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden sm:table-cell">Categoría</th>
                <th className="text-left p-3 font-medium text-muted-foreground">Precio</th>
                <th className="text-left p-3 font-medium text-muted-foreground hidden sm:table-cell">Estado</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {mockProducts.map((p) => {
                const cat = getCategory(p.categoryId);
                return (
                  <tr key={p.id} className="border-b border-border last:border-0">
                    <td className="p-3">
                      <div className="w-10 h-10 rounded bg-wood-light flex items-center justify-center">
                        <ImageIcon size={16} className="text-primary/30" />
                      </div>
                    </td>
                    <td className="p-3 font-medium text-foreground">{p.name}</td>
                    <td className="p-3 text-muted-foreground hidden sm:table-cell">{cat?.name}</td>
                    <td className="p-3 text-foreground">{formatPrice(p.price)}</td>
                    <td className="p-3 hidden sm:table-cell">
                      <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${p.active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                        {p.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button className="p-1.5 rounded hover:bg-muted"><Pencil size={14} /></button>
                        <button className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CategoriesTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Categorías</h2>
        <Button size="sm" className="gap-1"><Plus size={16} /> Nueva categoría</Button>
      </div>
      <div className="bg-card rounded-lg border border-border divide-y divide-border">
        {mockCategories.map((c) => (
          <div key={c.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-foreground">{c.name}</p>
              <p className="text-xs text-muted-foreground">Orden: {c.order}</p>
            </div>
            <div className="flex gap-1">
              <button className="p-1.5 rounded hover:bg-muted"><Pencil size={14} /></button>
              <button className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FAQTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Preguntas Frecuentes</h2>
        <Button size="sm" className="gap-1"><Plus size={16} /> Nueva pregunta</Button>
      </div>
      <div className="bg-card rounded-lg border border-border divide-y divide-border">
        {mockFaqs.sort((a, b) => a.order - b.order).map((f) => (
          <div key={f.id} className="p-4 space-y-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-foreground">{f.question}</p>
                <p className="text-sm text-muted-foreground">{f.answer}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button className="p-1.5 rounded hover:bg-muted"><Pencil size={14} /></button>
                <button className="p-1.5 rounded hover:bg-destructive/10 text-destructive"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
