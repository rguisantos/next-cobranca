import prismadb from "@/lib/prismadb";

import { Column } from "./components/columns"
import { Client } from "./components/client";

const Home = async () => {
  const list = await prismadb.corProduto.findMany({
    orderBy: {
      nome: 'asc'
    }
  });

  const formattedList: Column[] = list.map((item) => ({
    id: item.id,
    nome: item.nome,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Client data={formattedList} />
      </div>
    </div>
  );
};

export default Home;