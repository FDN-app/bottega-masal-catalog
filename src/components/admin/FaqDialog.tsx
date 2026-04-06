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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useCreateFaq, useUpdateFaq, type FAQ } from "@/hooks/useFaqs";
import { toast } from "sonner";

const faqSchema = z.object({
  question: z.string().min(1, "Pregunta requerida"),
  answer: z.string().min(1, "Respuesta requerida"),
  order: z.coerce.number().min(0, "Debe ser al menos 0"),
});

type FormValues = z.infer<typeof faqSchema>;

interface FaqDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  faq: FAQ | null;
}

export function FaqDialog({ open, onOpenChange, faq }: FaqDialogProps) {
  const { mutateAsync: createFaq } = useCreateFaq();
  const { mutateAsync: updateFaq } = useUpdateFaq();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: "",
      answer: "",
      order: 0,
    },
  });

  useEffect(() => {
    if (faq) {
      form.reset({
        question: faq.question,
        answer: faq.answer,
        order: faq.order,
      });
    } else {
      form.reset({ question: "", answer: "", order: 0 });
    }
  }, [faq, form, open]);

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      if (faq) {
        await updateFaq({ ...values, id: faq.id } as FAQ);
        toast.success("Pregunta actualizada");
      } else {
        await createFaq(values as Omit<FAQ, "id">);
        toast.success("Pregunta creada");
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{faq ? "Editar Pregunta" : "Nueva Pregunta"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pregunta</FormLabel>
                  <FormControl><Input placeholder="¿Hacen envíos?" {...field} disabled={isLoading} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Respuesta</FormLabel>
                  <FormControl><Textarea className="min-h-[100px]" placeholder="Sí, a todo el país..." {...field} disabled={isLoading} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orden</FormLabel>
                  <FormControl><Input type="number" {...field} disabled={isLoading} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancelar</Button>
              <Button type="submit" disabled={isLoading}>{isLoading ? "Guardando..." : "Guardar"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
