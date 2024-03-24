import { NextRequest, NextResponse } from 'next/server';
import prismadb from '@/lib/prismadb';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { usuarioId, rotaId } = body;

    if (!usuarioId) {
      return new NextResponse("usuarioId é obrigatório", { status: 400 });
    }

    if (!rotaId) {
      return new NextResponse("rotaId é obrigatório", { status: 400 });
    }

    const acessoNaRota = await prismadb.acessoNaRota.create({
      data: {
        usuarioId,
        rotaId,
      }
    });
  
    return NextResponse.json(acessoNaRota);
  } catch (error) {
    console.log('[ACESSONAROTA_POST]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};

export async function GET(req: NextRequest) {
  try {
    const acessosNaRota = await prismadb.acessoNaRota.findMany();
    return NextResponse.json(acessosNaRota);
  } catch (error) {
    console.log('[ACESSONAROTA_GET]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};