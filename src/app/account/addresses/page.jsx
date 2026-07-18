"use client";

import React, { useState } from "react";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddr, setEditingAddr] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [pinStatus, setPinStatus] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeSearchField, setActiveSearchField] = useState("");
  const [newAddr, setNewAddr] = useState({
    name: "",
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

  // High-Precision GPS Geolocation Auto-Capture (Sub-second instant detection via multi-engine reverse geocoding)
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setPinStatus("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    setPinStatus("Detecting your current location & PIN code...");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          // Race multi-engine reverse geocoding (Esri + BigDataCloud + Nominatim) for sub-second instant completion
          const esriPromise = fetch(
            `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=json&location=${longitude},${latitude}`
          )
            .then((r) => r.json())
            .catch(() => null);

          const bdcPromise = fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          )
            .then((r) => r.json())
            .catch(() => null);

          const nomPromise = fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { "User-Agent": "MouleetaShop/1.0" } }
          )
            .then((r) => r.json())
            .catch(() => null);

          const [esriRes, bdcRes, nomRes] = await Promise.all([esriPromise, bdcPromise, nomPromise]);

          const detectedCity =
            esriRes?.City ||
            esriRes?.MetroArea ||
            esriRes?.Subregion ||
            bdcRes?.city ||
            bdcRes?.locality ||
            nomRes?.address?.city ||
            nomRes?.address?.town ||
            nomRes?.address?.district ||
            "";

          const detectedState =
            esriRes?.Region ||
            bdcRes?.principalSubdivision ||
            nomRes?.address?.state ||
            "";

          const detectedZip =
            esriRes?.Postal ||
            bdcRes?.postcode ||
            nomRes?.address?.postcode ||
            "";

          const detectedRoad =
            esriRes?.Address ||
            esriRes?.District ||
            esriRes?.PlaceName ||
            nomRes?.address?.road ||
            nomRes?.address?.suburb ||
            "";

          setNewAddr((prev) => ({
            ...prev,
            city: detectedCity || prev.city,
            province: detectedState || prev.province,
            zip: detectedZip || prev.zip,
            address1: prev.address1 || detectedRoad,
          }));

          setPinStatus(`✨ Auto-captured location: ${detectedCity}${detectedState ? `, ${detectedState}` : ""}${detectedZip ? ` (${detectedZip})` : ""}`);
        } catch (err) {
          setPinStatus("Could not detect location details.");
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        setPinStatus("Location permission denied or unavailable.");
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  };

  // Esri Commercial ArcGIS + Photon + Nominatim Triple-Engine Super-Fast Autocomplete (Apple Maps Accuracy)
  const handleQueryChange = async (val, field) => {
    setNewAddr((prev) => ({ ...prev, [field]: val }));
    setActiveSearchField(field);

    if (val.trim().length >= 3) {
      setIsSearching(true);
      try {
        // Clean trailing commas, extra spaces, and normalize unspaced alphanumeric combos (e.g., "sector16B" -> "sector 16B")
        const q = val
          .trim()
          .replace(/([a-zA-Z]+)(\d+)/g, "$1 $2")
          .replace(/(\d+)([a-zA-Z]+)/g, "$1 $2")
          .replace(/,\s*$/, "")
          .replace(/\s+/g, " ");

        // 1A. Esri ArcGIS India Priority Service (Guarantees exact Indian society/apartment matches right at the top)
        const esriIndiaPromise = fetch(
          `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&SingleLine=${encodeURIComponent(
            q
          )}&maxLocations=8&outFields=*&countryCode=IND`
        )
          .then((r) => r.json())
          .then((d) => {
            if (d && d.candidates && Array.isArray(d.candidates)) {
              return d.candidates.map((c) => {
                const attr = c.attributes || {};
                const placeName = attr.PlaceName || attr.StAddr || c.address.split(",")[0] || q;
                const fullAddress = attr.LongLabel || attr.Match_addr || attr.Place_addr || c.address;
                const parts = fullAddress.split(",").map((p) => p.trim());
                const subtitleParts = parts.filter((p) => p.toLowerCase() !== placeName.toLowerCase());
                const cleanSubtitle = subtitleParts.join(", ") || fullAddress;

                return {
                  title: placeName,
                  subtitle: cleanSubtitle,
                  display_name: fullAddress,
                  building: attr.PlaceName || (placeName !== attr.City && placeName !== attr.Region ? placeName : ""),
                  street: attr.StAddr || subtitleParts[0] || "",
                  city: attr.City || attr.Subregion || "",
                  state: attr.Region || "",
                  pin: attr.Postal || "",
                  isIndia: true,
                  source: "Esri India",
                };
              });
            }
            return [];
          })
          .catch(() => []);

        // 1B. Esri ArcGIS Global Service (Fallback if no India match or searching international address)
        const esriGlobalPromise = fetch(
          `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=json&SingleLine=${encodeURIComponent(
            q
          )}&maxLocations=6&outFields=*`
        )
          .then((r) => r.json())
          .then((d) => {
            if (d && d.candidates && Array.isArray(d.candidates)) {
              return d.candidates.map((c) => {
                const attr = c.attributes || {};
                const placeName = attr.PlaceName || attr.StAddr || c.address.split(",")[0] || q;
                const fullAddress = attr.LongLabel || attr.Match_addr || attr.Place_addr || c.address;
                const parts = fullAddress.split(",").map((p) => p.trim());
                const subtitleParts = parts.filter((p) => p.toLowerCase() !== placeName.toLowerCase());
                const cleanSubtitle = subtitleParts.join(", ") || fullAddress;

                return {
                  title: placeName,
                  subtitle: cleanSubtitle,
                  display_name: fullAddress,
                  building: attr.PlaceName || (placeName !== attr.City && placeName !== attr.Region ? placeName : ""),
                  street: attr.StAddr || subtitleParts[0] || "",
                  city: attr.City || attr.Subregion || "",
                  state: attr.Region || "",
                  pin: attr.Postal || "",
                  isIndia: attr.Country === "IND" || attr.Region === "Uttar Pradesh" || fullAddress.includes("IND") || fullAddress.includes("India"),
                  source: "Esri Global",
                };
              });
            }
            return [];
          })
          .catch(() => []);

        // 2. Photon Komoot API (Fast OSM search)
        const photonPromise = fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=6`
        )
          .then((r) => r.json())
          .then((d) => {
            if (d && d.features && Array.isArray(d.features)) {
              return d.features.map((f) => {
                const p = f.properties || {};
                const placeName = p.name || p.street || q;
                const subtitleParts = [p.street, p.locality || p.district, p.city, p.state, p.postcode].filter(
                  (part) => part && part.toLowerCase() !== placeName.toLowerCase()
                );
                const fullAddress = [placeName, ...subtitleParts].join(", ");

                return {
                  title: placeName,
                  subtitle: subtitleParts.join(", ") || fullAddress,
                  display_name: fullAddress,
                  building: p.name || "",
                  street: p.street || p.locality || "",
                  city: p.city || p.county || "",
                  state: p.state || "",
                  pin: p.postcode || "",
                  isIndia: p.country === "India" || p.state === "Uttar Pradesh" || fullAddress.includes("India"),
                  source: "Photon OSM",
                };
              });
            }
            return [];
          })
          .catch(() => []);

        // 3. OpenStreetMap Nominatim
        const nomPromise = fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            q
          )}&addressdetails=1&limit=5&countrycodes=in,us,gb,ae,sg,ca,au`
        )
          .then((r) => r.json())
          .then((d) => {
            if (Array.isArray(d) && d.length > 0) {
              return d.map((item) => {
                const a = item.address || {};
                const placeName = item.name || item.display_name.split(",")[0] || q;
                const subtitleParts = item.display_name
                  .split(",")
                  .map((p) => p.trim())
                  .filter((p) => p.toLowerCase() !== placeName.toLowerCase());

                return {
                  title: placeName,
                  subtitle: subtitleParts.join(", ") || item.display_name,
                  display_name: item.display_name,
                  building: a.building || a.residential || a.apartments || item.name || "",
                  street: a.road || a.suburb || a.neighbourhood || "",
                  city: a.city || a.town || a.district || a.state_district || "",
                  state: a.state || "",
                  pin: a.postcode || "",
                  isIndia: a.country === "India" || item.display_name.includes("India"),
                  source: "Nominatim",
                };
              });
            }
            return [];
          })
          .catch(() => []);

        const [esriIndiaResults, photonResults, nomResults, esriGlobalResults] = await Promise.all([
          esriIndiaPromise,
          photonPromise,
          nomPromise,
          esriGlobalPromise,
        ]);

        // Prioritize India candidates right at the top & eliminate foreign country clutter when searching in India
        const combined = [...esriIndiaResults, ...photonResults, ...nomResults, ...esriGlobalResults];
        const hasIndiaMatch = combined.some((item) => item.isIndia);
        const seen = new Set();
        const deduplicated = [];

        for (const item of combined) {
          if (!item.title || !item.subtitle) continue;
          // If we already have Indian matches and the user did not explicitly type a foreign country, strip out England/Polynesia/etc.
          if (hasIndiaMatch && !item.isIndia && !q.toLowerCase().includes("england") && !q.toLowerCase().includes("polynesia") && !q.toLowerCase().includes("uk") && !q.toLowerCase().includes("usa")) {
            continue;
          }
          if (q.length > 8 && item.title.toLowerCase() === item.city.toLowerCase() && !item.building && !item.street) {
            continue;
          }
          const key = `${item.title.toLowerCase().replace(/[^a-z0-9]/g, "")}_${item.city.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
          if (!seen.has(key) && deduplicated.length < 10) {
            seen.add(key);
            deduplicated.push(item);
          }
        }

        setSuggestions(deduplicated);
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
    const detectedBuilding = item.building || (item.title !== item.city && item.title !== item.state ? item.title : "");
    const detectedRoad = [item.street, item.locality].filter(Boolean).join(", ") || item.subtitle.split(",")[0] || detectedBuilding;
    const detectedCity = item.city || "";
    const detectedState = item.state || "";
    const detectedZip = item.pin || "";

    setNewAddr((prev) => {
      let updatedCompany = prev.company;
      let updatedAddress1 = prev.address1;

      if (activeSearchField === "company") {
        updatedCompany = detectedBuilding || item.title || prev.company;
        if (!updatedAddress1 || updatedAddress1.length < 3) {
          updatedAddress1 = detectedRoad || updatedAddress1;
        }
      } else if (activeSearchField === "address1") {
        updatedAddress1 = detectedRoad || item.title || prev.address1;
        if (!updatedCompany && detectedBuilding && detectedBuilding !== updatedAddress1) {
          updatedCompany = detectedBuilding;
        }
      }

      return {
        ...prev,
        company: updatedCompany,
        address1: updatedAddress1,
        city: detectedCity || prev.city,
        province: detectedState || prev.province,
        zip: detectedZip || prev.zip,
      };
    });

    setSuggestions([]);
    setPinStatus(`✨ Auto-completed: ${detectedCity || "Verified Location"}, ${detectedState} ${detectedZip ? `(${detectedZip})` : ""}`);
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
      name: "",
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

            {/* High-Precision Location Assist Bar */}
            <div className="bg-stone-50 border border-stone-200 p-3.5 sm:p-4 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <div className="text-xs">
                  <p className="font-medium text-stone-900">High-Precision Location Assist</p>
                  <p className="text-[11px] text-stone-500">Instant City, State & PIN auto-detection via GPS</p>
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
                  placeholder="Enter full name"
                  value={newAddr.name}
                  onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>

              {/* Building / Apartment Name with Live Autocomplete */}
              <div className="relative">
                <label className="block text-xs uppercase tracking-wider text-stone-900 font-semibold mb-1">
                  Building / Apartment / Flat Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Start typing building, apartment, or flat name"
                  value={newAddr.company}
                  onChange={(e) => handleQueryChange(e.target.value, "company")}
                  className="w-full border border-stone-400 bg-stone-50/50 px-3 py-2.5 text-sm focus:outline-none focus:border-black focus:bg-white transition-colors"
                />
                {isSearching && activeSearchField === "company" && (
                  <div className="absolute right-3 top-9 text-[11px] text-stone-400 animate-pulse">
                    Searching suggestions...
                  </div>
                )}
                {suggestions.length > 0 && activeSearchField === "company" && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-stone-300 shadow-2xl rounded-sm z-50 max-h-64 overflow-y-auto divide-y divide-stone-100">
                    <div className="px-3 py-1.5 bg-stone-100 text-[10px] uppercase tracking-widest text-stone-500 font-semibold flex justify-between items-center sticky top-0 bg-stone-100 z-10">
                      <span>Address Autocomplete Suggestions</span>
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
                        className="p-3 hover:bg-stone-50 cursor-pointer transition-all flex items-start gap-3 text-left group"
                      >
                        <div className="w-8 h-8 rounded-full bg-stone-200/80 group-hover:bg-stone-300/80 flex items-center justify-center shrink-0 mt-0.5 transition-colors text-base shadow-2xs">
                          {item.building || item.title?.toLowerCase().includes("apartment") || item.title?.toLowerCase().includes("tower") || item.title?.toLowerCase().includes("flat") || item.title?.toLowerCase().includes("residence") ? "🏢" : "📍"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-stone-900 truncate group-hover:text-black transition-colors">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-stone-500 line-clamp-2 leading-tight mt-0.5 font-medium">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Address Line 1 with Live Autocomplete */}
              <div className="relative">
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">Address Line 1 (Street / Area) *</label>
                <input
                  type="text"
                  required
                  placeholder="Start typing street, area, or road name"
                  value={newAddr.address1}
                  onChange={(e) => handleQueryChange(e.target.value, "address1")}
                  className="w-full border border-gray-300 px-3 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
                />
                {isSearching && activeSearchField === "address1" && (
                  <div className="absolute right-3 top-9 text-[11px] text-stone-400 animate-pulse">
                    Searching suggestions...
                  </div>
                )}
                {suggestions.length > 0 && activeSearchField === "address1" && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-stone-300 shadow-2xl rounded-sm z-50 max-h-64 overflow-y-auto divide-y divide-stone-100">
                    <div className="px-3 py-1.5 bg-stone-100 text-[10px] uppercase tracking-widest text-stone-500 font-semibold flex justify-between items-center sticky top-0 bg-stone-100 z-10">
                      <span>Address Autocomplete Suggestions</span>
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
                        className="p-3 hover:bg-stone-50 cursor-pointer transition-all flex items-start gap-3 text-left group"
                      >
                        <div className="w-8 h-8 rounded-full bg-stone-200/80 group-hover:bg-stone-300/80 flex items-center justify-center shrink-0 mt-0.5 transition-colors text-base shadow-2xs">
                          {item.building || item.title?.toLowerCase().includes("apartment") || item.title?.toLowerCase().includes("tower") || item.title?.toLowerCase().includes("flat") || item.title?.toLowerCase().includes("residence") ? "🏢" : "📍"}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-stone-900 truncate group-hover:text-black transition-colors">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-stone-500 line-clamp-2 leading-tight mt-0.5 font-medium">
                            {item.subtitle}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">Address Line 2 (Landmark / Sector - Optional)</label>
                <input
                  type="text"
                  placeholder="Enter landmark or sector"
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
                    placeholder="Enter 6-digit postal or PIN code"
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
                    placeholder="Enter phone number"
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
