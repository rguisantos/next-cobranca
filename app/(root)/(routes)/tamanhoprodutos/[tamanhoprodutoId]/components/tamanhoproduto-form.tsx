"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { TamanhoProduto } from "@prisma/client"
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

const formSchema = z.object({
  medida: z.string().min(2),
});

type TamanhoProdutoFormValues = z.infer<typeof formSchema>

interface TamanhoProdutoFormProps {
  initialData: TamanhoProduto | null;
};

export const TamanhoProdutoForm: React.FC<TamanhoProdutoFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Modificar Tamanho de produto' : 'Adicionar Tamanho de produto';
  const description = initialData ? 'Modificar um Tamanho de produto.' : 'Adicionar um novo Tamanho de produto';
  const toastMessage = initialData ? 'Tamanho de produto atualizado.' : 'Tamanho de produto adicionado.';
  const action = initialData ? 'Salvar alterações' : 'Adicionar';

  const form = useForm<TamanhoProdutoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      medida: '',
    }
  });

  const onSubmit = async (data: TamanhoProdutoFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/tamanhoprodutos/${params.tamanhoprodutoId}`, data);
      } else {
        await axios.post(`/api/tamanhoprodutos`, data);
      }
      router.refresh();
      router.push(`/tamanhoprodutos`);
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
      await axios.delete(`/api/tamanhoprodutos/${params.tamanhoprodutoId}`);
      router.refresh();
      router.push(`/tamanhoprodutos`);
      toast.success('Tamanho de produto removido.');
    } catch (error: any) {
      toast.error('Antes disso, remova todos os produtos desse tamanho.');
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
              name="medida"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medida</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Medida do Produto" {...field} />
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