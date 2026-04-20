export default function UniversityCardSkeleton() {
  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden h-full animate-pulse">
      <div className="h-40 bg-gray-200" />
      <div className="p-5">
        <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-24 bg-gray-200 rounded mb-3" />
        <div className="flex items-center justify-between">
          <div className="h-5 w-16 bg-gray-200 rounded-full" />
          <div className="h-4 w-12 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
