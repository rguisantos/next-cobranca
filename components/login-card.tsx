'use client'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fetchWrapper } from "@/helpers/fetch-wrapper"
import { useRouter } from "next/navigation"
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"

const formSchema = z.object({
    nome: z.string().min(2),
    senha: z.string().min(2),
});

type LoginFormValues = z.infer<typeof formSchema>

export const LoginCard: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nome: '',
            senha: '',
        }
    });

    const onSubmit = (data: { nome: string, senha: string }): void => {
        setLoading(true);
        localStorage.removeItem('user');
        fetchWrapper.post(`/api/auth`, data)
            .then(user => {
                toast.success("Login com sucesso!");
                localStorage.setItem('user', JSON.stringify(user));
                router.push('/');
            })
            .catch(() => {
                toast.error('Algo deu errado!');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>Informe suas credenciais</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <FormField
                                    control={form.control}
                                    name="nome"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} placeholder="Seu nome" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <FormField
                                    control={form.control}
                                    name="senha"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Senha</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} type="password" placeholder="***" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button type="submit">Acessar</Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    )
}