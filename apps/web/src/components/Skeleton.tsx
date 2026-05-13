'use client';

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      role="status"
      aria-label="Loading..."
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="border rounded-lg p-6 bg-white">
      <Skeleton className="h-4 w-3/4 mb-3" />
      <Skeleton className="h-4 w-1/2 mb-6" />
      <Skeleton className="h-8 w-full mb-4" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b">
      <td className="p-4">
        <Skeleton className="h-4 w-full" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-full" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-full" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-full" />
      </td>
      <td className="p-4">
        <Skeleton className="h-4 w-full" />
      </td>
    </tr>
  );
}

export function GridSkeleton({ columns = 3, count = 6 }: { columns?: number; count?: number }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border rounded-lg p-4 bg-white">
          <Skeleton className="h-4 w-3/4 mb-3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  );
}
