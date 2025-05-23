'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from '../hooks/useSession';
import { fetchWithAuth } from '../utils/api';
import { Button } from '@heroui/react';

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
    return null;
  }

  if (!session) {
    return <div>Please log in to view your dashboard.</div>;
  }

  const cardBackground = (dive) => {
    if (dive.media_items.length > 0 && dive.media_items[0].thumbnails && dive.media_items[0].thumbnails.length > 0) {
      return dive.media_items[0].thumbnails[0];
    }
    return '/bg_image.jpg';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {dives.map((dive) => (
        <Link href={`/dashboard/dive/${dive.id}`} key={dive.id}>
          <div 
            className="shadow relative mb-8 rounded-md overflow-hidden cursor-pointer border"
            style={{
              backgroundImage: `
                linear-gradient(to right, 
                  rgba(255,255,255,1) 0%, 
                  rgba(255,255,255,1) 50%, 
                  rgba(255,255,255,0.5) 75%, 
                  rgba(255,255,255,0) 100%
                ),
                url(${cardBackground(dive)})
              `,
              backgroundSize: 'cover, cover',
              backgroundPosition: 'center, right',
              backgroundRepeat: 'no-repeat, no-repeat'
            }}
          >
            <div className="relative z-10 p-8 h-full flex flex-col">
              <div>
                <h2 className="text-2xl font-bold text-black mb-2">{dive.name}</h2>
                <p className="text-gray-500 mb-4 text-sm"> Location - 01 Jan 2023</p>
              </div>
              <div className="flex space-x-2 mt-6">
                {dive.media_items.slice(0, 5).map((media, index) => (
                  <div key={index} className="w-40 h-30 bg-gray-200 rounded-md overflow-hidden">
                    {media.thumbnails && media.thumbnails.length > 0 ? (
                      <img src={media.thumbnails[0]} alt={media.filename} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                        No preview
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}