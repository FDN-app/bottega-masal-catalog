export interface Category {
  id: string;
  name: string;
  order: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  price5: number | null;
  price10: number | null;
  materials: string;
  dimensions: string;
  images: string[];
  active: boolean;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order: number;
}


export const WHATSAPP_NUMBER = "5491100000000";

export function formatPrice(price: number): string {
  return "$" + price.toLocaleString("es-AR");
}


export function getWhatsAppLink(productName: string, quantity: number): string {
  const text = encodeURIComponent(
    `Hola! Me interesa ${productName} x ${quantity} unidades. ¿Cuál es la disponibilidad?`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
