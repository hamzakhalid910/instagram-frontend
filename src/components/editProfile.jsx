import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEdit } from "react-icons/fa";

const EditProfile = () => {
  const [profilePic, setProfilePic] = useState(
    "/assets/profile-placeholder.jpg"
  );

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [accountType, setAccountType] = useState("");
  const [followersCount, setFollowersCount] = useState("");
  const [followingCount, setFollowingCount] = useState("");

  const navigate = useNavigate();

  const userData = {
    firstName: "",
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:3000/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(`http://localhost:3000${response.data.profilePic}`);
        setProfilePic(
          `http://localhost:3000${response.data.profilePic}` ||
            "/assets/profile-placeholder.jpg"
        );

        setEmail(response.data.email);
        setFirstName(response.data.firstName);
        setLastName(response.data.lastName);
        setUsername(response.data.username);
        setMobileNumber(response.data.mobileNumber);
        setAccountType(response.data.accountType);
        setFollowersCount(response.data.followersCount);
        setFollowingCount(response.data.followingCount);

        console.log("userData", userData.firstName);

        // console.log("profileData:", profileData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleProfilePicChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    console.log("Selected File:", file); // Check if file is detected

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append("profilePic", file);

      let response = await axios.post(
        "http://localhost:3000/user/set-profile-pic",
        formData,
        {
          headers: {
            Authorization: `bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfilePic(
        `http://localhost:3000${response.data.filePath}` ||
          "/assets/profile-placeholder.jpg"
      );
      console.log("Profile picture uploaded successfully!");
    } catch (error) {
      console.error("Error setting Profile Pic", error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      console.log("Handle Save fucntion");
      console.log("username:", username);
      const token = localStorage.getItem("accessToken");

      const data = {
        username,
        firstName,
        lastName,
        mobileNumber,
        accountType,
      };

      console.log("Data for saving", data);

      const response = await axios.put(
        "http://localhost:3000/user/edit-profile",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-4 p-6 bg-white shadow-md rounded-lg flex border-1 overflow-hidden min-h-[340px]">
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
          onChange={handleProfilePicChange}
        />

        <div>
          <h4 className="font-semibold mt-4">Followers</h4>
          <p>{followersCount}</p>

          <h4 className="font-semibold mt-4">Following</h4>
          <p>{followingCount}</p>
        </div>
      </div>

      {/* Right Section - User Information */}
      <div className="flex-1 ml-8">
        <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>

        <form onSubmit={handleSave}>
          {/* email */}
          <div className="mb-4">
            <label className="block text-gray-600">Email</label>
            <input
              type="email"
              value={email || ""}
              className="w-full px-4 py-2 border rounded-md bg-gray-200 cursor-not-allowed"
              disabled
            />
          </div>
          {/* Username */}
          <div className="mb-4">
            <label className="block text-gray-600">Username</label>
            <input
              type="text"
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* First Name */}
          <div className="mb-4">
            <label className="block text-gray-600">First Name</label>
            <input
              type="text"
              value={firstName || ""}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label className="block text-gray-600">Last Name</label>
            <input
              type="text"
              value={lastName || ""}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Mobile Number */}
          <div className="mb-4">
            <label className="block text-gray-600">Mobile Number</label>
            <input
              type="tel"
              value={mobileNumber || ""}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Account Type */}
          <div className="mb-4">
            <label className="block text-gray-600">Account Type</label>
            <select
              value={accountType || ""}
              onChange={(e) => setAccountType(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
