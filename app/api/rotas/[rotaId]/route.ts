import { NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { rotaId: string } }
) {
  try {
    if (!params.rotaId) {
      return new NextResponse("RotaId é obrigatório", { status: 400 });
    }

    const rota = await prismadb.rota.findUnique({
      where: {
        id: params.rotaId
      }
    });
  
    return NextResponse.json(rota);
  } catch (error) {
    console.log('[ROTA_GET]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { rotaId: string } }
) {
  try {
    // const { userId } = auth();

    // if (!userId) {
    //   return new NextResponse("Não autenticado", { status: 403 });
    // }

    if (!params.rotaId) {
      return new NextResponse("RotaId é obrigatório", { status: 400 });
    }

    const rota = await prismadb.rota.delete({
      where: {
        id: params.rotaId,
      }
    });
  
    return NextResponse.json(rota);
  } catch (error) {
    console.log('[ROTA_DELETE]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};


export async function PATCH(
  req: Request,
  { params }: { params: { rotaId: string } }
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

    if (!params.rotaId) {
      return new NextResponse("RotaId é obrigatório", { status: 400 });
    }

    const rota = await prismadb.rota.update({
      where: {
        id: params.rotaId,
      },
      data: { nome }
    });
  
    return NextResponse.json(rota);
  } catch (error) {
    console.log('[ROTA_PATCH]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};
