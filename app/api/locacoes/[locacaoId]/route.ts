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
        cliente: true,
        produto: {
          include: {
            tipoProduto:true
          }
        },
        rota: true,
      }
    });
  
    return NextResponse.json(Locacao);
  } catch (error) {
    console.log('[LOCACAO_GET]', error);
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
    console.log('[LOCACAO_DELETE]', error);
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

    const { 
      produtoId, 
      clienteId, 
      rotaId,
      ehTipoLocacaoMensal,
      valorMensal,
      porcentagemEmpresa,
      valorFicha,
      valorSaldoDevedor
    } = body;

    if (!params.locacaoId) {
      return new NextResponse("Id da Locação é obrigatória", { status: 400 });
    }

    if (!produtoId) {
      return new NextResponse("Plaqueta é obrigatória", { status: 400 });
    }

    if (!clienteId) {
      return new NextResponse("O Cliente é obrigatório", { status: 400 });
    }

    if (!rotaId) {
      return new NextResponse("A Rota é obrigatória", { status: 400 });
    }

    const locacao = await prismadb.locacao.update({
      where: {
        id: params.locacaoId
      },
      data: {
        produtoId,
        clienteId,
        rotaId,
        ehTipoLocacaoMensal,
        valorMensal,
        porcentagemEmpresa,
        valorFicha,
        valorSaldoDevedor
      },
    });
  
    return NextResponse.json(locacao);
  } catch (error) {
    console.log('[LOCACAO_PATCH]', error);
    return new NextResponse("Erro Interno do servidor", { status: 500 });
  }
};