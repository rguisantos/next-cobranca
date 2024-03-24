import prismadb from "@/lib/prismadb";

import { CorProdutoForm } from "./components/corproduto-form";

const Home = async ({
  params
}: {
  params: { corProdutoId: string }
}) => {
  const corProduto = await prismadb.corProduto.findUnique({
    where: {
      id: params.corProdutoId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CorProdutoForm initialData={corProduto} />
      </div>
    </div>
  );
}

export default Home;