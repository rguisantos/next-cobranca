'use client'

import * as z from "zod"
import { FormEvent, FormEventHandler, useEffect, useMemo, useState } from "react"
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
    ehTipoLocacaoMensal: z.boolean(),
    valorMensal: z.preprocess((a) => parseFloat(z.string().parse(a)),
    z.number({invalid_type_error: "Precisa ser um preço",})).optional(),
    porcentagemEmpresa: z.preprocess((a) => parseFloat(z.string().parse(a)),
    z.number({invalid_type_error: "Precisa ser um percentual",})).optional(),
    porcentagemCliente: z.preprocess((a) => parseFloat(z.string().parse(a)),
    z.number({invalid_type_error: "Precisa ser um percentual",})).optional(),
    valorFicha: z.preprocess((a) => parseFloat(z.string().parse(a)),
    z.number({invalid_type_error: "Precisa ser um preço",})).optional(),
    valorSaldoDevedor: z.preprocess((a) => parseFloat(z.string().parse(a)),
    z.number({invalid_type_error: "Precisa ser um preço",})).optional(),
});

type LocacaoFormValues = z.infer<typeof formSchema>

export const LocacaoForm: React.FC = () => {

    const params = useParams();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [clientes, setClientes] = useState<{ id: string, nome: string, cpf: string }[]>([]);
    const [rotas, setRotas] = useState<{ id: string, nome: string }[]>([]);
    const [produtos, setProdutos] = useState<{ id: string, plaqueta: string, tipoProduto: { id: string, nome: string } }[]>([]);
    const [initialData, setInitialData] = useState<LocacaoFormValues>();


    const [tipoLocacaoMensal, setTipoLocacaoMensal] = useState(false);

    useEffect(() => {
        fetchWrapper.get(`/api/locacoes/${params.locacaoId}`).then(data => {
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

    const form = useForm<LocacaoFormValues>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (initialData) {
            form.setValue('produtoId', initialData.produtoId);
            form.setValue('clienteId', initialData.clienteId);
            form.setValue('rotaId', initialData.rotaId);
            form.setValue('ehTipoLocacaoMensal', initialData.ehTipoLocacaoMensal);
            setTipoLocacaoMensal(initialData.ehTipoLocacaoMensal ?? false);
            form.setValue('valorMensal', initialData.valorMensal??0);
            form.setValue('porcentagemEmpresa', initialData.porcentagemEmpresa??0);
            form.setValue('valorFicha', initialData.valorFicha??0);
            form.setValue('valorSaldoDevedor', initialData.valorSaldoDevedor??0);
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
                await fetchWrapper.patch(`/api/locacoes/${params.locacaoId}`, data);
            } else {
                await fetchWrapper.post(`/api/locacoes`, data);
            }
            router.refresh();
            router.push(`/locacoes`);
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
            await fetchWrapper.delete(`/api/locacoes/${params.locacaoId}`);
            router.refresh();
            router.push(`/locacoes`);
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
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8 w-full">
                    <div className="md:grid md:grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name="produtoId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Produto</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Selecione um produto" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {produtos.map((produto) => (
                                                <SelectItem key={produto.id} value={produto.id}>{produto.plaqueta}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="clienteId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cliente</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Selecione um Cliente" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {clientes.map((cliente) => (
                                                <SelectItem key={cliente.id} value={cliente.id}>{cliente.nome}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="rotaId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rota</FormLabel>
                                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue defaultValue={field.value} placeholder="Selecione uma rota" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {rotas.map((rota) => (
                                                <SelectItem key={rota.id} value={rota.id}>{rota.nome}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="ehTipoLocacaoMensal"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Locação</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={
                                            (value) => {
                                                field.onChange(value === 'true');
                                                setTipoLocacaoMensal(value === 'true');
                                            }
                                        }
                                        value={field?.value?.toString()}
                                        defaultValue={field?.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    defaultValue={field?.value?.toString()}
                                                    placeholder="Selecione o tipo da Locação" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value={'true'}>Mensal</SelectItem>
                                            <SelectItem value={'false'}>Porcentagem</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {tipoLocacaoMensal && <FormField
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
                        }
                        {!tipoLocacaoMensal && <FormField
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
                        }
                        {!tipoLocacaoMensal && <FormField
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
                        }
                        {!tipoLocacaoMensal && <FormField
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
                        }
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