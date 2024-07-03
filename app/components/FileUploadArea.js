// components/FileUploadArea.js
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default function FileUploadArea({diveId}) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const supabase = createClientComponentClient();

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(prevFiles => [
      ...prevFiles,
      ...acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substring(2, 15) // Simple unique id
      }))
    ]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'video/*': []
    },
    multiple: true
  });

  const removeFile = (file) => {
    setFiles(prevFiles => prevFiles.filter(f => f !== file));
    setUploadProgress(prev => {
      const { [file.id]: removed, ...rest } = prev;
      return rest;
    });
  };

  const handleUpload = async () => {
    setUploading(true);
    try {
      // Step 1: Get upload URLs from backend
      const fileInfo = files.map(file => ({
        id: file.id,
        name: file.name,
        content_type: file.type,
        size: file.size
      }));
      const { data: { session } } = await supabase.auth.getSession();
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/media/get_upload_urls`, 
        { 
            files: fileInfo
        }, 
        {
            headers: {
            'Authorization': `Bearer ${session.access_token}`
        }
        });
      const uploadUrls = response.data;

      // Step 2: Upload files to Backblaze B2
      const uploadPromises = files.map(file => {
        const uploadUrl = uploadUrls[file.id];
        
        return axios.put(uploadUrl, file, {
          headers: { 'Content-Type': file.type },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => ({
              ...prev,
              [file.id]: percentCompleted
            }));
          }
        })
        .then(async () => {
            // File uploaded successfully, now save the metadata
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/media/save?dive_id=${diveId}`, {
              filename: file.name,
              raw_url: uploadUrl,
              mime_type: file.type
            },
            {
                headers: {
                'Authorization': `Bearer ${session.access_token}`
                }
            });
        });

      });

      await Promise.all(uploadPromises);

      // Clear files after successful upload
      setFiles([]);
      setUploadProgress({});
    } catch (error) {
      console.error('Upload failed:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4">
      <div {...getRootProps()} className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-2">Previews:</h4>
          <div className="grid grid-cols-3 gap-4">
            {files.map(file => (
              <div key={file.id} className="relative bg-gray-100 p-2 rounded">
                <div className="aspect-w-16 aspect-h-9 mb-2">
                  {file.type.startsWith('image/') ? (
                    <img src={file.preview} alt={file.name} className="object-cover rounded" />
                  ) : (
                    <video src={file.preview} className="object-cover rounded" />
                  )}
                </div>
                <div className="text-sm truncate">{file.name}</div>
                <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                {uploadProgress[file.id] !== undefined && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${uploadProgress[file.id]}%`}}></div>
                  </div>
                )}
                {!uploading && (
                  <button
                    onClick={() => removeFile(file)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {uploading ? 'Uploading...' : `Upload ${files.length} file${files.length !== 1 ? 's' : ''}`}
          </button>
        </div>
      )}
    </div>
  );
}