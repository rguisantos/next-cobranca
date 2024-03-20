import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';
 
export async function POST(
  req: Request
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { nome } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

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
    return new NextResponse("Internal error", { status: 500 });
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
    return new NextResponse("Internal error", { status: 500 });
  }
};
