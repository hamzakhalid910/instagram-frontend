import { useState } from "react";

const EditablePost = ({ post, onSave, currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const isOwnPost = post.user.id === currentUser;

  const handleSave = () => {
    onSave(post.id, editedContent);
    setIsEditing(false);
  };

  return (
    <div className="pb-4 bg-white rounded-lg flex flex justify-between items-center">
      {isEditing ? (
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
        />
      ) : (
        <p className="text-gray-900 text-base">{post.content}</p>
      )}

      {isEditing ? (
        <div className="flex space-x-3 mt-3">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      ) : (
        isOwnPost && (
          <button
            onClick={() => setIsEditing(true)}
            className="mt-3 text-blue-600 font-medium hover:text-blue-700 transition"
          >
            Edit
          </button>
        )
      )}
    </div>
  );
};

export default EditablePost;
