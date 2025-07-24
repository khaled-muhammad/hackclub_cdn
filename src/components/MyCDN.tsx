import React, { useEffect, useState, useRef } from "react";
import session from "../consts";
import {
  FiFolder,
  FiFileText,
  FiImage,
  FiVideo,
  FiArchive,
  FiPenTool,
  FiChevronDown,
  FiFile,
  FiStar,
  FiTrash2,
  FiShare2,
  FiMoreVertical,
} from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import useUploadWrapper from "./UploadWrapper";
import { toast } from 'react-toastify';

// Types for the API response
interface OwnerDetail {
  id: number;
  username: string;
  email: string;
  full_name: string;
  profile_picture: string;
}

interface FolderDetail {
  id: string;
  name: string;
  parent: string | null;
  owner: number;
  owner_detail: OwnerDetail;
  path: string;
  is_root: boolean;
  children_count: number;
  files_count: number;
  full_path: string;
  created_at: string;
  updated_at: string;
}

interface FileItem {
  id: string;
  filename: string;
  original_filename: string;
  folder: string;
  folder_detail: FolderDetail;
  owner: number;
  owner_detail: OwnerDetail;
  file_size: number;
  file_size_human: string;
  mime_type: string;
  file_extension: string;
  storage_path: string;
  cdn_url: string;
  thumbnail_url: string | null;
  preview_url: string | null;
  is_processed: boolean;
  processing_status: string;
  versions: any[];
  versions_count: number;
  is_starred: boolean;
  created_at: string;
  updated_at: string;
  last_accessed: string;
}

interface FolderItem {
  id: string;
  name: string;
  parent: string | null;
  owner: number;
  owner_detail: OwnerDetail;
  path: string;
  is_root: boolean;
  children_count: number;
  files_count: number;
  full_path: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  root_folder: FolderDetail;
  folders: FolderItem[];
  files: FileItem[];
}

interface DisplayItem {
  id: string;
  name: string;
  type: "folder" | "file";
  owner: string;
  modified: string;
  size: string;
  icon: React.ReactElement;
  color: string;
  url?: string;
  is_starred?: boolean;
}

