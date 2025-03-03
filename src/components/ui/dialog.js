export function Dialog({ title, description, onConfirm, onCancel }) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-black">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <p>{description}</p>
          <div className="mt-4 flex justify-end space-x-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  }