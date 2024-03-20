import { CreditCard, DollarSign, Package } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";

const DashboardPage: React.FC = async () => {

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading title="Painel" description="Visão Geral" />
        <Separator />
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Agenda</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
