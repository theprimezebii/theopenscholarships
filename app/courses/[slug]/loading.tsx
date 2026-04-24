// app/courses/[slug]/loading.tsx
export default function CourseDetailLoading() {
  return (
    <main className="min-h-screen bg-white animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-gray-800 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="h-6 w-32 bg-gray-600 rounded mb-4" />
          <div className="h-10 w-3/4 bg-gray-600 rounded mb-3" />
          <div className="h-6 w-1/2 bg-gray-600 rounded mb-4" />
          <div className="flex gap-4">
            <div className="h-5 w-24 bg-gray-600 rounded" />
            <div className="h-5 w-24 bg-gray-600 rounded" />
            <div className="h-5 w-32 bg-gray-600 rounded" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-8 w-40 bg-gray-200 rounded" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-11/12" />
              <div className="h-4 bg-gray-200 rounded w-10/12" />
            </div>
            <div className="h-8 w-48 bg-gray-200 rounded mt-6" />
            <div className="grid grid-cols-2 gap-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded" />
              ))}
            </div>
            <div className="h-8 w-40 bg-gray-200 rounded mt-6" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-11/12" />
          </div>
          <div className="space-y-4">
            <div className="h-64 bg-gray-200 rounded-xl" />
            <div className="h-12 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </main>
  );
}