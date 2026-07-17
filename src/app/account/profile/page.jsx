"use client";

import React, { useState } from "react";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "Vivaan",
    lastName: "Veer",
    email: "vivaan.veer@mouleeta.com",
    countryCode: "+91",
    phone: "98200 12345",
    gender: "Prefer not to say",
    acceptsMarketing: true,
  });
  const [showNotification, setShowNotification] = useState(false);

  const countryCodes = [
    { code: "+91", flag: "🇮🇳", label: "India (+91)" },
    { code: "+1", flag: "🇺🇸", label: "United States (+1)" },
    { code: "+44", flag: "🇬🇧", label: "United Kingdom (+44)" },
    { code: "+971", flag: "🇦🇪", label: "United Arab Emirates (+971)" },
    { code: "+33", flag: "🇫🇷", label: "France (+33)" },
    { code: "+61", flag: "🇦🇺", label: "Australia (+61)" },
    { code: "+65", flag: "🇸🇬", label: "Singapore (+65)" },
    { code: "+49", flag: "🇩🇪", label: "Germany (+49)" },
    { code: "+81", flag: "🇯🇵", label: "Japan (+81)" },
    { code: "+39", flag: "🇮🇹", label: "Italy (+39)" },
    { code: "+34", flag: "🇪🇸", label: "Spain (+34)" },
    { code: "+41", flag: "🇨🇭", label: "Switzerland (+41)" },
    { code: "+966", flag: "🇸🇦", label: "Saudi Arabia (+966)" },
    { code: "+974", flag: "🇶🇦", label: "Qatar (+974)" },
  ];

  const genderOptions = [
    "Prefer not to say",
    "Female",
    "Male",
    "Non-binary",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsEditing(false);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const selectedCountry = countryCodes.find((c) => c.code === formData.countryCode) || countryCodes[0];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="border-b border-gray-200/80 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-gray-900">
            Profile Details
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Personal details and account preferences mapped via Shopify Customer API.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-black text-white px-6 py-2.5 text-xs font-medium uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors cursor-pointer shadow-sm"
            >
              Enable Edit Mode
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="border border-gray-300 bg-white px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-gray-600 hover:text-black transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={(e) => handleSave(e)}
                className="bg-emerald-700 text-white px-6 py-2.5 text-xs font-medium uppercase tracking-[0.15em] hover:bg-emerald-800 transition-colors cursor-pointer shadow-sm"
              >
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      {/* Notification Toast */}
      {showNotification && (
        <div className="bg-black text-white px-5 py-3.5 rounded-sm flex items-center justify-between text-xs tracking-wider animate-fadeIn shadow-lg">
          <span>✓ Profile changes successfully saved.</span>
          <button onClick={() => setShowNotification(false)} className="text-gray-400 hover:text-white cursor-pointer">✕</button>
        </div>
      )}

      {/* Profile Details Form */}
      <form onSubmit={handleSave} className="space-y-8 bg-white border border-gray-200/80 p-6 sm:p-8 rounded-sm shadow-xs">
        
        {/* Personal Information Grid */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-900 mb-6">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* First Name */}
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="block text-xs font-medium uppercase tracking-wider text-gray-600"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full border px-4 py-3 text-sm rounded-none transition-colors ${
                  isEditing
                    ? "border-gray-900 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-black"
                    : "border-gray-200 bg-gray-50/70 text-gray-800 cursor-not-allowed"
                }`}
              />
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className="block text-xs font-medium uppercase tracking-wider text-gray-600"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full border px-4 py-3 text-sm rounded-none transition-colors ${
                  isEditing
                    ? "border-gray-900 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-black"
                    : "border-gray-200 bg-gray-50/70 text-gray-800 cursor-not-allowed"
                }`}
              />
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-xs font-medium uppercase tracking-wider text-gray-600"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full border px-4 py-3 text-sm rounded-none transition-colors ${
                  isEditing
                    ? "border-gray-900 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-black"
                    : "border-gray-200 bg-gray-50/70 text-gray-800 cursor-not-allowed"
                }`}
              />
            </div>

            {/* Phone Number with International Dialing Codes + Flags */}
            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-xs font-medium uppercase tracking-wider text-gray-600"
              >
                Phone Number
              </label>
              {isEditing ? (
                <div className="flex">
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="border border-r-0 border-gray-900 bg-white text-gray-900 px-3 py-3 text-sm rounded-none focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="98200 12345"
                    className="w-full border border-gray-900 bg-white px-4 py-3 text-sm text-gray-900 rounded-none focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              ) : (
                <div className="w-full border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm text-gray-800 flex items-center gap-2 cursor-not-allowed">
                  <span>{selectedCountry.flag}</span>
                  <span className="font-medium text-gray-600">{formData.countryCode}</span>
                  <span>{formData.phone}</span>
                </div>
              )}
            </div>

            {/* Gender Dropdown */}
            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor="gender"
                className="block text-xs font-medium uppercase tracking-wider text-gray-600"
              >
                Gender
              </label>
              {isEditing ? (
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border border-gray-900 bg-white px-4 py-3 text-sm text-gray-900 rounded-none focus:outline-none focus:ring-1 focus:ring-black cursor-pointer"
                >
                  {genderOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={formData.gender}
                  disabled
                  className="w-full border border-gray-200 bg-gray-50/70 px-4 py-3 text-sm text-gray-800 cursor-not-allowed"
                />
              )}
            </div>
          </div>
        </div>

        {/* Marketing & Newsletter Preferences */}
        <div className="pt-6 border-t border-gray-200/60 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-900">
            Privé Communications
          </h3>
          <label className={`flex items-start gap-3 ${isEditing ? "cursor-pointer" : "cursor-not-allowed"}`}>
            <input
              type="checkbox"
              name="acceptsMarketing"
              checked={formData.acceptsMarketing}
              onChange={handleChange}
              disabled={!isEditing}
              className="mt-1 h-4 w-4 border-gray-300 text-black focus:ring-black rounded-none accent-black"
            />
            <span className="text-sm text-gray-600 leading-relaxed">
              Subscribe to exclusive Privé drops, runway previews, and bespoke member updates.
            </span>
          </label>
        </div>

        {/* Action Button (Black Box at bottom only) */}
        <div className="pt-4 flex justify-end gap-4">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-3.5 text-xs font-medium uppercase tracking-[0.15em] text-gray-600 hover:text-black transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-black text-white px-8 py-3.5 text-xs font-medium uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors cursor-pointer shadow-sm"
              >
                Save Profile Changes
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-black text-white px-8 py-3.5 text-xs font-medium uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors cursor-pointer shadow-sm"
            >
              Click Here to Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
