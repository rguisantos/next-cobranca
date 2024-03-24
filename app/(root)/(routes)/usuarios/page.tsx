import prismadb from "@/lib/prismadb";

import { Client as ClientType } from "./components/columns"
import { Client } from "./components/client";

const Home = async () => {
  const list = await prismadb.usuario.findMany({
    orderBy: {
      nome: 'asc'
    }
  });

const formattedList: ClientType[] = list.map((item) => ({
  id: item.id,
  nome: item.nome,
  senha: item.senha,
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