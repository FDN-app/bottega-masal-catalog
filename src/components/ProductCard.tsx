import { Link } from "react-router-dom";
import { type Product, formatPrice, getCategory } from "@/data/mock";
import { ImageIcon } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const category = getCategory(product.categoryId);

  return (
    <Link
      to={`/producto/${product.id}`}
      className="group block rounded-lg overflow-hidden bg-card shadow-sm border border-border transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
    >
      {/* Image placeholder */}
      <div className="aspect-[4/3] bg-wood-light flex items-center justify-center">
        <ImageIcon size={48} className="text-primary/30" />
      </div>

      <div className="p-4 space-y-2">
        {category && (
          <span className="inline-block text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
            {category.name}
          </span>
        )}
        <h3 className="font-display text-lg font-semibold text-foreground leading-tight">
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground">
          Desde {formatPrice(product.price10 ?? product.price5 ?? product.price)}
        </p>
      </div>
    </Link>
  );
}
