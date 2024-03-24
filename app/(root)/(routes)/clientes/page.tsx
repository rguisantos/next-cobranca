import prismadb from "@/lib/prismadb";

import { Column } from "./components/columns"
import { Client } from "./components/client";

const Home = async () => {
  const list = await prismadb.cliente.findMany({
    orderBy: {
      nome: 'asc'
    }
  });

const formattedList: Column[] = list.map((item) => ({
    id: item.id,
    nome: item.nome,
    cpf: item.cpf,
    rg: item.rg || "", // Ensure rg is of type string
    telefone: item.telefone || "", // Ensure telefone is of type string
    endereco: item.endereco || "", // Ensure endereco is of type string
    cidade: item.cidade || "", // Ensure cidade is of type string
    estado: item.estado || "", // Ensure estado is of type string
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