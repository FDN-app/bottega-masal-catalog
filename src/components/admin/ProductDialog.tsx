import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useCreateProduct, useUpdateProduct, uploadImages, type Product } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { toast } from "sonner";
import { ImageIcon } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(1, "Nombre requerido"),
  description: z.string(),
  categoryId: z.string().min(1, "Categoría requerida"),
  price: z.coerce.number().min(1, "Precio debe ser mayor a 0"),
  price5: z.coerce.number().optional().nullable(),
  price10: z.coerce.number().optional().nullable(),
  materials: z.string(),
  dimensions: z.string(),
  active: z.boolean().default(true),
});

type FormValues = z.infer<typeof productSchema>;

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function ProductDialog({ open, onOpenChange, product }: ProductDialogProps) {
  const { data: categories = [] } = useCategories();
  const { mutateAsync: createProduct } = useCreateProduct();
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      categoryId: "",
      price: 0,
      price5: null,
      price10: null,
      materials: "",
      dimensions: "",
      active: true,
    },
  });

  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        categoryId: product.categoryId,
        price: product.price,
        price5: product.price5,
        price10: product.price10,
        materials: product.materials,
        dimensions: product.dimensions,
        active: product.active,
      });
      setPreviewUrls(product.images || []);
    } else {
      form.reset({
        name: "",
        description: "",
        categoryId: "",
        price: 0,
        price5: null,
        price10: null,
        materials: "",
        dimensions: "",
        active: true,
      });
      setPreviewUrls([]);
    }
    setFiles([]);
  }, [product, form, open]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, 4); // Max 4
      setFiles(selectedFiles);
      setPreviewUrls(selectedFiles.map(file => URL.createObjectURL(file)));
    }
  };

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      let finalImages = product?.images || [];
      
      // We upload images independently if they selected new files.
      // However, to upload images to Supabase they must be associated to the product ID.
      // Easiest is to create/update first without images, get ID, then upload, then update again.
      // Or we can just generate an ID (since it's a UUID) before. But Supabase DB gives us the ID.
      
      if (product) {
        if (files.length > 0) {
          finalImages = await uploadImages(product.id, files);
        }
        await updateProduct({ ...values, id: product.id, images: finalImages } as Product);
        toast.success("Producto actualizado");
      } else {
        const tempProduct = await createProduct({ ...values, images: [] } as Omit<Product, "id">);
        if (files.length > 0) {
          finalImages = await uploadImages(tempProduct.id, files);
          await updateProduct({ ...tempProduct, images: finalImages } as Product);
        }
        toast.success("Producto creado");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Ocurrió un error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? "Editar Producto" : "Nuevo Producto"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre *</FormLabel>
                    <FormControl><Input placeholder="Madera..." {...field} disabled={isLoading} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl><Textarea className="h-20" placeholder="Hermoso producto artesanal..." {...field} disabled={isLoading} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio Lista *</FormLabel>
                    <FormControl><Input type="number" {...field} disabled={isLoading} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price5"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio 5+ uds</FormLabel>
                    <FormControl><Input type="number" {...field} value={field.value ?? ""} disabled={isLoading} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price10"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio 10+ uds</FormLabel>
                    <FormControl><Input type="number" {...field} value={field.value ?? ""} disabled={isLoading} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="materials"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Materiales</FormLabel>
                    <FormControl><Input placeholder="Roble y Metal..." {...field} disabled={isLoading} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dimensions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dimensiones</FormLabel>
                    <FormControl><Input placeholder="30x20x15 cm..." {...field} disabled={isLoading} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Images Input */}
            <div className="space-y-2">
              <FormLabel>Fotos (Max 4, al subirlas se reemplazarán las actuales)</FormLabel>
              <Input type="file" multiple accept="image/*" onChange={handleFileChange} disabled={isLoading} />
              {previewUrls.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {previewUrls.map((url, idx) => (
                    <div key={idx} className="w-16 h-16 border rounded bg-muted flex items-center justify-center overflow-hidden">
                      {url ? <img src={url} className="w-full h-full object-cover" alt="preview" /> : <ImageIcon size={20} />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Estado del producto</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Activar mostrará el producto en el catálogo público
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancelar</Button>
              <Button type="submit" disabled={isLoading}>{isLoading ? "Guardando..." : "Guardar"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
