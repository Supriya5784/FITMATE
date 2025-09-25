// Home.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Profile from "./profile";
import PostMatch from "./PostMatches";
import FindUsers from "./FindUsers";
import {
  FaHome,
  FaSearch,
  FaBell,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaMapMarkerAlt,
  FaClock,
  FaUsers,
  FaFutbol,
  FaChartLine,
  FaRobot,
  FaComments
} from "react-icons/fa";


import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Home() {

  const [user, setUser] = useState(null);
  const [recommendedMatches, setRecommendedMatches] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [activityView, setActivityView] = useState("Weekly");
  const [leaderboardView, setLeaderboardView] = useState("Weekly");
  const [activityData, setActivityData] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [userId, setUserId] = useState(null);
  const [featuredMatches, setFeaturedMatches] = useState([]);
  const [percentile, setPercentile] = useState(null);


  const [isOpen, setIsOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [isPostMatchOpen, setIsPostMatchOpen] = useState(false);
  const [isFindUsersOpen, setIsFindUsersOpen] = useState(false);
  const [showChatMessage, setShowChatMessage] = useState(false);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => {
      setShowChatMessage(true);
    }, 200);

    const hideTimer = setTimeout(() => {
      setShowChatMessage(false);
    }, 8000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);


  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await fetch("http://localhost:3000/auth/me", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch user ID");
        const data = await res.json();
        setUserId(data.userId);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    async function fetchHomeData() {
      try {
        const res = await fetch("/api/home", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to fetch home data");
        const data = await res.json();

        setUser(data);
        setPercentile(data.percentile || 0);

        setActivityData(data.userActivityData?.weeklyData || []);

        setLeaderboardData(
          leaderboardView === "Weekly"
            ? data.weeklyLeaderboard || []
            : data.monthlyLeaderboard || []
        );

        setRecommendedMatches(data.recommendedMatches || []);
        setFeaturedMatches(data.featuredMatches || []);
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setLoadingMatches(false);
      }
    }

    fetchHomeData();
  }, [leaderboardView]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    // Add user's message to chat
    const newMessage = { role: "user", content: chatInput };
    setChatMessages((prev) => [...prev, newMessage]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: chatInput }),
      });

      const data = await res.json();
      if (res.ok && data.reply) {
        setChatMessages((prev) => [...prev, { role: "ai", content: data.reply }]);
      } else {
        setChatMessages((prev) => [...prev, { role: "ai", content: "Failed to get response." }]);
      }
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [...prev, { role: "ai", content: "Error connecting to server." }]);
    } finally {
      setIsChatLoading(false);
    }
  };



  const handleJoinMatch = async (matchId) => {
    // Find the full match object from recommendedMatches or featuredMatches
    const match =
      recommendedMatches.find((m) => m._id === matchId) ||
      featuredMatches.find((m) => m._id === matchId);

    if (!match) {
      alert("Match not found");
      return;
    }
    console.log(match);
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

      alert(data.message || "Joined match successfully");

      setSelectedMatch((prev) =>
        prev
          ? {
            ...prev,
            players: [...(prev.players || []), { playerId: data.userId }],
            playersRequired: Math.max((prev.playersRequired || 0) - 1, 0),
          }
          : prev
      );

      // Update recommendedMatches
      setRecommendedMatches((prev) =>
        prev.map((m) =>
          m._id === match._id
            ? {
              ...m,
              players: [...(m.players || []), { playerId: data.userId }],
              playersRequired: Math.max(m.playersRequired - 1, 0),
            }
            : m
        )
      );

      // Update featuredMatches
      setFeaturedMatches((prev) =>
        prev.map((m) =>
          m._id === match._id
            ? {
              ...m,
              players: [...(m.players || []), { playerId: data.userId }],
              playersRequired: Math.max(m.playersRequired - 1, 0),
            }
            : m
        )
      );
    } catch (err) {
      console.error("Error joining match:", err);
      alert("Something went wrong while joining the match");
    }
  };



  useEffect(() => {
    document.body.style.overflow = (isPostMatchOpen || isFindUsersOpen) ? "hidden" : "auto";
  }, [isPostMatchOpen, isFindUsersOpen]);



  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <aside
        className={`${isOpen ? "w-64" : "w-20"
          } bg-[#001A2A] fixed left-0 top-0 bottom-0 text-white flex flex-col justify-between transition-all duration-300 z-50 shadow-lg`}
      >
        <div>
          <div className="flex items-center justify-between px-4 py-4">
            {/* Sidebar User Card */}
            <img
              src={user?.profileImage ? `http://localhost:3000/uploads/${user.profileImage}` : "http://localhost:3000/uploads/default.jpg"}
              alt="User"
              className="w-12 h-12 rounded-full object-cover"
            />
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
              className="p-2 rounded-md hover:bg-gray-700 text-gray-300"
            >
              <FaBars className="text-lg" />
            </button>
          </div>

          <nav className="mt-6 px-4 flex flex-col gap-6 text-lg">
            <Link
              to="#"
              onClick={() => setActiveSection("home")}
              className="flex items-center gap-3 text-gray-100 hover:text-blue-300"
            >
              <FaHome />
              {isOpen && <span className="text-base">Home</span>}
            </Link>

            <Link
              to="#"
              onClick={() => setIsFindUsersOpen(true)} // modal open
              className="flex items-center gap-3 text-gray-100 hover:text-blue-300"
            >
              <FaSearch />
              {isOpen && <span className="text-base">Find User</span>}
            </Link>



            <Link
              to="#"
              onClick={() => setActiveSection("profile")}
              className="flex items-center gap-3 text-gray-100 hover:text-blue-300"
            >
              <FaUser />
              {isOpen && <span className="text-base">Profile</span>}
            </Link>

            <Link
              to="/settings"
              onClick={() => setActiveSection("settings")}
              className="flex items-center gap-3 text-gray-100 hover:text-blue-300"
            >
              <FaCog />
              {isOpen && <span className="text-base">Settings</span>}
            </Link>

            <Link
              to="#"
              onClick={() => setActiveSection("messages")}
              className="flex items-center gap-3 text-gray-100 hover:text-blue-300"
            >
              <FaComments /> {/* Formal chat icon */}
              {isOpen && <span className="text-base">Chats</span>}
            </Link>





          </nav>
        </div>

        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <img
              src={
                user?.profileImage
                  ? `http://localhost:3000/uploads/${user.profileImage}`
                  : "http://localhost:3000/uploads/default.jpg"
              }
              alt={user?.name || "User"}
              className="w-12 h-12 rounded-full object-cover"
            />


            {isOpen && (
              <div>
                <div className="font-semibold text-sm">{user?.name || "Loading..."}</div>
                <div className="text-xs text-gray-300">Online</div>
              </div>
            )}
          </div>

          <button
            onClick={async () => {
              try {
                const res = await fetch("http://localhost:3000/auth/signout", {
                  method: "GET",
                  credentials: "include",
                });
                const data = await res.json();

                if (res.ok) {
                  alert(data.message || "Logged out successfully");
                  // Redirect to login page
                  navigate("/login");
                } else {
                  alert(data.message || "Logout failed");
                }
              } catch (err) {
                console.error("Logout error:", err);
                alert("Logout failed");
              }
            }}
            className="mt-4 flex items-center gap-3 text-red-400 hover:text-red-600"
          >
            <FaSignOutAlt />
            {isOpen && <span className="text-sm">Logout</span>}
          </button>

        </div>
      </aside>

      {/* Main area */}
      <main
        className={`flex-1 transition-all duration-300 ${isOpen ? "ml-64" : "ml-20"
          }`}
      >
        {activeSection === "home" && (
          <>
            {/* Top bar */}
            <div className="flex items-center justify-between px-8 py-5">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/FindMatches")}
                  className="bg-[#001A2A] text-white px-5 py-3 rounded-lg font-semibold shadow hover:bg-[#151521] transition"
                >
                  Find Matches Near You
                </button>


                {isPostMatchOpen && (
                  <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Background blur */}
                    <div
                      className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                      onClick={() => setIsPostMatchOpen(false)}
                    ></div>

                    {/* Modal content */}
                    <div className="relative z-10 w-[90%] max-w-5xl">
                      <PostMatch onClose={() => setIsPostMatchOpen(false)} />
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setIsPostMatchOpen(true)}
                  className="bg-[#001A2A] text-white px-5 py-3 rounded-lg font-semibold shadow hover:bg-[#151521] transition"
                >
                  Post a Match Requirement
                </button>
              </div>

              <h1 className="text-4xl font-extrabold text-gray-800">
                Welcome, {user?.name}
              </h1>
            </div>

            {/* Content grid */}
            <div className="px-8 pb-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left + middle main area */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  {/* Activity & Leaderboard */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Activity */}
                    <section className="md:col-span-2 bg-white rounded-xl p-6 shadow-md">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                          <FaChartLine className="text-2xl text-blue-600" />
                          <h2 className="text-2xl font-semibold">Activity</h2>
                        </div>
                      </div>

                      <div style={{ height: 260 }} className="w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={activityData} // activityData has {day, count}
                            margin={{ left: 0, right: 24 }}
                          >
                            <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
                            <XAxis dataKey="day" tick={{ fill: "#64748b" }} />
                            <YAxis tick={{ fill: "#64748b" }} />
                            <Tooltip />
                            <Line
                              type="monotone"
                              dataKey="count"
                              stroke="#2563eb"
                              strokeWidth={3}
                              dot={{ r: 4, stroke: "#fff", strokeWidth: 2 }}
                            />
                          </LineChart>

                        </ResponsiveContainer>
                      </div>
                    </section>

                    {/* Leaderboard */}
                    <section className="bg-white rounded-xl p-4 shadow-md">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-semibold">Leaderboard</h3>
                        <select
                          value={leaderboardView}
                          onChange={(e) => setLeaderboardView(e.target.value)}
                          className="border rounded-md px-3 py-1 text-sm"
                        >
                          <option>Weekly</option>
                          <option>Monthly</option>
                        </select>
                      </div>

                      <ul className="space-y-3">
                        {(leaderboardData ?? []).map((lbUser, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <img
                              src={
                                lbUser.profileImage
                                  ? `http://localhost:3000/uploads/${lbUser.profileImage}`
                                  : "http://localhost:3000/uploads/default.jpg"
                              }
                              alt={lbUser.username}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="font-medium">{lbUser.username}</span>
                            <span className="ml-auto text-gray-600">
                              {lbUser.matches} matches
                            </span>
                          </li>
                        ))}
                      </ul>



                    </section>
                  </div>

                  {/* Recommended & Featured */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recommended Matches */}
                    <section className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-md flex flex-col">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Recommended Matches</h2>
                        <div className="text-sm text-gray-500">
                          Suggestions based on your location & sports interests
                        </div>
                      </div>

                      {loadingMatches ? (
                        <div className="text-gray-500 text-center py-10">Loading matches...</div>
                      ) : recommendedMatches.length === 0 ? (
                        <div className="text-gray-500 text-center py-10">No matches found</div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {recommendedMatches.map((match) => (
                            <div
                              key={match._id}
                              className="bg-gray-50 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                            >
                              <div className="w-full h-30  md:h-59">
                                <img
                                  src={
                                    match.sportsType && match.sportsType.trim() !== ""
                                      ? `http://localhost:3000/matchuploads/${match.sportsType}.jpg`
                                      : "http://localhost:3000/matchuploads/default-match.jpg"
                                  }
                                  alt={match.sportsType || "Match"}
                                  className="h-44 w-full object-cover "
                                />


                              </div>

                              <div className="p-4 flex flex-col gap-2">
                                <h3 className="font-semibold text-lg">{match.matchName}</h3>
                                <p className="text-gray-600 text-sm">
                                  <FaMapMarkerAlt className="inline mr-1" />
                                  {match.address.city}, {match.address.state}
                                </p>
                                <p className="text-gray-600 text-sm flex items-center">
                                  <FaClock className="inline mr-1" />
                                  <span>
                                    {new Date(match.date).toLocaleDateString([], {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric'
                                    })}
                                  </span>
                                  <span className="ml-2">
                                    {new Date(match.date).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      hour12: true
                                    })}
                                  </span>
                                </p>
                                <p className="text-gray-600 text-sm">
                                  <span className="font-medium">Sports Type:</span> {match.sportsType}
                                </p>
                                <p className="text-gray-600 text-sm">
                                  <span className="font-medium">Players Required:</span> {match.playersRequired}
                                </p>

                                {/* Know More button */}
                                <button
                                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-fit"
                                  onClick={() => setSelectedMatch(match)}
                                >
                                  Know More
                                </button>
                              </div>
                            </div>

                          ))}
                        </div>
                      )}
                    </section>



                    {/* Match Details Modal */}
                    {selectedMatch && (
                      <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div
                          className="absolute inset-0 bg-black bg-opacity-50"
                          onClick={() => setSelectedMatch(null)}
                        ></div>

                        <div className="relative z-10 bg-white rounded-xl w-[90%] max-w-3xl p-6 shadow-lg">
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
                                alt={selectedMatch.sportsType || "Match"}
                                className="w-full h-full object-cover"
                              />

                            </div>

                            <div className="flex-1 flex flex-col justify-between text-gray-700 text-lg gap-4">
                              <div className="flex gap-4">
                                <p><strong>Sport:</strong> {selectedMatch.sportsType}</p>
                                <p><strong>Type:</strong> {selectedMatch.matchType}</p>
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
                                  {selectedMatch.address?.area}, {selectedMatch.address?.city}, {selectedMatch.address?.state}
                                </span>
                                <a
                                  href={selectedMatch.coordinates.mapLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline flex items-center gap-1"
                                >
                                  Map
                                </a>
                              </div>

                              <div>
                                <p><strong>Players Required:</strong> {selectedMatch.playersRequired}</p>
                                <p><strong>Joined Players:</strong> {selectedMatch?.players?.length ?? 0}</p>
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
                            className={`px-6 py-3 rounded-md font-medium ${selectedMatch.players?.some(
                              (p) => p.playerId === userId
                            )
                              ? "bg-green-600 cursor-not-allowed"
                              : "bg-[#001A2A] text-white hover:bg-blue-900"
                              }`}
                            onClick={() =>
                              !selectedMatch.players?.some((p) => p.playerId === userId) &&
                              handleJoinMatch(selectedMatch._id)
                            }
                            disabled={selectedMatch.players?.some((p) => p.playerId === userId)}
                          >
                            {selectedMatch.players?.some((p) => p.playerId === userId)
                              ? "Already Joined"
                              : "Join Now"}
                          </button>
                        </div>
                      </div>
                    )}



                    {/* Featured Matches */}
                    <section className="bg-white rounded-2xl p-6 shadow-md ">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold">Featured Matches Today</h2>
                        <div className="text-sm text-gray-500">Top picks for you</div>
                      </div>

                      {featuredMatches.length === 0 ? (
                        <div className="text-gray-500 text-center py-10">No featured matches today.</div>
                      ) : (
                        <div className="grid grid-cols-1 gap-6">
                          {featuredMatches.map((f) => (
                            <div
                              key={f._id}
                              className="bg-gray-50 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
                            >
                              <div className="w-full h-40 sm:h-48 md:h-56">
                                <img
                                  src={
                                    f.sportsType && f.sportsType.trim() !== ""
                                      ? `http://localhost:3000/matchuploads/${f.sportsType}.jpg`
                                      : "http://localhost:3000/matchuploads/default-match.jpg"
                                  }
                                  alt={f.sportsType || "Match"}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <div className="p-4 flex flex-col gap-2">
                                <h4 className="font-semibold text-lg">{f.matchName}</h4>

                                <p className="text-gray-600 text-sm flex items-center">
                                  <FaMapMarkerAlt className="inline mr-1" />
                                  {f.address.city}, {f.address.state}
                                </p>
                                <p className="text-gray-600 text-sm flex items-center">
                                  <FaClock className="inline mr-1" />
                                  {new Date(f.date).toLocaleDateString([], {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}{" "}
                                  {new Date(f.date).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  })}
                                </p>
                                <p className="text-gray-600 text-sm">
                                  <span className="font-medium">Sport:</span> {f.sportsType}
                                </p>
                                <p className="text-gray-600 text-sm">
                                  <span className="font-medium">Players Required:</span> {f.playersRequired}
                                </p>

                                {/* Know More button */}
                                <button
                                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-fit"
                                  onClick={() => setSelectedMatch(f)} // same as Recommended
                                >
                                  Know More
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </section>




                  </div>
                </div>

                {/* Right panel: top-to-bottom full height */}
                <aside className="flex-[0.35] bg-gray-50 p-6 rounded-xl shadow-md min-h-screen flex flex-col gap-5">
                  {/* User Card */}
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex flex-col items-center">
                      <img
                        src={user?.profileImage ? `http://localhost:3000/uploads/${user.profileImage}` : "http://localhost:3000/uploads/default.jpg"}
                        alt="User"
                        className="w-20 h-20 rounded-full mb-3 object-cover"
                      />
                      <div className="text-lg font-semibold">{user?.name || "Loading..."}</div>
                      <div className="text-xs text-gray-400">
                        {user?.address || "Loading..."}
                      </div>

                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center mt-5">
                      <div>
                        <div className="font-semibold text-lg">{user?.bodySpecs?.weight || "-"}</div>
                        <div className="text-xs text-gray-400">Weight</div>
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{user?.bodySpecs?.height || "-"}</div>
                        <div className="text-xs text-gray-400">Height</div>
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{user?.bodySpecs?.age || "-"}</div>
                        <div className="text-xs text-gray-400">Age</div>
                      </div>
                    </div>

                  </div>

                  {/* Game history */}
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <h4 className="font-semibold mb-3">Your game history</h4>
                    <ul className="space-y-3 text-sm">
                      {user && Object.keys(user.counts).length > 0 ? (
                        Object.entries(user.counts).map(([sport, matches]) => {
                          const emojiMap = {
                            cricket: "🏏",
                            football: "⚽",
                            tennis: "🎾",
                            badminton: "🏸",
                            basketball: "🏀",
                            hockey: "🏑",
                            volleyball: "🏐",
                            tabletennis: "🏓",
                            golf: "⛳"
                          };


                          return (
                            <li key={sport} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span>{emojiMap[sport.toLowerCase()]}</span>
                                <div>
                                  <div className="font-medium">{sport}</div>
                                </div>
                              </div>
                              <div className="text-gray-500">{matches}</div>
                            </li>
                          );
                        })
                      ) : (
                        <li className="text-gray-400 text-sm text-center">No games played yet</li>
                      )}
                    </ul>



                  </div>

                  {/* Monthly Progress */}
                  <div className="bg-white rounded-xl p-4 shadow-sm text-center">
                    <h4 className="font-semibold mb-3">Monthly Progress</h4>
                    <div className="mx-auto w-28 h-28 rounded-full relative flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                      <div
                        className="absolute inset-0 rounded-full border-8 border-blue-500"
                        style={{
                          clipPath: `inset(${100 - (percentile || 0)}% 0 0 0)` // fill based on percentile
                        }}
                      />
                      <div className="relative font-bold text-lg">{percentile}%</div>
                    </div>
                    <div className="text-xs text-gray-400 mt-3">
                      You are in top {percentile}% users of this month
                    </div>
                  </div>


                  {/* Scheduled Matches */}
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <h4 className="font-semibold mb-3">Your Scheduled Matches</h4>
                    <div className="space-y-3 text-sm">
                      {user?.scheduledMatches?.length > 0 ? (
                        user.scheduledMatches.map((m, idx) => (
                          <div key={idx}>
                            <div className="font-medium">{m.matchName}</div>
                            <div className="text-xs text-gray-400">
                              {m.address?.area}, {m.address?.city} —{" "}
                              {new Date(m.date).toLocaleString([], {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-400 text-sm text-center">
                          No scheduled matches
                        </div>
                      )}
                    </div>
                  </div>




                  <div className="bg-[#001A2A] rounded-xl p-2 shadow-sm flex gap-2">
                    <button
                      className="flex-1 text-slate-100 text-lg py-2 rounded-lg"
                      onClick={() =>
                        navigate("/profile", {
                          state: { from: "edit-profile" },
                        })
                      } // ✅ state pass kiya
                    >
                      Edit Profile
                    </button>
                  </div>
                </aside>
              </div>
            </div>
          </>
        )}
        {activeSection === "profile" && <Profile />}
      </main>
      <FindUsers
        isOpen={isFindUsersOpen}
        onClose={() => setIsFindUsersOpen(false)}
      />

      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-xl shadow-lg flex flex-col overflow-hidden z-50">
          {/* Header */}
          <div className="bg-[#001A2A] text-white p-3 flex justify-between items-center">
            <span>FitMate AI Chat</span>
            <button onClick={() => setIsChatOpen(false)}>✕</button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto h-64 flex flex-col gap-2">
            {chatMessages.length === 0 ? (
              <div className="text-gray-400 text-sm">Ask me anything about fitness...</div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-lg ${msg.role === "user" ? "bg-blue-100 self-end" : "bg-gray-100 self-start"}`}
                >
                  {msg.content}
                </div>
              ))
            )}
            {isChatLoading && <div className="text-gray-400 text-sm">Typing...</div>}
          </div>

          {/* Input */}
          <div className="flex border-t p-2">
            <input
              type="text"
              className="flex-1 border rounded-l px-2 py-1 focus:outline-none"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white px-4 py-1 rounded-r hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      )}


      {/* AI Chat Floating Button */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-2 z-50">
        {/* ✅ Auto Message Bubble */}
        {showChatMessage && (
          <div className="p-[6px] rounded-lg bg-gradient-to-r from-[#001A2A] to-blue-300 shadow-lg animate-bounce">
            <div className="bg-white text-gray-800 px-4 py-2 rounded-lg text-sm">
              Hii {user?.name}, need fitness tips? Ask me..
            </div>
          </div>
        )}


        {/* ✅ Chat Button */}
        <button
          onClick={() => setIsChatOpen(true)}
          className="bg-[#001A2A] hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition"
          aria-label="AI Chat"
        >
          <FaRobot className="text-5xl" />
        </button>
      </div>

    </div>
  );
}
