import prismadb from "@/lib/prismadb";

import { Column } from "./components/columns"
import { Client } from "./components/client";

const Home = async () => {
  const list = await prismadb.tamanhoProduto.findMany({
    orderBy: {
      medida: 'asc'
    }
  });

  const formattedList: Column[] = list.map((item) => ({
    id: item.id,
    nome: item.medida,
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
