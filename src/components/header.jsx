import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import defaultProfilePic from "../assets/profile-placeholder.jpg";
import CreatePost from "./createPost";
import SearchBar from "./searchbar";
const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(defaultProfilePic);
  const [username, setUsername] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfilepic = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/login");
          return;
        }
        const response = await axios.get("http://localhost:3000/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.profilePic) {
          setProfileImage(`http://localhost:3000${response.data.profilePic}`);
        }

        setUsername(response.data.username);
      } catch (error) {
        console.error("Error in fetching profile image:", error);
        setProfileImage(defaultProfilePic);
      }
    };

    fetchProfilepic();
  }, [navigate]);

  return (
    <header className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      {/* Logo */}
      <div className="border-1 flex items-center">
        <img
          src="src/assets/instagram-logo.png"
          alt="Instagram Logo"
          className="h-10 cursor-pointer h-18"
          onClick={() => navigate("/dashboard")}
        />
      </div>

      <div className="w-2/5">
        <SearchBar></SearchBar>
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
              onClick={() => navigate("/profile")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              Profile
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("accessToken");
                navigate("/login");
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      <CreatePost isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </header>
  );
};

export default Header;
