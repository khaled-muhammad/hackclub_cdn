import React, { useRef } from 'react';
import { useUploadWrapper } from './UploadWrapper';
import { FiUpload, FiCheckCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const UploadTest = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadFiles, notification, currentUploads, isUploading } = useUploadWrapper({
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedFileTypes: [], // Allow all file types for testing
    maxConcurrentUploads: 2,
    onUploadStart: (files) => {
      console.log('🚀 Upload started for files:', Array.from(files).map(f => f.name));
    },
    onUploadProgress: (fileId, progress) => {
      console.log(`📊 Progress for ${fileId}: ${progress}%`);
    },
    onUploadComplete: (fileId, result) => {
      console.log('✅ Upload completed:', result);
    },
    onUploadError: (fileId, error) => {
      console.error('❌ Upload failed:', error);
    },
    onAllUploadsComplete: (results) => {
      console.log('🎉 All uploads completed:', results);
    }
  });

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      console.log('📁 Files selected:', Array.from(files).map(f => f.name));
      uploadFiles(files);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FiUpload className="text-green-500" />
          Upload Test Component
        </h2>

        {/* Current URL Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <FiInfo className="text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Current URL Info:</p>
              <p className="text-xs text-blue-700 mt-1">
                Path: <code className="bg-blue-100 px-1 rounded">{window.location.pathname}</code>
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Extracted folder_id: <code className="bg-blue-100 px-1 rounded">
                  {window.location.pathname.match(/\/dashboard\/my-cdn\/(.+)/)?.[1] || 'null (will fetch root folder ID)'}
                </code>
              </p>
            </div>
          </div>
        </div>

        {/* Upload Process Steps */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-3">Upload Process:</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Step 1: Upload via /api/cdn/upload-0x0/ (0x0.st proxy)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Step 2: Upload to HackClub CDN</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Step 3: Fetch folder ID (root if needed) + Save metadata</span>
            </div>
          </div>
        </div>

        {/* Upload Button */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />

        <button
          onClick={triggerFileUpload}
          disabled={isUploading}
          className={`
            w-full py-4 px-6 rounded-lg font-medium text-white
            flex items-center justify-center gap-3 transition-all
            ${isUploading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-500 hover:bg-green-600 hover:shadow-lg transform hover:scale-[1.02]'
            }
          `}
        >
          <FiUpload className="text-xl" />
          {isUploading ? 'Uploading...' : 'Select Files to Upload'}
        </button>

        {/* Upload Status */}
        {currentUploads.length > 0 && (
          <div className="mt-6 space-y-3">
            <h3 className="font-medium text-gray-900">Upload Status:</h3>
            {currentUploads.map((upload) => (
              <div
                key={upload.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-shrink-0">
                  {upload.status === 'uploading' && (
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {upload.status === 'completed' && (
                    <FiCheckCircle className="w-5 h-5 text-green-500" />
                  )}
                  {upload.status === 'error' && (
                    <FiAlertCircle className="w-5 h-5 text-red-500" />
                  )}
                  {upload.status === 'pending' && (
                    <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {upload.file.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-gray-500">
                      {(upload.file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                    <span className="text-xs text-gray-400">•</span>
                    <p className="text-xs text-gray-500 capitalize">
                      {upload.status}
                    </p>
                    {upload.status === 'uploading' && (
                      <>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-blue-600">
                          {upload.progress}%
                        </p>
                      </>
                    )}
                    {upload.error && (
                      <>
                        <span className="text-xs text-gray-400">•</span>
                        <p className="text-xs text-red-600 truncate">
                          {upload.error}
                        </p>
                      </>
                    )}
                  </div>
                  
                  {upload.status === 'uploading' && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${upload.progress}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Open your browser's developer console to see detailed logs
            of the upload process. Make sure your backend implements the `/api/cdn/upload-0x0/`
            endpoint as described in the documentation.
          </p>
        </div>
      </div>

      {/* Notification will appear here */}
      {notification}
    </div>
  );
};

export default UploadTest; 