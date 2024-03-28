'use client'

import * as z from "zod"
import { useEffect, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { fetchWrapper } from "@/helpers/fetch-wrapper"

const formSchema = z.object({
  nome: z.string().min(2),
});

type TipoProdutoFormValues = z.infer<typeof formSchema>

export const TipoProdutoForm: React.FC = () => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [initialData, setInitialData] = useState<TipoProdutoFormValues>();

  useEffect(() => {
    fetchWrapper.get(`/api/tipoprodutos/${params.tipoprodutoId}`).then(data => {
      setInitialData(data);
    })
  }, [])

  const title = initialData ? 'Modificar Tipo de produto' : 'Adicionar Tipo de produto';
  const description = initialData ? 'Modificar um Tipo de produto.' : 'Adicionar um novo Tipo de produto';
  const toastMessage = initialData ? 'Tipo de produto atualizado.' : 'Tipo de produto adicionado.';
  const action = initialData ? 'Salvar alterações' : 'Adicionar';


  const form = useForm<TipoProdutoFormValues>({
    resolver: zodResolver(formSchema),
  });
  
  useEffect(() => {
    if (initialData) {
      form.setValue("nome",initialData.nome);
    }
  }, [initialData]);

  const onSubmit = async (data: TipoProdutoFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await fetchWrapper.patch(`/api/tipoprodutos/${params.tipoprodutoId}`, data);
      } else {
        await fetchWrapper.post(`/api/tipoprodutos`, data);
      }
      router.refresh();
      router.push(`/tipoprodutos`);
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
      await fetchWrapper.delete(`/api/tipoprodutos/${params.tipoprodutoId}`);
      router.refresh();
      router.push(`/tipoprodutos`);
      toast.success('Tipo de produto removido.');
    } catch (error: any) {
      toast.error('Antes disso, remova todos os produtos desse tipo.');
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
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Nome do Tipo de Produto" {...field} />
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
