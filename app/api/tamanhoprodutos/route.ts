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

    const { medida } = body;

    if (!medida) {
      return new NextResponse("Medida é obrigatório", { status: 400 });
    }

    const tamanhoProduto = await prismadb.tamanhoProduto.create({
      data: {
        medida
      }
    });
  
    return NextResponse.json(tamanhoProduto);
  } catch (error) {
    console.log('[TAMANHOPRODUTOS_POST]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};

export async function GET(
  req: Request
) {
  try {
    const tamanhoProdutos = await prismadb.tamanhoProduto.findMany();
  
    return NextResponse.json(tamanhoProdutos);
  } catch (error) {
    console.log('[TAMANHOPRODUTOS_GET]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};