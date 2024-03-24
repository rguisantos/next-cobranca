import { NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { tamanhoProdutoId: string } }
) {
  try {
    if (!params.tamanhoProdutoId) {
      return new NextResponse("TamanhoProdutoId é obrigatório", { status: 400 });
    }

    const tamanhoProduto = await prismadb.tamanhoProduto.findUnique({
      where: {
        id: params.tamanhoProdutoId
      }
    });
  
    return NextResponse.json(tamanhoProduto);
  } catch (error) {
    console.log('[TAMANHOPRODUTO_GET]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { tamanhoProdutoId: string } }
) {
  try {
    // const { userId } = auth();

    // if (!userId) {
    //   return new NextResponse("Não autenticado", { status: 403 });
    // }

    if (!params.tamanhoProdutoId) {
      return new NextResponse("TamanhoProdutoId é obrigatório", { status: 400 });
    }

    const tamanhoProduto = await prismadb.tamanhoProduto.delete({
      where: {
        id: params.tamanhoProdutoId,
      }
    });
  
    return NextResponse.json(tamanhoProduto);
  } catch (error) {
    console.log('[TAMANHOPRODUTO_DELETE]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { tamanhoProdutoId: string } }
) {
  try {   
    // const { userId } = auth();
    
    // if (!userId) {
    //   return new NextResponse("Não autenticado", { status: 403 });
    // }

    const body = await req.json();
    
    const { medida } = body;

    if (!medida) {
      return new NextResponse("Medida é obrigatório", { status: 400 });
    }

    if (!params.tamanhoProdutoId) {
      return new NextResponse("TamanhoProdutoId é obrigatório", { status: 400 });
    }

    const tamanhoProduto = await prismadb.tamanhoProduto.update({
      where: {
        id: params.tamanhoProdutoId,
      },
      data: { medida }
    });
  
    return NextResponse.json(tamanhoProduto);
  } catch (error) {
    console.log('[TAMANHOPRODUTO_PATCH]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};