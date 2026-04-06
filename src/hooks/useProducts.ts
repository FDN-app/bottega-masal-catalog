import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string; // Mapped from category_id
  price: number; // Mapped from price_unit
  price5: number | null; // Mapped from price_wholesale_5
  price10: number | null; // Mapped from price_wholesale_10
  materials: string;
  dimensions: string;
  images: string[];
  active: boolean; // Mapped from is_active
}

// Convert DB to Product
const mapFromDB = (dbProduct: any): Product => ({
  id: dbProduct.id,
  name: dbProduct.name,
  description: dbProduct.description || "",
  categoryId: dbProduct.category_id,
  price: dbProduct.price_unit,
  price5: dbProduct.price_wholesale_5,
  price10: dbProduct.price_wholesale_10,
  materials: dbProduct.materials || "",
  dimensions: dbProduct.dimensions || "",
  images: dbProduct.images || [],
  active: dbProduct.is_active,
});

// Convert Product to DB
const mapToDB = (product: Omit<Product, "id"> | Product) => ({
  name: product.name,
  description: product.description,
  category_id: product.categoryId,
  price_unit: product.price,
  price_wholesale_5: product.price5,
  price_wholesale_10: product.price10,
  materials: product.materials,
  dimensions: product.dimensions,
  images: product.images,
  is_active: product.active,
});

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data.map(mapFromDB);
    },
  });
};

export const useProduct = (id?: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      return mapFromDB(data);
    },
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: Omit<Product, "id">) => {
      const { data, error } = await supabase
        .from("products")
        .insert([mapToDB(product)])
        .select()
        .single();
      if (error) throw error;
      return mapFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (product: Product) => {
      const { data, error } = await supabase
        .from("products")
        .update(mapToDB(product))
        .eq("id", product.id)
        .select()
        .single();
      if (error) throw error;
      return mapFromDB(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const uploadImages = async (productId: string, files: File[]) => {
  const urls: string[] = [];
  for (let i = 0; i < Math.min(files.length, 4); i++) {
    const file = files[i];
    const fileExt = file.name.split('.').pop();
    const filePath = `${productId}/${i + 1}-${Date.now()}.${fileExt}`;
    
    const { error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);
      
    urls.push(data.publicUrl);
  }
  return urls;
};
