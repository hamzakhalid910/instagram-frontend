import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import { useNavigate } from "react-router-dom";

function Login() {
  const [showPassword, setShowPassword] = useState();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const validate = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password contains at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    console.log("Login Form Data:", formData);
    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        formData
      );
      console.log("Login successful:", response.data);
      localStorage.setItem("accessToken", response.data.accesToken);
      navigate("/dashboard");

      setFormData({
        email: "",
        password: "",
      });
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className="bg-gradient-to-tl from-orange-500 via-pink-500 to-blue-500 flex-row bg-gray-300 flex items-center justify-center border-1 min-h-screen">
      <div className="flex flex-col bg-white max-w-md rounded-lg shadow-md p-4 space-y-4">
        <div className="flex justify-center">
          <img
            className="w-32 h-32 mt-2 mb-5"
            src="src\assets\Logo.png"
            alt="Instagram"
          />
        </div>
        <h2 className="text-center text-sm">
          Log in to start using Instgram and connect to friends
        </h2>
        <form className="text- space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}

          <p className="text-sm px-2">
            By Logging in, you agree to our{" "}
            <a
              href="/terms"
              className="text-blue-500 font-semibold hover:underline"
            >
              Terms
            </a>
            ,{" "}
            <a
              href="/privacy-policy"
              className="text-blue-500 font-semibold hover:underline"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="/cookies-policy"
              className="text-blue-500 font-semibold hover:underline"
            >
              Cookies Policy
            </a>
            .
          </p>
          <div className="flex justify-center ">
            <button
              type="submit"
              className="w-[50%] bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300 cursor-pointer"
            >
              Login
            </button>
          </div>
        </form>
        <p className="text-sm">
          Don't have an Account?{" "}
          <span
            onClick={() => navigate("/")}
            className="font-semibold text-blue-500 cursor-pointer hover:underline"
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
