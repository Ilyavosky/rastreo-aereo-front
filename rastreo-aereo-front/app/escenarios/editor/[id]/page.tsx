import { Suspense } from "react";
import { EditorView } from "@/features/editor";
import { EditorSkeleton } from "@/features/editor";

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditorView key={id} id={id} />;
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <Content params={params} />
    </Suspense>
  );
}
