export default function ScholarshipCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden h-full flex flex-col animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3 h-6">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-5 w-16 bg-gray-200 rounded-full" />
        </div>
        <div className="h-12 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-32 bg-gray-200 rounded mb-3" />
        <div className="flex gap-3 mb-3">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
        <div className="flex-1" />
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 h-10">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-12 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
