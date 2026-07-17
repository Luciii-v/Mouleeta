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
    setNewAddr(addr);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingAddr(null);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white max-w-lg w-full p-6 sm:p-8 rounded-sm shadow-xl space-y-6 animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="text-lg font-light uppercase tracking-widest text-gray-900">
                {editingAddr ? "Edit Address" : "New Address"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-black text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newAddr.name}
                  onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">Company / Building (Optional)</label>
                <input
                  type="text"
                  value={newAddr.company}
                  onChange={(e) => setNewAddr({ ...newAddr, company: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">Address Line 1</label>
                <input
                  type="text"
                  required
                  value={newAddr.address1}
                  onChange={(e) => setNewAddr({ ...newAddr, address1: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">Address Line 2 (Optional)</label>
                <input
                  type="text"
                  value={newAddr.address2}
                  onChange={(e) => setNewAddr({ ...newAddr, address2: e.target.value })}
                  className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">State / Province</label>
                  <input
                    type="text"
                    required
                    value={newAddr.province}
                    onChange={(e) => setNewAddr({ ...newAddr, province: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">Postal Code / ZIP</label>
                  <input
                    type="text"
                    required
                    value={newAddr.zip}
                    onChange={(e) => setNewAddr({ ...newAddr, zip: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-600 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-black"
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
                  <span className="text-xs text-gray-700">Set as default shipping address</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs uppercase tracking-widest text-gray-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-gray-800 cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
