import { useEffect, useState } from "react";
import { FiImage, FiFileText, FiFolder, FiBarChart } from "react-icons/fi";
import session from "../consts";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Shared = () => {
    const [sharedItems, setSharedItems] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        session.get('cdn/shares/').then((res) => {
            setSharedItems(res.data.results)
        }).catch((err) => {
            toast.error("Failed to fetch shares!")
        })
    }, [])

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Shared with Me
          </h1>
          <p className="text-gray-600">
            Files and folders others have shared with you or by you
          </p>
        </div>
        <div className="flex gap-3">
          <Link to='/dashboard/my-cdn' className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
            Share Files
          </Link>
        </div>
      </div>

      {/* Loading State */}
      {!sharedItems && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto 
mb-4"></div>
            <p className="text-emerald-600">Loading recent files...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {sharedItems && sharedItems.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FiFolder size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Shares yet</h3>
            <p className="text-gray-600">You share or somebody share to you.</p>
          </div>
        </div>
      )}

      {/* Activity List */}
      {sharedItems && sharedItems.length > 0 && (

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sharedItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-green-300 transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 shrink-0 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-green-700">
                    <img src={item.owner_detail.profile_picture} className="rounded-full" />
                  </span>
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {item.resource_detail.filename || item.resource_detail.name}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">
                    by {item.owner_detail.full_name}
                  </p>
                </div>
              </div>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium" onClick={() => {
                // session.get(`cdn/shares/${item.id}/`)
                if (item.resource_detail.files_count) {
                    navigate(`/dashboard/my-cdn/${item.resource_detail.id}`)
                } else {
                    session.get(`cdn/files/${item.resource_detail.id}`).then((res) => {
                      window.location.href = res.data.cdn_url
                    })
                }
              }}>
                Open
              </button>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>{item.resource_detail.files_count && `${item.resource_detail.files_count} files` || 'File'}</span>
              <span>Shared {item.shared}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
              <button
                className="flex-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                onClick={() => {
                    toast("Download option is coming soon!")
                }}
              >
                Download
              </button>
              <button
                className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium"
                onClick={() => {
                    if (item.resource_detail.files_count) {
                        const fullUrl = `${window.location.origin}/dashboard/my-cdn/${item.resource_detail.id}`;
                        navigator.clipboard.writeText(fullUrl)
                        .then(() => {
                            toast('Link has been copied successfully.');
                        })
                        .catch((err) => {
                            toast('Failed to copy the link!');
                        });
                    } else {
                        session.get(`cdn/files/${item.resource_detail.id}`).then((res) => {
                            navigator.clipboard.writeText(res.data.cdn_url)
                            .then(() => {
                                toast('Link has been copied successfully.');
                            })
                            .catch((err) => {
                                toast('Failed to copy the link!');
                            });
                        })
                    }
                }}
              >
                Copy Link
              </button>
            </div>
          </div>
        ))}
      </div>)}
    </div>
  );
};

export default Shared;
