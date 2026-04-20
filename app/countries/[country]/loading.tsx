export default function Loading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Hero skeleton */}
      <div className="h-64 md:h-80 bg-gray-200" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content area - scholarship list */}
          <div className="lg:col-span-2">
            <div className="h-8 w-48 bg-gray-200 rounded mb-6" />
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0" />
                    <div className="flex-1">
                      <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
                      <div className="h-4 w-1/2 bg-gray-200 rounded mb-2" />
                      <div className="flex gap-4">
                        <div className="h-4 w-16 bg-gray-200 rounded" />
                        <div className="h-4 w-20 bg-gray-200 rounded" />
                        <div className="h-4 w-16 bg-gray-200 rounded" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 bg-gray-200 rounded" />
                <div className="h-20 bg-gray-200 rounded" />
                <div className="h-20 bg-gray-200 rounded col-span-2" />
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-20 bg-gray-200 rounded" />
                    <div className="h-6 w-12 bg-gray-200 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
            <div className="h-40 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
