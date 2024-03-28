import { AcessoNaRotaForm } from "./components/acessonarota-form";

const Home = async () => {

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <AcessoNaRotaForm />
      </div>
    </div>
  );
}

export default Home;