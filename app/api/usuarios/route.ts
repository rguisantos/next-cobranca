import { NextResponse } from 'next/server';
// import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';
import { encryptPassword } from '@/lib/utils';
import { getUserJwt } from '@/helpers/api/jwt-util';
 
export async function POST(
  req: Request,
) {
  try {
    const user = getUserJwt(req);
    if(!user)
      return new NextResponse("Usuário não autorizado", { status: 401 });

    const body = await req.json();

    const { nome, rotas } = body;

    if (!nome) {
      return new NextResponse("Nome é obrigatório", { status: 400 });
    }

    const senhaCriptografada = await encryptPassword(process.env.SENHA_PADRAO!, process.env.SECRET_KEY_CRYPT! );

    const usuario = await prismadb.usuario.create({
      data: {
        nome,
        senha: senhaCriptografada,
        acessosNaRota:{
          create:[...rotas.map((rota:any)=>{
            return { rotaId:rota.id }
          })]
        }
      },
      include:{
        acessosNaRota:true
      }
    });
  
    return NextResponse.json(usuario);
  } catch (error) {
    console.log('[USUARIOS_POST]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};

export async function GET(
  req: Request,
) {
  try {
    const user = getUserJwt(req);
    if(!user)
      return new NextResponse("Usuário não autorizado", { status: 401 });

    const usuarios = await prismadb.usuario.findMany({
      include:{
        acessosNaRota:true
      }
    });
  
    return NextResponse.json(usuarios.map(usuario => ({ id: usuario.id, nome: usuario.nome, acessosNaRota: usuario.acessosNaRota })));
  } catch (error) {
    console.log('[USUARIOS_GET]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};
export async function PUT(
  req: Request
) {
  try {
    const user = getUserJwt(req);
    if(!user)
      return new NextResponse("Usuário não autorizado", { status: 401 });

    const body = await req.json();

    const { id, nome, senha } = body;

    if (!id) {
      return new NextResponse("ID do usuário é obrigatório", { status: 400 });
    }

    const senhaCriptografada = senha ? await encryptPassword(senha, process.env.SECRET_KEY_CRYPT!) : undefined;

    const usuario = await prismadb.usuario.update({
      where: { id },
      data: {
        ...(nome && { nome }),
        ...(senhaCriptografada && { senha: senhaCriptografada })
      }
    });
  
    return NextResponse.json(usuario);
  } catch (error) {
    console.log('[USUARIOS_PUT]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};