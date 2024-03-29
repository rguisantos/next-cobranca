import { NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { locacaoId: string } }
) {
  try {
    if (!params.locacaoId) {
      return new NextResponse("Id da Locação é obrigatória", { status: 400 });
    }

    const Locacao = await prismadb.locacao.findUnique({
      where: {
        id: params.locacaoId

      },
      include: {
        clienteId: true,
        rotaId: true,
      }
    });
  
    return NextResponse.json(Locacao);
  } catch (error) {
    console.log('[Locação_GET]', error);
    return new NextResponse("Erro Interno do servidor", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { locacaoId: string } }
) {
  try {
    // const { userId: userAuthId } = auth();

    // if (!userAuthId) {
    //   return new NextResponse("Não autenticado", { status: 403 });
    // }

    if (!params.locacaoId) {
      return new NextResponse("Id da Locação é obrigatória", { status: 400 });
    }

    const Locacao = await prismadb.locacao.delete({
      where: {
        id: params.locacaoId
      },
    });
  
    return NextResponse.json(Locacao);
  } catch (error) {
    console.log('[Locacao_DELETE]', error);
    return new NextResponse("Erro Interno do servidor", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { locacaoId: string } }
) {
  try {
    // const { userId: userAuthId } = auth();

    // if (!userAuthId) {
    //   return new NextResponse("Não autenticado", { status: 403 });
    // }

    const body = await req.json();

    const { plaqueta, cliente, rota } = body;

    if (!params.locacaoId) {
      return new NextResponse("Id da Locação é obrigatória", { status: 400 });
    }

    if (!plaqueta) {
      return new NextResponse("Plaqueta é obrigatória", { status: 400 });
    }

    if (!cliente) {
      return new NextResponse("O Cliente é obrigatório", { status: 400 });
    }

    if (!rota) {
      return new NextResponse("A Rota é obrigatória", { status: 400 });
    }

    const locacao = await prismadb.locacao.update({
      where: {
        id: params.locacaoId
      },
      data: {
        plaqueta,
        clienteId: cliente,
        rotaId: rota,
      },
    });
  
    return NextResponse.json(locacao);
  } catch (error) {
    console.log('[Locação_PATCH]', error);
    return new NextResponse("Erro Interno do servidor", { status: 500 });
  }
};