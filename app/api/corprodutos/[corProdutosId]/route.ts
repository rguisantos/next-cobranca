import { NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { corProdutoId: string } }
) {
  try {
    if (!params.corProdutoId) {
      return new NextResponse("CorProdutoId é obrigatório", { status: 400 });
    }

    const corProduto = await prismadb.corProduto.findUnique({
      where: {
        id: params.corProdutoId
      }
    });
  
    return NextResponse.json(corProduto);
  } catch (error) {
    console.log('[CORPRODUTO_GET]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { corProdutoId: string } }
) {
  try {
    // const { userId } = auth();

    // if (!userId) {
    //   return new NextResponse("Não autenticado", { status: 403 });
    // }

    if (!params.corProdutoId) {
      return new NextResponse("CorProdutoId é obrigatório", { status: 400 });
    }

    const corProduto = await prismadb.corProduto.delete({
      where: {
        id: params.corProdutoId,
      }
    });
  
    return NextResponse.json(corProduto);
  } catch (error) {
    console.log('[CORPRODUTO_DELETE]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { corProdutoId: string } }
) {
  try {   
    // const { userId } = auth();
    
    // if (!userId) {
    //   return new NextResponse("Não autenticado", { status: 403 });
    // }

    const body = await req.json();
    
    const { nome } = body;

    if (!nome) {
      return new NextResponse("Nome é obrigatório", { status: 400 });
    }

    if (!params.corProdutoId) {
      return new NextResponse("CorProdutoId é obrigatório", { status: 400 });
    }

    const corProduto = await prismadb.corProduto.update({
      where: {
        id: params.corProdutoId,
      },
      data: { nome }
    });
  
    return NextResponse.json(corProduto);
  } catch (error) {
    console.log('[CORPRODUTO_PATCH]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};