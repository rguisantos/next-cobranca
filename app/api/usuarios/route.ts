import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';
import { encryptPassword } from '@/lib/utils';
 
export async function POST(
  req: Request
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


    const usuario = await prismadb.usuario.create({
      data: {
        nome,
        senha:encryptPassword(process.env.SENHA_PADRAO!, process.env.SECRET_KEY_CRYPT! )
      }
    });
  
    return NextResponse.json(usuario);
  } catch (error) {
    console.log('[USUARIOS_POST]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};

export async function GET(
  req: Request
) {
  try {
    const usuarios = await prismadb.usuario.findMany({
      include:{
        acessosNaRota:true
      }
    });
  
    return NextResponse.json(usuarios.map(usuario => { usuario.nome, usuario.acessosNaRota }));
  } catch (error) {
    console.log('[USUARIOS_GET]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};
