'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import FileUploadArea from '@/app/components/FileUploadArea';
import { fetchWithAuth } from '@/app/utils/api';
import { useSession } from '@/app/hooks/useSession';
import { useRouter } from 'next/navigation';

export default function DiveDetails({ id }) {

  const [dive, setDive] = useState(null);
  const { session, loading: sessionLoading } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (session) {
      fetchWithAuth(`/dives/${id}`)
        .then(setDive)
        .catch(console.error);
    }
  }, [id, session]);

  const handleEditClick = () => {
    setEditedName(dive.name);
    setIsEditing(true);
  };

  const handleSaveName = async () => {
    try {
      const updatedDive = await fetchWithAuth(`/dives/${id}`, {
        method: 'PATCH',
        body: { name: editedName }
      });
      setDive(updatedDive);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating dive name:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleDeleteClick = () => {
    setIsDeleting(true);
  };

  const handleConfirmDelete = async (deleteMedia = false) => {
    try {
      await fetchWithAuth(`/dives/${id}?delete_media=${deleteMedia}`, {
        method: 'DELETE',
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('Error deleting dive:', error);
      // Handle error (e.g., show error message to user)
    }
    setIsDeleting(false);
  };

  const handleCancelDelete = () => {
    setIsDeleting(false);
  };
  
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

                <div className="flex items-center mb-2">
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="text-2xl font-bold mr-2 p-1 border rounded"
                      />
                      <button onClick={handleSaveName} className="text-green-500 mr-2">
                        Save
                      </button>
                      <button onClick={handleCancelEdit} className="text-red-500">
                        Cancel 
                      </button>
                    </>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold mr-2">{dive.name}</h2>
                      <button
                        onClick={handleEditClick}
                        className="text-gray-500 hover:text-blue-500 transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={handleDeleteClick}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>

                {isDeleting && (
                  <div className="mt-4 p-4 bg-red-100 rounded">
                    <p className="mb-2">Are you sure you want to delete this dive?</p>
                    <button
                      onClick={() => handleConfirmDelete(false)}
                      className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                    >
                      Delete Dive Only
                    </button>
                    <button
                      onClick={() => handleConfirmDelete(true)}
                      className="bg-red-700 text-white px-4 py-2 rounded mr-2"
                    >
                      Delete Dive and Media
                    </button>
                    <button
                      onClick={handleCancelDelete}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                )}

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