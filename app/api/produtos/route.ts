import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function POST(
  req: Request
) {
  try {
    const { userId: userAuthId } = auth();

    const body = await req.json();

    const { tipoProdutoId, plaqueta, contadorRelogio } = body;

    if (!userAuthId) {
      return new NextResponse("Não autenticado", { status: 403 });
    }

    if (!plaqueta) {
      return new NextResponse("Plaqueta é obrigatório", { status: 400 });
    }

    if (!tipoProdutoId) {
      return new NextResponse("Id do Tipo de Produto é obrigatório", { status: 400 });
    }

    if (!contadorRelogio) {
      return new NextResponse("Contador é obrigatório", { status: 400 });
    }

    const produto = await prismadb.produto.create({
      data: {tipoProdutoId, plaqueta, contadorRelogio},
    });
  
    return NextResponse.json(produto);
  } catch (error) {
    console.log('[Produtos_POST]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};

export async function GET(
  req: Request,
) {
  try {
    const { searchParams } = new URL(req.url)
    const tipoProdutoId = searchParams.get('tipoProdutoId') || undefined;
    const plaqueta = parseInt(searchParams.get('plaqueta')!) || undefined;


    const produtos = await prismadb.produto.findMany({
      where: {
        tipoProdutoId,
        plaqueta,
      },
      include: {
        tipoProduto: true,
      },
      orderBy: {
        plaqueta: 'asc',
      }
    });
  
    return NextResponse.json(produtos);
  } catch (error) {
    console.log('[Produtos_GET]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};
