'use client'

import * as z from "zod"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Rota } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { Trash } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form"
import { fetchWrapper } from "@/helpers/fetch-wrapper"

const formSchema = z.object({
  nome: z.string().min(1),
});

type RotaFormValues = z.infer<typeof formSchema>

interface RotaFormProps {
  initialData: Rota | null;
};

export const RotaForm: React.FC<RotaFormProps> = ({
  initialData,
}) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Modificar Rota' : 'Adicionar Rota';
  const description = initialData ? 'Modificar uma Rota.' : 'Adicionar uma nova Rota';
  const toastMessage = initialData ? 'Rota atualizada.' : 'Rota adicionada.';
  const action = initialData ? 'Salvar alterações' : 'Adicionar';

  const defaultValues = initialData ? {
    ...initialData,
  } : {};
  const form = useForm<RotaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: RotaFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await fetchWrapper.patch(`/api/rotas/${params.rotaId}`, data);
      } else {
        await fetchWrapper.post(`/api/rotas`, data);
      }
      router.refresh();
      router.push(`/rotas`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Algo deu errado!');
    } finally {
      setLoading(false);
    }
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      await fetchWrapper.delete(`/api/rotas/${params.rotaId}`);
      router.refresh();
      router.push(`/rotas`);
      toast.success('Rota removida.');
    } catch (error: any) {
      toast.error('Algo deu errado.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};