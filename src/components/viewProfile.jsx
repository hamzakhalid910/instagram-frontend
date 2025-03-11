import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewProfile = ({ IsFollowing }) => {
  //   const [userId, setUserId] = useState("");
  const { userId } = useParams(); // Get userId from the URL
  const [profilePic, setProfilePic] = useState(
    "/assets/profile-placeholder.jpg"
  );
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [accountType, setAccountType] = useState("");
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState([]); // List of followers
  const [following, setFollowing] = useState([]); // List of following

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          alert("Please log in to view profiles.");
          return;
        }

        let user;
        if (location.pathname.startsWith("/profile/")) {
          user = location.pathname.split("/")[2];
        }
        // Fetch the profile of the user in the URL
        const response = await axios.get(
          `http://localhost:3000/user/profile/${user}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const userData = response.data;
        
        setProfilePic(
          `http://localhost:3000${userData.profilePic}` ||
            "/assets/profile-placeholder.jpg"
        );
        setEmail(userData.email);
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setUsername(userData.username);
        setMobileNumber(userData.mobileNumber);
        setAccountType(userData.accountType);
        setFollowersCount(userData.followersCount);
        setFollowingCount(userData.followingCount);
        setFollowers(userData.followers); // Set followers list
        setFollowing(userData.following); // Set following list

        // Check if the current user is following this profile
        const followStatusResponse = await axios.get(
          `http://localhost:3000/user/is-following/${user}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // console.log(followStatusResponse.data);
        setIsFollowing(followStatusResponse.data);
        // console.log(isFollowing);
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Failed to fetch profile");
      }
    };

    fetchUserProfile();
  }, [userId, location.pathname]);

  const handleFollowUser = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Please log in to follow users.");
        return;
      }

      let user;
      if (location.pathname.startsWith("/profile/")) {
        user = location.pathname.split("/")[2];
      }
      const response = await axios.post(
        `http://localhost:3000/follow/${user}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setIsFollowing(!isFollowing); // Update follow status
      if (isFollowing === true) {
        setFollowersCount((prev) => prev - 1);
      } else {
        setFollowersCount((prev) => prev + 1);
      }
      alert("You are now following this user!");
    } catch (error) {
      console.error("Error following user:", error);
      alert("Failed to follow user");
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

        <div>
          <h4 className="font-semibold mt-4">Followers</h4>
          <p>{followersCount}</p>

          <h4 className="font-semibold mt-4">Following</h4>
          <p>{followingCount}</p>
        </div>
      </div>

      {/* Right Section - User Information */}
      <div className="flex-1 ml-8">
        <h2 className="text-2xl font-semibold mb-4">{username}'s Profile</h2>

        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-600">Email</label>
            <p className="text-gray-900">{email}</p>
          </div>

          {/* Username */}
          <div>
            <label className="block text-gray-600">Username</label>
            <p className="text-gray-900">{username}</p>
          </div>

          {/* First Name */}
          <div>
            <label className="block text-gray-600">First Name</label>
            <p className="text-gray-900">{firstName}</p>
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-600">Last Name</label>
            <p className="text-gray-900">{lastName}</p>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-gray-600">Mobile Number</label>
            <p className="text-gray-900">{mobileNumber}</p>
          </div>

          {/* Account Type */}
          <div>
            <label className="block text-gray-600">Account Type</label>
            <p className="text-gray-900">{accountType}</p>
          </div>

          {/* Follow Button */}
          {!isFollowing && (
            <button
              onClick={handleFollowUser}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 cursor-pointer"
            >
              Follow
            </button>
          )}

          {/* Unfollow Button (if already following) */}
          {isFollowing && (
            <button
              onClick={handleFollowUser} // You can implement an unfollow function if needed
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 cursor-pointer"
            >
              Unfollow
            </button>
          )}

          {/* Followers List */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Followers</h3>
            {followers.length > 0 ? (
              <ul className="space-y-2">
                {followers.map((follower) => (
                  <li key={follower.id} className="flex items-center space-x-2">
                    <img
                      src={
                        follower.profilePic
                          ? `http://localhost:3000${follower.profilePic}`
                          : "/profile-placeholder.jpg"
                      }
                      alt="Profile"
                      className="h-8 w-8 rounded-full border-2 border-gray-300"
                    />
                    <p className="font-semibold text-gray-900">
                      {follower.username}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No followers yet.</p>
            )}
          </div>

          {/* Following List */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Following</h3>
            {following.length > 0 ? (
              <ul className="space-y-2">
                {following.map((followedUser) => (
                  <li
                    key={followedUser.id}
                    className="flex items-center space-x-2"
                  >
                    <img
                      src={
                        followedUser.profilePic
                          ? `http://localhost:3000${followedUser.profilePic}`
                          : "/profile-placeholder.jpg"
                      }
                      alt="Profile"
                      className="h-8 w-8 rounded-full border-2 border-gray-300"
                    />
                    <p className="font-semibold text-gray-900">
                      {followedUser.username}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Not following anyone yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
