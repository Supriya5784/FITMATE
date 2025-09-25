// pages/Profile.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaUpload, FaArrowLeft, FaTimes } from "react-icons/fa";

export default function Profile({ userData }) {
  const navigate = useNavigate();

  // Profile data + editing state
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Initialize profile from signup
  const [profile, setProfile] = useState({
    name: userData?.fullName || "",
    username: userData?.username || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
    age: userData?.age || "",
    height: userData?.height || "",
    weight: userData?.weight || "",
    houseNo: userData?.houseNo || "",
    area: userData?.area || "",
    city: userData?.city || "",
    state: userData?.state || "",
    sports: userData?.sports || [],
    profileImage: userData?.profileImage || null,
  });

  const [tempProfile, setTempProfile] = useState(profile);

  // Skills placeholder
  const skills = [
    { name: "UI/UX Design", level: 95 },
    { name: "Figma", level: 90 },
    { name: "Design Systems", level: 88 },
    { name: "User Research", level: 85 },
  ];

  // Stats placeholder
  const stats = [
    { label: "Matches", value: "12", icon: "📊" },
    { label: "Friends", value: "0", icon: "👥" },
    { label: "Awards", value: "12", icon: "🏆" },
    { label: "Experience", value: "8 Yrs", icon: "⭐" },
  ];

  // Social Links placeholder
  const socialLinks = [
    { name: "LinkedIn", icon: "🔗", color: "bg-blue-500" },
    { name: "Twitter", icon: "🐦", color: "bg-sky-400" },
    { name: "GitHub", icon: "💻", color: "bg-gray-700" },
    { name: "Dribbble", icon: "🎨", color: "bg-pink-500" },
  ];

  const handleEdit = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
    // Optionally send updated profile to backend here
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setTempProfile((prev) => ({ ...prev, [field]: value }));
  };

  // -----------------------
  // Image upload / camera
  // -----------------------
  const [preview, setPreview] = useState(
    profile.profileImage ? URL.createObjectURL(profile.profileImage) : null
  );
  const [showMenu, setShowMenu] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // File upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setTempProfile((prev) => ({ ...prev, profileImage: file }));
    setPreview(URL.createObjectURL(file));
    setShowMenu(false);
  };

  // Open camera
  const openCamera = async () => {
    setShowMenu(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setShowCameraModal(true);
    } catch (err) {
      console.error("Camera error:", err);
      alert("Unable to access camera.");
    }
  };

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });
      setTempProfile((prev) => ({ ...prev, profileImage: file }));
      setPreview(URL.createObjectURL(file));
    }, "image/jpeg");
    stopCamera();
    setShowCameraModal(false);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="absolute inset-x-0 top-0 h-96 bg-[#001A2A]" />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          {/* Top Actions */}
          <div className="flex justify-end gap-3 mb-8">
            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="bg-white/20 backdrop-blur-md text-white px-6 py-2.5 rounded-full font-medium hover:bg-white/30 transition-all duration-300 flex items-center gap-2 border border-white/30"
              >
                ✏️ Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white px-6 py-2.5 rounded-full font-medium hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-white/20 backdrop-blur-md text-white px-6 py-2.5 rounded-full font-medium hover:bg-white/30 transition-all duration-300 border border-white/30"
                >
                  Cancel
                </button>
              </>
            )}
          </div>

          {/* Main Profile Card */}
          <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-white/50 relative">
            <div className="px-8 pt-8 pb-6 relative">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-indigo-50 flex items-center justify-center">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Profile"
                        className="w-32 h-32 object-cover rounded-2xl"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-purple-600">
                        {profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    )}
                  </div>

                  {/* Camera / upload button */}
                  <div className="absolute -bottom-1 -right-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMenu((s) => !s);
                      }}
                      aria-expanded={showMenu}
                      className="profile-image-menu-toggle bg-indigo-600 text-white p-2 rounded-full shadow-md hover:bg-indigo-700 focus:outline-none"
                      title="Change photo"
                    >
                      <FaCamera />
                    </button>

                    {showMenu && (
                      <div className="absolute right-0 bottom-full mb-2 w-44 bg-white rounded-lg shadow-lg p-2 z-30">
                        <button
                          onClick={openCamera}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 rounded-md"
                        >
                          <FaCamera className="text-indigo-600" /> Take Photo
                        </button>

                        <label
                          htmlFor="upload-photo"
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-50 rounded-md cursor-pointer"
                        >
                          <FaUpload className="text-indigo-600" /> Upload Photo
                        </label>
                        <input
                          id="upload-photo"
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center lg:text-left">
                  {isEditing ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={tempProfile.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="text-3xl font-bold text-gray-900 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 w-full"
                      />
                      <input
                        type="text"
                        value={tempProfile.username}
                        onChange={(e) =>
                          handleInputChange("username", e.target.value)
                        }
                        className="text-lg text-gray-600 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200 w-full"
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {profile.name}
                      </h1>
                      <p className="text-lg text-gray-600 mb-4">
                        @{profile.username}
                      </p>
                    </>
                  )}

                  <div className="flex flex-wrap gap-3 justify-center lg:justify-start mt-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                      Age: {profile.age}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">
                      Height: {profile.height}cm
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 text-pink-700 rounded-full text-sm font-medium">
                      Weight: {profile.weight}kg
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 lg:gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-2xl mb-1">{stat.icon}</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-100">
              <div className="flex gap-1 px-8 bg-gray-50/50">
                {["overview", "skills", "contact"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-4 font-medium capitalize transition-all duration-300 border-b-2 ${
                      activeTab === tab
                        ? "text-indigo-600 border-indigo-600"
                        : "text-gray-500 border-transparent hover:text-gray-700"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-8">
              {activeTab === "overview" && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Address
                    </h3>
                    <p>
                      {profile.houseNo}, {profile.area}, {profile.city},{" "}
                      {profile.state}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Sports Interests
                    </h3>
                    <p>{profile.sports.join(", ")}</p>
                  </div>
                </div>
              )}

              {activeTab === "skills" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Professional Skills
                  </h3>
                  <div className="space-y-4">
                    {skills.map((skill, index) => (
                      <div key={index} className="group">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700">
                            {skill.name}
                          </span>
                          <span className="text-sm font-semibold text-indigo-600">
                            {skill.level}%
                          </span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "contact" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Contact Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="group bg-gray-50 rounded-xl p-5">
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Email Address
                      </label>
                      <p className="text-gray-900 font-medium">{profile.email}</p>
                    </div>

                    <div className="group bg-gray-50 rounded-xl p-5">
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Location
                      </label>
                      <p className="text-gray-900 font-medium">
                        {profile.city}, {profile.state}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Camera Modal */}
          {showCameraModal && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-60 p-4">
              <div className="bg-white rounded-lg overflow-hidden max-w-md w-full">
                <div className="flex items-center justify-between p-3 border-b">
                  <h3 className="font-semibold">Take Photo</h3>
                  <button
                    onClick={() => {
                      stopCamera();
                      setShowCameraModal(false);
                    }}
                    className="p-2 rounded hover:bg-gray-100"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="p-4">
                  <div className="w-full h-64 bg-black flex items-center justify-center">
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      playsInline
                      muted
                    />
                  </div>

                  <div className="mt-3 flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        stopCamera();
                        setShowCameraModal(false);
                      }}
                      className="px-4 py-2 rounded border"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleCapture}
                      className="px-4 py-2 rounded bg-indigo-600 text-white"
                    >
                      Capture
                    </button>
                  </div>

                  <canvas ref={canvasRef} className="hidden" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
