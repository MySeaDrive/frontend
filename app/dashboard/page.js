'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from '../hooks/useSession';
import { fetchWithAuth } from '../utils/api';

export default function Dashboard() {
  const [dives, setDives] = useState([]);
  const { session, loading: sessionLoading } = useSession();

  useEffect(() => {
    const fetchDives = async () => {
      if (session) {
        try {
          const data = await fetchWithAuth('/dives/');
          setDives(data);
        } catch (error) {
          console.error('Error fetching dives:', error);
          // Handle error (e.g., show error message to user)
        }
      }
    };

    fetchDives();
  }, [session]);

  if (sessionLoading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Please log in to view your dashboard.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {dives.map((dive) => (
        <div className="bg-white shadow rounded-lg p-4 mb-16" key={dive.id}>
          <Link href={`/dashboard/dive/${dive.id}`} className="block">
            <h2 className="text-2xl font-bold mb-2">{dive.name} </h2>
            <p className="text-gray-500 mb-4">{dive.location} - {dive.date}</p>
          </Link>
          <div className="grid grid-cols-6 gap-4 mb-4">
            {dive.media_items.map((media, index) => (
              <div key={index} className="bg-gray-200 aspect-video flex items-center justify-center">
                
                <p>{media.filename}</p>

              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}