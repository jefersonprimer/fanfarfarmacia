"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import CatalogView from "@/components/CatalogView";
import CatalogSkeleton from "@/components/CatalogSkeleton";

function BrandPageContent() {
  const params = useParams<{ nome: string }>();

  return <CatalogView key={params.nome} brandSlug={params.nome} />;
}

export default function BrandPage() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <BrandPageContent />
    </Suspense>
  );
}
