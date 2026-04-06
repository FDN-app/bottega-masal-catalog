import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { formatPrice } from "@/data/mock";
import { LogOut, Plus, Pencil, Trash2, ImageIcon } from "lucide-react";
import { useProducts, useDeleteProduct, type Product } from "@/hooks/useProducts";
import { useCategories, useDeleteCategory, type Category } from "@/hooks/useCategories";
import { useFaqs, useDeleteFaq, type FAQ } from "@/hooks/useFaqs";
import { CategoryDialog } from "@/components/admin/CategoryDialog";
import { FaqDialog } from "@/components/admin/FaqDialog";
import { ProductDialog } from "@/components/admin/ProductDialog";
import { DeleteDialog } from "@/components/admin/DeleteDialog";
import { toast } from "sonner";

type Tab = "productos" | "categorias" | "faq";

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("productos");
  const { session, isLoading, logout } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Cargando...</p></div>;
  }

  if (!session) return <Navigate to="/admin/login" replace />;

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="container flex h-14 items-center justify-between">
          <span className="font-display text-lg font-bold text-primary">Admin · Bottega MaSal</span>
          <Button variant="ghost" size="sm" onClick={logout}>
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
  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  const { data: categories = [] } = useCategories();
  const { mutateAsync: deleteProduct } = useDeleteProduct();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);

  const openEdit = (product: Product) => {
    setSelectedItem(product);
    setDialogOpen(true);
  };
  const openNew = () => {
    setSelectedItem(null);
    setDialogOpen(true);
  };
  const openDelete = (product: Product) => {
    setSelectedItem(product);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;
    try {
      await deleteProduct(selectedItem.id);
      toast.success("Producto eliminado");
    } catch (e: any) {
      toast.error(e.message || "Error al eliminar");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Productos</h2>
        <Button size="sm" className="gap-1" onClick={openNew}><Plus size={16} /> Nuevo producto</Button>
      </div>
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {isLoadingProducts ? (
          <div className="p-8 text-center text-muted-foreground animate-pulse">Cargando productos...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
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
                {products.length === 0 && (
                  <tr><td colSpan={6} className="text-center p-4 text-muted-foreground">No hay productos</td></tr>
                )}
                {products.map((p) => {
                  const cat = categories.find(c => c.id === p.categoryId);
                  return (
                    <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="p-3">
                        <div className="w-10 h-10 rounded bg-wood-light flex items-center justify-center overflow-hidden border">
                          {p.images && p.images.length > 0 ? (
                            <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={16} className="text-primary/30" />
                          )}
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
                        <div className="flex gap-1 justify-end">
                          <button className="p-1.5 rounded hover:bg-muted" onClick={() => openEdit(p)}><Pencil size={14} /></button>
                          <button className="p-1.5 rounded hover:bg-destructive/10 text-destructive" onClick={() => openDelete(p)}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProductDialog open={dialogOpen} onOpenChange={setDialogOpen} product={selectedItem as Product} />
      <DeleteDialog 
        open={deleteOpen} 
        onOpenChange={setDeleteOpen} 
        onConfirm={confirmDelete}
        title="¿Eliminar producto?"
        description="Esta acción no se puede deshacer y borrará permanentemente este producto del catálogo." 
      />
    </div>
  );
}

function CategoriesTab() {
  const { data: categories = [], isLoading } = useCategories();
  const { mutateAsync: deleteCategory } = useDeleteCategory();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Category | null>(null);

  const openEdit = (cat: Category) => {
    setSelectedItem(cat);
    setDialogOpen(true);
  };
  const openNew = () => {
    setSelectedItem(null);
    setDialogOpen(true);
  };
  const openDelete = (cat: Category) => {
    setSelectedItem(cat);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;
    try {
      await deleteCategory(selectedItem.id);
      toast.success("Categoría eliminada");
    } catch (e: any) {
      toast.error("No se puede eliminar la categoría. Probablemente tiene productos asociados.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Categorías</h2>
        <Button size="sm" className="gap-1" onClick={openNew}><Plus size={16} /> Nueva categoría</Button>
      </div>
      <div className="bg-card rounded-lg border border-border divide-y divide-border">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground animate-pulse">Cargando categorías...</div>
        ) : (
          categories.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No hay categorías</div>
          ) : (
            categories.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-4 hover:bg-muted/30">
                <div>
                  <p className="font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">Orden: {c.order}</p>
                </div>
                <div className="flex gap-1">
                  <button className="p-1.5 rounded hover:bg-muted" onClick={() => openEdit(c)}><Pencil size={14} /></button>
                  <button className="p-1.5 rounded hover:bg-destructive/10 text-destructive" onClick={() => openDelete(c)}><Trash2 size={14} /></button>
                </div>
              </div>
            ))
          )
        )}
      </div>

      <CategoryDialog open={dialogOpen} onOpenChange={setDialogOpen} category={selectedItem as Category} />
      <DeleteDialog 
        open={deleteOpen} 
        onOpenChange={setDeleteOpen} 
        onConfirm={confirmDelete}
        title="¿Eliminar categoría?"
        description="Si hay productos en esta categoría, no podrás eliminarla." 
      />
    </div>
  );
}

function FAQTab() {
  const { data: faqs = [], isLoading } = useFaqs();
  const { mutateAsync: deleteFaq } = useDeleteFaq();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FAQ | null>(null);

  const openEdit = (faq: FAQ) => {
    setSelectedItem(faq);
    setDialogOpen(true);
  };
  const openNew = () => {
    setSelectedItem(null);
    setDialogOpen(true);
  };
  const openDelete = (faq: FAQ) => {
    setSelectedItem(faq);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;
    try {
      await deleteFaq(selectedItem.id);
      toast.success("Pregunta eliminada");
    } catch (e: any) {
      toast.error(e.message || "Error al eliminar");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Preguntas Frecuentes</h2>
        <Button size="sm" className="gap-1" onClick={openNew}><Plus size={16} /> Nueva pregunta</Button>
      </div>
      <div className="bg-card rounded-lg border border-border divide-y divide-border">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground animate-pulse">Cargando preguntas frecuentes...</div>
        ) : (
           faqs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No hay preguntas</div>
          ) : (
            faqs.map((f) => (
              <div key={f.id} className="p-4 space-y-1 hover:bg-muted/30">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-foreground">{f.question}</p>
                    <p className="text-sm text-muted-foreground">{f.answer}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button className="p-1.5 rounded hover:bg-muted" onClick={() => openEdit(f)}><Pencil size={14} /></button>
                    <button className="p-1.5 rounded hover:bg-destructive/10 text-destructive" onClick={() => openDelete(f)}><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))
          )
        )}
      </div>

      <FaqDialog open={dialogOpen} onOpenChange={setDialogOpen} faq={selectedItem as FAQ} />
      <DeleteDialog 
        open={deleteOpen} 
        onOpenChange={setDeleteOpen} 
        onConfirm={confirmDelete}
        title="¿Eliminar FAQ?"
        description="Esta pregunta dejará de aparecer en la página de preguntas frecuentes." 
      />
    </div>
  );
}
