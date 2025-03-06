import React, { useEffect, useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import defaultProfilePic from "../assets/profile-placeholder.jpg";
import axios from "axios";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(defaultProfilePic);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [username, setUsername] = useState("Hamza");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfilepic = async () => {
      console.log("fetching profile pic");
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // navigate("/");
          return;
        }
        const response = await axios.get(
          "http://localhost:3000/user/profile-pic",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfileImage(response.data.profileurl);
        setUsername(response.data.username);
      } catch (error) {
        console.error("Error in fetching profile image:", error);
        setProfileImage(defaultProfilePic);
      }
    };

    fetchProfilepic();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handlePostSubmit = async () => {
    if (!selectedFile || !caption.trim()) {
      alert("Please upload an image and write a caption.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("caption", caption);

      await axios.post("http://localhost:3000/post/create", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Post created successfully!");
      setIsModalOpen(false);
      setSelectedFile(null);
      setCaption("");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post.");
    }
  };

  return (
    <header className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      {/* Logo */}
      <div className="border-1 flex items-center">
        <img
          src="src\assets\instagram-logo.png"
          alt="Instagram Logo"
          className="h-10 cursor-pointer h-18 "
          onClick={() => navigate("/dashboard")}
        />
      </div>

      {/* Create Post Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center"
      >
        <FaPlus className="mr-2" /> Create Post
      </button>

      {/* Profile & Dropdown */}
      <div className="relative">
        <div className="flex items-center">
          <p className="text-sm font-semibold mr-2">{username}</p>

          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className=" flex items-center space-x-2 p-2 bg-gray-200 rounded-full hover:bg-gray-300"
          >
            <img
              src={profileImage}
              alt="Profile"
              className="h-8 w-8 rounded-full cursor-pointer"
            />
          </button>
        </div>

        {dropdownOpen && (
          <div className="absolute right-0 mt-4 w-48 bg-white border rounded shadow-md">
            <button
              onClick={() => {
                navigate("/profile");
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Post Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-80 bg-black flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Create Post
            </h2>

            {/* Image Upload */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mb-4 border-1 w-full p-1 rounded-md cursor-pointer"
            />
            {selectedFile && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected"
                className="w-full h-60 object-cover mb-4 rounded-md border-1 border-gray-400"
              />
            )}

            <textarea
              className="w-full p-2 border rounded-md mb-4"
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            ></textarea>

            {/* Submit Button */}
            <button
              onClick={handlePostSubmit}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
