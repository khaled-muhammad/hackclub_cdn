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
  FiX,
  FiLock,
  FiGlobe,
  FiLink,
} from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import useUploadWrapper from "./UploadWrapper";
import { toast } from 'react-toastify';
import { isValidEmail } from "../utils";

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
  onCopyCDN: () => void;
  isStarred: boolean;
  position: { x: number; y: number };
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isOpen,
  onClose,
  onShare,
  onStar,
  onDelete,
  onCopyCDN,
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
        onClick={onCopyCDN}
        className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors text-left">
          <FiLink className="w-4 h-4" />
          Copy CDN
      </button>
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

const ShareModal = ({
  item, 
  isOpen, 
  onClose, 
  onSubmit,
  isLoading = false
}: {
  item: DisplayItem;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (folderName: string) => void;
  isLoading?: boolean;
}) => {
  const [currentEmail, setCurrentEmail] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [collectedEmails, setCollectedEmails] = useState([]);

  const [currentShareData, setCurrentShareData] = useState([]);
  const [publicToken, setPublicToken] = useState(null);
  const [publicShareId, setPublicShareId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setPublicToken(null);
      setPublicShareId(null);
      setCollectedEmails([]);
      setCurrentEmail("");
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);

      session.get(`cdn/shares/status/?resource_type=${item.type}&resource_id=${item.id}`).then((res) => {
        setCurrentShareData(res.data)
        res.data.forEach((share) => {
          if (share.is_public) {
            setPublicToken(share.public_token);
            setPublicShareId(share.share_id);
          }
          setCollectedEmails(share.shared_with.map((shw) => {
            return {
              share_id: share.share_id,
              username: shw.username,
              user_id: shw.user_id,
            };
          }))
        })
      }).catch(() => {
        onClose();
      })
    }
  }, [isOpen]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    session.post('cdn/shares/', {
      resource_type: item.type,
      resource_id: item.id,
      is_public: false,
      shared_users: collectedEmails.map((em) => {
        return {user_email:em, permission_level: "view"};
      })
    }).then((res) => {
      toast("Item is now shared with people");
    }).catch((err) => {
      toast.error("One or more user not found!");
    })
    onClose();
    // if (currentEmail.trim() && isValidEmail(currentEmail.trim())) {
    //   setCollectedEmails([...collectedEmails, currentEmail.trim()])
    //   // onSubmit(folderName.trim());
    // }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }else if (e.key === 'Enter') {
      if (currentEmail.trim() && isValidEmail(currentEmail.trim())) {
        setCollectedEmails([...collectedEmails, {username: currentEmail.trim()}])
        setCurrentEmail('');
        // onSubmit(folderName.trim());
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-md
       bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100">
        <div className="px-6 py-4 pb-0 border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 truncate overflow-hidden whitespace-nowrap">Share "{item.name}"</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            {collectedEmails.length == 0? <input
              ref={inputRef}
              id="email"
              type="text"
              value={currentEmail}
              onChange={(e) => setCurrentEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="khaledmuhmmed99@gmail.com"
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              maxLength={255}
            /> : <div className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex gap-3 flex-wrap hover:cursor-text" onClick={() => {inputRef.current?.focus()}}>
              <div className="flex gap-3">{collectedEmails.map((em) => <span className="bg-green-200/20 rounded-xl ring-1 p-2 text-xs ring-green-500/30 flex gap-3">{em.username} <FiX size={16} className="cursor-pointer" onClick={() => {
                if (em.user_id) {
                  session.delete(`cdn/shares/${em.share_id}/remove_user/?user_email=${em.username}`)
                }
                setCollectedEmails(collectedEmails.filter((emm) => emm != em))
              }} /></span>)}</div>
              <input
              ref={inputRef}
              type="text"
              value={currentEmail}
              onChange={(e) => setCurrentEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 min-w-[120px] bg-transparent outline-none border-none focus:ring-0 focus:outline-none"
              />
              </div>}
            <label htmlFor="email" className="block text-xs font-medium text-gray-700/80 mt-2">
              Share with other hack clubbers using email address (Click enter to add more than one email)
            </label>

            <h3 className="mt-4 mb-5">General Access</h3>
            <div className="flex gap-2 items-center">
              <div className="aspect-square p-2 rounded-full bg-green-500/50 text-white">{publicToken? <FiGlobe size={20} /> : <FiLock size={20} />}</div>
              <div>
                <select name="general-access" id="general-access" className="block" value={publicToken? 'view' : 'none'} onChange={(event) => {
                  if (event.target.value == 'view') {
                    session.post('cdn/shares/', {
                      resource_type: item.type,
                      resource_id: item.id,
                      is_public: true,
                    }).then((res) => {
                      toast("Item is now shared public");
                      if (res.data.is_public) {
                        setPublicToken(res.data.public_token)
                        setPublicShareId(res.data.id)
                      }
                    }).catch((err) => {
                      toast.error("Share error happened, try again later!")
                    })
                  } else {
                    session.delete(`cdn/shares/${publicShareId}/`).then((res) => {
                      toast("Item is back private.");
                      setPublicToken(null)
                    }).catch((err) => {
                      toast.error("Share error happened, try again later!")
                    })
                  }

                }}>
                  <option value="none">Restricted</option>
                  <option value="view">Anyone with the link</option>
                </select>
                <span className="text-xs block ml-1 mt-3">Only people with access can open with the link</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 justify-between">
            <button
              type="button"
              onClick={() => {
                if (publicToken != null) {
                  navigator.clipboard.writeText(`${window.location.origin}/dashboard/shared/public/${publicToken}`).then(() => {
                    toast.success('Link copied to clipboard!');
                  }).catch(() => {
                    toast.error('Failed to copy link to clipboard');
                  });
                }
              }}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Copy Link
            </button>
            <button
              type="submit"
              disabled={collectedEmails.length == 0 || isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  Done
                </>
              )}
            </button>
          </div>
        </form>
      </div>
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

  const [showShareModal, setShowShareModal] = useState(false);
  const [inshareItem, setInshareItem] = useState(null);

  // Function to handle dropdown menu
  const handleDropdownClick = (itemId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    const menuWidth = 192;
    const menuHeight = 120;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = rect.right - menuWidth;
    if (x < 8) {
      x = rect.left;
    }
    if (x + menuWidth > viewportWidth - 8) {
      x = viewportWidth - menuWidth - 8;
    }

    let y = rect.bottom + 4;
    if (y + menuHeight > viewportHeight - 8) {
      y = rect.top - menuHeight - 4;
    }

    setDropdownPosition({
      x: Math.max(8, x),
      y: Math.max(8, y),
    });
    setActiveDropdown(activeDropdown === itemId ? null : itemId);
  };

  const handleShare = (item: DisplayItem) => {
    setInshareItem(item);
    setShowShareModal(true)

    console.log('Share item:', item);
  };

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
    setActiveDropdown(null);
  }

  const handleStar = async (item: DisplayItem) => {
    console.log('Toggle star for item:', item);
    try {
      if (item.type === 'file') {
        await session.post(`cdn/files/${item.id}/star/`);
      } else {
        // await session.post(`cdn/folders/${item.id}/star/`);
        toast('Folder starring is coming soon!')
        return;
      }
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
      try {
        if (item.type === 'file') {
          await session.delete(`cdn/files/${item.id}/`);
        } else {
          await session.delete(`cdn/folders/${item.id}/`);
        }
        fetchData();
        toast.success(`Successfully deleted "${item.name}"`);
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Failed to delete item');
      }
    setActiveDropdown(null);
  };

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

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
        is_starred: false // No backend support yet
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
          onCopyCDN={() => {
            const item = displayItems.find(i => i.id === activeDropdown);
            if (item) handleCopyCDNUrl(item);
          }}
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

      <ShareModal
        item={inshareItem!}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onSubmit={() => {}}
        isLoading={false}
      />
    </div>
  );
};

export default MyCDN;