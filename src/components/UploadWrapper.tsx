import { useState, useCallback, useRef, useEffect } from 'react';
import { FiUpload, FiCheck, FiX, FiAlertCircle, FiLoader } from 'react-icons/fi';

interface UploadFile {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress: number;
  error?: string;
}

interface UploadWrapperProps {
  onUploadStart?: (files: FileList) => void;
  onUploadProgress?: (fileId: string, progress: number) => void;
  onUploadComplete?: (fileId: string, result: any) => void;
  onUploadError?: (fileId: string, error: string) => void;
  onAllUploadsComplete?: (results: any[]) => void;
  maxFileSize?: number; // in bytes
  allowedFileTypes?: string[];
  maxConcurrentUploads?: number;
}

interface NotificationProps {
  files: UploadFile[];
  isVisible: boolean;
  onClose: () => void;
}

const UploadNotification: React.FC<NotificationProps> = ({ files, isVisible, onClose }) => {
  const completedFiles = files.filter(f => f.status === 'completed').length;
  const errorFiles = files.filter(f => f.status === 'error').length;
  const uploadingFiles = files.filter(f => f.status === 'uploading').length;
  const totalFiles = files.length;

  const getOverallStatus = () => {
    if (errorFiles > 0 && completedFiles + errorFiles === totalFiles) {
      return errorFiles === totalFiles ? 'all-error' : 'partial-error';
    }
    if (completedFiles === totalFiles && totalFiles > 0) {
      return 'completed';
    }
    if (uploadingFiles > 0) {
      return 'uploading';
    }
    return 'idle';
  };

  const status = getOverallStatus();

  if (!isVisible || files.length === 0) return null;

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
        return <FiLoader className="w-5 h-5 animate-spin text-blue-500" />;
      case 'completed':
        return <FiCheck className="w-5 h-5 text-green-500" />;
      case 'all-error':
        return <FiX className="w-5 h-5 text-red-500" />;
      case 'partial-error':
        return <FiAlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <FiUpload className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'uploading':
        return `Uploading ${uploadingFiles} of ${totalFiles} files...`;
      case 'completed':
        return `Successfully uploaded ${totalFiles} file${totalFiles > 1 ? 's' : ''}`;
      case 'all-error':
        return `Failed to upload ${totalFiles} file${totalFiles > 1 ? 's' : ''}`;
      case 'partial-error':
        return `${completedFiles} uploaded, ${errorFiles} failed`;
      default:
        return 'Ready to upload';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'uploading':
        return 'border-blue-500 bg-blue-50';
      case 'completed':
        return 'border-green-500 bg-green-50';
      case 'all-error':
        return 'border-red-500 bg-red-50';
      case 'partial-error':
        return 'border-yellow-500 bg-yellow-50';
      default:
        return 'border-gray-300 bg-white';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`
          max-w-sm p-4 rounded-lg border-2 shadow-lg backdrop-blur-sm
          transform transition-all duration-300 ease-out
          hover:scale-105 hover:shadow-xl
          ${getStatusColor()}
        `}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getStatusIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {getStatusMessage()}
            </p>
            
            {/* Progress for individual files */}
            {files.length > 0 && (
              <div className="mt-2 space-y-1">
                {files.slice(0, 3).map((file) => (
                  <div key={file.id} className="flex items-center gap-2">
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600 truncate max-w-[150px]">
                          {file.file.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {file.status === 'uploading' ? `${file.progress}%` : 
                           file.status === 'completed' ? '✓' :
                           file.status === 'error' ? '✗' : '...'}
                        </span>
                      </div>
                      {file.status === 'uploading' && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {files.length > 3 && (
                  <p className="text-xs text-gray-500">
                    +{files.length - 3} more files
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 transition-colors"
          >
            <FiX className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const useUploadWrapper = (props: UploadWrapperProps = {}) => {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const activeUploadsRef = useRef(0);
  const uploadQueueRef = useRef<UploadFile[]>([]);

  const {
    onUploadStart,
    onUploadProgress,
    onUploadComplete,
    onUploadError,
    onAllUploadsComplete,
    maxFileSize = 50 * 1024 * 1024,
    allowedFileTypes = [],
    maxConcurrentUploads = 3
  } = props;

  useEffect(() => {
    if (uploadFiles.length > 0) {
      const allDone = uploadFiles.every(f => f.status === 'completed' || f.status === 'error');
      if (allDone) {
        const timer = setTimeout(() => {
          setIsNotificationVisible(false);
          setTimeout(() => setUploadFiles([]), 300);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [uploadFiles]);

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize) {
      return `File size exceeds ${(maxFileSize / (1024 * 1024)).toFixed(1)}MB limit`;
    }
    
    if (allowedFileTypes.length > 0) {
      const fileType = file.type;
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      
      const isAllowed = allowedFileTypes.some(type => 
        type === fileType || 
        type === fileExtension ||
        (type.endsWith('/*') && fileType.startsWith(type.slice(0, -1)))
      );
      
      if (!isAllowed) {
        return `File type not allowed. Accepted types: ${allowedFileTypes.join(', ')}`;
      }
    }
    
    return null;
  };

  // func to generate MD5 hash
  // LATER UPDATE: using crypto-js library: npm install crypto-js
  const generateMD5Hash = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
  };

  const generateSHA256Hash = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const extractFolderIdFromUrl = (): string | null => {
    const currentPath = window.location.pathname;
    const match = currentPath.match(/\/dashboard\/my-cdn\/(.+)/);
    return match ? match[1] : null;
  };

  const fetchRootFolderId = async (): Promise<string> => {
    const response = await fetch('/api/cdn/folders/root/');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch root folder: ${response.statusText}`);
    }
    
    const rootData = await response.json();
    return rootData.root_folder.id;
  };

  const uploadFileToServer = async (file: File, onProgress: (progress: number) => void): Promise<any> => {
    try {
      let folderId = `${extractFolderIdFromUrl()}`;

      onProgress(10);
      const tempUrl = await uploadToTempStorage(file);
      onProgress(33);

      const cdnResult = await uploadToHackClubCDN(tempUrl);
      onProgress(66);

      const finalResult = await saveToBackend(file, folderId, cdnResult);
      onProgress(100);

      return finalResult;
    } catch (error) {
      throw new Error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const uploadToTempStorage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/cdn/upload-0x0/', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Temporary upload failed: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const result = await response.json();
      return result.tempUrl || result.url;
    } else {
      const tempUrl = await response.text();
      return tempUrl.trim();
    }
  };

  const uploadToHackClubCDN = async (tempUrl: string): Promise<any> => {
    const response = await fetch('https://cdn.hackclub.com/api/v3/new', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer beans',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([tempUrl]),
    });

    if (!response.ok) {
      throw new Error(`CDN upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.files || result.files.length === 0) {
      throw new Error('CDN upload returned no files');
    }

    return {
      cdnFile: result.files[0],
      cdnBase: result.cdnBase
    };
  };

  const saveToBackend = async (file: File, folderId: string | null, cdnResult: any): Promise<any> => {
    const md5Hash = await generateMD5Hash(file);
    const sha256Hash = await generateSHA256Hash(file);
    
    if (!folderId) {
      folderId = await fetchRootFolderId();
    }

    const backendData = {
      filename: cdnResult.cdnFile.file,
      original_filename: file.name,
      cdn_url: cdnResult.cdnFile.deployedUrl,
      file_size: file.size,
      mime_type: file.type,
      md5_hash: md5Hash,
      sha256_hash: sha256Hash,
      folder_id: folderId
    };

    const response = await fetch('/api/cdn/files/upload/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendData),
    });

    if (!response.ok) {
      throw new Error(`Backend save failed: ${response.statusText}`);
    }

    const backendResult = await response.json();

    return {
      ...backendResult,
      cdnUrl: cdnResult.cdnFile.deployedUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      sha: cdnResult.cdnFile.sha
    };
  };

  const processUploadQueue = useCallback(async () => {
    while (uploadQueueRef.current.length > 0 && activeUploadsRef.current < maxConcurrentUploads) {
      const fileToUpload = uploadQueueRef.current.shift();
      if (!fileToUpload) continue;

      activeUploadsRef.current++;
      
      setUploadFiles(prev => prev.map(f => 
        f.id === fileToUpload.id ? { ...f, status: 'uploading' } : f
      ));

      try {
        const result = await uploadFileToServer(fileToUpload.file, (progress) => {
          onUploadProgress?.(fileToUpload.id, progress);
          setUploadFiles(prev => prev.map(f => 
            f.id === fileToUpload.id ? { ...f, progress } : f
          ));
        });

        setUploadFiles(prev => prev.map(f => 
          f.id === fileToUpload.id ? { ...f, status: 'completed', progress: 100 } : f
        ));
        
        onUploadComplete?.(fileToUpload.id, result);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        setUploadFiles(prev => prev.map(f => 
          f.id === fileToUpload.id ? { ...f, status: 'error', error: errorMessage } : f
        ));
        
        onUploadError?.(fileToUpload.id, errorMessage);
      } finally {
        activeUploadsRef.current--;
        processUploadQueue();
      }
    }

    const currentFiles = uploadFiles.filter(f => f.status === 'completed');
    if (currentFiles.length === uploadFiles.length && uploadFiles.length > 0) {
      const results = currentFiles.map(f => ({ fileId: f.id, fileName: f.file.name }));
      onAllUploadsComplete?.(results);
    }
  }, [maxConcurrentUploads, onUploadProgress, onUploadComplete, onUploadError, onAllUploadsComplete, uploadFiles]);

  const startUpload = useCallback((fileList: FileList) => {
    const files = Array.from(fileList);
    const validFiles: UploadFile[] = [];
    const errors: string[] = [];

    files.forEach((file, index) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push({
          file,
          id: `upload-${Date.now()}-${index}`,
          status: 'pending',
          progress: 0
        });
      }
    });

    if (errors.length > 0) {
      console.warn('Some files were rejected:', errors);
    }

    if (validFiles.length > 0) {
      setUploadFiles(prev => [...prev, ...validFiles]);
      uploadQueueRef.current.push(...validFiles);
      setIsNotificationVisible(true);
      onUploadStart?.(fileList);
      processUploadQueue();
    }
  }, [validateFile, onUploadStart, processUploadQueue]);

  const closeNotification = useCallback(() => {
    setIsNotificationVisible(false);
    setTimeout(() => {
      setUploadFiles(prev => prev.filter(f => f.status === 'uploading'));
    }, 300);
  }, []);

  return {
    uploadFiles: startUpload,
    currentUploads: uploadFiles,
    isUploading: uploadFiles.some(f => f.status === 'uploading'),
    notification: (
      <UploadNotification
        files={uploadFiles}
        isVisible={isNotificationVisible}
        onClose={closeNotification}
      />
    )
  };
};

export default useUploadWrapper;