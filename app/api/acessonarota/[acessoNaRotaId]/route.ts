import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { acessoNaRotaId: string } }
) {
  try {
    if (!params.acessoNaRotaId) {
      return new NextResponse("acessoNaRotaId é obrigatório", { status: 400 });
    }

    const acessoNaRota = await prismadb.acessoNaRota.findUnique({
      where: {
        id: params.acessoNaRotaId
      }
    });
  
    return NextResponse.json(acessoNaRota);
  } catch (error) {
    console.log('[ACESSONAROTA_GET]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};

export async function DELETE(
  req: Request,
  { params }: { params: { acessoNaRotaId: string } }
) {
  try {
    if (!params.acessoNaRotaId) {
      return new NextResponse("acessoNaRotaId é obrigatório", { status: 400 });
    }

    const acessoNaRota = await prismadb.acessoNaRota.delete({
      where: {
        id: params.acessoNaRotaId,
      }
    });
  
    return NextResponse.json(acessoNaRota);
  } catch (error) {
    console.log('[ACESSONAROTA_DELETE]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};

export async function PATCH(
  req: Request,
  { params }: { params: { acessoNaRotaId: string } }
) {
  try {   
    const body = await req.json();
    
    const { usuarioId, rotaId } = body;

    if (!usuarioId) {
      return new NextResponse("usuarioId é obrigatório", { status: 400 });
    }

    if (!rotaId) {
      return new NextResponse("rotaId é obrigatório", { status: 400 });
    }

    if (!params.acessoNaRotaId) {
      return new NextResponse("acessoNaRotaId é obrigatório", { status: 400 });
    }

    const acessoNaRota = await prismadb.acessoNaRota.update({
      where: {
        id: params.acessoNaRotaId,
      },
      data: { usuarioId, rotaId }
    });
  
    return NextResponse.json(acessoNaRota);
  } catch (error) {
    console.log('[ACESSONAROTA_PATCH]', error);
    return new NextResponse("Erro Interno do Servidor", { status: 500 });
  }
};