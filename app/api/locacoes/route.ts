import { NextResponse } from 'next/server';
// import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function POST(
  req: Request
) {
  try {
    // const { userId: userAuthId } = auth();

    // if (!userAuthId) {
    //   return new NextResponse("Não autenticado", { status: 403 });
    // }

    const body = await req.json();

    const { 
        produtoId, 
        clienteId, 
        rotaId,
        ehTipoLocacaoMensal,
        valorMensal,
        porcentagemEmpresa,
        valorFicha,
        valorSaldoDevedor
    } = body;

    if (!produtoId) {
      return new NextResponse("Id do Produto é obrigatório", { status: 400 });
    }

    if (!clienteId) {
      return new NextResponse("Id do Cliente é obrigatório", { status: 400 });
    }

    if (!rotaId) {  
      return new NextResponse("Id da Rota é obrigatório", { status: 400 });
    }

    const locacao = await prismadb.locacao.create({
      data: {
        produtoId,
        clienteId,
        rotaId,
        ehTipoLocacaoMensal,
        valorMensal,
        porcentagemEmpresa,
        valorFicha,
        valorSaldoDevedor
      },
    });
  
    return NextResponse.json(locacao);
  } catch (error) {
    console.log('[LOCACAO_POST]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};

export async function GET(
  req: Request,
) {
  try {
    const { searchParams } = new URL(req.url)
    const produtoId = searchParams.get('produtoId') || undefined;


    const locacoes = await prismadb.locacao.findMany({
      where: {
        produtoId,
      },
      include: {
        produto: {
            include:{
                tipoProduto:true
            }
        },
        rota: true,
        cliente: true,
      }
    });
  
    return NextResponse.json(locacoes);
  } catch (error) {
    console.log('[LOCACAO_GET]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};