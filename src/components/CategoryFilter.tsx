import { useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  active: string | null;
  onChange: (id: string | null) => void;
}

export default function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  const { data: categories = [], isLoading } = useCategories();

  if (isLoading) return <div className="text-sm text-muted-foreground animate-pulse">Cargando categorías...</div>;

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={active === null ? "chip-active" : "chip"}
        size="sm"
        onClick={() => onChange(null)}
        className="rounded-full"
      >
        Todos
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat.id}
          variant={active === cat.id ? "chip-active" : "chip"}
          size="sm"
          onClick={() => onChange(cat.id)}
          className="rounded-full"
        >
          {cat.name}
        </Button>
      ))}
    </div>
  );
}
