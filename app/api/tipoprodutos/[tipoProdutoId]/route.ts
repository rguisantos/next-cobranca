import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { tipoProdutoId: string } }
) {
  try {
    if (!params.tipoProdutoId) {
      return new NextResponse("TipoProdutoId é obrigatório", { status: 400 });
    }

    const tipoProduto = await prismadb.tipoProduto.findUnique({
      where: {
        id: params.tipoProdutoId
      }
    });
  
    return NextResponse.json(tipoProduto);
  } catch (error) {
    console.log('[TIPOPRODUTO_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { tipoProdutoId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Não autenticado", { status: 403 });
    }

    if (!params.tipoProdutoId) {
      return new NextResponse("TipoProdutoId é obrigatório", { status: 400 });
    }

    const tipoProduto = await prismadb.tipoProduto.delete({
      where: {
        id: params.tipoProdutoId,
      }
    });
  
    return NextResponse.json(tipoProduto);
  } catch (error) {
    console.log('[TIPOPRODUTO_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { tipoProdutoId: string } }
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

    if (!params.tipoProdutoId) {
      return new NextResponse("TipoProdutoId é obrigatório", { status: 400 });
    }

    const tipoProduto = await prismadb.tipoProduto.update({
      where: {
        id: params.tipoProdutoId,
      },
      data: { nome }
    });
  
    return NextResponse.json(tipoProduto);
  } catch (error) {
    console.log('[TIPOPRODUTO_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
