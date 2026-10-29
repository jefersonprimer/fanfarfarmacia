"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import CatalogView from "@/components/CatalogView";
import CatalogSkeleton from "@/components/CatalogSkeleton";

function SubcategoryPageContent() {
  const params = useParams<{ departamento: string; categoria: string; subcategoria: string }>();
  return (
    <CatalogView
      key={`${params.departamento}-${params.categoria}-${params.subcategoria}`}
      departmentSlug={params.departamento}
      categorySlug={params.categoria}
      subcategorySlug={params.subcategoria}
    />
  );
}

export default function SubcategoryPage() {
  return <Suspense fallback={<CatalogSkeleton />}><SubcategoryPageContent /></Suspense>;
}
