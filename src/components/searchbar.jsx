import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login");
        return;
      }
      console.log("Query", searchQuery);
      const response = await axios.get(
        `http://localhost:3000/user/search?username=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSearchResults(response.data); // Set the search results
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error searching profiles:", error);
      alert("Failed to search profiles");
    }
  };

  const handleProfileClick = (userId) => {
    navigate(`/profile/${userId}`); // Navigate to the user's profile
  };

  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Search by username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 p-2 border rounded-lg outline-none"
        />
        <button
          onClick={handleSearch}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Search Results:</h3>
          <ul className="space-y-2">
            {searchResults.map((user) => (
              <li
                key={user.id}
                onClick={() => handleProfileClick(user.id)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
              >
                <img
                  src={
                    user.profilePic
                      ? `http://localhost:3000${user.profilePic}`
                      : "/profile-placeholder.jpg"
                  }
                  alt="Profile"
                  className="h-8 w-8 rounded-full border-2 border-gray-300"
                />
                <p className="font-semibold text-gray-900">{user.username}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
