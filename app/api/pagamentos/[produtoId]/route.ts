import { NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import axios from "axios";

export async function GET(
    req: Request,
    { params }: { params: { produtoId: string } }
) {
    try {
        if (!params.produtoId) {
            return new NextResponse("Id do Produto é obrigatória", { status: 400 });
        }

        const produto = await prismadb.produto.findUnique({
            where: {
                id: params.produtoId
            }
        });

        if (!produto)
            return new NextResponse("Id do Produto não encontrado", { status: 400 });

        if (!produto.maquinaId || produto.maquinaId === "")
            return new NextResponse("Produto não tem maquinaId", { status: 400 });

        const apiPagamento = (await prismadb.configuracao.findFirst({
            where: {
                chave: "API_PAGAMENTO"
            }
        }));

        var tokenApiPagamento = (await prismadb.configuracao.findFirst({
            where: {
                chave: "TOKEN_PAGAMENTO"
            }
        }));

        if(tokenApiPagamento){
            try{
                const res = await axios.get(`${apiPagamento?.valor}/pagamentos/${produto.maquinaId}`, {
                    headers: {
                        "x-access-token": tokenApiPagamento?.valor,
                        "content-type": "application/json"
                    }
                })
                if(res.status===200)
                    return NextResponse.json({estornos: res.data.estornos, total: res.data.total, pagamentos: res.data.pagamentos.map((x:any)=>({
                        ...x,
                        jaTemCobranca: pagamentosComCobranca.some((y) => y.id===x.id)
                    }))})
            }
            catch{
                await prismadb.configuracao.deleteMany({
                    where: {
                        chave: "TOKEN_PAGAMENTO"
                    }
                })
                tokenApiPagamento = null;
            }
        }

        const usuarioApiPagamento = (await prismadb.configuracao.findFirst({
            where: {
                chave: "USUARIO_PAGAMENTO"
            }
        }));
        const senhaApiPagamento = (await prismadb.configuracao.findFirst({
            where: {
                chave: "SENHA_PAGAMENTO"
            }
        }));

        const resLogin = await axios.post(`${apiPagamento?.valor}/login-cliente`, {
            senha: senhaApiPagamento?.valor,
            email: usuarioApiPagamento?.valor,
        });
        
        await prismadb.configuracao.create({
            data: {
                chave: "TOKEN_PAGAMENTO",
                valor: resLogin.data.token
            }
        });

        tokenApiPagamento = (await prismadb.configuracao.findFirst({
            where: {
                chave: "TOKEN_PAGAMENTO"
            }
        }));

        
        const pagamentosComCobranca = await prismadb.pagamento.findMany({
            where: {
                maquinaId: produto.maquinaId
            }
        });
        
        const result = await axios.get(`${apiPagamento?.valor}/pagamentos/${produto.maquinaId}`, {
            headers: {
                "x-access-token": resLogin.data.token,
                "content-type": "application/json"
            }
        })
        
        return NextResponse.json({estornos: result.data.estornos, total: result.data.total, pagamentos: result.data.pagamentos.map((x:any)=>({
            ...x,
            jaTemCobranca: pagamentosComCobranca.some((y) => y.id===x.id)
        }))})
    } catch (error) {
        console.log('[Pagamento_GET]', error);
        return new NextResponse("Erro Interno do servidor", { status: 500 });
    }
}