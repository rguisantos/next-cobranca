"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Usuario } from "@prisma/client"
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

const formSchema = z.object({
  nome: z.string().min(1),
  senha: z.string().min(1),
});

type UsuarioFormValues = z.infer<typeof formSchema>

interface UsuarioFormProps {
  initialData: Usuario | null;
};

export const UsuarioForm: React.FC<UsuarioFormProps> = ({
  initialData,
}) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Modificar Usuario' : 'Adicionar Usuario';
  const description = initialData ? 'Modificar um Usuário.' : 'Adicionar um novo Usuário';
  const toastMessage = initialData ? 'Usuario atualizado.' : 'Usuario adicionado.';
  const action = initialData ? 'Salvar alterações' : 'Adicionar';

  const defaultValues = initialData ? {
    ...initialData,
    } : {};
    const form = useForm<UsuarioFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues
      });

  const onSubmit = async (data: UsuarioFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/usuarios/${params.usuarioId}`, data);
      } else {
        await axios.post(`/api/usuarios`, data);
      }
      router.refresh();
      router.push(`/usuarios`);
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
      await axios.delete(`/api/usuarios/${params.usuarioId}`);
      router.refresh();
      router.push(`/usuarios`);
      toast.success('Usuário removido.');
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
            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
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