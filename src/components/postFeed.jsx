import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart, FaComment } from "react-icons/fa";

const PostsFeed = () => {
  const [followedUsers, setFollowedUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating dummy data instead of API calls for now
    const dummyPosts = [
      {
        _id: "1",
        user: {
          username: "john_doe",
          profileImage: "https://randomuser.me/api/portraits/men/1.jpg",
        },
        imageUrl: "https://source.unsplash.com/random/400x300",
        caption: "Enjoying the sunset! 🌅",
        liked: false, // To track if the post is liked
      },
      {
        _id: "2",
        user: {
          username: "jane_smith",
          profileImage: "https://randomuser.me/api/portraits/women/2.jpg",
        },
        imageUrl: "https://source.unsplash.com/random/401x300",
        caption: "Morning vibes! ☕",
        liked: false,
      },
      {
        _id: "3",
        user: {
          username: "mike_williams",
          profileImage: "https://randomuser.me/api/portraits/men/3.jpg",
        },
        imageUrl: "https://source.unsplash.com/random/402x300",
        caption: "Weekend getaway 🏖️",
        liked: false,
      },
    ];

    setPosts(dummyPosts);
    setLoading(false);
  }, []);

  // Function to handle like reaction
  const handleLike = async (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, liked: !post.liked } : post
      )
    );

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/reactions/like",
        { postId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Reaction saved successfully");
    } catch (error) {
      console.error("Error saving reaction:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      {loading ? (
        <p className="text-center">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-center">No posts available from followed users.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="bg-white shadow-md p-4 rounded-md mb-4">
            {/* Post Header */}
            <div className="flex items-center mb-2">
              <img
                src={post.user.profileImage || "src/assets/profile-placeholder.jpg"}
                alt="Profile"
                className="h-10 w-10 rounded-full mr-3"
              />
              <p className="font-semibold">{post.user.username}</p>
            </div>

            {/* Post Image */}
            <img src={post.imageUrl} alt="Post" className="w-full rounded-md mb-2" />

            {/* Reaction Icons */}
            <div className="flex items-center gap-4 mb-2">
              <button onClick={() => handleLike(post._id)} className="focus:outline-none">
                {post.liked ? (
                  <FaHeart className="text-red-500 text-xl cursor-pointer" />
                ) : (
                  <FaRegHeart className="text-gray-500 text-xl cursor-pointer" />
                )}
              </button>
              <FaComment className="text-gray-500 text-xl cursor-pointer" />
            </div>

            {/* Caption */}
            <p className="text-sm text-gray-700">{post.caption}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default PostsFeed;
