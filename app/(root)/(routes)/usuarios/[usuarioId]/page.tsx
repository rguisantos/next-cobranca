import prismadb from "@/lib/prismadb";

import { UsuarioForm } from "./components/usuario-form";

const Home = async ({
  params
}: {
  params: { usuarioId: string }
}) => {
  
  const usuario = await prismadb.usuario.findUnique({
    where: {
      id: params.usuarioId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UsuarioForm initialData={usuario}/>
      </div>
    </div>
  );
}

export default Home;