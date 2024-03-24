import { NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { getUserJwt } from "@/helpers/api/jwt-util";

export async function GET(
  req: Request,
  { params }: { params: { usuarioId: string } }
) {
  try {
    const user = getUserJwt(req);
    if(!user)
      return new NextResponse("Usuário não autorizado", { status: 401 });

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
    const user = getUserJwt(req);
    if(!user)
      return new NextResponse("Usuário não autorizado", { status: 401 });

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
    const user = getUserJwt(req);
    if(!user)
      return new NextResponse("Usuário não autorizado", { status: 401 });

    const body = await req.json();
    
    const { nome } = body;

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
