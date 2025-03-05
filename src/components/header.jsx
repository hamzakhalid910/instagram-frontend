import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src="/assets/instagram-logo.png"
          alt="Instagram Logo"
          className="h-10 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        />
      </div>

      {/* Profile & Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 p-2 bg-gray-200 rounded-full hover:bg-gray-300"
        >
          <img
            src="/assets/profile-icon.png"
            alt="Profile"
            className="h-8 w-8 rounded-full"
          />
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
