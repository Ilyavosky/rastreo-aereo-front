import { Block, Loading } from "@/shared/components/Skeletons";

export function RunProgressSkeleton() {
  return (
    <Loading className="grid gap-5 p-5 lg:grid-cols-[1fr_420px]">
      <div className="flex flex-col gap-3.5">
        <Block className="h-12 w-72" />
        <Block className="h-24" />
        <Block className="h-[520px]" />
      </div>
      <div className="flex flex-col gap-3">
        {[0, 1, 2, 3].map((i) => <Block key={i} className="h-36" />)}
      </div>
    </Loading>
  );
}
