import prismadb from "@/lib/prismadb";

import { TamanhoProdutoForm } from "./components/tamanhoproduto-form";

const Home = async ({
  params
}: {
  params: { tamanhoprodutoId: string }
}) => {
  const tamanhoProduto = await prismadb.tamanhoProduto.findUnique({
    where: {
      id: params.tamanhoprodutoId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <TamanhoProdutoForm initialData={tamanhoProduto} />
      </div>
    </div>
  );
}

export default Home;