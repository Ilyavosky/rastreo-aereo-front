import { Skeleton } from "@heroui/react";

export function Block({ className = "" }: { className?: string }) {
  return <Skeleton className={`rounded-lg bg-ra-panel2 ${className}`} />;
}

export function Loading({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div role="status" aria-label="Cargando" aria-busy="true" className={`flex-1 ${className}`}>
      {children}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <Loading className="flex flex-col gap-[18px] p-8">
      <Block className="h-8 w-40" />
      <Block className="h-9 w-96 max-w-full" />
      <Block className="h-56 w-full" />
    </Loading>
  );
}
