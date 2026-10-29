export default function CatalogSkeleton() {
  return (
    <main className="flex-1 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-3 w-48 animate-pulse rounded bg-gray-200" />
        <div className="mt-4 h-8 w-64 animate-pulse rounded bg-gray-200" />
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <div className="hidden h-96 animate-pulse rounded-2xl bg-gray-200 lg:block" />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="h-72 animate-pulse rounded-2xl bg-gray-200"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
