import type { Metadata } from "next";
import OffersView from "@/components/OffersView";

export const metadata: Metadata = {
  title: "Ofertas | Fanfar Farmácia",
  description:
    "Aproveite as melhores ofertas em medicamentos, dermocosméticos, higiene, beleza e muito mais.",
};

export default function OffersPage() {
  return <OffersView />;
}
