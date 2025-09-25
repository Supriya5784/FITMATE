// pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import Logo from "../assets/Logo.jpg";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ navigate hook

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier:username, password }),
        credentials: "include",
      });


      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // If success:
      console.log("Login success:", data);

      // Save token/user if you’re using JWT
      // localStorage.setItem("token", data.token);

      // ✅ Redirect to home
      navigate("/home");
    } catch (err) {
      console.error("Error logging in:", err);
      setError("Something went wrong. Please try again.");
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-[#001A2A]">
      <div className="flex w-[1200px] h-[700px] bg-white/95 rounded-2xl shadow-2xl ring-1 ring-gray-200 overflow-hidden backdrop-blur-sm">
        {/* Left - Image */}
        <div className="w-1/2 h-full flex items-center justify-center">
          <img
            src={Logo}
            alt="Fitmate"
            className="w-[97%] h-[97%] object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* Right - Form */}
        <div className="w-1/2 flex flex-col items-center justify-center p-12">
          <h2 className="text-3xl font-extrabold mb-2 text-gray-800 tracking-wide drop-shadow-sm">
            Welcome To Fitmate
          </h2>
          <p className="text-gray-600 mb-8 text-base font-medium italic">
            Connect And Play
          </p>

          <form className="w-full space-y-4" onSubmit={handleLogin}>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 shadow-sm">
              <FaUser className="text-[#001A2A] mr-2" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-2 shadow-sm">
              <FaLock className="text-[#001A2A] mr-2" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="text-right text-base text-[#001A2A] font-semibold cursor-pointer hover:underline">
              Recovery Password
            </div>

            <button
              type="submit"
              className="w-full text-lg bg-[#001A2A] text-white py-2 rounded-lg font-bold tracking-wider shadow-md hover:bg-blue-900 transition"
            >
              Login
            </button>

            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-blue-900"></div>
              <p className="text-[#001A2A] text-sm px-4">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-indigo-600 font-semibold cursor-pointer hover:underline"
                >
                  Sign Up
                </Link>
              </p>
              <div className="flex-grow h-px bg-blue-900"></div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
