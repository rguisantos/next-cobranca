import { Client } from "./components/client";

const Home = async () => {
 
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Client />
      </div>
    </div>
  );
};

export default Home;