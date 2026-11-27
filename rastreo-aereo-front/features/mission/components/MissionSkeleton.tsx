import { Block, Loading } from "@/shared/components/Skeletons";

export function MissionSkeleton() {
  return (
    <Loading className="flex flex-col gap-4 p-4 lg:flex-row">
      <Block className="h-[780px] lg:w-80" />
      <Block className="min-h-[520px] flex-1" />
      <Block className="h-[780px] lg:w-80" />
    </Loading>
  );
}
