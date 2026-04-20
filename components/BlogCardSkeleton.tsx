export default function BlogCardSkeleton() {
  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden h-full flex flex-col animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-5 w-16 bg-gray-200 rounded-full" />
          <div className="h-4 w-12 bg-gray-200 rounded" />
        </div>
        <div className="h-12 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-full bg-gray-200 rounded mb-1" />
        <div className="h-4 w-3/4 bg-gray-200 rounded mb-4" />
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="h-4 w-20 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
