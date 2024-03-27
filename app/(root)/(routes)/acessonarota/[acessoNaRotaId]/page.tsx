import prismadb from "@/lib/prismadb";
import { AcessoNaRotaForm } from "./components/acessonarota-form";

const Home = async ({
  params
}: {
  params: { acessoNaRotaId: string }
}) => {
  const acessoNaRota = await prismadb.acessoNaRota.findUnique({
    where: {
      id: params.acessoNaRotaId
    }
  });

  const usuarios = await prismadb.usuario.findMany();
  const rotas = await prismadb.rota.findMany();

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AcessoNaRotaForm initialData={acessoNaRota} usuarios={usuarios} rotas={rotas} />
      </div>
    </div>
  );
}

export default Home;