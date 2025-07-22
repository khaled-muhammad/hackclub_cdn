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
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import './Dashboard.css';
import session from "../consts";

const Dashboard = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeTab, setActiveTab] = useState("recent");
  const [viewMode, setViewMode] = useState("list"); // "list" or "grid"
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement your search logic here
      console.log("Searching for:", searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    searchRef.current?.focus();
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

  const getTabContent = () => {
    switch (activeTab) {
      case "mycdn":
        const files = [
          { 
            name: "Marketing Assets", 
            type: "folder", 
            owner: "You", 
            modified: "Oct 15, 2024", 
            size: "—",
            icon: <FiFolder size={24} />,
            color: "blue"
          },
          { 
            name: "Client Projects", 
            type: "folder", 
            owner: "You", 
            modified: "Oct 14, 2024", 
            size: "—",
            icon: <FiFolder size={24} />,
            color: "blue"
          },
          { 
            name: "presentation-final.pdf", 
            type: "file", 
            owner: "You", 
            modified: "Oct 13, 2024", 
            size: "4.2 MB",
            icon: <FiFileText size={24} />,
            color: "red"
          },
          { 
            name: "brand-guidelines.pdf", 
            type: "file", 
            owner: "Sarah Johnson", 
            modified: "Oct 12, 2024", 
            size: "8.7 MB",
            icon: <FiFileText size={24} />,
            color: "red"
          },
          { 
            name: "hero-image.png", 
            type: "file", 
            owner: "You", 
            modified: "Oct 11, 2024", 
            size: "2.1 MB",
            icon: <FiImage size={24} />,
            color: "green"
          },
          { 
            name: "product-demo.mp4", 
            type: "file", 
            owner: "Michael Chen", 
            modified: "Oct 10, 2024", 
            size: "45.8 MB",
            icon: <FiVideo size={24} />,
            color: "purple"
          },
          { 
            name: "logo-variations.zip", 
            type: "file", 
            owner: "You", 
            modified: "Oct 9, 2024", 
            size: "12.3 MB",
            icon: <FiArchive size={24} />,
            color: "orange"
          },
          { 
            name: "Shared Documents", 
            type: "folder", 
            owner: "Team", 
            modified: "Oct 8, 2024", 
            size: "—",
            icon: <FiFolder size={24} />,
            color: "blue"
          },
          { 
            name: "analytics-report.xlsx", 
            type: "file", 
            owner: "Emma Davis", 
            modified: "Oct 7, 2024", 
            size: "1.8 MB",
            icon: <FiFileText size={24} />,
            color: "green"
          },
          { 
            name: "wireframes.sketch", 
            type: "file", 
            owner: "You", 
            modified: "Oct 6, 2024", 
            size: "5.4 MB",
            icon: <FiPenTool size={24} />,
            color: "pink"
          }
        ];

        return (
          <div className="h-full flex flex-col">
            {/* Cleaner Header */}
            <div className="p-6 mb-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
                  <button className="hover:text-green-600 transition-colors">My CDN</button>
                  <FiChevronDown className="text-gray-400 rotate-270" size={20} />
                  <button className="hover:text-green-600 transition-colors">Documents</button>
                  <FiChevronDown className="text-gray-400 rotate-270" size={20} />
                  <span className="text-gray-500">Project Files</span>
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
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
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
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
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
              {viewMode === "list" ? (
                /* Cleaner List View */
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  {/* Table header */}
                  <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
                    <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
                      <div className="col-span-6 flex items-center gap-3">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                        Name
                      </div>
                      <div className="col-span-2">Owner</div>
                      <div className="col-span-2">Last modified</div>
                      <div className="col-span-1">Size</div>
                      <div className="col-span-1"></div>
                    </div>
                  </div>

                  {/* File/folder rows */}
                  <div className="divide-y divide-gray-100">
                    {files.map((item, index) => (
                      <div key={index} className="px-6 py-3 hover:bg-gray-50 transition-colors group cursor-pointer">
                        <div className="grid grid-cols-12 gap-4 items-center">
                          {/* Name column */}
                          <div className="col-span-6 flex items-center gap-4">
                            <input type="checkbox" className="rounded-md border-gray-300 text-green-600 focus:ring-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className={`w-8 h-8 bg-${item.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                              <span className={`text-${item.color}-600`}>{item.icon}</span>
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
                              {item.owner === "You" ? (
                                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-semibold text-green-700">
                                    {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                                  </span>
                                </div>
                              ) : (
                                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-semibold text-gray-700">
                                    {item.owner.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                              )}
                              <span className="text-sm text-gray-700 truncate">{item.owner}</span>
                            </div>
                          </div>
                          
                          {/* Modified column */}
                          <div className="col-span-2">
                            <span className="text-sm text-gray-600">{item.modified}</span>
                          </div>
                          
                          {/* Size column */}
                          <div className="col-span-1">
                            <span className="text-sm text-gray-600">{item.size}</span>
                          </div>
                          
                          {/* Actions column */}
                          <div className="col-span-1 flex justify-end">
                            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
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
                  {files.map((item, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-green-300 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group relative">
                      {/* Checkbox - appears on hover */}
                      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                      </div>
                      
                      {/* Actions menu - appears on hover */}
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>

                      {/* File icon */}
                      <div className="flex justify-center mb-3">
                        <div className={`w-16 h-16 bg-${item.color}-100 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform`}>
                          <span className={`text-${item.color}-600 text-3xl`}>{item.icon}</span>
                        </div>
                      </div>

                      {/* File name */}
                      <div className="text-center">
                        <h3 className="font-medium text-gray-800 text-sm mb-1 truncate group-hover:text-green-600 transition-colors" title={item.name}>
                          {item.name}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case "recent":
        return (
          <div className="h-full flex flex-col">
            {/* Modern Header */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-6 mb-6 border border-emerald-100">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">Recent Activity</h1>
                  <p className="text-emerald-700 font-medium">Your recently accessed and modified files</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300">
                    Last 7 days
                  </button>
                  <button className="px-4 py-2.5 text-emerald-700 bg-white/70 backdrop-blur-sm border-2 border-emerald-200 hover:bg-white hover:shadow-md rounded-xl font-semibold transition-all duration-300">
                    Last 30 days
                  </button>
                </div>
              </div>
            </div>

            {/* Activity List */}
            <div className="flex-1 space-y-4">
              {[
                { name: "holiday-photos.zip", action: "uploaded", time: "2 hours ago", size: "156 MB", type: "archive", icon: <FiArchive size={24} /> },
                { name: "project-mockup.figma", action: "modified", time: "4 hours ago", size: "2.8 MB", type: "design", icon: <FiPenTool size={24} /> },
                { name: "presentation-final.pdf", action: "shared", time: "Yesterday", size: "4.2 MB", type: "document", icon: <FiFileText size={24} /> },
                { name: "demo-video.mp4", action: "uploaded", time: "Yesterday", size: "89 MB", type: "video", icon: <FiVideo size={24} /> },
                { name: "client-assets", action: "created folder", time: "2 days ago", size: "12 files", type: "folder", icon: <FiFolder size={24} /> },
                { name: "logo-variations.png", action: "downloaded", time: "3 days ago", size: "1.2 MB", type: "image", icon: <FiImage size={24} /> },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-5 bg-white/80 backdrop-blur-sm border-2 border-emerald-100 rounded-2xl hover:shadow-xl hover:shadow-emerald-500/20 hover:border-emerald-300 hover:-translate-y-1 transition-all duration-300 group">
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 ${
                      item.type === "folder" ? "bg-gradient-to-br from-blue-400 to-blue-500 shadow-blue-500/30" :
                      item.type === "image" ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-500/30" :
                      item.type === "video" ? "bg-gradient-to-br from-purple-400 to-purple-500 shadow-purple-500/30" :
                      item.type === "document" ? "bg-gradient-to-br from-orange-400 to-red-500 shadow-orange-500/30" :
                      item.type === "design" ? "bg-gradient-to-br from-pink-400 to-rose-500 shadow-pink-500/30" : "bg-gradient-to-br from-gray-400 to-gray-500 shadow-gray-500/30"
                    }`}>
                      <span className="text-2xl text-white">
                        {item.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-emerald-600 transition-colors duration-300">{item.name}</h3>
                      <p className="text-emerald-700 font-medium">
                        <span className="capitalize bg-emerald-100 px-2 py-1 rounded-full text-xs font-semibold">{item.action}</span>
                        <span className="mx-2">•</span>
                        <span>{item.time}</span>
                        <span className="mx-2">•</span>
                        <span className="text-gray-600">{item.size}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-3 text-gray-400 hover:text-emerald-600 hover:bg-emerald-100 rounded-xl transition-all duration-300 group-hover:scale-110">
                      <FiStar size={18} />
                    </button>
                    <button className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 group-hover:scale-110">
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "shared":
        return (
          <div className="h-full">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Shared with Me</h1>
                <p className="text-gray-600">Files and folders others have shared with you</p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                  Share Files
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                { name: "Marketing Campaign Assets", owner: "Sarah Johnson", files: 24, shared: "3 days ago", avatar: "SJ", icon: <FiFolder size={24} /> },
                { name: "Q4 Financial Reports", owner: "Michael Chen", files: 8, shared: "1 week ago", avatar: "MC", icon: <FiBarChart size={24} /> },
                { name: "Product Photography", owner: "Emma Davis", files: 156, shared: "2 weeks ago", avatar: "ED", icon: <FiImage size={24} /> },
                { name: "Brand Guidelines 2024", owner: "Alex Rivera", files: 12, shared: "1 month ago", avatar: "AR", icon: <FiFileText size={24} /> },
              ].map((item, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-green-300 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-green-700">{item.avatar}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">by {item.owner}</p>
                      </div>
                    </div>
                    <button className="text-green-600 hover:text-green-700 text-sm font-medium">Open</button>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>{item.files} files</span>
                    <span>Shared {item.shared}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                      Download
                    </button>
                    <button className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                      Copy Link
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "starred":
        return (
          <div className="h-full">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Starred Files</h1>
                <p className="text-gray-600">Your favorite and important files</p>
              </div>
              <div className="text-sm text-gray-500">
                {6} starred items
              </div>
            </div>

            <div className="space-y-4">
              {[
                { name: "Brand Logo Final.svg", type: "image", size: "245 KB", starred: "2 days ago", icon: <FiImage size={20} /> },
                { name: "Client Presentation.pptx", type: "document", size: "8.4 MB", starred: "1 week ago", icon: <FiFileText size={20} /> },
                { name: "Product Demo Video", type: "video", size: "127 MB", starred: "2 weeks ago", icon: <FiVideo size={20} /> },
                { name: "Design System Components", type: "folder", size: "45 files", starred: "3 weeks ago", icon: <FiFolder size={20} /> },
                { name: "API Documentation.pdf", type: "document", size: "2.1 MB", starred: "1 month ago", icon: <FiFileText size={20} /> },
                { name: "User Research Data", type: "folder", size: "23 files", starred: "1 month ago", icon: <FiFolder size={20} /> },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        item.type === "folder" ? "bg-blue-100" :
                        item.type === "image" ? "bg-green-100" :
                        item.type === "video" ? "bg-purple-100" : "bg-orange-100"
                      }`}>
                        <span className="text-xl text-gray-700">
                          {item.icon}
                        </span>
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                        <FiStar size={12} className="text-white fill-current" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        {item.size} • Starred {item.starred}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 rounded-lg transition-colors">
                      <FiStar size={16} className="fill-current" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "trash":
        return (
          <div className="h-full">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Trash</h1>
                <p className="text-gray-600">Files will be permanently deleted after 30 days</p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                  Empty Trash
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { name: "old-project-files.zip", size: "45 MB", deleted: "2 days ago", expires: "28 days", type: "archive", icon: <FiArchive size={20} /> },
                { name: "unused-images", type: "folder", size: "23 files", deleted: "5 days ago", expires: "25 days", icon: <FiFolder size={20} /> },
                { name: "draft-presentation.pptx", size: "6.2 MB", deleted: "1 week ago", expires: "23 days", type: "document", icon: <FiFileText size={20} /> },
                { name: "test-data.csv", size: "890 KB", deleted: "2 weeks ago", expires: "16 days", type: "document", icon: <FiFile size={20} /> },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl hover:shadow-md transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center opacity-60">
                      <span className="text-xl text-red-600">
                        {item.icon}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">{item.name}</h3>
                      <p className="text-sm text-red-600">
                        Deleted {item.deleted} • Expires in {item.expires}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium">
                      Restore
                    </button>
                    <button className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium">
                      Delete Forever
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty state for when trash is empty */}
            <div className="text-center py-12 opacity-50">
              <FiTrash2 size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Trash is empty</h3>
              <p className="text-gray-500">Deleted files will appear here</p>
            </div>
          </div>
        );

      default:
        return <div>Select a tab to view content</div>;
    }
  };

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
          <Link to="/" className="flex justify-center items-center gap-4">
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
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
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
                      {/* Add your search results here */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 text-sm"><FiFileText /></span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              document.pdf
                            </p>
                            <p className="text-xs text-gray-500">
                              Modified 2 hours ago
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 text-sm"><FiImage /></span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              image.jpg
                            </p>
                            <p className="text-xs text-gray-500">
                              Modified yesterday
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                      <div className="px-4 py-3">
                        <p className="text-sm text-gray-500 mb-3">
                          Quick actions
                        </p>
                        <div className="space-y-1">
                          <button className="w-full flex items-center gap-3 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                            <span className="text-lg text-green-600"><FiFolder /></span>
                            <span className="text-sm text-gray-700">
                              Browse all files
                            </span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                            <span className="text-lg text-green-600"><FiUpload /></span>
                            <span className="text-sm text-gray-700">
                              Upload new file
                            </span>
                          </button>
                          <button className="w-full flex items-center gap-3 p-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
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
          <button className="green-glow-btn cursor-pointer w-full">
            <span className="flex gap-3 justify-start items-center">
              <FiUpload /> Upload
            </span>
          </button>
          <button className="green-glow-btn cursor-pointer w-full">
            <span className="flex gap-3 justify-start items-center">
              <FiFolderPlus /> New Folder
            </span>
          </button>
        </div>
        <div className="tab-switcher">
            <div className={`tab-nav-item ${activeTab === "mycdn" ? "active" : ""}`} onClick={() => setActiveTab("mycdn")}>
                <span className="text">
                    <FiHardDrive size={22} />
                    My CDN
                </span>
            </div>
            <div className={`tab-nav-item ${activeTab === "recent" ? "active" : ""}`} onClick={() => setActiveTab("recent")}>
                <span className="text">
                    <FiClock size={22} />
                    Recent
                </span>
            </div>
            <div className={`tab-nav-item ${activeTab === "shared" ? "active" : ""}`} onClick={() => setActiveTab("shared")}>
                <span className="text">
                    <FiUsers size={22} />
                    Shared with me
                </span>
            </div>
            <div className={`tab-nav-item ${activeTab === "starred" ? "active" : ""}`} onClick={() => setActiveTab("starred")}>
                <span className="text">
                    <FiStar size={22} />
                    Starred
                </span>
            </div>
            <div className={`tab-nav-item ${activeTab === "trash" ? "active" : ""}`} onClick={() => setActiveTab("trash")}>
                <span className="text">
                    <FiTrash2 size={22} />
                    Trash
                </span>
            </div>
        </div>
        <div className="stats p-5 mx-5 rounded-t-3xl bg-gradient-to-tl from-[#6bbf95] to-[#3e9478] flex flex-col gap-4">
            {[
                {
                    text: "Photos (60% of the content)",
                    progress: 60,
                },
                {
                    text: "Videos (40% of the content)",
                    progress: 40,
                },
            ].map((statItem) => <div>
                <div className="w-full bg-green-100 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-[#6bbf95] h-full rounded-full transition-all duration-300" style={{width: `${statItem.progress}%`,}}></div>
                </div>
                <p className="text-xs text-center text-white mt-1">{statItem.text}</p>
            </div>)}
            <div className="cdn-count self-center bg-white rounded-full px-3 font-medium text-sm">
                600 Item
            </div>
        </div>
      </aside>
      <main className="bg-white rounded-t-4xl p-6 me-[1.5rem] overflow-y-auto scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-green-100 hover:scrollbar-thumb-green-500" style={{ 
          gridArea: "main",
          scrollbarWidth: "thin",
          scrollbarColor: "#6bbf95 transparent"
        }}>
          {getTabContent()}
      </main>
    </div>
  );
};

export default Dashboard;
