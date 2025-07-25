import { useEffect, useState } from "react"
import { 
  FiHardDrive, 
  FiFolder, 
  FiFile, 
  FiBarChart, 
  FiClock, 
  FiImage, 
  FiVideo, 
  FiFileText,
  FiArchive,
  FiUpload,
  FiUser,
  FiExternalLink,
  FiTrendingUp
} from "react-icons/fi"
import session from "../consts"
import { summarizeStats } from "../types"
import { formatDate } from "../utils"

interface Stats {
  total_files: number;
  total_folders: number;
  total_size: number;
  total_size_human: string;
}

interface UserDetail {
  id: number;
  username: string;
  email: string;
  full_name: string;
  profile_picture: string;
}

interface ActivityItem {
  id: string;
  user: number;
  user_detail: UserDetail;
  action_type: string;
  resource_type: string;
  resource_id: string | null;
  resource_name: string;
  metadata: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

interface FileItem {
  id: string;
  filename: string;
  original_filename: string;
  folder: string;
  folder_detail: any;
  owner: number;
  owner_detail: UserDetail;
  file_size: number;
  file_size_human: string;
  mime_type: string;
  file_extension: string;
  cdn_url: string;
  created_at: string;
  updated_at: string;
  last_accessed: string;
}

interface StorageByType {
  mime_type: string;
  count: number;
  size: number;
}

interface DashboardData {
  stats: Stats;
  recent_activity: ActivityItem[];
  recent_files: FileItem[];
  storage_by_type: StorageByType[];
}

const DashboardPanel = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    session.get('cdn/dashboard/').then((res) => {
      setData(res.data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <FiImage className="text-blue-500" />;
    if (mimeType.startsWith('video/')) return <FiVideo className="text-purple-500" />;
    if (mimeType.includes('text') || mimeType.includes('document')) return <FiFileText className="text-green-500" />;
    if (mimeType.includes('archive') || mimeType.includes('zip')) return <FiArchive className="text-orange-500" />;
    return <FiFile className="text-gray-500" />;
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'upload': return <FiUpload className="text-green-500" />;
      default: return <FiFile className="text-gray-500" />;
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3e9478]"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  const storageStats = summarizeStats(data.storage_by_type);

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#3e9478] mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your CDN.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FiClock />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-[#3e9478]/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Files</p>
              <p className="text-3xl font-bold text-[#3e9478] mt-2">{data.stats.total_files}</p>
            </div>
            <div className="p-3 bg-[#3e9478]/10 rounded-lg">
              <FiFile className="text-[#3e9478] text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-[#3e9478]/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Folders</p>
              <p className="text-3xl font-bold text-[#3e9478] mt-2">{data.stats.total_folders}</p>
            </div>
            <div className="p-3 bg-[#3e9478]/10 rounded-lg">
              <FiFolder className="text-[#3e9478] text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-[#3e9478]/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Storage Used</p>
              <p className="text-3xl font-bold text-[#3e9478] mt-2">{data.stats.total_size_human}</p>
            </div>
            <div className="p-3 bg-[#3e9478]/10 rounded-lg">
              <FiHardDrive className="text-[#3e9478] text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-[#3e9478]/30 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Growth</p>
              <p className="text-3xl font-bold text-[#3e9478] mt-2">+12%</p>
            </div>
            <div className="p-3 bg-[#3e9478]/10 rounded-lg">
              <FiTrendingUp className="text-[#3e9478] text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Storage Breakdown */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <FiBarChart className="text-[#3e9478]" />
          <h2 className="text-xl font-semibold text-gray-800">Storage Breakdown</h2>
        </div>
        <div className="space-y-4">
          {storageStats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{stat.text}</span>
                <span className="font-medium text-gray-800">{stat.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#3e9478] to-[#6bbf95] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stat.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <FiClock className="text-[#3e9478]" />
            <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {data.recent_activity.slice(0, 10).map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getActionIcon(activity.action_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <img
                      src={activity.user_detail.profile_picture}
                      alt={activity.user_detail.full_name}
                      className="w-6 h-6 rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          activity.user_detail.full_name || activity.user_detail.email
                        )}&background=3e9478&color=ffffff`;
                      }}
                    />
                    <span className="text-sm font-medium text-gray-800">
                      {activity.user_detail.full_name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {activity.action_type} {activity.resource_type}: {activity.resource_name}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(activity.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Files */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <FiFile className="text-[#3e9478]" />
            <h2 className="text-xl font-semibold text-gray-800">Recent Files</h2>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {data.recent_files.slice(0, 8).map((file) => (
              <div key={file.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getFileIcon(file.mime_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {file.original_filename}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{file.file_size_human}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{formatDate(file.created_at)}</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate mt-1">
                    {file.folder_detail.full_path}
                  </p>
                </div>
                <a
                  href={file.cdn_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-200 rounded-lg"
                >
                  <FiExternalLink className="text-gray-500 text-sm" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Storage by Type Details */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <FiBarChart className="text-[#3e9478]" />
          <h2 className="text-xl font-semibold text-gray-800">Storage Details by Type</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.storage_by_type.map((storage, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-[#3e9478]/30 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                {getFileIcon(storage.mime_type)}
                <div>
                  <p className="font-medium text-gray-800 capitalize">
                    {storage.mime_type.split('/')[0]}s
                  </p>
                  <p className="text-sm text-gray-500">{storage.mime_type}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Files:</span>
                  <span className="font-medium">{storage.count}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium">{formatBytes(storage.size)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPanel;