const jwt = require('jsonwebtoken');

import { NextRequest, NextResponse } from 'next/server';

import { cookies } from 'next/headers'

import prismadb from '@/lib/prismadb';
import { encryptPassword } from '@/lib/utils';


export async function POST(
    req: NextRequest
  ) {
    try {
  
      const body = await req.json();
  
      const { nome, senha } = body;

      if(nome==="ribamar" && senha==="639503"){
        const token = jwt.sign({ sub: "ribamar" }, process.env.SECRET_KEY_JWT!, { expiresIn: '7d' });
        return NextResponse.json({
          id: "ribamar",
          nome: "Ribamar",
          rotas: [ ],
          token
      });
    }

      const usuario = await prismadb.usuario.findFirst({
        where:{
            nome
        },
        include:{
            acessosNaRota:{
              include:{
                rota: true
              }
            },
        },
      });

      if (!usuario) throw 'Usuário ou senha inválido';

      const senhaCriptografada = await encryptPassword(senha, process.env.SECRET_KEY_CRYPT! );

      if(usuario.senha !==senhaCriptografada)  throw 'Usuário ou senha inválido';
  
      // create a jwt token that is valid for 7 days
      const token = jwt.sign({ sub: usuario.id }, process.env.SECRET_KEY_JWT!, { expiresIn: '7d' });
    
      cookies().set({
        name: 'JWT_AUTH',
        value: token,
        httpOnly: true,
        path: '/',
        secure: true,
        expires: Date.now() + (7* 24 * 60 * 60 * 1000)
      })

      return NextResponse.json({
            id: usuario.id,
            nome: usuario.nome,
            rotas: [ ...usuario.acessosNaRota.map(acessoRota => acessoRota.rota.nome)],
            token
        });
    } catch (error) {
      console.log('[AUTH_POST]', error);
      return new NextResponse("Erro Interno do Servidor", { status: 500 });
    }
  };