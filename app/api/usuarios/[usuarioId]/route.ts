import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { usuarioId: string } }
) {
  try {
    if (!params.usuarioId) {
      return new NextResponse("UsuarioId é obrigatório", { status: 400 });
    }

    const usuario = await prismadb.usuario.findUnique({
      where: {
        id: params.usuarioId
      },
      include:{
        acessosNaRota:true
      }
    });
  
    return NextResponse.json({ nome: usuario?.nome, acessosNaRota: usuario?.acessosNaRota });
  } catch (error) {
    console.log('[USUARIO_GET]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { usuarioId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Não autenticado", { status: 403 });
    }

    if (!params.usuarioId) {
      return new NextResponse("UsuarioId é obrigatório", { status: 400 });
    }

    const usuario = await prismadb.usuario.delete({
      where: {
        id: params.usuarioId,
      }
    });
  
    return NextResponse.json(usuario);
  } catch (error) {
    console.log('[USUARIO_DELETE]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { usuarioId: string } }
) {
  try {   
    const { userId } = auth();

    const body = await req.json();
    
    const { nome } = body;
    
    if (!userId) {
      return new NextResponse("Não autenticado", { status: 403 });
    }

    if (!nome) {
      return new NextResponse("Nome é obrigatório", { status: 400 });
    }

    if (!params.usuarioId) {
      return new NextResponse("UsuarioId é obrigatório", { status: 400 });
    }

    const usuario = await prismadb.usuario.update({
      where: {
        id: params.usuarioId,
      },
      data: { nome }
    });
  
    return NextResponse.json(usuario);
  } catch (error) {
    console.log('[USUARIO_PATCH]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};
