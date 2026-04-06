import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import { products } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import heroImage from "@/assets/hero-wood.jpg";

export default function Index() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? products.filter((p) => p.categoryId === activeCategory && p.active)
    : products.filter((p) => p.active);

  const scrollToCatalog = () => {
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="relative py-20 md:py-32 overflow-hidden">
        <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" width={1920} height={800} />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-background/30" />
        <div className="container relative text-center space-y-5">
          <h1 className="font-display text-4xl md:text-6xl font-bold text-primary">
            Bottega MaSal
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 max-w-xl mx-auto">
            Madera con historia — Productos artesanales hechos a mano con tradición italiana
          </p>
          <Button variant="cta" size="lg" onClick={scrollToCatalog} className="rounded-full">
            Ver catálogo
            <ArrowDown size={18} />
          </Button>
        </div>
      </section>

      {/* Catalog */}
      <section id="catalogo" className="container py-10 space-y-6 flex-1">
        <h2 className="font-display text-2xl font-semibold text-foreground">
          Nuestros Productos
        </h2>
        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No hay productos en esta categoría.
          </p>
        )}
      </section>

      <Footer />
    </div>
  );
}
