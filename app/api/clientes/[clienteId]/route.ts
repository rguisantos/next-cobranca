import { NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { getUserJwt } from "@/helpers/api/jwt-util";

export async function GET(
  req: Request,
  { params }: { params: { clienteId: string } }
) {
  try {
    const user = getUserJwt(req);
    if(!user)
      return new NextResponse("Usuário não autorizado", { status: 401 });

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
    const user = getUserJwt(req);
    if(!user)
      return new NextResponse("Usuário não autorizado", { status: 401 });
    
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
    const user = getUserJwt(req);
    if(!user)
      return new NextResponse("Usuário não autorizado", { status: 401 });
    
    const body = await req.json();
    
    const { nome, cpf, rg, telefone, endereco, cidade, estado } = body;

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
