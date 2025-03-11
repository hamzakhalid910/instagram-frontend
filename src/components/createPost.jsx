import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "axios";

const CreatePost = ({ isOpen, onClose }) => {
  const [selectedFiles, setSelectedFiles] = useState([]); // For multiple files
  const [content, setContent] = useState("");

  if (!isOpen) return null; // Don't render if modal is closed

  // Handle file selection (multiple files)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to array
    setSelectedFiles(files);
  };

  // Handle post submission
  const handlePostSubmit = async () => {
    if (selectedFiles.length === 0) {
      alert("Please upload at least one image or media file."); // Media is required
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append("content", content.trim() ? content : ""); // Append content

    // Append each file to FormData
    selectedFiles.forEach((file, index) => {
      formData.append("mediaFiles", file); // Use "mediaFiles" as the field name
    });

    console.log("FormData:", [...formData.entries()]); // Debugging

    try {
      const response = await axios.post(
        "http://localhost:3000/post/create-post",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response.data);
      alert("Post created successfully!");
      onClose(); // Close modal after posting
      setSelectedFiles([]); // Reset files
      setContent(""); // Reset content
      window.location.reload();
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post.");
    }
  };

  return (
    <div className="z-12 fixed inset-0 bg-white bg-opacity-90 backdrop-blur-md flex justify-center items-center">
      <div className="border bg-yellow-400 p-6 rounded-lg shadow-lg w-[500px] relative">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 cursor-pointer"
          onClick={onClose}
        >
          <FaTimes />
        </button>
        <h2 className="text-xl font-semibold mb-4 text-center">Create Post</h2>

        {/* Image Upload (multiple files) */}
        <input
          type="file"
          accept="image/*"
          multiple // Allow multiple files
          onChange={handleFileChange}
          className="mb-4 border-1 w-full p-1 rounded-md cursor-pointer"
        />

        {/* Display selected files */}
        {selectedFiles.length > 0 && (
          <div className="mb-4">
            {selectedFiles.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`Selected ${index + 1}`}
                className="w-full h-60 object-cover mb-2 rounded-md border-1 border-gray-400"
              />
            ))}
          </div>
        )}

        {/* Caption Textarea */}
        <textarea
          className="w-full p-2 border rounded-md mb-4"
          placeholder="Write a caption..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
  );
};

export default CreatePost;
