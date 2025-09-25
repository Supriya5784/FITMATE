// pages/SignUp.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.jpg";

export default function SignUp() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    age: "",
    height: "",
    weight: "",
    houseNo: "",
    area: "",
    city: "",
    state: "",
    profileImage: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = async (e) => {
    e.preventDefault();

    if (!agreed) {
      alert("You must agree to the terms before continuing.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/auth/signup/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Validation failed");
        return;
      }

      setStep(2); // ✅ Only go to step 2 if backend says it's okay
    } catch (err) {
      console.error("Validation error:", err);
      alert("Something went wrong. Try again.");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 🔹 Step 1 → send signup basic info
      const signupRes = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // cookie/session ke liye
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          name: formData.fullName,
          email: formData.email,
        }),
      });

      if (!signupRes.ok) {
        const errData = await signupRes.json();
        alert("Signup failed: " + errData.message);
        return;
      }

      console.log("✅ Basic signup success!");

      // 🔹 Step 2 → send extra profile data
      if (!formData.sport1 && !formData.sport2 && !formData.sport3) {
        alert("Please enter at least one sport.");
        return;
      }

      const formPayload = new FormData();
      formPayload.append("username", formData.username);
      formPayload.append("height", formData.height);
      formPayload.append("weight", formData.weight);
      formPayload.append("age", formData.age);
      formPayload.append("houseNo", formData.houseNo);
      formPayload.append("area", formData.area);
      formPayload.append("city", formData.city);
      formPayload.append("state", formData.state);
      formPayload.append(
        "sports",
        JSON.stringify(
          [formData.sport1, formData.sport2, formData.sport3]
            .filter(Boolean)
            .map((sport) => sport.toLowerCase())
        )
      );
      if (formData.profileImage) {
        formPayload.append("profileImage", formData.profileImage);
      }

      const profileRes = await fetch("http://localhost:3000/auth/signup/data", {
        method: "POST",
        body: formPayload,
        credentials: "include", // keep cookies/session
      });

      if (!profileRes.ok) {
        const errData = await profileRes.json();
        alert("Profile save failed: " + errData.message);
        return;
      }

      console.log("✅ Profile data saved!");

      alert(" Signup completed successfully!");
      navigate("/Home");

    } catch (err) {
      console.error("❌ Signup error:", err);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#001A2A]">
      <div className="flex w-[1200px] h-[700px] bg-white/95 rounded-2xl shadow-2xl ring-1 ring-gray-200 overflow-hidden backdrop-blur-sm">
        {/* Left - Form */}
        <div className="w-1/2 flex flex-col items-center justify-center p-12">
          <h2 className="text-3xl font-extrabold mb-2 text-[#001A2A] tracking-wide drop-shadow-sm">
            {step === 1 ? "Join Us!" : "Additional Details"}
          </h2>
          <p className="text-[#001A2A] mb-8 text-base font-medium italic">
            {step === 1 ? "Create New Account" : "Tell us more about yourself"}
          </p>

          <form
            className="w-full space-y-4"
            onSubmit={step === 1 ? handleNext : handleSubmit}
          >
            {/* Step 1 */}
            {step === 1 && (
              <>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  name="username"
                  placeholder="Username (unique)"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address (unique)"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />

                {/* Checkbox */}
                <div className="flex items-start space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="terms" className="text-[#001A2A] text-sm">
                    By signing up, you agree to the{" "}
                    <span className="text-indigo-600 underline cursor-pointer">
                      Terms of Services
                    </span>
                    ,{" "}
                    <span className="text-indigo-600 underline cursor-pointer">
                      Privacy Policy
                    </span>
                    , and{" "}
                    <span className="text-indigo-600 underline cursor-pointer">
                      Cookies Policy
                    </span>
                    .
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!agreed}
                  className={`w-full py-3 rounded-lg font-bold tracking-wider shadow-md transition mt-3
                    ${agreed
                      ? "bg-[#001A2A] text-white hover:bg-indigo-800"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                    }`}
                >
                  Next
                </button>
              </>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                {/* Age/Height/Weight */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl shadow-lg p-4 text-center">
                    <p className="text-sm text-[#001A2A] mb-2">Age</p>
                    <input
                      type="number"
                      name="age"
                      placeholder="e.g., 25"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-4 text-center">
                    <p className="text-sm text-[#001A2A] mb-2">Height (cm)</p>
                    <input
                      type="number"
                      name="height"
                      placeholder="e.g., 170"
                      value={formData.height}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-4 text-center">
                    <p className="text-sm text-[#001A2A] mb-2">Weight (kg)</p>
                    <input
                      type="number"
                      name="weight"
                      placeholder="e.g., 65"
                      value={formData.weight}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="bg-gray-50 p-6 rounded-2xl shadow-inner border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-[#001A2A]">Address</h3>
                  <input
                    type="text"
                    name="houseNo"
                    placeholder="House No."
                    value={formData.houseNo}
                    onChange={handleChange}
                    required
                    className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      name="area"
                      placeholder="Area"
                      value={formData.area}
                      onChange={handleChange}
                      required
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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

                {/* Sports Interests */}
                <div className="bg-gray-50 p-6 rounded-2xl shadow-inner border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4 text-[#001A2A]">
                    Your Interests in Sports <span className="text-sm text-gray-500">(At least 1 required)</span>
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      name="sport1"
                      placeholder="Sport 1"
                      value={formData.sport1 || ""}
                      onChange={handleChange}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      name="sport2"
                      placeholder="Sport 2"
                      value={formData.sport2 || ""}
                      onChange={handleChange}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      name="sport3"
                      placeholder="Sport 3"
                      value={formData.sport3 || ""}
                      onChange={handleChange}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Profile Image Upload */}
                <div className="bg-white rounded-xl shadow-lg p-4 text-center">
                  <p className="text-sm text-[#001A2A] mb-2">Upload Profile Picture</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({ ...formData, profileImage: e.target.files[0] })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
               focus:ring-indigo-500 focus:outline-none"
                  />
                </div>

                {/* Navigation */}
                <div className="flex justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/2 bg-gray-300 text-black py-3 rounded-lg hover:bg-gray-400 transition"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-[#001A2A] text-white py-3 rounded-lg hover:bg-indigo-800 transition"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}

          </form>
        </div>

        {/* Right - Image */}
        <div className="w-1/2 h-full flex items-center justify-center">
          <img
            src={Logo}
            alt="Fitmate"
            className="w-[95%] h-[95%] object-cover rounded-2xl shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}