import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useFaqs } from "@/hooks/useFaqs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  const { data: faqs = [], isLoading } = useFaqs();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-8">
          Preguntas Frecuentes
        </h1>
        <div className="max-w-2xl mx-auto">
          {isLoading ? (
            <p className="text-center text-muted-foreground animate-pulse">Cargando preguntas frecuentes...</p>
          ) : (
            <Accordion type="single" collapsible className="space-y-2">
              {faqs
                .sort((a, b) => a.order - b.order)
                .map((faq) => (
                  <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="border border-border rounded-lg px-4 bg-card"
                  >
                    <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