// Dropdown Menu Component
interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: () => void;
  onStar: () => void;
  onDelete: () => void;
  isStarred: boolean;
  position: { x: number; y: number };
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isOpen,
  onClose,
  onShare,
  onStar,
  onDelete,
  isStarred,
  position,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <button
        onClick={onShare}
        className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors text-left"
      >
        <FiShare2 className="w-4 h-4" />
        Share
      </button>
      <button
        onClick={onStar}
        className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors text-left"
      >
        <FiStar className={`w-4 h-4 ${isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
        {isStarred ? 'Remove from starred' : 'Add to starred'}
      </button>
      <hr className="my-1 border-gray-100" />
      <button
        onClick={onDelete}
        className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors text-left"
      >
        <FiTrash2 className="w-4 h-4" />
        Delete
      </button>
    </div>
  );
};

const MyCDN = () => {
  const [viewMode, setViewMode] = useState("list");
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const { folderId } = useParams();
  const [fullPath, setFullPath] = useState(['Root']);
  const [parentId, setParentId] = useState('');

  const isRoot = !folderId;

  const navigate = useNavigate();

  // Function to handle dropdown menu
  const handleDropdownClick = (itemId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 192; // w-48 = 192px
    const menuHeight = 120; // Approximate height
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate horizontal position
    let x = rect.right - menuWidth; // Start from right edge of button
    if (x < 8) { // If too far left, move to right of button
      x = rect.left;
    }
    if (x + menuWidth > viewportWidth - 8) { // If too far right, adjust
      x = viewportWidth - menuWidth - 8;
    }

    // Calculate vertical position
    let y = rect.bottom + 4; // 4px below button
    if (y + menuHeight > viewportHeight - 8) { // If would go below viewport, show above
      y = rect.top - menuHeight - 4;
    }

    setDropdownPosition({
      x: Math.max(8, x),
      y: Math.max(8, y),
    });
    setActiveDropdown(activeDropdown === itemId ? null : itemId);
  };

  const handleShare = (item: DisplayItem) => {
    console.log('Share item:', item);
    // Implement share functionality
    if (item.url) {
      navigator.clipboard.writeText(item.url).then(() => {
        toast.success('Link copied to clipboard!');
      }).catch(() => {
        toast.error('Failed to copy link to clipboard');
      });
    } else {
      toast.error('No shareable link available for this item');
    }
    setActiveDropdown(null);
  };

  const handleStar = async (item: DisplayItem) => {
    console.log('Toggle star for item:', item);
    // Implement star/unstar functionality
    try {
      if (item.type === 'file') {
        await session.post(`cdn/files/${item.id}/toggle-star/`);
      } else {
        await session.post(`cdn/folders/${item.id}/toggle-star/`);
      }
      // Refresh data to update star status
      fetchData();
      toast.success(item.is_starred ? `Removed "${item.name}" from starred` : `Added "${item.name}" to starred`);
    } catch (error) {
      console.error('Error toggling star:', error);
      toast.error('Failed to update starred status');
    }
    setActiveDropdown(null);
  };

  const handleDelete = async (item: DisplayItem) => {
    console.log('Delete item:', item);
    // Implement delete functionality
    if (window.confirm(`Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) {
      try {
        if (item.type === 'file') {
          await session.delete(`cdn/files/${item.id}/`);
        } else {
          await session.delete(`cdn/folders/${item.id}/`);
        }
        // Refresh data to remove deleted item
        fetchData();
        toast.success(`Successfully deleted "${item.name}"`);
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Failed to delete item');
      }
    }
    setActiveDropdown(null);
  };

  // Function to get file icon and color based on mime type
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

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Function to convert API data to display format
  const convertToDisplayItems = (data: ApiResponse): DisplayItem[] => {
    const items: DisplayItem[] = [];

    // Add folders
    data.folders.forEach(folder => {
      items.push({
        id: folder.id,
        name: folder.name,
        type: 'folder',
        owner: folder.owner_detail.full_name,
        modified: formatDate(folder.updated_at),
        size: '—',
        icon: <FiFolder size={24} />,
        color: 'blue',
        is_starred: false // Note: Add this field to API if folders can be starred
      });
    });

    // Add files
    data.files.forEach(file => {
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

  const fetchData = async () => {
    /*alert(fullPath)*/
    alert(folderId)
    alert(folderId)
    if (!isRoot) {
      const response = await session.get(`cdn/folders/${folderId}/`);
      setFullPath(response.data.full_path.split('/'))
      setParentId(response.data.parent)
    } else {
        setFullPath(['Root'])
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log()
      const response = await session.get(`cdn/folders/${isRoot? 'root' : folderId}/${isRoot? '' : 'contents'}`);
      console.log('API Response:', response.data);
      setApiData(response.data);
    } catch (err) {
      console.error('Error fetching CDN data:', err);
      setError('Failed to load CDN data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchData();
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Listen for folder creation and file upload events to refresh data
  useEffect(() => {
    const handleFolderCreated = () => {
      console.log('Folder created event received, refreshing data...');
      fetchData();
    };

    const handleFileUploaded = () => {
      console.log('File uploaded event received, refreshing data...');
      fetchData();
    };

    const handleAllUploadsComplete = () => {
      console.log('All uploads completed event received, refreshing data...');
      fetchData();
    };

    window.addEventListener('folderCreated', handleFolderCreated);
    window.addEventListener('fileUploaded', handleFileUploaded);
    window.addEventListener('allUploadsComplete', handleAllUploadsComplete);
    
    return () => {
      window.removeEventListener('folderCreated', handleFolderCreated);
      window.removeEventListener('fileUploaded', handleFileUploaded);
      window.removeEventListener('allUploadsComplete', handleAllUploadsComplete);
    };
  }, [folderId]);

  // Close dropdown when navigating or clicking outside
  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveDropdown(null);
    };

    if (activeDropdown) {
      document.addEventListener('click', handleGlobalClick);
      return () => document.removeEventListener('click', handleGlobalClick);
    }
  }, [activeDropdown]);

  const routeMe = (rI: number) => {
    if (rI == 0) {
        navigate(`/dashboard/my-cdn/`)
    } else if (rI == fullPath.length - 2) {
        navigate(`/dashboard/my-cdn/${parentId}`)
    } else {

    }
  }

  // Get display items from API data
  const displayItems = apiData ? convertToDisplayItems(apiData) : [];

  if (authLoading || isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your files...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Cleaner Header */}
      <div className="p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
            {fullPath.map(((d, i) => <>
                <button className="hover:text-green-600 transition-colors" onClick={() => {routeMe(i)}}>
                {d}
                </button>
                <FiChevronDown className="text-gray-400 rotate-270" size={20} />
            </> ))}
            {/* <button className="hover:text-green-600 transition-colors">
              Documents
            </button> */}
            {/* <FiChevronDown className="text-gray-400 rotate-270" size={20} /> */}
            {/* <span className="text-gray-500">Project Files</span> */}
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
            <h3 className="text-lg font-medium text-gray-800 mb-2">No files or folders</h3>
            <p className="text-gray-600">Upload files or create folders to get started.</p>
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
                    } else {
                        navigate(`/dashboard/my-cdn/${item.id}`)
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
                        onClick={(e) => handleDropdownClick(item.id, e)}
                      >
                        <FiMoreVertical className="w-5 h-5" />
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
                  } else {
                    navigate(`/dashboard/my-cdn/${item.id}`)
                  }
                }}
              >


                {/* Actions menu - appears on hover */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={(e) => handleDropdownClick(item.id, e)}
                  >
                    <FiMoreVertical className="w-4 h-4" />
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

      {/* Global Dropdown Menu */}
      {activeDropdown && (
        <DropdownMenu
          isOpen={true}
          onClose={() => setActiveDropdown(null)}
          onShare={() => {
            const item = displayItems.find(i => i.id === activeDropdown);
            if (item) handleShare(item);
          }}
          onStar={() => {
            const item = displayItems.find(i => i.id === activeDropdown);
            if (item) handleStar(item);
          }}
          onDelete={() => {
            const item = displayItems.find(i => i.id === activeDropdown);
            if (item) handleDelete(item);
          }}
          isStarred={displayItems.find(i => i.id === activeDropdown)?.is_starred || false}
          position={dropdownPosition}
        />
      )}
    </div>
  );
};

export default MyCDN;