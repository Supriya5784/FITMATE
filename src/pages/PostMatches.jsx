import React, { useState } from "react";
import { FaFutbol, FaMapMarkerAlt, FaInfoCircle, FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect } from "react";


export default function PostMatch({ onClose }) {
  
  const [formData, setFormData] = useState({
    matchName: "",
    sportsType: "",
    playersRequired: "",
    matchType: "Friendly",
    matchDate: "",
    matchTime: "",
    groundName: "",
    area: "",
    city: "",
    state: "",
    notes: "",
  });

  

  const [weatherInfo, setWeatherInfo] = useState(null);



useEffect(() => {
  const { groundName, city, state, matchDate, matchTime } = formData;
  if (groundName && city && state && matchDate && matchTime) {
    setWeatherInfo("ClearWeather on that day"); // hardcoded
  } else {
    setWeatherInfo(null); // clear if any field missing
  }
}, [formData.groundName, formData.city, formData.state, formData.matchDate, formData.matchTime]);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      matchName: formData.matchName,
      sportsType: formData.sportsType,
      playersRequired: Number(formData.playersRequired),
      matchType: formData.matchType,
      date: `${formData.matchDate}T${formData.matchTime}`,
      address: {
        groundName: formData.groundName,
        area: formData.area,
        city: formData.city,
        state: formData.state,
      },
      notes: formData.notes,
    };

    try {
      const res = await fetch("/api/match/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Match Posted Successfully!");
        console.log("Match Posted:", data);
        onClose();
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong!");
    }
  };


  const handleCancel = () => {
    setFormData({
      matchName: "",
      sportsType: "",
      playersRequired: "",
      matchType: "Friendly",
      matchDate: "",
      matchTime: "",
      groundName: "",
      area: "",
      city: "",
      state: "",
      notes: "",
    });
    onClose();
  };

  return (
    <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-8 relative">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl font-bold"
      >
        ✕
      </button>

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-[#001A2A] px-6 py-3 rounded-lg border-white-400 shadow-md inline-block">
          Organize a Match
        </h1>
        <p className="mt-2 text-[#001A2A] text-xl">
          Connect players, create fun games, and make memories!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Match Time Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#001A2A] space-y-4 flex flex-col md:flex-row gap-4 items-center">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3 mb-2 md:mb-0">
            <FaCalendarAlt className="text-purple-600" /> Match Time
          </h2>
          <input type="date" name="matchDate" value={formData.matchDate} onChange={handleChange} className="p-4 border border-gray-300 rounded-xl shadow-md w-full md:w-1/2 focus:ring-2 focus:ring-purple-500 outline-none text-lg transition" required />

          <input
            type="time"
            name="matchTime"
            value={formData.matchTime}
            onChange={handleChange}
            className="p-4 border border-gray-300 rounded-xl shadow-md w-full md:w-1/2 focus:ring-2 focus:ring-purple-500 outline-none text-lg transition"
            required
          />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Match Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#001A2A] space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3 mb-4">
              <FaFutbol className="text-blue-600" /> Match Details
            </h2>
            <input
              type="text"
              name="matchName"
              value={formData.matchName}
              onChange={handleChange}
              placeholder="Match Name"
              className="p-4 border border-gray-300 rounded-xl shadow-md w-full focus:ring-2 focus:ring-blue-500 outline-none text-lg transition"
              required
            />
            <input
              type="text"
              name="sportsType"
              value={formData.sportsType}
              onChange={handleChange}
              placeholder="Sport"
              className="p-4 border border-gray-300 rounded-xl shadow-md w-full focus:ring-2 focus:ring-blue-500 outline-none text-lg transition"
              required
            />
            <input
              type="number"
              name="playersRequired"
              value={formData.playersRequired}
              onChange={handleChange}
              placeholder="Players Required"
              className="p-4 border border-gray-300 rounded-xl shadow-md w-full focus:ring-2 focus:ring-blue-500 outline-none text-lg transition"
              required
            />
            <select
              name="matchType"
              value={formData.matchType}
              onChange={handleChange}
              className="p-4 border border-gray-300 rounded-xl shadow-md w-full focus:ring-2 focus:ring-blue-500 outline-none text-lg transition"
            >
              <option value="Friendly">Friendly</option>
              <option value="Tournament">Tournament</option>
              <option value="Practice">Practice</option>
            </select>
          </div>

          {/* Right Column - Match Location */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#001A2A] space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-3 mb-4">
              <FaMapMarkerAlt className="text-blue-500" /> Match Location
            </h2>
            <input
              type="text"
              name="groundName"
              value={formData.groundName}
              onChange={handleChange}
              placeholder="Ground Name"
              className="p-4 border border-gray-300 rounded-xl shadow-md w-full focus:ring-2 focus:ring-blue-500 outline-none text-lg transition"
              required
            />
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              placeholder="Area"
              className="p-4 border border-gray-300 rounded-xl shadow-md w-full focus:ring-2 focus:ring-blue-500 outline-none text-lg transition"
            />
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="p-4 border border-gray-300 rounded-xl shadow-md w-full focus:ring-2 focus:ring-blue-500 outline-none text-lg transition"
              required
            />
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="p-4 border border-gray-300 rounded-xl shadow-md w-full focus:ring-2 focus:ring-blue-500 outline-none text-lg transition"
              required
            >
              <option value="">Select State</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Arunachal Pradesh">Arunachal Pradesh</option>
              <option value="Assam">Assam</option>
              <option value="Bihar">Bihar</option>
              <option value="Chhattisgarh">Chhattisgarh</option>
              <option value="Delhi">Delhi</option>
              <option value="Goa">Goa</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Haryana">Haryana</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Jharkhand">Jharkhand</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Manipur">Manipur</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Mizoram">Mizoram</option>
              <option value="Nagaland">Nagaland</option>
              <option value="Odisha">Odisha</option>
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
              <option value="Tripura">Tripura</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Uttarakhand">Uttarakhand</option>
              <option value="West Bengal">West Bengal</option>
            </select>

          </div>
        </div>
        {weatherInfo && (
          <div className="bg-blue-50 text-blue-800 p-4 rounded-xl shadow-md mt-4">
            <strong>Weather Suggestion:</strong> {weatherInfo}
          </div>
        )}


        {/* About Section - Full Width */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#001A2A]">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
            <FaInfoCircle className="text-green-600" /> About the Match
          </h2>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Write something about the match..."
            rows="5"
            className="p-4 border border-gray-300 rounded-xl shadow-md w-full focus:ring-2 focus:ring-green-400 outline-none text-lg transition"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-6 mt-4">
          <button
            type="submit"
            className="w-48 px-6 py-3 bg-[#001A2A] text-white font-semibold rounded-xl shadow-lg border border-white hover:bg-white hover:border-[#001A2A] hover:text-[#001A2A] hover:scale-105 transition transform"
          >
            Post Match
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="w-48 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl shadow-md hover:bg-gray-300 hover:scale-105 transition transform"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}