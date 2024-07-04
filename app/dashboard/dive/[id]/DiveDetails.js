'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import FileUploadArea from '@/app/components/FileUploadArea';
import { fetchWithAuth } from '@/app/utils/api';
import { useSession } from '@/app/hooks/useSession';

export default function DiveDetails({ id }) {

  const [dive, setDive] = useState(null);
  const { session, loading: sessionLoading } = useSession();

  useEffect(() => {
    if (session) {
      fetchWithAuth(`/dives/${id}`)
        .then(setDive)
        .catch(console.error);
    }
  }, [id, session]);
  
  const renderMediaItem = (media) => {
    if (media.mime_type.startsWith('image/')) {
      return (
        <img 
          src={media.processed_url || media.raw_url} 
          alt={media.filename}
          className="w-full h-full object-cover rounded"
        />
      );
    } else if (media.mime_type.startsWith('video/')) {
      return (
        <video 
          controls
          className="w-full h-full object-cover rounded"
        >
          <source src={media.processed_url || media.raw_url} type={media.mime_type} />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return <p>Unsupported media type</p>;
    }
  };

  if (sessionLoading || !dive) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container flex">


        <div className="w-3/4 mx-4 my-8">
            <div className="bg-white shadow rounded-lg p-4">
                <Link href="/dashboard" className="text-blue-500 hover:underline mb-4 block">
                    ← Back
                </Link>
                <h2 className="text-2xl font-bold mb-2">{dive.name} </h2>
                <p className="text-gray-500 mb-4">{dive.location} - {dive.date}</p>
            
            <div className="grid grid-cols-6 gap-4 mb-4">
                {dive.media_items.map((media, index) => (
                    <div key={index} className="aspect-w-16 aspect-h-9">
                        {renderMediaItem(media)}
                  </div>
                ))}
            </div>
            
            <FileUploadArea diveId={dive.id}/>    

            </div>
        </div>
        
        <div className='w-1/4 mx-4 my-8'>
            <div className="bg-white shadow rounded-lg p-4">
                <h2 className='text-xl'>Dive Info</h2>
            </div>
        </div>

    </div>

  );
}