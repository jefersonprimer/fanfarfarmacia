"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import CatalogView from "@/components/CatalogView";
import CatalogSkeleton from "@/components/CatalogSkeleton";

function DepartmentPageContent() {
  const params = useParams<{ departamento: string }>();
  const departamento = params.departamento;

  return <CatalogView key={departamento} departmentSlug={departamento} />;
}

export default function DepartmentPage() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <DepartmentPageContent />
    </Suspense>
  );
}
