export default function Loading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Hero skeleton */}
      <div className="h-64 md:h-80 bg-gray-200" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
        <div className="h-6 w-full bg-gray-200 rounded mb-2" />
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-8" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-40 bg-gray-200 rounded-xl" />
            <div className="h-40 bg-gray-200 rounded-xl" />
            <div className="h-40 bg-gray-200 rounded-xl" />
          </div>
          <div className="lg:col-span-1">
            <div className="h-64 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
