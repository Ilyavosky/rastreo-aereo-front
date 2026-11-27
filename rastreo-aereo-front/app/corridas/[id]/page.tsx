import { Suspense } from "react";
import { RunProgressView } from "@/features/runs";
import { RunProgressSkeleton } from "@/features/runs";

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RunProgressView key={id} id={id} />;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<RunProgressSkeleton />}>
      <Content params={params} />
    </Suspense>
  );
}
