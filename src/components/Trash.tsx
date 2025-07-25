import { useEffect, useState } from "react";
import {
  FiArchive,
  FiFolder,
  FiFileText,
  FiFile,
  FiTrash2,
} from "react-icons/fi";
import session from "../consts";
import { toast } from "react-toastify";
import { formatDate, getRemainingDays } from "../utils";

const Trash = () => {
  const [trashItems, setTrashItems] = useState(null);

  const update = () => {
    session.get('cdn/trash/').then((res) => {
      setTrashItems(res.data.results);
    }).catch((err) => {
      toast.error("Failed to fetch your trash.")
    })
  }
  
  useEffect(() => {
    update();
  }, [])

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trash</h1>
          <p className="text-gray-600">
            Files will be permanently deleted after 30 days
          </p>
        </div>
        <div className="flex gap-3">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            onClick={() => {
              if (window.confirm(`Are you sure you want to clear your trash? This action cannot be undone.`)) {
                session.post('cdn/trash/empty/').then((res) => {
                  toast(res.data.message)
                  update();
                }).catch(() => {
                  toast.error("Failed to empty your trash")
                })
              }
            }}
          >
            Empty Trash
          </button>
        </div>
      </div>

      <div className="space-y-4">

        {!trashItems && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"
              ></div>
              <p className="text-emerald-600">Loading Trash items...</p>
            </div>
          </div>
        )}

        {trashItems && trashItems.map((item, index) => {
          return <div
            key={index}
            className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center opacity-60">
                <span className="text-xl text-red-600">{item.resource_type == 'file'? <FiFile size={24} /> : <FiFolder size={24} />}</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">{item.original_name}</h3>
                <p className="text-sm text-red-600">
                  Deleted {formatDate(item.deleted_at)} • Expires in {getRemainingDays(item.permanent_delete_at)} days
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                onClick={() => {
                  session.post(`cdn/trash/${item.id}/restore/`).then((res) => {
                    update();
                    toast(res.data.message)
                  }).catch((err) => {
                    toast.error("Failed to restore item, please, try again later.")
                  })
                }}
              >
                Restore
              </button>
              <button
                className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                onClick={() => {
                  if (window.confirm(`Are you sure you want to delete this item forever? This action cannot be undone.`)) {
                    session.delete(`cdn/trash/${item.id}/`).then((res) => {
                      update();
                      toast("Item deleted successfully")
                    }).catch((err) => {
                      toast.error("Failed to delete this item, try again later.")
                    })
                  }
                }}
              >
                Delete Forever
              </button>
            </div>
          </div>
        })}
      </div>

      {trashItems && trashItems.length == 0 && <div className="text-center py-12 opacity-50">
        <FiTrash2 size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Trash is empty
        </h3>
        <p className="text-gray-500">Deleted files will appear here</p>
      </div>}
    </div>
  );
};

export default Trash;
