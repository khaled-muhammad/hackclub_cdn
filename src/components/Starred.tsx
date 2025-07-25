import { useEffect, useState } from "react";
import {
  FiFolder,
  FiFileText,
  FiTrash2,
  FiStar,
  FiImage,
  FiVideo,
} from "react-icons/fi";
import session from "../consts";
import { toast } from "react-toastify";
import { formatDate, getFileIconAndColor } from "../utils";

const Starred = () => {
  const [starredItems, setStarredItems] = useState(null);

  const update = () => {
    session
      .get("cdn/files/starred")
      .then((res) => {
        setStarredItems(res.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Couldn't fetch starred items!");
      });
  }

  useEffect(() => {
    update();
  }, []);

  const handleDelete = async (item) => {
    console.log('Delete item:', item);
      try {
        await session.delete(`cdn/files/${item.id}/`);
        update();
        toast.success(`Successfully deleted "${item.original_filename}"`);
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('Failed to delete item');
      }
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Starred Files
          </h1>
          <p className="text-gray-600">Your favorite and important files</p>
        </div>
        <div className="text-sm text-gray-500">{starredItems && starredItems.length} starred items</div>
      </div>

      <div className="space-y-4">
        {!starredItems && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"
              ></div>
              <p className="text-emerald-600">Loading recent files...</p>
            </div>
          </div>
        )}

      {starredItems && starredItems.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FiStar size={48} className="mx-auto text-yellow-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No recent activity</h3>
            <p className="text-gray-600">Star some files to see them appear here.</p>
          </div>
        </div>
      )}

        {starredItems && starredItems.map((item) => {
          const fileInfo = getFileIconAndColor(item.file_extension, item.mime_type);

          return <div
            key={item.id}
            className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl hover:shadow-md transition-all duration-300"
            onClick={() => {
              if (item.cdn_url) {
                window.open(item.cdn_url, '_blank');
              }
            }}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    fileInfo.type === "folder"
                      ? "bg-blue-100"
                      : fileInfo.type === "image"
                      ? "bg-green-100"
                      : fileInfo.type === "video"
                      ? "bg-purple-100"
                      : "bg-orange-100"
                  }`}
                >
                  <span className="text-xl text-gray-700">{fileInfo.icon}</span>
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                  <FiStar size={12} className="text-white fill-current" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 truncate overflow-hidden whitespace-nowrap">{item.original_filename}</h3>
                <p className="text-sm text-gray-500">
                  {item.file_size_human} • Starred {formatDate(item.updated_at)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="p-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100 rounded-lg transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  session.post(`cdn/files/${item.id}/star/`).then(() => {
                    update();
                  });
                }}
              >
                <FiStar size={16} className="fill-current" />
              </button>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(item)
                }}
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
})}
      </div>
    </div>
  );
};

export default Starred;
