export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-5">
      <div className="lg:col-span-4 lg:row-span-2 min-h-[260px] rounded-2xl shimmer" />
      <div className="lg:col-span-2 min-h-[180px] rounded-2xl shimmer" />
      <div className="lg:col-span-2 min-h-[180px] rounded-2xl shimmer" />
      <div className="lg:col-span-2 min-h-[180px] rounded-2xl shimmer" />
      <div className="lg:col-span-2 min-h-[180px] rounded-2xl shimmer" />
      <div className="lg:col-span-2 min-h-[180px] rounded-2xl shimmer" />
      <div className="lg:col-span-6 min-h-[220px] rounded-2xl shimmer" />
    </div>
  );
}
