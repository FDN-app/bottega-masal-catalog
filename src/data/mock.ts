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

export const categories: Category[] = [
  { id: "1", name: "Lámparas", order: 1 },
  { id: "2", name: "Juegos", order: 2 },
  { id: "3", name: "Decoración", order: 3 },
  { id: "4", name: "Playeras", order: 4 },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Lámpara Nórdica",
    description: "Lámpara de diseño nórdico hecha a mano con madera de pino y detalles en hierro forjado. Perfecta para crear ambientes cálidos y acogedores.",
    categoryId: "1",
    price: 25000,
    price5: 21000,
    price10: 18000,
    materials: "Pino y hierro",
    dimensions: "30x30x45cm",
    images: [],
    active: true,
  },
  {
    id: "2",
    name: "Lámpara Rústica",
    description: "Lámpara rústica elaborada con roble reciclado. Cada pieza es única, con las vetas naturales de la madera como protagonistas.",
    categoryId: "1",
    price: 30000,
    price5: 26000,
    price10: 22000,
    materials: "Roble reciclado",
    dimensions: "25x25x50cm",
    images: [],
    active: true,
  },
  {
    id: "3",
    name: "Tejo Artesanal",
    description: "Mesa de tejo artesanal con acabado profesional. Superficie de juego en MDF con pintura epoxi de alta resistencia.",
    categoryId: "2",
    price: 15000,
    price5: 12000,
    price10: 10000,
    materials: "MDF y pintura epoxi",
    dimensions: "150x50cm",
    images: [],
    active: true,
  },
  {
    id: "4",
    name: "Pizarra de Pie",
    description: "Pizarra de pie ideal para comercios, bares o decoración del hogar. Estructura de pino con superficie de pintura pizarra.",
    categoryId: "3",
    price: 18000,
    price5: 15000,
    price10: 12000,
    materials: "Pino y pintura pizarra",
    dimensions: "60x120cm",
    images: [],
    active: true,
  },
  {
    id: "5",
    name: "Paleta Playera",
    description: "Paleta de playa de multilaminado con diseño ergonómico. Liviana y resistente, ideal para la arena o el parque.",
    categoryId: "4",
    price: 8000,
    price5: 6500,
    price10: 5000,
    materials: "Multilaminado",
    dimensions: "45x20cm",
    images: [],
    active: true,
  },
];

export const faqs: FAQ[] = [
  { id: "1", question: "¿Hacen envíos?", answer: "Sí, enviamos a toda la zona de GBA y al interior del país a través de empresas de transporte.", order: 1 },
  { id: "2", question: "¿Cuáles son los materiales?", answer: "Trabajamos con maderas seleccionadas de primera calidad. Cada producto especifica sus materiales.", order: 2 },
  { id: "3", question: "¿Cuánto tarda un pedido?", answer: "Los productos en stock se despachan en 48-72hs. Pedidos por mayor pueden tardar 7-15 días.", order: 3 },
  { id: "4", question: "¿Se pueden personalizar los productos?", answer: "Consultanos por WhatsApp y vemos las posibilidades de personalización.", order: 4 },
  { id: "5", question: "¿Cuáles son los medios de pago?", answer: "Transferencia bancaria y efectivo. Para compras mayoristas, consultanos por condiciones.", order: 5 },
];

export const WHATSAPP_NUMBER = "5491100000000";

export function formatPrice(price: number): string {
  return "$" + price.toLocaleString("es-AR");
}

export function getCategory(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getWhatsAppLink(productName: string, quantity: number): string {
  const text = encodeURIComponent(
    `Hola! Me interesa ${productName} x ${quantity} unidades. ¿Cuál es la disponibilidad?`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
