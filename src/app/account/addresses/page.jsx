"use client";

import React, { useState } from "react";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([
    {
      id: "addr_1",
      name: "VIVAAN VEER",
      company: "Mouleeta Privé Concierge",
      address1: "14/B, Pali Hill, Bandra West",
      address2: "Apt 402, Luxury Heights",
      city: "Mumbai",
      province: "Maharashtra",
      zip: "400050",
      country: "India",
      phone: "+91 98200 12345",
      isDefault: true,
    },
    {
      id: "addr_2",
      name: "VIVAAN VEER",
      company: "",
      address1: "Penthouse 4B, The Oberoi Residences",
      address2: "Golf Course Road, Sector 54",
      city: "Gurugram",
      province: "Haryana",
      zip: "122002",
      country: "India",
      phone: "+91 98200 12345",
      isDefault: false,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddr, setEditingAddr] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [pinStatus, setPinStatus] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: "VIVAAN VEER",
    company: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    zip: "",
    country: "India",
    phone: "",
    isDefault: false,
  });

  // Auto-capture City & State from Indian/International PIN code
  const handlePinChange = async (e) => {
    const pin = e.target.value;
    setNewAddr((prev) => ({ ...prev, zip: pin }));

    if (/^\d{6}$/.test(pin.trim())) {
      setIsLocating(true);
      setPinStatus("Auto-capturing City & State from PIN...");
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin.trim()}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice && data[0].PostOffice.length > 0) {
          const po = data[0].PostOffice[0];
          const detectedCity = po.District || po.Block || po.Name;
          const detectedState = po.State;
          setNewAddr((prev) => ({
            ...prev,
            city: detectedCity || prev.city,
            province: detectedState || prev.province,
          }));
          setPinStatus(`✨ Auto-captured: ${detectedCity}, ${detectedState}`);
        } else {
          setPinStatus("PIN Code not found. Please verify or enter City & State manually.");
        }
      } catch (err) {
        setPinStatus("Could not fetch PIN details.");
      } finally {
        setIsLocating(false);
      }
    } else {
      if (pinStatus) setPinStatus("");
    }
  };

  // Google Maps GPS Geolocation Auto-Capture
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setPinStatus("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    setPinStatus("Locating via GPS coordinates like Google Maps...");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          if (data && data.address) {
            const addr = data.address;
            const detectedCity = addr.city || addr.town || addr.district || addr.county || "";
            const detectedState = addr.state || "";
            const detectedZip = addr.postcode || "";
            const detectedRoad = addr.road || addr.suburb || "";
            setNewAddr((prev) => ({
              ...prev,
              city: detectedCity || prev.city,
              province: detectedState || prev.province,
              zip: detectedZip || prev.zip,
              address1: prev.address1 || detectedRoad,
            }));
            setPinStatus(`✨ Auto-captured location: ${detectedCity}, ${detectedState}`);
          }
        } catch (err) {
          setPinStatus("Could not reverse-geocode coordinates.");
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        setPinStatus("Location permission denied or unavailable.");
      }
    );
  };

  // Google Maps style Autocomplete on typing Street/Area (No GPS required)
  const handleAddress1Change = async (e) => {
    const val = e.target.value;
    setNewAddr((prev) => ({ ...prev, address1: val }));

    if (val.trim().length >= 3) {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            val.trim()
          )}&addressdetails=1&limit=5&countrycodes=in,us,gb,ae,sg,ca,au`
        );
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSuggestions(data);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (item) => {
    const addr = item.address || {};
    const detectedRoad = addr.road || addr.suburb || addr.neighbourhood || item.display_name.split(',')[0] || "";
    const detectedSub = addr.suburb || addr.city_district || "";
    const fullStreet = detectedSub && detectedRoad !== detectedSub ? `${detectedRoad}, ${detectedSub}` : detectedRoad;
    const detectedCity = addr.city || addr.town || addr.district || addr.county || addr.state_district || "";
    const detectedState = addr.state || "";
    const detectedZip = addr.postcode || "";

    setNewAddr((prev) => ({
      ...prev,
      address1: fullStreet || prev.address1,
      city: detectedCity || prev.city,
      province: detectedState || prev.province,
      zip: detectedZip || prev.zip,
    }));
    setSuggestions([]);
    setPinStatus(`✨ Auto-completed: ${detectedCity}, ${detectedState} (${detectedZip || 'Verified Area'})`);
  };

  const handleSetDefault = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  const handleRemove = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleOpenEdit = (addr) => {
    setEditingAddr(addr);
    setPinStatus("");
    setSuggestions([]);
    setNewAddr(addr);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingAddr(null);
    setPinStatus("");
    setSuggestions([]);
    setNewAddr({
      name: "VIVAAN VEER",
      company: "",
      address1: "",
      address2: "",
      city: "",
      province: "",
      zip: "",
      country: "India",
      phone: "",
      isDefault: false,
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (editingAddr) {
      setAddresses((prev) =>
        prev.map((a) => (a.id === editingAddr.id ? { ...newAddr, id: a.id } : a))
      );
    } else {
      const created = {
        ...newAddr,
        id: `addr_${Date.now()}`,
      };
      if (created.isDefault) {
        setAddresses((prev) =>
          prev.map((a) => ({ ...a, isDefault: false })).concat(created)
        );
      } else {
        setAddresses((prev) => [...prev, created]);
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="border-b border-gray-200/80 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-gray-900">
              Saved Addresses
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your default shipping and billing destinations for rapid checkout.
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="bg-black text-white px-6 py-2.5 text-xs font-medium uppercase tracking-[0.15em] hover:bg-gray-800 transition-colors w-fit cursor-pointer"
          >
            + Add New Address
          </button>
        </div>
      </div>

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`bg-white border p-6 sm:p-8 rounded-sm shadow-xs flex flex-col justify-between transition-all ${
              addr.isDefault ? "border-gray-900 ring-1 ring-gray-900" : "border-gray-200/80 hover:border-gray-300"
            }`}
          >
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-900">
                  {addr.name}
                </h2>
                {addr.isDefault ? (
                  <span className="bg-black text-white text-[9px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-none">
                    Default Address
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-600 text-[9px] font-medium uppercase tracking-widest px-2.5 py-1 rounded-none">
                    Secondary
                  </span>
                )}
              </div>

              <div className="space-y-1.5 text-sm text-gray-700 leading-relaxed font-light">
                {addr.company && <p className="font-medium text-gray-900">{addr.company}</p>}
                <p>{addr.address1}</p>
                {addr.address2 && <p>{addr.address2}</p>}
                <p>
                  {addr.city}, {addr.province} {addr.zip}
                </p>
                <p className="font-medium text-gray-900 pt-1">{addr.country}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 font-mono">
                  Phone: {addr.phone || "Not provided"}
                </p>
              </div>
            </div>

            {/* Card Actions */}
            <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
              {!addr.isDefault ? (
                <button
                  type="button"
                  onClick={() => handleSetDefault(addr.id)}
                  className="text-xs font-medium uppercase tracking-wider text-gray-600 hover:text-black transition-colors cursor-pointer"
                >
                  Set as Default
                </button>
              ) : (
                <span className="text-[11px] uppercase tracking-wider text-gray-400">
                  Primary Destination
                </span>
              )}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(addr)}
                  className="border border-gray-300 bg-white hover:border-black text-gray-800 px-4 py-2 text-xs font-medium uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Edit Address
                </button>
                {addresses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemove(addr.id)}
                    className="border border-red-200 bg-white hover:border-red-600 text-red-600 px-4 py-2 text-xs font-medium uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 sm:p-4">
          <div className="bg-white max-w-xl w-full p-5 sm:p-8 rounded-sm shadow-xl space-y-6 animate-fadeIn max-h-[90vh] overflow-y-auto border border-gray-100">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="text-lg font-light uppercase tracking-widest text-gray-900">
                {editingAddr ? "Edit Address" : "New Shipping Address"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-black text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Google Maps Location Assist Bar */}
            <div className="bg-stone-50 border border-stone-200 p-3.5 sm:p-4 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <div className="text-xs">
                  <p className="font-medium text-stone-900">Google Maps Location Assist</p>
                  <p className="text-[11px] text-stone-500">Auto-capture City & State via PIN or GPS</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={isLocating}
                className="w-full sm:w-auto px-4 py-2 bg-black hover:bg-stone-800 text-white text-[11px] font-medium uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
              >
                {isLocating ? "Locating..." : "📍 Detect Current Location"}
              </button>
            </div>

            {pinStatus && (
              <div className="text-xs px-3.5 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium rounded-sm flex items-center justify-between">
                <span>{pinStatus}</span>
                <button type="button" onClick={() => setPinStatus("")} className="text-emerald-600 hover:text-emerald-900 ml-2">✕</button>
              </div>
            )}

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newAddr.name}
                  onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>

              {/* Building / Apartment Name Required */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-stone-900 font-semibold mb-1">
                  Building / Apartment / Flat Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. French Apartment, Flat 603, Luxury Heights"
                  value={newAddr.company}
                  onChange={(e) => setNewAddr({ ...newAddr, company: e.target.value })}
                  className="w-full border border-stone-400 bg-stone-50/50 px-3 py-2.5 text-sm focus:outline-none focus:border-black focus:bg-white transition-colors"
                />
              </div>

              <div className="relative">
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">Address Line 1 (Street / Area) *</label>
                <input
                  type="text"
                  required
                  placeholder="Start typing street, area, or landmark (e.g. Pali Hill, Cyber Hub)"
                  value={newAddr.address1}
                  onChange={handleAddress1Change}
                  className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
                />
                {isSearching && (
                  <div className="absolute right-3 top-9 text-[11px] text-stone-400 animate-pulse">
                    Searching suggestions...
                  </div>
                )}
                {suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-stone-300 shadow-2xl rounded-sm z-50 max-h-56 overflow-y-auto divide-y divide-stone-100">
                    <div className="px-3 py-1.5 bg-stone-100 text-[10px] uppercase tracking-widest text-stone-500 font-semibold flex justify-between items-center">
                      <span>Google Maps Autocomplete Suggestions</span>
                      <button
                        type="button"
                        onClick={() => setSuggestions([])}
                        className="text-stone-400 hover:text-black font-bold cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                    {suggestions.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectSuggestion(item)}
                        className="px-3 py-2.5 hover:bg-stone-50 cursor-pointer transition-colors text-left"
                      >
                        <p className="text-xs font-semibold text-stone-900 truncate">
                          {item.display_name.split(',')[0]}
                        </p>
                        <p className="text-[11px] text-stone-500 line-clamp-1">
                          {item.display_name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">Address Line 2 (Landmark / Sector - Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Near Town Central Mall"
                  value={newAddr.address2}
                  onChange={(e) => setNewAddr({ ...newAddr, address2: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>

              {/* Postal Code & Phone - PIN input triggers City/State capture */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-stone-900 font-semibold mb-1">
                    Postal Code / PIN Code <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 400050 (Auto-fills City & State)"
                    value={newAddr.zip}
                    onChange={handlePinChange}
                    className="w-full border border-stone-400 bg-stone-50/50 px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-black focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98200 12345"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>

              {/* City & State Auto-captured Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                    City <span className="text-[10px] text-emerald-700 font-normal">(Auto-captured)</span> *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Auto-captured from PIN / GPS"
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full border border-gray-300 bg-stone-50/80 px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-black focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">
                    State / Province <span className="text-[10px] text-emerald-700 font-normal">(Auto-captured)</span> *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Auto-captured from PIN / GPS"
                    value={newAddr.province}
                    onChange={(e) => setNewAddr({ ...newAddr, province: e.target.value })}
                    className="w-full border border-gray-300 bg-stone-50/80 px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-black focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAddr.isDefault}
                    onChange={(e) => setNewAddr({ ...newAddr, isDefault: e.target.checked })}
                    className="h-4 w-4 border-gray-300 text-black focus:ring-black accent-black"
                  />
                  <span className="text-xs text-gray-700 font-medium">Set as default shipping destination</span>
                </label>
              </div>

              <div className="pt-5 flex flex-col sm:flex-row justify-end gap-3 border-t border-gray-100 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs uppercase tracking-widest text-gray-600 hover:text-black cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-3 text-xs font-semibold uppercase tracking-widest hover:bg-gray-800 cursor-pointer shadow-sm text-center"
                >
                  Save Shipping Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
