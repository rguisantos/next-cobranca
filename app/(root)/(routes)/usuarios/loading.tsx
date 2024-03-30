'use client';

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <div className="flex items-center justify-between space-y-4">
        <Skeleton className="h-9 w-[250px]" />
        <Skeleton className="h-9 w-[200px]" />
      </div>
      <Separator />
      <div>
        <div className="flex items-center py-4">
          <Skeleton className="h-9 w-[200px]" />
        </div>
        <div className="rounded-md border">
          <Skeleton className="h-[200px] w-[100%]" />
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Skeleton className="h-9 w-[80px]" />
          <Skeleton className="h-9 w-[80px]" />
        </div>
      </div>
    </>
  );
}

export default Loading;