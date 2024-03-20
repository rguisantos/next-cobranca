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

    const rota = await prismadb.rota.create({
      data: {
        nome
      }
    });
  
    return NextResponse.json(rota);
  } catch (error) {
    console.log('[ROTAS_POST]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};

export async function GET(
  req: Request
) {
  try {
    const rotas = await prismadb.rota.findMany();
  
    return NextResponse.json(rotas);
  } catch (error) {
    console.log('[ROTAS_GET]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};
