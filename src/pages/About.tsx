import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Hammer, HeartHandshake, TreePine } from "lucide-react";

const values = [
  { icon: Hammer, title: "Hecho a mano", desc: "Cada pieza es elaborada artesanalmente con dedicación y atención al detalle." },
  { icon: HeartHandshake, title: "Tradición italiana", desc: "Técnicas heredadas de generación en generación, fusionando lo clásico con lo moderno." },
  { icon: TreePine, title: "Calidad artesanal", desc: "Maderas seleccionadas y acabados de primera calidad en cada producto." },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-10 space-y-12">
        <section className="max-w-2xl mx-auto text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Nuestra Historia</h1>
          <p className="text-muted-foreground leading-relaxed">
            Bottega MaSal nace de la pasión por la madera y el trabajo artesanal. Con raíces
            en la tradición italiana de la carpintería, cada producto que creamos lleva consigo
            años de experiencia, amor por los detalles y un compromiso inquebrantable con la calidad.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Desde nuestra bottega en la Zona Oeste del Gran Buenos Aires, transformamos maderas
            nobles en piezas únicas que cuentan historias. No hacemos producción masiva: cada
            lámpara, cada juego, cada objeto decorativo pasa por nuestras manos.
          </p>
        </section>

        <section className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {values.map((v) => (
            <div key={v.title} className="text-center space-y-3 p-6 rounded-lg bg-card border border-border">
              <div className="w-14 h-14 mx-auto rounded-full bg-secondary flex items-center justify-center">
                <v.icon size={28} className="text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
