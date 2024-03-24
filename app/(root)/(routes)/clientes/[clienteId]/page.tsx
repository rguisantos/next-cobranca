import prismadb from "@/lib/prismadb";

import { ClienteForm } from "./components/cliente-form";

const Home = async ({
  params
}: {
  params: { clienteId: string }
}) => {
  
  const cliente = await prismadb.cliente.findUnique({
    where: {
      id: params.clienteId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ClienteForm initialData={cliente}/>
      </div>
    </div>
  );
}

export default Home;