import { NextResponse } from 'next/server';
// import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';
 
export async function POST(
  req: Request
) {
  try {
    // const { userId } = auth();

    // if (!userId) {
    //   return new NextResponse("Não autenticado", { status: 403 });
    // }

    const body = await req.json();

    const { nome } = body;

    if (!nome) {
      return new NextResponse("Nome é obrigatório", { status: 400 });
    }

    const tipoProduto = await prismadb.tipoProduto.create({
      data: {
        nome
      }
    });
  
    return NextResponse.json(tipoProduto);
  } catch (error) {
    console.log('[TIPOPRODUTOS_POST]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};

export async function GET(
  req: Request
) {
  try {
    const tipoProdutos = await prismadb.tipoProduto.findMany();
  
    return NextResponse.json(tipoProdutos);
  } catch (error) {
    console.log('[TIPOPRODUTOS_GET]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};
