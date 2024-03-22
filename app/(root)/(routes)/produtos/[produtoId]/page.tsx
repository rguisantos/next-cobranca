import prismadb from "@/lib/prismadb";

import { ProdutoForm } from "./components/produto-form";

const Home = async ({
  params
}: {
  params: { produtoId: string }
}) => {
  
  const tiposProdutos = await prismadb.tipoProduto.findMany({
    orderBy:{
      nome: "asc"
    }
  });

  const produto = await prismadb.produto.findUnique({
    where: {
      id: params.produtoId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProdutoForm initialData={produto} tiposProdutos={tiposProdutos}/>
      </div>
    </div>
  );
}

export default Home;