import { Block, Loading } from "@/shared/components/Skeletons";

export function ScenariosSkeleton() {
  return (
    <Loading className="flex flex-col gap-[18px] p-8">
      <Block className="h-8 w-44" />
      <div className="flex flex-wrap gap-4">
        {[0, 1, 2].map((i) => (
          <Block key={i} className="h-[430px] w-full sm:w-[330px]" />
        ))}
      </div>
    </Loading>
  );
}
