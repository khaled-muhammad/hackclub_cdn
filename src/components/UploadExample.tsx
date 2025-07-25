import React, { useRef } from 'react';
import { useUploadWrapper } from './UploadWrapper';
import { FiUpload, FiImage, FiFile } from 'react-icons/fi';

// Example 1: Simple upload for any file type
export const SimpleUploadExample = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadFiles, notification } = useUploadWrapper({
    onUploadComplete: (fileId, result) => {
      console.log('File uploaded:', result);
      // Handle successful upload - maybe refresh file list, show success message, etc.
    },
    onUploadError: (fileId, error) => {
      console.error('Upload failed:', error);
      // Handle upload error - maybe show error message, retry option, etc.
    },
    onAllUploadsComplete: (results) => {
      console.log('All files uploaded!', results);
      // All files are done - maybe redirect, refresh page, etc.
    }
  });

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Simple File Upload</h2>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => uploadFiles(e.target.files!)}
      />
      
      <button 
        onClick={handleUploadClick}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <FiUpload /> Upload Files
      </button>
      
      {notification}
    </div>
  );
};

// Example 2: Images only with size limit
export const ImageUploadExample = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadFiles, notification } = useUploadWrapper({
    maxFileSize: 10 * 1024 * 1024, // 10MB limit
    allowedFileTypes: ['image/*', '.jpg', '.jpeg', '.png', '.gif', '.webp'],
    maxConcurrentUploads: 2,
    onUploadStart: (files) => {
      console.log(`Starting upload of ${files.length} images`);
    },
    onUploadComplete: (fileId, result) => {
      console.log('Image uploaded:', result);
      // Maybe add to image gallery, update thumbnail cache, etc.
    }
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      uploadFiles(files);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Image Upload (Max 10MB)</h2>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => uploadFiles(e.target.files!)}
      />
      
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <FiImage className="mx-auto text-4xl text-gray-400 mb-4" />
        <p className="text-gray-600">
          Click to upload or drag and drop images
        </p>
        <p className="text-sm text-gray-400 mt-2">
          JPG, PNG, GIF, WEBP up to 10MB
        </p>
      </div>
      
      {notification}
    </div>
  );
};

// Example 3: Document upload with custom styling
export const DocumentUploadExample = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadFiles, notification, currentUploads } = useUploadWrapper({
    maxFileSize: 25 * 1024 * 1024, // 25MB for documents
    allowedFileTypes: [
      'application/pdf',
      '.doc', '.docx',
      '.txt', '.rtf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ],
    maxConcurrentUploads: 1, // Upload documents one at a time
    onUploadProgress: (fileId, progress) => {
      console.log(`Document ${fileId} is ${progress}% uploaded`);
    },
    onUploadComplete: (fileId, result) => {
      console.log('Document uploaded:', result);
      // Maybe index document for search, extract text content, etc.
    }
  });

  const hasActiveUploads = currentUploads.some(upload => 
    upload.status === 'uploading' || upload.status === 'pending'
  );

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Document Upload</h2>
      
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx"
        className="hidden"
        onChange={(e) => uploadFiles(e.target.files!)}
      />
      
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={hasActiveUploads}
        className={`
          px-6 py-3 rounded-lg flex items-center gap-2 transition-all
          ${hasActiveUploads 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg'
          }
        `}
      >
        <FiFile /> 
        {hasActiveUploads ? 'Uploading...' : 'Upload Documents'}
      </button>
      
      <p className="text-sm text-gray-500 mt-2">
        Supports PDF, Word, Excel, Text files (max 25MB)
      </p>
      
      {notification}
    </div>
  );
};

// Example 4: Programmatic upload (no UI)
export const useFileUpload = () => {
  const { uploadFiles, currentUploads } = useUploadWrapper({
    onUploadComplete: (fileId, result) => {
      // Handle completion programmatically
      console.log('Programmatic upload completed:', result);
    }
  });

  // Function that can be called from anywhere
  const uploadFilesProgrammatically = (files: FileList) => {
    return uploadFiles(files);
  };

  return {
    uploadFiles: uploadFilesProgrammatically,
    uploads: currentUploads,
    isUploading: currentUploads.some(u => u.status === 'uploading')
  };
}; 