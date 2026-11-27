import { Suspense } from "react";
import { ComparisonView } from "@/features/results";
import { ResultsSkeleton } from "@/features/results";

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ComparisonView key={id} id={id} />;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<ResultsSkeleton />}>
      <Content params={params} />
    </Suspense>
  );
}
