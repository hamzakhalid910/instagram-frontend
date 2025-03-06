import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit } from "react-icons/fa";

const Profile = () => {
  const [profilePic, setProfilePic] = useState("/assets/profile-placeholder.jpg");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:3000/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfilePic(response.data.profilePicture || "/assets/profile-placeholder.jpg");
        setUsername(response.data.username || "");
        setEmail(response.data.email || "");
        setBio(response.data.bio || "");
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      if (selectedFile) {
        formData.append("profilePicture", selectedFile);
      }
      formData.append("username", username);
      formData.append("email", email);
      formData.append("bio", bio);

      await axios.put("http://localhost:3000/user/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/dashboard"); // Redirect after saving
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg flex">
      {/* Left Section - Profile Picture */}
      <div className="relative w-40 h-40">
        <img
          src={profilePic}
          alt="Profile"
          className="w-full h-full rounded-full object-cover border border-gray-300"
        />
        {/* Edit Button on Image */}
        <label
          htmlFor="file-upload"
          className="absolute bottom-2 right-2 bg-gray-800 text-white p-2 rounded-full cursor-pointer hover:bg-gray-600"
        >
          <FaEdit />
        </label>
        <input
          id="file-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      {/* Right Section - User Information */}
      <div className="flex-1 ml-8">
        <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>

        <div className="mb-4">
          <label className="block text-gray-600">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
            disabled
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-2 border rounded-md resize-none"
            rows="3"
            placeholder="Tell something about yourself..."
          ></textarea>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default Profile;
