"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { AcessoNaRota, Usuario, Rota } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { Trash } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  usuario: z.string().min(1),
  rota: z.string().min(1),
  rotaId: z.string().min(1),
  usuarioId: z.string().min(1),
});

type AcessoNaRotaFormValues = z.infer<typeof formSchema>

interface AcessoNaRotaFormProps {
  initialData: AcessoNaRota | null;
  usuarios: Usuario[];
  rotas: Rota[];
};

export const AcessoNaRotaForm: React.FC<AcessoNaRotaFormProps> = ({
  initialData,
  usuarios,
  rotas,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Modificar Acessos' : 'Adicionar Acesso a Rota';
  const description = initialData ? 'Modificar um Acesso.' : 'Adicionar um Novo Acesso';
  const toastMessage = initialData ? 'Acesso a Rota atualizado.' : 'Acesso a Rota adicionado.';
  const action = initialData ? 'Salvar alterações' : 'Adicionar';

  const defaultValues = initialData ? {
    ...initialData,
    usuarioId: initialData.usuarioId,
    rotaId: initialData.rotaId,
  } : {
    rotaId: '',
    usuarioId: '',
  };

  const form = useForm<AcessoNaRotaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: AcessoNaRotaFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/acessonarota/${params.acessoNaRotaId}`, data);
      } else {
        await axios.post(`/api/acessonarota`, data);
      }
      router.refresh();
      router.push(`/acessonarota`);
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
      await axios.delete(`/api/acessonarota/${params.acessoNaRotaId}`);
      router.refresh();
      router.push(`/acessonarota`);
      toast.success('Acesso removido.');
    } catch (error: any) {
      toast.error('Antes disso, remova todos os Acessos.');
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
  name="usuario"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Usuário</FormLabel>
      <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue defaultValue={field.value} placeholder="Escolha uma Especialidade" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
        {usuarios && usuarios.map((usuario) => (
            <SelectItem key={usuario.id} value={usuario.id}>{usuario.nome}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
            <FormField
              control={form.control}
              name="rota"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rota</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Escolha uma Especialidade" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {rotas && rotas.map((rota) => (
                        <SelectItem key={rota.id} value={rota.id}>{rota.nome}</SelectItem>
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