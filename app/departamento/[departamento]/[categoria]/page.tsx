"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import CatalogView from "@/components/CatalogView";
import CatalogSkeleton from "@/components/CatalogSkeleton";

function CategoryPageContent() {
  const params = useParams<{ departamento: string; categoria: string }>();
  const { departamento, categoria } = params;

  return (
    <CatalogView
      key={`${departamento}-${categoria}`}
      departmentSlug={departamento}
      categorySlug={categoria}
    />
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CategoryPageContent />
    </Suspense>
  );
}
