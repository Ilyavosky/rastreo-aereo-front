import { Block, Loading } from "@/shared/components/Skeletons";

export function EditorSkeleton() {
  return (
    <Loading className="flex gap-4 p-4">
      <Block className="hidden w-60 lg:block" />
      <Block className="min-h-[520px] flex-1" />
      <Block className="hidden w-[300px] lg:block" />
    </Loading>
  );
}
