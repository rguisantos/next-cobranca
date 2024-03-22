import prismadb from "@/lib/prismadb";

import { TipoProdutoForm } from "./components/tipoproduto-form";

const Home = async ({
  params
}: {
  params: { tipoprodutoId: string }
}) => {
  const tipoProduto = await prismadb.tipoProduto.findUnique({
    where: {
      id: params.tipoprodutoId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TipoProdutoForm initialData={tipoProduto} />
      </div>
    </div>
  );
}

export default Home;
