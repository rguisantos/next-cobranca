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

type CorProdutoFormValues = z.infer<typeof formSchema>

export const CorProdutoForm: React.FC = () => {

  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [initialData, setInitialData] = useState<CorProdutoFormValues>();

  useEffect(() => {
    fetchWrapper.get(`/api/corprodutos/${params.corprodutoId}`).then(data => {
      setInitialData(data);
    })
  }, [])

  const title = initialData ? 'Modificar Cor de produto' : 'Adicionar Cor de produto';
  const description = initialData ? 'Modificar uma Cor de produto.' : 'Adicionar uma nova Cor de produto';
  const toastMessage = initialData ? 'Cor de produto atualizada.' : 'Cor de produto adicionada.';
  const action = initialData ? 'Salvar alterações' : 'Adicionar';

  const form = useForm<CorProdutoFormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: CorProdutoFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await fetchWrapper.patch(`/api/corprodutos/${params.corprodutoId}`, data);
      } else {
        await fetchWrapper.post(`/api/corprodutos`, data);
      }
      router.refresh();
      router.push(`/corprodutos`);
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
      await fetchWrapper.delete(`/api/corprodutos/${params.corprodutoId}`);
      router.refresh();
      router.push(`/corprodutos`);
      toast.success('Cor de produto removida.');
    } catch (error: any) {
      toast.error('Antes disso, remova todos os produtos dessa cor.');
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
                    <Input disabled={loading} placeholder="Nome da Cor de Produto" {...field} />
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