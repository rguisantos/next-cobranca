"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { Produto, TipoProduto } from "@prisma/client"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  plaqueta: z.coerce.number().min(1),
  tipoProdutoId: z.string().min(1),
  contadorRelogio: z.coerce.number().min(1),
});

type ProdutoFormValues = z.infer<typeof formSchema>

interface ProdutoFormProps {
  initialData: Produto | null;
  tiposProdutos: TipoProduto[];
};

export const ProdutoForm: React.FC<ProdutoFormProps> = ({
  initialData,
  tiposProdutos
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Modificar Produto' : 'Adicionar Produto';
  const description = initialData ? 'Modificar um Produto.' : 'Adicionar um novo Produto';
  const toastMessage = initialData ? 'Produto atualizado.' : 'Produto adicionado.';
  const action = initialData ? 'Salvar alterações' : 'Adicionar';

  const defaultValues = initialData ? {
    ...initialData,
    plaqueta: parseFloat(String(initialData?.plaqueta)),
    contadorRelogio: parseFloat(String(initialData?.contadorRelogio)),
  } : {
    plaqueta: 0,
    tipoProdutoId: '',
    contadorRelogio:0
  }

  const form = useForm<ProdutoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: ProdutoFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/produtos/${params.produtoId}`, data);
      } else {
        await axios.post(`/api/produtos`, data);
      }
      router.refresh();
      router.push(`/produtos`);
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
      await axios.delete(`/api/produtos/${params.produtoId}`);
      router.refresh();
      router.push(`/produtos`);
      toast.success('Produto removido.');
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
              name="tipoProdutoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Escolha uma Especialidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tiposProdutos.map((tipoProduto) => (
                        <SelectItem key={tipoProduto.id} value={tipoProduto.id}>{tipoProduto.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plaqueta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plaqueta</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="Plaqueta do Produto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contadorRelogio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contador do Relógio</FormLabel>
                  <FormControl>
                    <Input type="number" disabled={loading} placeholder="Contador do Relógio do Produto" {...field} />
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