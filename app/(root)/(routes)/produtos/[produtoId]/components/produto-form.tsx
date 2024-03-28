'use client'

import * as z from "zod"
import { useEffect, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Produto, TipoProduto, TamanhoProduto, CorProduto } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { Trash } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { fetchWrapper } from "@/helpers/fetch-wrapper"

const formSchema = z.object({
  plaqueta: z.coerce.number().min(1),
  tipoProdutoId: z.string().min(1),
  contadorRelogio: z.coerce.number().min(1),
  tamanhoProdutoId: z.string().min(1),
  corProdutoId: z.string().min(1),
});

type ProdutoFormValues = z.infer<typeof formSchema>

export const ProdutoForm: React.FC = () => {

  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tiposProdutos, setTiposProdutos] = useState<TipoProduto[]>([]);
  const [tamanhoProdutos, setTamanhoProdutos] = useState<TamanhoProduto[]>([]);
  const [corProdutos, setCorProdutos] = useState<CorProduto[]>([]);
  const [initialData, setInitialData] = useState<ProdutoFormValues>();


  useEffect(() => {
    fetchWrapper.get(`/api/produtos/${params.produtoId}`).then(data => {
      setInitialData(data);
    })
    fetchWrapper.get('/api/tipoprodutos').then(data => {
      setTiposProdutos(data);
    })
    fetchWrapper.get('/api/tamanhoprodutos').then(data => {
      setTamanhoProdutos(data);
    })
    fetchWrapper.get('/api/corprodutos').then(data => {
      setCorProdutos(data);
    })
  }, [])


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
    contadorRelogio: 0,
    tamanhoProdutoId: '',
    corProdutoId: '',
  }

  const form = useForm<ProdutoFormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (initialData) {
      form.setValue('plaqueta', initialData.plaqueta);
      form.setValue('tipoProdutoId', initialData.tipoProdutoId);
      form.setValue('contadorRelogio', initialData.contadorRelogio);
      form.setValue('tamanhoProdutoId', initialData.tamanhoProdutoId);
      form.setValue('corProdutoId', initialData.corProdutoId);
    }
  }, [initialData]);

  const onSubmit = async (data: ProdutoFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await fetchWrapper.patch(`/api/produtos/${params.produtoId}`, data);
      } else {
        await fetchWrapper.post(`/api/produtos`, data);
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
      await fetchWrapper.delete(`/api/produtos/${params.produtoId}`);
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
            <FormField
              control={form.control}
              name="tamanhoProdutoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tamanho do Produto</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Escolha um Tamanho" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tamanhoProdutos.map((tamanhoProduto) => (
                        <SelectItem key={tamanhoProduto.id} value={tamanhoProduto.id}>{tamanhoProduto.medida}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="corProdutoId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cor do Produto</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Escolha uma Cor" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {corProdutos.map((corProduto) => (
                        <SelectItem key={corProduto.id} value={corProduto.id}>{corProduto.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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