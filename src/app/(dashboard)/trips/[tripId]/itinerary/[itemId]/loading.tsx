import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-56 w-full rounded-2xl" />
    </div>
  );
}
