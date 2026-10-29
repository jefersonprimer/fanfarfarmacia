import type { Metadata } from "next";
import CatalogView from "@/components/CatalogView";

export const metadata: Metadata = {
  title: "Departamentos | Fanfar Farmácia",
  description:
    "Navegue por todos os departamentos e encontre medicamentos, dermocosméticos e produtos de saúde.",
};

export default function DepartmentsPage() {
  return <CatalogView />;
}
