// src/pages/FindUsers.jsx
import React, { useState, useEffect } from "react";

const FindUsers = ({ isOpen, onClose }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/find-users")
      .then(res => res.json())
      .then(users => {
        console.log(users);
        setUsers(users);
      })
      .catch(err => console.error("Error loading users:", err));
  }, []);


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setRecentSearches([searchTerm, ...recentSearches.slice(0, 4)]);
      const res = await fetch(
        `http://localhost:3000/auth/find-users?search=${searchTerm}`
      );
      const data = await res.json();
      setUsers(data);
    }
  };

  const clearSearch = (term) =>
    setRecentSearches(recentSearches.filter((s) => s !== term));

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm transition-opacity ${isOpen ? "opacity-100 z-40" : "opacity-0 -z-10"
          }`}
        onClick={onClose}
      ></div>

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-gray-50 shadow-2xl transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"
          } flex flex-col p-6 z-50`}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-[#001A2A] tracking-wide">
            Discover Players
          </h1>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-xl font-bold"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center mb-4 border rounded-md px-4 py-2 w-full focus-within:ring-2 focus-within:ring-blue-500 bg-white transition"
        >
          <input
            type="text"
            placeholder="Search by name, sport, or city"
            className="flex-1 outline-none text-lg"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button
            type="submit"
            className="ml-3 bg-[#001A2A] text-white px-4 py-2 rounded-md hover:bg-blue-900 transition"
          >
            Search
          </button>
        </form>

        {recentSearches.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Recent Searches</h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((term, idx) => (
                <span
                  key={idx}
                  className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm"
                >
                  {term}
                  <button
                    onClick={() => clearSearch(term)}
                    className="ml-2 text-red-500 hover:text-red-700 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-4">
          {users.length > 0 ? (
            users.map((u) => (
              <div
                key={u._id}
                className="flex items-center gap-4 bg-white rounded-lg shadow hover:shadow-lg transition p-4"
              >
                <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-full border">
                  <img
                    src={u.img}
                    alt={u.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-[#001A2A]">
                    {u.name}
                  </h3>
                  <p className="text-gray-700 text-sm">
                    {u.sport} | {u.level} | {u.city}
                  </p>
                  <p className="text-gray-600 text-sm mt-1">{u.bio}</p>
                </div>
                <button className="bg-[#001A2A] text-white px-3 py-1.5 rounded-md hover:bg-blue-900 text-sm">
                  View Profile
                </button>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center mt-6">
              No users found
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FindUsers;
