'use client'

import * as z from "zod"
import { useEffect, useState } from "react"
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
  FormMessage,
  FormDescription
} from "@/components/ui/form"
import { fetchWrapper } from "@/helpers/fetch-wrapper"
import { Switch } from "@/components/ui/switch"
import { RadioGroup } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  nome: z.string().min(1),
  senha: z.string().min(1),
});

type UsuarioFormValues = z.infer<typeof formSchema>


export const UsuarioForm: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [initialData, setInitialData] = useState<{ id: string, nome: string, acessosNaRota: { usuarioId:string, rotaId: string }[] }>();
  const [rotas, setRotas] = useState<{ id: string, nome: string, checked: boolean }[]>();

  useEffect(() => {
    fetchWrapper.get(`/api/usuarios/${params.usuarioId}`).then(dataUsuarios => {
      setInitialData(dataUsuarios);
    })
  }, []);

  useEffect(()=>{
    fetchWrapper.get(`/api/rotas`).then(dataRotas => {
      setRotas([...dataRotas.map((item:any)=>{
        return {
          ...item,
          checked:initialData?.acessosNaRota.map(acesso => acesso.rotaId).includes(item.id)
        }
      })]);
    })
  },[initialData])

  const title = initialData ? 'Modificar Usuario' : 'Adicionar Usuario';
  const description = initialData ? 'Modificar um Usuário.' : 'Adicionar um novo Usuário';
  const toastMessage = initialData ? 'Usuario atualizado.' : 'Usuario adicionado.';
  const action = initialData ? 'Salvar alterações' : 'Adicionar';

  const form = useForm<UsuarioFormValues>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (initialData) {
      form.setValue("nome", initialData.nome);
    }
  }, [initialData]);

  const onSubmit = async (data: any) => {
    console.log(rotas);
    try {
      setLoading(true);
      var id = params.usuarioId as string;
      if (initialData) {
        await fetchWrapper.patch(`/api/usuarios/${id}`, {...data, rotas: rotas?.filter(x=>x.checked)});
      } else {
        id = (await fetchWrapper.post(`/api/usuarios`, {...data, rotas: rotas?.filter(x=>x.checked)})).id;
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
      await fetchWrapper.delete(`/api/usuarios/${params.usuarioId}`);
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
            <RadioGroup>
              Rotas:
              {rotas?.map((rota,i) => {
                return (
                  <div key={i} className="flex items-center space-x-2">
                    <FormControl>
                      <Switch key={i} 
                        id={rota.id}
                        checked={rota.checked}
                        onCheckedChange={(checked) => {
                              setRotas(rotas.map((x)=>{
                                if(x.id===rota.id)
                                  x.checked=checked
                                return x;
                              }
                            ));
                          }
                        }
                      />
                    </FormControl>
                    <div className="space-y-0.5">
                      <FormLabel htmlFor={rota.id} className="text-base">
                        {rota.nome}
                      </FormLabel>
                    </div>
                  </div>
                )
              })}
            </RadioGroup>
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};