import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa";
import { BsTrash, BsPencil, BsCheck } from "react-icons/bs"; // Import BsCheck

import { useNavigate, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { FaPaperPlane } from "react-icons/fa";
import CommentItem from "./commentItem";
import { BsThreeDotsVertical } from "react-icons/bs";
import * as jwtDecode from "jwt-decode";
import EditablePost from "./editablePost";

const PostsFeed = (IsFollowingUser) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({}); // Store comments for each post
  const navigate = useNavigate();
  const location = useLocation();
  const [commentText, setCommentText] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [accountRestricted, setAccountRestricted] = useState("");
  const [likes, setLikes] = useState(
    posts.reactions ? posts.reactions.length : 0
  );

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/login");
          return;
        }
        const decodedToken = jwtDecode.jwtDecode(token);
        setCurrentUserId(decodedToken.id);
        let response;

        if (location.pathname === "/dashboard") {
          response = await axios.get("http://localhost:3000/post/all-posts", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else if (location.pathname === "/profile") {
          response = await axios.get("http://localhost:3000/post/user-posts", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } else if (location.pathname.startsWith("/profile/")) {
          console.log("in this");
          const userId = location.pathname.split("/")[2]; // Extract username from URL

          const userAccountType = await axios.get(
            `http://localhost:3000/user/account-type/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("AccountType:", userAccountType.data);
          if (userAccountType.data === "private") {
            const followStatusResponse = await axios.get(
              `http://localhost:3000/user/is-following/${userId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            console.log("Follow Status", followStatusResponse.data);

            if (followStatusResponse.data === true) {
              response = await axios.get(
                `http://localhost:3000/post/user/${userId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              console.log("Posts:", response.data);
              setPosts(response.data);
            } else {
              setLoading(false);
              setAccountRestricted(true);
              return;
            }
          }

          if (userAccountType.data === "public") {
            response = await axios.get(
              `http://localhost:3000/post/user/${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          }
        }

        console.log("All Posts:", response.data);
        setPosts(response.data);
      } catch (error) {
        console.error("Error in fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [navigate, location.pathname]);

  const handleLike = async (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              reactions: post.reactions.includes(currentUserId)
                ? post.reactions.filter((userId) => userId !== currentUserId) // Remove like
                : [...post.reactions, currentUserId], // Add like
            }
          : post
      )
    );
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.post(
        `http://localhost:3000/post-reaction/react/${postId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Post Reaction:", response);
    } catch (error) {
      console.error("Error saving reaction:", error);
    }
  };

  const handleCommentSubmit = async (postId) => {
    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem("accessToken");
      console.log("comment:", commentText);
      console.log("PostId:", postId);

      // Data to send to the backend
      const Data = {
        content: commentText,
      };

      // Send the comment to the backend
      const response = await axios.post(
        `http://localhost:3000/post-comment/${postId}/comment`,
        Data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Comment Response:", response.data.user.profilePic);

      // Update the UI with the new comment
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [
                  ...post.comments,
                  {
                    id: response.data.id, // Use the comment ID from the response
                    content: commentText,
                    user: {
                      id: response.data.user.id, // Use the current user's ID
                      username: response.data.user.username, // Replace with actual username if available
                      profilePic: response.data.user.profilePic.startsWith(
                        "http"
                      )
                        ? response.data.user.profilePic
                        : `http://localhost:3000${response.data.user.profilePic}`,
                    },
                  },
                ],
              }
            : post
        )
      );
      // Clear the comment input
      setCommentText("");

      // alert("Comment posted successfully!");
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment");
    }
  };
  // Callback function to handle comment deletion
  const handleDeleteComment = (deletedCommentId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => ({
        ...post,
        comments: post.comments.filter(
          (comment) => comment.id !== deletedCommentId
        ),
      }))
    );
  };

  const handleEditComment = (editedCommentId, newContent) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => ({
        ...post,
        comments: post.comments.map((comment) =>
          comment.id === editedCommentId
            ? { ...comment, content: newContent }
            : comment
        ),
      }))
    );
  };

  //Edit post
  const handleEditPost = async (postId, newContent) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.put(
        `http://localhost:3000/post/edit/${postId}`,
        { content: newContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, content: newContent } : post
        )
      );

      // alert("Post updated successfully!");
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post");
    }
  };

  // Function to handle post deletion
  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.delete(
        `http://localhost:3000/post/delete/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      // alert("Post deleted successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      {loading ? (
        <p className="text-center text-gray-500">Loading posts...</p>
      ) : accountRestricted ? (
        <p className="text-center text-gray-500">This account is Private.</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available.</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="bg-white shadow-md rounded-lg overflow-hidden mb-6 transition-transform transform"
          >
            {/* Post Header */}
            <div className="flex items-center p-4 border-b">
              <img
                src={
                  post.user?.profilePic
                    ? `http://localhost:3000${post.user.profilePic}`
                    : "/profile-placeholder.jpg"
                }
                alt="Profile"
                className="h-12 w-12 rounded-full border-2 border-gray-300"
              />
              <div className="ml-3">
                <p className="font-semibold text-gray-900">
                  {post.user?.username || "Unknown User"}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(post.createdAt).toDateString()}
                </p>
              </div>
              {/* Delete & Eidit Button (only for own posts) */}
              {post.user?.id === currentUserId && (
                <div className="ml-auto flex space-x-2">
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-black-500 hover:text-red-700 cursor-pointer"
                  >
                    <BsTrash size={18} /> {/* Delete icon */}
                  </button>
                </div>
              )}
            </div>

            {/* Post Media */}
            {post.media?.length > 0 && (
              <Swiper
                modules={[Navigation]}
                navigation
                className="w-full h-72 rounded-md overflow-hidden"
              >
                {post.media.map((item) => (
                  <SwiperSlide key={item.id}>
                    <img
                      src={`http://localhost:3000${item.mediaUrl}`}
                      alt="Post Media"
                      className=" w-full h-full object-contain"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            )}

            {/* Reactions & Actions */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center space-x-4">
                <p>{post.reactions ? post.reactions.length : 0} Likes</p>
                <button
                  onClick={() => handleLike(post.id)}
                  className="focus:outline-none"
                >
                  {post.liked ? (
                    <FaHeart className="text-red-500 text-2xl cursor-pointer transition-transform transform hover:scale-110" />
                  ) : (
                    <FaRegHeart className="text-gray-600 text-2xl cursor-pointer transition-transform transform hover:scale-110" />
                  )}
                </button>
                <FaComment className="text-gray-600 text-2xl cursor-pointer transition-transform transform hover:scale-110" />
              </div>
            </div>

            {/* Post Caption */}
            <div className="">
              <div className="px-4 ">
                {post.content && (
                  <EditablePost
                    currentUser={currentUserId}
                    post={post}
                    onSave={handleEditPost}
                  />
                )}
              </div>
            </div>

            {/* Comment Input */}
            <div className="flex items-center p-2 space-x-2 mt-4 ">
              <input
                type="text"
                placeholder="Write a comment..."
                className="flex-1 p-2 border rounded-lg outline-none"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                onClick={() => handleCommentSubmit(post.id)}
              >
                <FaPaperPlane />
              </button>
            </div>

            {/* Comments Section */}
            <div className="px-4 pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Comments:</h3>
              {post.comments?.length > 0 ? (
                post.comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    post={post}
                    comment={comment}
                    currentUser={currentUserId}
                    onEditComment={handleEditComment}
                    onDeleteComment={handleDeleteComment} // Pass the callback
                  />
                ))
              ) : (
                <p className="text-gray-500">No comments yet.</p>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default PostsFeed;
