'use client';

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <div className="flex items-center justify-between space-y-1">
        <Skeleton className="h-9 w-[350px]" />
        <Skeleton className="h-9 w-[50px]" />
      </div>
      <Skeleton className="h-4 w-[200px]" />
      <Separator />
      <div className="space-y-3">
        <div className="flex items-center justify-between space-x-9">
          <div className="flex-col space-y-1">
            <Skeleton className="h-5 w-[200px]" />
            <Skeleton className="h-12 w-[350px]" />
          </div>
          <div className="flex-col space-y-1">
            <Skeleton className="h-5 w-[200px]" />
            <Skeleton className="h-12 w-[350px]" />
          </div>
          <div className="flex-col space-y-1">
            <Skeleton className="h-5 w-[200px]" />
            <Skeleton className="h-12 w-[350px]" />
          </div>
        </div>
        <div className="flex items-center justify-between space-x-9">
          <div className="flex-col space-y-1">
            <Skeleton className="h-5 w-[200px]" />
            <Skeleton className="h-12 w-[350px]" />
          </div>
          <div className="flex-col space-y-1">
            <Skeleton className="h-5 w-[200px]" />
            <Skeleton className="h-12 w-[350px]" />
          </div>
          <div className="flex-col space-y-1">
            <Skeleton className="h-5 w-[200px]" />
            <Skeleton className="h-12 w-[350px]" />
          </div>
        </div>
        <div className="flex items-center justify-between space-x-9">
          <div className="flex-col space-y-1">
            <Skeleton className="h-5 w-[200px]" />
            <Skeleton className="h-12 w-[350px]" />
          </div>
          <div className="flex-col space-y-1">
            <Skeleton className="h-5 w-[200px]" />
            <Skeleton className="h-12 w-[350px]" />
          </div>
          <div className="flex-col space-y-1">
            <Skeleton className="h-5 w-[200px]" />
            <Skeleton className="h-12 w-[350px]" />
          </div>
        </div>
      </div>
      <div className="py-3">
        <Skeleton className="h-[50px] w-[200px]" />
      </div>
    </>
  );
}

export default Loading;