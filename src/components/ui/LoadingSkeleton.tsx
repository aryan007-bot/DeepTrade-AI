interface LoadingSkeletonProps {
  count?: number;
  height?: number;
  variant?: "text" | "rectangular" | "circular";
}

export function LoadingSkeleton({ 
  count = 3, 
  height = 80
}: LoadingSkeletonProps) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-muted rounded-lg"
          style={{ height: `${height}px` }}
        />
      ))}
    </div>
  );
}