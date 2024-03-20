import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';
 
export async function POST(
  req: NextRequest
) {
  try {
    const { userId } = auth();

    const body = await req.json();

    const { nome, cpf, rg, telefone, endereco, cidade, estado } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!nome) {
      return new NextResponse("Nome é obrigatório", { status: 400 });
    }

    if (!cpf) {
      return new NextResponse("CPF é obrigatório", { status: 400 });
    }

    const cliente = await prismadb.cliente.create({
      data: {
        nome,
        cpf, 
        rg, 
        telefone, 
        endereco, 
        cidade, 
        estado
      }
    });
  
    return NextResponse.json(cliente);
  } catch (error) {
    console.log('[CLIENTES_POST]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function GET(
  req: Request
) {
  try {
    const clientes = await prismadb.cliente.findMany();
  
    return NextResponse.json(clientes);
  } catch (error) {
    console.log('[CLIENTES_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};