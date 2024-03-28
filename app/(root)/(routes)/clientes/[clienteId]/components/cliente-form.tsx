'use client'

import * as z from "zod"
import { useEffect, useMemo, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
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
  cpf: z.string().min(1),
  rg: z.string().min(1),
  telefone: z.string().min(1),
  endereco: z.string().min(1),
  cidade: z.string().min(1),
  estado: z.string().min(1),
});

type ClienteFormValues = z.infer<typeof formSchema>

export const ClienteForm: React.FC = () => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [initialData, setInitialData] = useState<ClienteFormValues>();

  useEffect(() => {
    fetchWrapper.get(`/api/clientes/${params.clienteId}`).then(data => {
      setInitialData(data);
    })
  }, [])

  const title = initialData ? 'Modificar Cliente' : 'Adicionar Cliente';
  const description = initialData ? 'Modificar um Cliente.' : 'Adicionar um novo Cliente';
  const toastMessage = initialData ? 'Cliente atualizado.' : 'Cliente adicionado.';
  const action = initialData ? 'Salvar alterações' : 'Adicionar';

  const defaultValues = initialData ? {
    ...initialData,
    } : {};
    const form = useForm<ClienteFormValues>({
        resolver: zodResolver(formSchema),
      });


  useEffect(() => {
    if (initialData) {
      form.setValue("nome",initialData.nome);
      form.setValue("cpf",initialData.cpf);
      form.setValue("rg",initialData.rg);
      form.setValue("telefone",initialData.telefone);
      form.setValue("endereco",initialData.endereco);
      form.setValue("cidade",initialData.cidade);
      form.setValue("estado",initialData.estado);
    }
  }, [initialData]);

  const onSubmit = async (data: ClienteFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await fetchWrapper.patch(`/api/clientes/${params.clienteId}`, data);
      } else {
        await fetchWrapper.post(`/api/clientes`, data);
      }
      router.refresh();
      router.push(`/clientes`);
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
      await fetchWrapper.delete(`/api/produtos/${params.clienteId}`);
      router.refresh();
      router.push(`/clientes`);
      toast.success('Cliente removido.');
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>RG</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefone</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endereco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cidade</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
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