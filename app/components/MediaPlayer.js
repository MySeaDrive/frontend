import Link from 'next/link';

export default function SingleDiveView({ dive }) {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <Link href="/dashboard" className="text-blue-500 hover:underline mb-4 block">
        ← Back to all dives
      </Link>
      <h2 className="text-2xl font-bold mb-2">{dive.name}</h2>
      <p className="text-gray-500 mb-4">{dive.location} - {dive.date}</p>
      <div className="grid grid-cols-3 gap-4 mb-4">
        {dive.media.map((media, index) => (
          <div key={index} className="bg-gray-200 aspect-video flex items-center justify-center">
            <span className="text-3xl">▶</span>
          </div>
        ))}
      </div>
      <button className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600">
        Upload videos and photos
      </button>
    </div>
  );
}