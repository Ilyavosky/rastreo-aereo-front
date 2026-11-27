import { Block, Loading } from "@/shared/components/Skeletons";

export function ResultsSkeleton() {
  return (
    <Loading className="flex flex-col gap-3 p-4">
      <Block className="h-11 w-full" />
      <div className="grid gap-3 lg:grid-cols-3">
        {[0, 1, 2].map((i) => <Block key={i} className="h-[480px]" />)}
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        {[0, 1, 2].map((i) => <Block key={i} className="h-48" />)}
      </div>
    </Loading>
  );
}
