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
produtoId: z.string().nonempty(),
clienteId: z.string().nonempty(),
rotaId: z.string().nonempty(),
ehTipoLocacaoMensal: z.boolean().optional(),
valorMensal: z.number().optional(),
porcentagemEmpresa: z.number().optional(),
porcentagemCliente: z.number().optional(),
valorFicha: z.number().optional(),
valorSaldoDevedor: z.number().optional(),
});

type LocacaoFormValues = z.infer<typeof formSchema>

export const LocacaoForm: React.FC = () => {

const params = useParams();
const router = useRouter();
const [open, setOpen] = useState(false);
const [loading, setLoading] = useState(false);
const [clientes, setClientes] = useState<{id:string, nome:string}[]>([]);
const [rotas, setRotas] = useState<{id:string, nome:string}[]>([]);
const [produtos, setProdutos] = useState<{id:string, nome:string}[]>([]);
const [initialData, setInitialData] = useState<LocacaoFormValues>();

useEffect(() => {
    fetchWrapper.get(`/api/locacaos/${params.locacaoId}`).then(data => {
    setInitialData(data);
    })
    fetchWrapper.get('/api/clientes').then(data => {
    setClientes(data);
    })
    fetchWrapper.get('/api/rotas').then(data => {
    setRotas(data);
    })
    fetchWrapper.get('/api/produtos').then(data => {
    setProdutos(data);
    })
}, [])

const title = initialData ? 'Modificar Locacão' : 'Adicionar Locação';
const description = initialData ? 'Modificar uma Locação.' : 'Adicionar uma nova Locação';
const toastMessage = initialData ? 'Locação atualizada.' : 'Locação adicionada.';
const action = initialData ? 'Salvar alterações' : 'Adicionar';

const defaultValues = initialData ? {
    ...initialData,
    valorFicha: parseFloat(String(initialData?.valorFicha)),
    valorSaldoDevedor: parseFloat(String(initialData?.valorSaldoDevedor)),
    ehTipoLocacaoMensal: initialData?.ehTipoLocacaoMensal ?? undefined,
} : {
    produtoId: '',
    clienteId: '',
    rotaId: '',
    ehTipoLocacaoMensal: '',
    valorMensal: 0,
    porcentagemEmpresa: '',
    porcentagemCliente: '',
    valorFicha: 0,
    valorSaldoDevedor: 0,
}

const form = useForm<LocacaoFormValues>({
    resolver: zodResolver(formSchema),
});

useEffect(() => {
    if (initialData) {
        form.setValue('produtoId', initialData.produtoId);
        form.setValue('clienteId', initialData.clienteId);
        form.setValue('rotaId', initialData.rotaId);
    }
}, [initialData]);

// Watch the value of porcentagemEmpresa and set porcentagemCliente accordingly
const porcentagemEmpresa = form.watch('porcentagemEmpresa');
useEffect(() => {
    if (porcentagemEmpresa !== undefined) {
        form.setValue('porcentagemCliente', 100 - porcentagemEmpresa);
    }
}, [porcentagemEmpresa]);

const onSubmit = async (data: LocacaoFormValues) => {
    try {
        setLoading(true);
        if (initialData) {
            await fetchWrapper.patch(`/api/locacaos/${params.locacaoId}`, data);
        } else {
            await fetchWrapper.post(`/api/locacaos`, data);
        }
        router.refresh();
        router.push(`/locacaos`);
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
        await fetchWrapper.delete(`/api/locacaos/${params.locacaoId}`);
        router.refresh();
        router.push(`/locacaos`);
        toast.success('Locação removida.');
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
                  name="produtoId"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="produtoId">Produto</FormLabel>
                        <Select {...field}>
                            <SelectTrigger>
                            <SelectValue>{produtos.find(p => p.id === field.value)?.nome || 'Selecione um produto'}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                            {produtos.map(p => (
                                <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage>{form.formState.errors.produtoId?.message}</FormMessage>
                    </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="clienteId"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="clienteId">Cliente</FormLabel>
                        <Select {...field}>
                            <SelectTrigger>
                            <SelectValue>{clientes.find(c => c.id === field.value)?.nome || 'Selecione um cliente'}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                            {clientes.map(c => (
                                <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage>{form.formState.errors.clienteId?.message}</FormMessage>
                    </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="rotaId"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="rotaId">Rota</FormLabel>
                        <Select {...field}>
                            <SelectTrigger>
                            <SelectValue>{rotas.find(r => r.id === field.value)?.nome || 'Selecione uma rota'}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                            {rotas.map(r => (
                                <SelectItem key={r.id} value={r.id}>{r.nome}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        <FormMessage>{form.formState.errors.rotaId?.message}</FormMessage>
                    </FormItem>
                    )}
                />
                <FormField
              control={form.control}
                name="ehTipoLocacaoMensal"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="ehTipoLocacaoMensal">Tipo de Locação</FormLabel>
                        <Select {...field} value={field.value ? 'true' : 'false'}>
                            <SelectTrigger>
                                <SelectValue>{field.value ? 'Mensal' : 'Porcentagem'}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={'true'}>Mensal</SelectItem>
                                <SelectItem value={'false'}>Porcentagem</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage>{form.formState.errors.ehTipoLocacaoMensal?.message}</FormMessage>
                    </FormItem>
                )}
                />
                <FormField
                  control={form.control}
                  name="valorMensal"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="valorMensal">Valor Mensal</FormLabel>
                        <Input {...field} type="number" />
                        <FormMessage>{form.formState.errors.valorMensal?.message}</FormMessage>
                    </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="porcentagemEmpresa"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="porcentagemEmpresa">Porcentagem Empresa</FormLabel>
                        <Input {...field} type="number" />
                        <FormMessage>{form.formState.errors.porcentagemEmpresa?.message}</FormMessage>
                    </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="porcentagemCliente"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="porcentagemCliente">Porcentagem Cliente</FormLabel>
                        <Input {...field} type="number" />
                        <FormMessage>{form.formState.errors.porcentagemCliente?.message}</FormMessage>
                    </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="valorFicha"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="valorFicha">Valor Ficha</FormLabel>
                        <Input {...field} type="number" />
                        <FormMessage>{form.formState.errors.valorFicha?.message}</FormMessage>
                    </FormItem>
                    )}
                />
                <FormField
                  control={form.control}
                  name="valorSaldoDevedor"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel htmlFor="valorSaldoDevedor">Valor Saldo Devedor</FormLabel>
                        <Input {...field} type="number" />
                        <FormMessage>{form.formState.errors.valorSaldoDevedor?.message}</FormMessage>
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