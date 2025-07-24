import { useEffect, useState } from "react";
import {
  FiArchive,
  FiPenTool,
  FiFileText,
  FiVideo,
  FiFolder,
  FiImage,
  FiStar,
  FiTrash2,
  FiFile,
} from "react-icons/fi";
import session from "../consts";

// Interface for recent file data
interface RecentFile {
  id: string;
  original_filename: string;
  file_extension: string;
  mime_type: string;
  file_size_human: string;
  cdn_url: string;
  updated_at: string;
  created_at: string;
}

const formatDate = (iso: string) => {
  const date = new Date(iso);
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

// Function to get file icon and color based on file extension
const getFileIconAndColor = (fileExtension: string, mimeType?: string) => {
  const extension = fileExtension?.toLowerCase().replace('.', '') || '';
  
  // Image files
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp', 'ico'].includes(extension) || 
      mimeType?.startsWith('image/')) {
    return { 
      icon: <FiImage size={24} />, 
      type: 'image',
      bgColor: 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-500/30'
    };
  }
  
  // Video files
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', '3gp'].includes(extension) || 
      mimeType?.startsWith('video/')) {
    return { 
      icon: <FiVideo size={24} />, 
      type: 'video',
      bgColor: 'bg-gradient-to-br from-purple-400 to-purple-500 shadow-purple-500/30'
    };
  }
  
  // Document files
  if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'].includes(extension) || 
      mimeType?.includes('pdf') || mimeType?.includes('document')) {
    return { 
      icon: <FiFileText size={24} />, 
      type: 'document',
      bgColor: 'bg-gradient-to-br from-orange-400 to-red-500 shadow-orange-500/30'
    };
  }
  
  // Archive files
  if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(extension) || 
      mimeType?.includes('zip') || mimeType?.includes('archive')) {
    return { 
      icon: <FiArchive size={24} />, 
      type: 'archive',
      bgColor: 'bg-gradient-to-br from-yellow-400 to-orange-500 shadow-yellow-500/30'
    };
  }
  
  // Design files
  if (['sketch', 'fig', 'psd', 'ai', 'xd'].includes(extension)) {
    return { 
      icon: <FiPenTool size={24} />, 
      type: 'design',
      bgColor: 'bg-gradient-to-br from-pink-400 to-rose-500 shadow-pink-500/30'
    };
  }
  
  // Spreadsheet files
  if (['xls', 'xlsx', 'csv', 'ods'].includes(extension) || 
      mimeType?.includes('spreadsheet')) {
    return { 
      icon: <FiFileText size={24} />, 
      type: 'spreadsheet',
      bgColor: 'bg-gradient-to-br from-green-400 to-green-500 shadow-green-500/30'
    };
  }
  
  // Default for unknown files
  return { 
    icon: <FiFile size={24} />, 
    type: 'file',
    bgColor: 'bg-gradient-to-br from-gray-400 to-gray-500 shadow-gray-500/30'
  };
};

const Recent = () => {
    const [recentFiles, setRecentFiles] = useState<RecentFile[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        session.get('cdn/files/recent/')
          .then((res) => {
            setRecentFiles(res.data);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error('Error fetching recent files:', error);
            setIsLoading(false);
          });
    }, [])

  return (
    <div className="h-full flex flex-col">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-6 mb-6 border 
border-emerald-100">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text 
text-transparent mb-2">
              Recent Activity
            </h1>
            <p className="text-emerald-700 font-medium">
              Your recently accessed and modified files
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white 
rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 
transition-all duration-300">
              Last 7 days
            </button>
            <button className="px-4 py-2.5 text-emerald-700 bg-white/70 backdrop-blur-sm border-2 
border-emerald-200 hover:bg-white hover:shadow-md rounded-xl font-semibold transition-all duration-300">
              Last 30 days
            </button>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto 
mb-4"></div>
            <p className="text-emerald-600">Loading recent files...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && (!recentFiles || recentFiles.length === 0) && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FiFolder size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No recent activity</h3>
            <p className="text-gray-600">Upload some files to see them appear here.</p>
          </div>
        </div>
      )}

      {/* Activity List */}
      {!isLoading && recentFiles && recentFiles.length > 0 && (
        <div className="flex-1 space-y-4">
          {recentFiles.map((item: RecentFile, index: number) => {
          const fileInfo = getFileIconAndColor(item.file_extension, item.mime_type);
          
          return (
            <div
              key={index}
              className="flex items-center justify-between p-5 bg-white/80 backdrop-blur-sm border-2 
border-emerald-100 rounded-2xl hover:shadow-xl hover:shadow-emerald-500/20 hover:border-emerald-300 
hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
              onClick={() => {
                if (item.cdn_url) {
                  window.open(item.cdn_url, '_blank');
                }
              }}
            >
              <div className="flex items-center gap-5">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg 
group-hover:scale-110 transition-transform duration-300 ${fileInfo.bgColor}`}
                >
                  <span className="text-white text-2xl">{fileInfo.icon}</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-emerald-600 
transition-colors duration-300">
                    {item.original_filename}
                  </h3>
                  <p className="text-emerald-700 font-medium">
                    <span className="capitalize bg-emerald-100 px-2 py-1 rounded-full text-xs font-semibold">
                      Uploaded
                    </span>
                    <span className="mx-2">•</span>
                    <span>{formatDate(item.updated_at)}</span>
                    <span className="mx-2">•</span>
                    <span className="text-gray-600">{item.file_size_human}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  className="p-3 text-gray-400 hover:text-emerald-600 hover:bg-emerald-100 rounded-xl 
transition-all duration-300 group-hover:scale-110"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiStar size={18} />
                </button>
                <button 
                  className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all 
duration-300 group-hover:scale-110"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
                     );
         })}
         </div>
       )}
    </div>
  );
};

export default Recent;