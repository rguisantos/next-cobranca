import prismadb from "@/lib/prismadb";

import { RotaForm } from "./components/rota-form";

const Home = async ({
  params
}: {
  params: { rotaId: string }
}) => {
  
  const rota = await prismadb.rota.findUnique({
    where: {
      id: params.rotaId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <RotaForm initialData={rota}/>
      </div>
    </div>
  );
}

export default Home;