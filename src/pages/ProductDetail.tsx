import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { formatPrice, getWhatsAppLink } from "@/data/mock";
import { useProduct } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { MessageCircle, ArrowLeft, ImageIcon, Minus, Plus } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading: loadingProduct } = useProduct(id);
  const { data: categories } = useCategories();
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (loadingProduct) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg text-muted-foreground animate-pulse">Cargando producto...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-lg text-muted-foreground">Producto no encontrado</p>
            <Button asChild variant="outline">
              <Link to="/"><ArrowLeft size={16} /> Volver al catálogo</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const category = categories?.find((c) => c.id === product.categoryId);

  function getUnitPrice() {
    if (quantity >= 10 && product?.price10) return product.price10;
    if (quantity >= 5 && product?.price5) return product.price5;
    return product?.price ?? 0;
  }

  const unitPrice = getUnitPrice();
  const images = product.images?.length > 0 ? product.images : [null, null, null, null];


  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container py-6 pb-28 lg:pb-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to="/"><ArrowLeft size={16} /> Volver al catálogo</Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Gallery */}
          <div className="space-y-3">
            <div className="aspect-[4/3] rounded-lg bg-wood-light flex items-center justify-center overflow-hidden">
              {images[activeImage] ? (
                <img src={images[activeImage]!} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={64} className="text-primary/30" />
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {images.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square rounded-md bg-wood-light flex items-center justify-center overflow-hidden border-2 transition-colors ${
                    activeImage === i ? "border-accent" : "border-transparent"
                  }`}
                >
                  {img ? (
                    <img src={img} alt={`mini-${i}`} className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon size={20} className="text-primary/20" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              {category && (
                <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground mb-2">
                  {category.name}
                </span>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {product.name}
              </h1>
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {product.materials && (
                <div>
                  <span className="font-medium text-foreground">Materiales</span>
                  <p className="text-muted-foreground">{product.materials}</p>
                </div>
              )}
              {product.dimensions && (
                <div>
                  <span className="font-medium text-foreground">Dimensiones</span>
                  <p className="text-muted-foreground">{product.dimensions}</p>
                </div>
              )}
            </div>

            {/* Pricing tiers */}
            <div className="space-y-2">
              <h3 className="font-medium text-foreground">Precios</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className={`rounded-lg border p-3 text-center transition-colors ${quantity < 5 ? "border-accent bg-accent/5" : "border-border"}`}>
                  <p className="text-xs text-muted-foreground">1 unidad</p>
                  <p className="font-semibold text-foreground">{formatPrice(product.price)}</p>
                </div>
                {product.price5 && (
                  <div className={`rounded-lg border p-3 text-center transition-colors ${quantity >= 5 && quantity < 10 ? "border-accent bg-accent/5" : "border-border"}`}>
                    <p className="text-xs text-muted-foreground">5+ unidades</p>
                    <p className="font-semibold text-foreground">{formatPrice(product.price5)}</p>
                  </div>
                )}
                {product.price10 && (
                  <div className={`rounded-lg border p-3 text-center transition-colors ${quantity >= 10 ? "border-accent bg-accent/5" : "border-border"}`}>
                    <p className="text-xs text-muted-foreground">10+ unidades</p>
                    <p className="font-semibold text-foreground">{formatPrice(product.price10)}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Cantidad</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center text-lg font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">
                Precio unitario: <span className="font-semibold text-foreground">{formatPrice(unitPrice)}</span>
                {" · "}Total: <span className="font-semibold text-foreground">{formatPrice(unitPrice * quantity)}</span>
              </p>
            </div>

            {/* WhatsApp CTA */}
            <Button asChild variant="cta" size="lg" className="w-full rounded-full text-base">
              <a
                href={getWhatsAppLink(product.name, quantity)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle size={20} />
                Consultar por WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </main>

      {/* Sticky WhatsApp button mobile */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 p-4 bg-card/95 backdrop-blur border-t border-border z-50">
        <Button asChild variant="cta" size="lg" className="w-full rounded-full text-base">
          <a
            href={getWhatsAppLink(product.name, quantity)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={20} />
            Consultar por WhatsApp
          </a>
        </Button>
      </div>

      <Footer />
    </div>
  );
}
