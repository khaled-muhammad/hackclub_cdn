import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import session from "../consts";
import { FiArchive, FiFile, FiFileText, FiFolder, FiImage, FiLink, FiPenTool, FiVideo } from "react-icons/fi";
import type { ApiResponse, DisplayItem } from "./MyCDN";
import { formatDate } from "../utils";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const PublicShared = () => {
  const { accessToken } = useParams();
  const [shareDetails, setShareDetails] = useState(null);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();

  const [viewMode, setViewMode] = useState('list');

  const getFileIconAndColor = (mimeType: string, filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    if (mimeType.startsWith('image/')) {
      return { icon: <FiImage size={24} />, color: 'green' };
    } else if (mimeType.startsWith('video/')) {
      return { icon: <FiVideo size={24} />, color: 'purple' };
    } else if (mimeType.includes('pdf')) {
      return { icon: <FiFileText size={24} />, color: 'red' };
    } else if (mimeType.includes('zip') || mimeType.includes('archive')) {
      return { icon: <FiArchive size={24} />, color: 'orange' };
    } else if (extension === 'sketch') {
      return { icon: <FiPenTool size={24} />, color: 'pink' };
    } else if (mimeType.includes('spreadsheet') || extension === 'xlsx' || extension === 'csv') {
      return { icon: <FiFileText size={24} />, color: 'green' };
    } else {
      return { icon: <FiFile size={24} />, color: 'gray' };
    }
  };

  const convertToDisplayItems = (data: ApiResponse): DisplayItem[] => {
    const items: DisplayItem[] = [];
    data.forEach(file => {
      const { icon, color } = getFileIconAndColor(file.mime_type, file.filename);
      items.push({
        id: file.id,
        name: file.original_filename,
        type: 'file',
        owner: file.owner_detail.full_name,
        modified: formatDate(file.updated_at),
        size: file.file_size_human,
        icon,
        color,
        url: file.cdn_url,
        is_starred: file.is_starred
      });
    });

    return items;
  };

  const displayItems = shareDetails ? convertToDisplayItems(shareDetails.resource) : [];


  useEffect(() => {
    session.get(`cdn/shares/public/?token=${accessToken}`).then((res) => {
        if (res.data.share.resource_type == 'file') {
            window.location.href = res.data.resource.cdn_url;
        } else {
            setShareDetails(res.data)
        }
    }).catch((err) => {
        navigate('/dashboard')
    })
  }, [])

  const handleCopyCDNUrl = (item: DisplayItem) => {
    if (item.url) {
      navigator.clipboard.writeText(item.url).then(() => {
        toast.success('Link copied to clipboard!');
      }).catch(() => {
        toast.error('Failed to copy link to clipboard');
      });
    } else {
      toast.error('No shareable link available for this item');
    }
  }

  if (!shareDetails) {
    return ''
  }

  return (
    <div className="h-full flex flex-col">
      {/* Cleaner Header */}
      <div className="p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
            {shareDetails.resource.name}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "text-green-600 bg-green-100"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 10h16M4 14h16M4 18h16"
                />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "text-green-600 bg-green-100"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
            </button>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option>Name</option>
              <option>Modified</option>
              <option>Size</option>
              <option>Type</option>
            </select>
          </div>
        </div>
      </div>

      {/* Conditional rendering based on view mode */}
      <div className="flex-1 px-6">
        {displayItems.length === 0 ? (
          <div className="text-center py-12">
            <FiFolder size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No files found</h3>
            <p className="text-gray-600">The shared folder is empty!</p>
          </div>
        ) : viewMode === "list" ? (
          /* Cleaner List View */
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
                <div className="col-span-6">Name</div>
                <div className="col-span-2">Owner</div>
                <div className="col-span-2">Last modified</div>
                <div className="col-span-1">Size</div>
                <div className="col-span-1"></div>
              </div>
            </div>

            {/* File/folder rows */}
            <div className="divide-y divide-gray-100">
              {displayItems.map((item) => (
                <div
                  key={item.id}
                  className="px-6 py-3 hover:bg-gray-50 transition-colors group cursor-pointer"
                  onClick={() => {
                    if (item.type === 'file' && item.url) {
                      window.open(item.url, '_blank');
                    }
                  }}
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Name column */}
                    <div className="col-span-6 flex items-center gap-4">
                      <div
                        className={`w-8 h-8 bg-${item.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}
                      >
                        <span className={`text-${item.color}-600`}>
                          {item.icon}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-800 truncate hover:text-green-600 transition-colors">
                          {item.name}
                        </p>
                      </div>
                    </div>

                    {/* Owner column */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        {item.owner === user?.name || item.owner === user?.email ? (
                          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-green-700">
                              {user?.name?.charAt(0) ||
                                user?.email?.charAt(0) ||
                                "U"}
                            </span>
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-gray-700">
                              {item.owner
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                        )}
                        <span className="text-sm text-gray-700 truncate">
                          {item.owner === user?.name || item.owner === user?.email ? 'You' : item.owner}
                        </span>
                      </div>
                    </div>

                    {/* Modified column */}
                    <div className="col-span-2">
                      <span className="text-sm text-gray-600">
                        {item.modified}
                      </span>
                    </div>

                    {/* Size column */}
                    <div className="col-span-1">
                      <span className="text-sm text-gray-600">{item.size}</span>
                    </div>

                    {/* Actions column */}
                    <div className="col-span-1 flex justify-end">
                      <button 
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCopyCDNUrl(item)
                        }}
                      >
                        <FiLink className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Cleaner Grid View */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5">
            {displayItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-green-300 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative"
                onClick={() => {
                  if (item.type === 'file' && item.url) {
                    window.open(item.url, '_blank');
                  }
                }}
              >
                {/* Actions menu - appears on hover */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleCopyCDNUrl(item)
                    }}
                  >
                    <FiLink className="w-4 h-4" />
                  </button>
                </div>

                {/* File icon */}
                <div className="flex justify-center mb-3">
                  <div
                    className={`w-16 h-16 bg-${item.color}-100 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform`}
                  >
                    <span className={`text-${item.color}-600 text-3xl`}>
                      {item.icon}
                    </span>
                  </div>
                </div>

                {/* File name */}
                <div className="text-center">
                  <h3
                    className="font-medium text-gray-800 text-sm mb-1 truncate group-hover:text-green-600 transition-colors"
                    title={item.name}
                  >
                    {item.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicShared