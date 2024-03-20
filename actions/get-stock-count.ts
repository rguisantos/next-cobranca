import prismadb from "@/lib/prismadb";

export const getStockCount = async (clinicaId: string) => {
  const stockCount = await prismadb.especialista.count({
    where: {
      clinicaId,
      isArchived: false,
    }
  });

  return stockCount;
};