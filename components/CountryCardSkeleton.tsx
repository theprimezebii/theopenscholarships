export default function CountryCardSkeleton() {
  return (
    <div className="relative h-28 md:h-32 rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="absolute inset-0 bg-gray-200" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-2 left-2 right-2">
        <div className="h-4 w-20 bg-gray-300 rounded mb-1" />
        <div className="h-3 w-12 bg-gray-300 rounded" />
      </div>
    </div>
  );
}
