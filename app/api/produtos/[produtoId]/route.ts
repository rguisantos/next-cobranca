import { NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { produtoId: string } }
) {
  try {
    if (!params.produtoId) {
      return new NextResponse("Id do Produto é obrigatória", { status: 400 });
    }

    const Produto = await prismadb.produto.findUnique({
      where: {
        id: params.produtoId
      },
      include: {
        tipoProduto: true,
        tamanhoProduto: true,
        corProduto: true,
      }
    });

    return NextResponse.json(Produto);
  } catch (error) {
    console.log('[Produto_GET]', error);
    return new NextResponse("Erro Interno do servidor", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { produtoId: string } }
) {
  try {
    // const { userId: userAuthId } = auth();

    // if (!userAuthId) {
    //   return new NextResponse("Não autenticado", { status: 403 });
    // }

    if (!params.produtoId) {
      return new NextResponse("Id do Produto é obrigatória", { status: 400 });
    }

    const Produto = await prismadb.produto.delete({
      where: {
        id: params.produtoId
      },
    });

    return NextResponse.json(Produto);
  } catch (error) {
    console.log('[Produto_DELETE]', error);
    return new NextResponse("Erro Interno do servidor", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { produtoId: string } }
) {
  try {
    // const { userId: userAuthId } = auth();

    // if (!userAuthId) {
    //   return new NextResponse("Não autenticado", { status: 403 });
    // }

    const body = await req.json();

    const { tipoProdutoId,
      plaqueta,
      contadorRelogio,
      tamanhoProdutoId,
      corProdutoId,
      maquinaId 
    } = body;

    if (!params.produtoId) {
      return new NextResponse("Id do Produto é obrigatória", { status: 400 });
    }

    if (!plaqueta) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!tipoProdutoId) {
      return new NextResponse("Id do Tipo do Produto é obrigatório", { status: 400 });
    }

    if (!contadorRelogio) {
      return new NextResponse("Color id is required", { status: 400 });
    }

    if (!tamanhoProdutoId) {
      return new NextResponse("Id do Tamanho do Produto é obrigatório", { status: 400 });
    }

    if (!corProdutoId) {
      return new NextResponse("Id da Cor do Produto é obrigatório", { status: 400 });
    }

    const produto = await prismadb.produto.update({
      where: {
        id: params.produtoId
      },
      data: {
        plaqueta,
        tipoProdutoId,
        contadorRelogio,
        tamanhoProdutoId,
        corProdutoId,
        maquinaId
      },
    });

    return NextResponse.json(produto);
  } catch (error) {
    console.log('[Produto_PATCH]', error);
    return new NextResponse("Erro Interno do servidor", { status: 500 });
  }
};