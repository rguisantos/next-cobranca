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

export const LoginCard: React.FC = () => {
    localStorage.removeItem('user');
    const [nome, setNome] = useState('');
    const [senha, setSenha] = useState('');
    const router = useRouter();

    const onAcessar = (nome: string, senha: string): void => {
        fetchWrapper.post(`/api/auth`, { nome, senha })
            .then(user => {
                localStorage.setItem('user', JSON.stringify(user));
                router.push('/');
            });
    }

    return (
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Informe suas credenciais</CardDescription>
            </CardHeader>
            <CardContent>
                <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="nome">Nome</Label>
                            <Input id="nome" onChange={(e) => setNome(e.target.value)} placeholder="Seu Nome" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="senha">Senha</Label>
                            <Input id="senha" onChange={(e) => setSenha(e.target.value)} type="password" placeholder="****" />
                        </div>
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button onClick={() => onAcessar(nome, senha)}>Acessar</Button>
            </CardFooter>
        </Card>
    )
}