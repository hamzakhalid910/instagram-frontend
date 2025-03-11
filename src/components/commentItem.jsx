import React, { useState } from "react";
import { BsTrash, BsPencil, BsCheck } from "react-icons/bs"; // Import BsCheck
import axios from "axios";

const CommentItem = ({
  post,
  comment,
  currentUser,
  onDeleteComment,
  onEditComment,
}) => {
  const [isEditing, setIsEditing] = useState(false); // State for edit mode
  const [editedCommentText, setEditedCommentText] = useState(comment.content); // State for edited comment text
  const isOwnComment = comment.user?.id === currentUser;
  const isOwnPost = post.user.id === currentUser;

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("accessToken");
      console.log("Comment ID:", commentId);
      const response = await axios.delete(
        `http://localhost:3000/post-comment/delete-comment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response:", response);

      // alert("Comment deleted successfully!");
      onDeleteComment(commentId);
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment");
    }
  };

  const handleEditComment = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.patch(
        `http://localhost:3000/post-comment/edit/${comment.id}`,
        { content: editedCommentText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response:", response);

      // alert("Comment updated successfully!");
      setIsEditing(false); // Exit edit mode
      onEditComment(comment.id, editedCommentText);
    } catch (error) {
      console.error("Error updating comment:", error);
      alert("Failed to update comment");
    }
  };

  return (
    <div key={comment.id} className="mb-2 relative">
      <div className="flex items-center space-x-2">
        <img
          src={
            comment.user?.profilePic
              ? `http://localhost:3000${comment.user.profilePic}`
              : "/profile-placeholder.jpg"
          }
          alt="Profile"
          className="h-8 w-8 rounded-full border-2 border-gray-300"
        />
        <div className="flex-1">
          <p className="font-semibold text-gray-900">
            {comment.user?.username || "Unknown User"}
          </p>

          {/* Edit Mode: Show input field */}
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={editedCommentText}
                onChange={(e) => setEditedCommentText(e.target.value)}
                className="flex-1 p-1 border rounded"
              />
              <button
                onClick={handleEditComment}
                className="text-green-500 hover:text-green-700 cursor-pointer"
              >
                <BsCheck size={32} color="black" /> {/* Save icon */}
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-600">{comment.content}</p>
          )}
        </div>

        {/* Edit and Delete Buttons (only for own comments) */}
        {isOwnComment && (
          <div className="flex items-center space-x-2">
            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(true)}
              className="text-gray-500 hover:text-blue-500 cursor-pointer"
            >
              <BsPencil size={18} /> {/* Edit icon */}
            </button>

            {/* Delete Button */}
            <button
              onClick={() => handleDeleteComment(comment.id)}
              className="text-gray-500 hover:text-red-500 cursor-pointer"
            >
              <BsTrash size={18} /> {/* Delete icon */}
            </button>
          </div>
        )}

        {/* Delete Button for Post Owner */}
        {!isOwnComment && isOwnPost && (
          <button
            onClick={() => handleDeleteComment(comment.id)}
            className="text-gray-500 hover:text-red-500 cursor-pointer"
          >
            <BsTrash size={18} /> {/* Delete icon */}
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
