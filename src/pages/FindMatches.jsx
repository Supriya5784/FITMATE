// src/pages/FindMatches.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FindMatches = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [matches, setMatches] = useState([]);
  const [allMatches, setAllMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await fetch("http://localhost:3000/auth/me", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch user ID");
        const data = await res.json();
        setUserId(data.userId);
      } catch (err) {
        console.error("Error fetching user ID:", err);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/match", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Failed to fetch matches");

        const data = await res.json();
        setMatches(data);
        setAllMatches(data);
      } catch (err) {
        console.error("Error fetching matches:", err);
      }
    };

    fetchMatches();
  }, []);

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term) {
      setMatches(allMatches);
      return;
    }

    const filtered = allMatches.filter(
      (m) =>
        m.matchName.toLowerCase().includes(term) ||
        m.sportsType.toLowerCase().includes(term) ||
        m.address.area.toLowerCase().includes(term) ||
        m.address.city.toLowerCase().includes(term)
    );
    setMatches(filtered);
  };

  const handleJoinMatch = async (match) => {
    try {
      const res = await fetch("http://localhost:3000/api/match/join", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchName: match.matchName,
          sportsType: match.sportsType,
          date: match.date,
          address: match.address,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to join match");
        return;
      }

      // store userId from the response
      setUserId(data.userId);

      alert(data.message || "Joined match successfully");

      setSelectedMatch((prev) => prev ? {
        ...prev,
        players: [...(prev.players || []), { playerId: data.userId }],
        playersRequired: Math.max((prev.playersRequired || 0) - 1, 0),
      } : prev);


      setMatches((prevMatches) =>
        prevMatches.map((m) =>
          m._id === match._id
            ? {
              ...m,
              players: [...(m.players || []), { playerId: data.userId }],
              playersRequired: Math.max((m.playersRequired || 0) - 1, 0),
            }
            : m
        )
      );
    } catch (err) {
      console.error("Error joining match:", err);
      alert("Something went wrong while joining the match");
    }
  };


  const isAlreadyJoined = selectedMatch?.players?.some(
    (p) => p.playerId?.toString() === userId?.toString()
  );



  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 right-6 bg-[#001A2A] text-white px-4 py-2 rounded-md hover:bg-blue-900 font-medium"
      >
        Back
      </button>

      {/* Logo + Title */}
      <div className="flex items-center mb-6 gap-4">
        <img
          src="/logo2.png"
          alt="App Logo"
          className="w-12 h-12 object-contain"
        />
        <h1 className="text-3xl font-bold text-[#001A2A]">
          Find Matches Near You
        </h1>
      </div>

      {/* Search Bar */}
      <div className="flex items-center mb-6 border rounded-md px-4 py-2 w-full max-w-xl focus-within:ring-2 focus-within:ring-blue-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-gray-400 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search by game, sport, or location"
          className="flex-1 outline-none text-lg"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {/* Matches List */}
      <div className="flex flex-col gap-4">
        {matches.length === 0 && (
          <div className="text-gray-500 text-center mt-10">
            No matches found
          </div>
        )}

        {matches.map((m) => (
          <div
            key={m._id}
            className="bg-white rounded-xl shadow p-4 flex items-center gap-4 hover:shadow-lg transition cursor-pointer"
            style={{ minHeight: "160px" }}
          >
            {/* Thumbnail */}
            {/* Thumbnail */}
            <div className="w-36 h-36 flex items-center justify-center bg-gray-200 rounded-md shadow-md text-gray-600">
              <img
                src={
                  m.sportsType && m.sportsType.trim() !== ""
                    ? `http://localhost:3000/matchuploads/${m.sportsType}.jpg`
                    : "http://localhost:3000/matchuploads/default-match.jpg"
                }
                alt={m.sportsType|| "Match"}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>



            {/* Match Details */}
            <div className="flex-1 flex flex-col justify-between">
              <h3 className="font-semibold text-2xl text-[#001A2A]">
                {m.matchName}
              </h3>
              <div className="flex flex-wrap justify-start mt-1 text-sm md:text-base text-gray-700 gap-x-4 gap-y-1">
                <span>{m.sportsType}</span>|
                <span>{new Date(m.date).toDateString()}</span>|
                <span>
                  {new Date(m.date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                |<span>{m.address.area}, {m.address.state}</span>
                {m.distance && <>|<span>{m.distance} km</span></>}
              </div>
              <p className="text-blue-600 font-medium mt-1">
                Looking for {m.playersRequired} players
              </p>
            </div>

            {/* Know More Button */}
            <div className="flex-shrink-0 flex items-center">
              <button
                className="bg-[#001A2A] text-white px-4 py-2 rounded-md font-medium hover:bg-blue-900"
                onClick={() => setSelectedMatch(m)}
              >
                Know More
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl relative shadow-lg">
            <button
              className="absolute top-4 right-4 text-gray-500 text-2xl font-bold hover:text-gray-700"
              onClick={() => setSelectedMatch(null)}
            >
              &times;
            </button>
            <h2 className="text-3xl font-bold text-[#001A2A] mb-6">
              {selectedMatch.matchName}
            </h2>

            <div className="flex gap-6 mb-6">
              <div className="w-36 h-36 flex items-center justify-center bg-gray-200 rounded-md shadow-md text-gray-600">
              <img
                src={
                  selectedMatch.sportsType && selectedMatch.sportsType.trim() !== ""
                    ? `http://localhost:3000/matchuploads/${selectedMatch.sportsType}.jpg`
                    : "http://localhost:3000/matchuploads/default-match.jpg"
                }
                alt={selectedMatch.sportsType|| "Match"}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

              <div className="flex-1 flex flex-col justify-between text-gray-700 text-lg gap-4">
                <div className="flex gap-4">
                  <p>
                    <strong>Sport:</strong> {selectedMatch.sportsType}
                  </p>
                  <p>
                    <strong>Type:</strong> {selectedMatch.matchType}
                  </p>
                </div>

                <div className="flex gap-4">
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(selectedMatch.date).toDateString()}
                  </p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {new Date(selectedMatch.date).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <strong>Location:</strong>
                  <span>
                    {selectedMatch.address.area},{" "}
                    {selectedMatch.address.city},{" "}
                    {selectedMatch.address.state}
                  </span>
                  <a
                    href={selectedMatch.address.coordinates.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 text-blue-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                    </svg>
                    Map
                  </a>
                </div>

                <div>
                  <p>
                    <strong>Players Required:</strong>{" "}
                    {selectedMatch.playersRequired}
                  </p>

                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Notes</h3>
              <p className="text-gray-800 leading-relaxed">
                {selectedMatch.notes || "No notes available"}
              </p>
            </div>

            <button
              className={`px-6 py-3 rounded-md font-medium ${isAlreadyJoined
                ? "bg-green-600 cursor-not-allowed"
                : "bg-[#001A2A] text-white hover:bg-blue-900"
                }`}
              onClick={() => !isAlreadyJoined && handleJoinMatch(selectedMatch)}
              disabled={isAlreadyJoined}
            >
              {isAlreadyJoined ? "Already Joined" : "Join Now"}
            </button>



          </div>
        </div>
      )}
    </div>
  );
};

export default FindMatches;
