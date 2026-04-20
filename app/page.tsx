export default function Home() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-serif text-[#0B3B2F]">The Open Scholarships</h1>
        <p className="text-gray-500 mt-2">Site is under maintenance. We'll be back shortly.</p>
        <a href="/scholarships" className="mt-4 inline-block bg-[#0B3B2F] text-white px-4 py-2 rounded">
          Browse Scholarships
        </a>
      </div>
    </main>
  );
}