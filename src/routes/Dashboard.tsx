import { useState, useRef, useEffect } from "react";
import {
  FiUser,
  FiSettings,
  FiLogOut,
  FiSearch,
  FiX,
  FiUpload,
  FiFolderPlus,
  FiClock,
  FiHardDrive,
  FiUsers,
  FiStar,
  FiTrash2,
  FiChevronDown,
  FiFolder,
  FiFile,
  FiFileText,
  FiImage,
  FiVideo,
  FiArchive,
  FiBarChart,
  FiPenTool,
} from "react-icons/fi";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useUploadWrapper } from "../components/UploadWrapper";
import session from "../consts";
import { toast } from 'react-toastify';

import './Dashboard.css';
import { NavLink } from "react-router-dom";
import { summarizeStats } from "../types";
import { formatDate } from "../utils";
import type { ApiResponse, DisplayItem } from "../components/MyCDN";

// New Folder Modal Component
const NewFolderModal = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  isLoading = false 
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (folderName: string) => void;
  isLoading?: boolean;
}) => {
  const [folderName, setFolderName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFolderName("");
      // Focus input after modal animation
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      onSubmit(folderName.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
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
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">New Folder</h2>
          <p className="text-sm text-gray-600 mt-1">Create a new folder to organize your files</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label htmlFor="folderName" className="block text-sm font-medium text-gray-700 mb-2">
              Folder Name
            </label>
            <input
              ref={inputRef}
              id="folderName"
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter folder name..."
              disabled={isLoading}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              maxLength={255}
            />
            <p className="text-xs text-gray-500 mt-1">{folderName.length}/255 characters</p>
          </div>
          
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!folderName.trim() || isLoading}
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
                  <FiFolderPlus className="w-4 h-4" />
                  Create Folder
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
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

const Dashboard = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchResults, setSearchResults] = useState(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [storageByType, setStorageByType] = useState(null);

  const getCurrentFolderId = (): string | null => {
    const path = location.pathname;
    const mycdnMatch = path.match(/\/my-cdn\/([a-f0-9\-]{36})/i);
    return mycdnMatch ? mycdnMatch[1] : null;
  };

  const fetchRootFolderId = async (): Promise<string> => {
    try {
      const response = await session.get('/cdn/folders/root/');
      return response.data.root_folder.id;
    } catch (error) {
      throw new Error(`Failed to fetch root folder: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const createFolder = async (folderName: string) => {
    try {
      setIsCreatingFolder(true);
      let parentFolderId = getCurrentFolderId();
      
      if (!parentFolderId) {
        parentFolderId = await fetchRootFolderId();
      }
      
      const payload = {
        name: folderName,
        parent: parentFolderId
      };

      console.log('Creating folder with payload:', payload);
      
      const response = await session.post('/cdn/folders/', payload);
      
      toast.success(`Folder "${folderName}" created successfully!`);
      setShowNewFolderModal(false);
      
      // Dispatch custom event to refresh file list
      window.dispatchEvent(new CustomEvent('folderCreated', { 
        detail: { folder: response.data, parentId: parentFolderId } 
      }));
      
      console.log('Created folder:', response.data);
      
    } catch (error: any) {
      console.error('Error creating folder:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to create folder';
      toast.error(errorMessage);
    } finally {
      setIsCreatingFolder(false);
    }
  };

  // Initialize upload wrapper
  const { uploadFiles, notification } = useUploadWrapper({
    onUploadStart: (files) => {
      console.log('Upload started for', files.length, 'files');
    },
    onUploadComplete: (fileId, result) => {
      console.log('File uploaded successfully:', result);
      // Dispatch event to refresh file list
      window.dispatchEvent(new CustomEvent('fileUploaded', { 
        detail: { fileId, result } 
      }));
    },
    onUploadError: (fileId, error) => {
      console.error('Upload failed:', error);
    },
    onAllUploadsComplete: (results) => {
      console.log('All uploads completed:', results);
      // Dispatch event to refresh file list
      window.dispatchEvent(new CustomEvent('allUploadsComplete', { 
        detail: { results } 
      }));
    },
    maxFileSize: 100 * 1024 * 1024, // 100MB
    allowedFileTypes: [], // Allow all file types
    maxConcurrentUploads: 3
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    session.get('cdn/dashboard/').then((res) => {
        setStats(res.data.stats)
        setStorageByType(res.data.storage_by_type)
    })
  }, [])

  const search = () => {
    if (searchQuery.trim()) {
      session.get(`cdn/search/?q=${searchQuery}`).then((res) => {
        setSearchResults(convertToDisplayItems(res.data.results));
      })
      console.log("Searching for:", searchQuery);
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search();
  };

  const clearSearch = () => {
    setSearchQuery("");
    searchRef.current?.focus();
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      uploadFiles(files);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Focus search on Ctrl/Cmd + K
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      // Clear search on Escape
      if (event.key === "Escape" && isSearchFocused) {
        clearSearch();
        searchRef.current?.blur();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSearchFocused]);

  return (
    <div className="grid h-screen overflow-hidden" style={{
      gridTemplateAreas: `
        "header header"
        "sidebar main"
      `,
      gridTemplateRows: "auto 1fr",
      gridTemplateColumns: "250px 1fr"
    }}>
      <header style={{ gridArea: "header" }}>
        <nav className="z-10 flex justify-between items-center px-[1.5rem] py-[2rem]">
          <Link to="/dashboard" className="flex justify-center items-center gap-4">
            <img
              src="https://camo.githubusercontent.com/b49b9311b30b33b5c18db8c62b26052414f6b5b875dec629ee8684f6af3e68d4/68747470733a2f2f66696c65732e636174626f782e6d6f652f65337261766b2e706e67"
              alt="HackClub CDN"
              width={100}
            />
            <span className="text-xl font-bold text-[#3e9478] inter">
              Hack Club CDN
            </span>
          </Link>

          {/* Beautiful Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative group">
              <div
                className={`relative transition-all duration-300 rounded-3xl ${
                  isSearchFocused
                    ? "transform scale-105 shadow-lg shadow-green-500/20"
                    : "shadow-md"
                }`}
              >
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch
                    className={`h-5 w-5 transition-colors duration-200 ${
                      isSearchFocused ? "text-green-500" : "text-gray-400"
                    }`}
                  />
                </div>

                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    search()
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                  placeholder="Search files, folders, or anything..."
                  className={`
                    w-full pl-12 pr-20 py-4 text-gray-900 placeholder-gray-500
                    bg-white/80 backdrop-blur-sm
                    border-2 rounded-2xl
                    transition-all duration-300 ease-out
                    focus:outline-none focus:ring-0
                    ${
                      isSearchFocused
                        ? "border-green-500 bg-white shadow-inner"
                        : "border-gray-200 hover:border-gray-300"
                    }
                  `}
                />

                {/* Search Actions */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 space-x-2">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  )}

                  <div className="flex items-center space-x-1 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                    <span>⌘</span>
                    <span>K</span>
                  </div>
                </div>
              </div>

              {/* Search Suggestions/Results Dropdown */}
              {isSearchFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
                  {searchQuery ? (
                    <div className="px-4 py-2">
                      <p className="text-sm text-gray-500 mb-2">
                        Search results for "{searchQuery}"
                      </p>
                      <div className="space-y-2">
                        {searchResults ? searchResults.map((res) => <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() => {
                            setSearchQuery('')
                            if (res.type == 'file') {
                                window.open(res.url, '_blank');
                            } else {
                                navigate(`/dashboard/my-cdn/${res.id}`)
                            }
                        }}>
                          <div className={`w-8 h-8 bg-${res.color}-100 rounded-lg flex items-center justify-center`}>
                            <span className={`text-${res.color}-600 text-sm`}>{res.icon}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {res.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Uploaded at {formatDate(res.modified)}
                            </p>
                          </div>
                        </div>) : <span>Searching ...</span>}
                      </div>
                    </div>
                  ) : (
                      <div className="px-4 py-3">
                        <p className="text-sm text-gray-500 mb-3">
                          Quick actions
                        </p>
                        <div className="space-y-1">
                          <button className="w-full flex items-center gap-3 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={() => navigate('/dashboard/my-cdn')}>
                            <span className="text-lg text-green-600"><FiFolder /></span>
                            <span className="text-sm text-gray-700">
                              Browse all files
                            </span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
                          onClick={triggerFileUpload}>
                            <span className="text-lg text-green-600"><FiUpload /></span>
                            <span className="text-sm text-gray-700">
                              Upload new file
                            </span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors" onClick={() => {
                            navigate('/dashboard')
                          }}>
                            <span className="text-lg text-green-600"><FiBarChart /></span>
                            <span className="text-sm text-gray-700">
                              View analytics
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>

          {isLoading ? (
            <svg
              className="animate-spin h-4 w-4 text-green-500 inline mr-2"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : isAuthenticated && user ? (
            <div className="relative" ref={dropdownRef}>
              <img
                src={
                  user.image ||
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name || user.email
                  )}&background=3e9478&color=ffffff`
                }
                alt={user.name || user.email}
                className="w-12 h-12 rounded-full object-cover border-2 border-green-400/40 cursor-pointer hover:border-green-500 transition-all duration-200 hover:scale-105"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name || user.email
                  )}&background=3e9478&color=ffffff`;
                }}
              />

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          user.image ||
                          user.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name || user.email
                          )}&background=3e9478&color=ffffff`
                        }
                        alt={user.name || user.email}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name || user.email
                          )}&background=3e9478&color=ffffff`;
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {user.name || "User"}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <a
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#3e9478] transition-colors"
                    >
                      <FiUser className="w-4 h-4" />
                      Dashboard
                    </a>
                    <a
                      href="/settings"
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 hover:text-[#3e9478] transition-colors"
                    >
                      <FiSettings className="w-4 h-4" />
                      Settings
                    </a>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FiLogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="green-glow-btn">
              Login
            </Link>
          )}
        </nav>
      </header>
      <aside className="flex flex-col justify-between overflow-y-auto scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-green-100 hover:scrollbar-thumb-green-500" style={{ 
          gridArea: "sidebar",
          scrollbarWidth: "thin",
          scrollbarColor: "#6bbf95 transparent"
        }}>
        <div className="btn-g flex flex-col gap-5 items-stretch ps-[1.5rem] pe-[1.5rem] mt-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
          <button className="green-glow-btn cursor-pointer w-full" onClick={triggerFileUpload}>
            <span className="flex gap-3 justify-start items-center">
              <FiUpload /> Upload
            </span>
          </button>
          <button 
            className="green-glow-btn cursor-pointer w-full"
            onClick={() => setShowNewFolderModal(true)}
          >
            <span className="flex gap-3 justify-start items-center">
              <FiFolderPlus /> New Folder
            </span>
          </button>
        </div>
        <div className="tab-switcher">
            <NavLink to='my-cdn' className={({ isActive }) => `tab-nav-item ${isActive ? "active" : ""}`}>
                <FiHardDrive size={22} />
                My CDN
            </NavLink>
            <NavLink to='recent' className={({ isActive }) => `tab-nav-item ${isActive ? "active" : ""}`}>
                <FiClock size={22} />
                Recent
            </NavLink>
            <NavLink to='shared' className={({ isActive }) => `tab-nav-item ${isActive ? "active" : ""}`}>
                <FiUsers size={22} />
                Shared with me
            </NavLink>
            <NavLink to='starred' className={({ isActive }) => `tab-nav-item ${isActive ? "active" : ""}`}>
                <FiStar size={22} />
                Starred
            </NavLink>
            <NavLink to='trash' className={({ isActive }) => `tab-nav-item ${isActive ? "active" : ""}`}>
                <FiTrash2 size={22} />
                Trash
            </NavLink>
        </div>
        <div className="stats p-5 mx-5 rounded-t-3xl bg-gradient-to-tl from-[#6bbf95] to-[#3e9478] flex flex-col gap-4">
            {storageByType && stats && <>
                {summarizeStats(storageByType).map((statItem) => <div>
                    <div className="w-full bg-green-100 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-[#6bbf95] h-full rounded-full transition-all duration-300" style={{width: `${statItem.progress}%`,}}></div>
                    </div>
                    <p className="text-xs text-center text-white mt-1">{statItem.text}</p>
                </div>)}
                <div className="cdn-count self-center bg-white rounded-full px-3 font-medium text-sm">
                    {stats.total_files} Files
                </div>
            </>}
        </div>
      </aside>
      <main className="bg-white rounded-t-4xl p-6 me-[1.5rem] overflow-y-auto scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-green-100 hover:scrollbar-thumb-green-500" style={{ 
          gridArea: "main",
          scrollbarWidth: "thin",
          scrollbarColor: "#6bbf95 transparent"
        }}>
          <Outlet />
      </main>
      
      {/* Upload notification */}
      {notification}

      {/* New Folder Modal */}
      <NewFolderModal
        isOpen={showNewFolderModal}
        onClose={() => setShowNewFolderModal(false)}
        onSubmit={createFolder}
        isLoading={isCreatingFolder}
      />
    </div>
  );
};

export default Dashboard;
