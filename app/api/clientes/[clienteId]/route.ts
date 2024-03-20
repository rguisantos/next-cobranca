import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { clienteId: string } }
) {
  try {
    if (!params.clienteId) {
      return new NextResponse("ClienteId é obrigatório", { status: 400 });
    }

    const cliente = await prismadb.cliente.findUnique({
      where: {
        id: params.clienteId
      }
    });
  
    return NextResponse.json(cliente);
  } catch (error) {
    console.log('[CLIENTE_GET]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { clienteId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Não autenticado", { status: 403 });
    }

    if (!params.clienteId) {
      return new NextResponse("ClienteId é obrigatório", { status: 400 });
    }

    const cliente = await prismadb.cliente.delete({
      where: {
        id: params.clienteId,
      }
    });
  
    return NextResponse.json(cliente);
  } catch (error) {
    console.log('[CLIENTE_DELETE]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { clienteId: string } }
) {
  try {   
    const { userId } = auth();

    const body = await req.json();
    
    const { nome, cpf, rg, telefone, endereco, cidade, estado } = body;
    
    if (!userId) {
      return new NextResponse("Não autenticado", { status: 403 });
    }

    if (!nome) {
      return new NextResponse("Nome é obrigatório", { status: 400 });
    }

    if (!cpf) {
      return new NextResponse("CPF é obrigatório", { status: 400 });
    }

    if (!params.clienteId) {
      return new NextResponse("ClienteId é obrigatório", { status: 400 });
    }

    const cliente = await prismadb.cliente.update({
      where: {
        id: params.clienteId,
      },
      data: { nome, cpf, rg, telefone, endereco, cidade, estado }
    });
  
    return NextResponse.json(cliente);
  } catch (error) {
    console.log('[CLIENTE_PATCH]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};
