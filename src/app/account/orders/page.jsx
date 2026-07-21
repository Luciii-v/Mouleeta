"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import OrderTrackingStepper from "@/components/OrderTrackingStepper";

export default function OrdersPage() {
  const { data: session } = useSession();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("ALL");
  const [trackingData, setTrackingData] = useState(null);
  const [isLoadingTracking, setIsLoadingTracking] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [returnNotes, setReturnNotes] = useState("");

  const mockOrders = [
    {
      id: "gid://shopify/Order/1001",
      orderNumber: "#MOU-8921",
      date: "May 14, 2026",
      total: "₹24,500 INR",
      fulfillmentStatus: "UNFULFILLED",
      statusLabel: "Processing",
      trackingNumber: "MOU-TRK-900213",
      itemsCount: 1,
      items: [
        {
          title: "The Georgette Evening Gown — Midnight Black",
          variant: "Size: M",
          quantity: 1,
          price: "₹24,500",
        },
      ],
    },
    {
      id: "gid://shopify/Order/1002",
      orderNumber: "#MOU-8640",
      date: "April 02, 2026",
      total: "₹18,500 INR",
      fulfillmentStatus: "FULFILLED",
      statusLabel: "Delivered",
      trackingNumber: "MOU-TRK-884012",
      itemsCount: 1,
      items: [
        {
          title: "Structured Silk Trench Coat — Bone White",
          variant: "Size: L",
          quantity: 1,
          price: "₹18,500",
        },
      ],
    },
    {
      id: "gid://shopify/Order/1003",
      orderNumber: "#MOU-8104",
      date: "January 18, 2026",
      total: "₹32,000 INR",
      fulfillmentStatus: "FULFILLED",
      statusLabel: "Delivered",
      trackingNumber: "MOU-TRK-771209",
      itemsCount: 2,
      items: [
        {
          title: "Tailored Wool Blazer — Charcoal",
          variant: "Size: M",
          quantity: 1,
          price: "₹21,000",
        },
        {
          title: "Pleated Silk Trousers — Charcoal",
          variant: "Size: 32",
          quantity: 1,
          price: "₹11,000",
        },
      ],
    },
  ];

  useEffect(() => {
    if (selectedOrder?.action === "TRACKING") {
      setIsLoadingTracking(true);
      fetch(`/api/track?awb=${selectedOrder.trackingNumber}`)
        .then((res) => res.json())
        .then((data) => {
          setTrackingData(data);
          setIsLoadingTracking(false);
        })
        .catch((err) => {
          console.error("Failed to load live tracking:", err);
          setIsLoadingTracking(false);
        });
    } else {
      setTrackingData(null);
    }
  }, [selectedOrder]);

  const filteredOrders = mockOrders.filter((order) => {
    if (activeTab === "PROCESSING") return order.fulfillmentStatus === "UNFULFILLED";
    if (activeTab === "DELIVERED") return order.fulfillmentStatus === "FULFILLED";
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="border-b border-gray-200/80 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-gray-900">
            Orders & Returns
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review past acquisitions, track active deliveries, and manage returns.
          </p>
        </div>
      </div>

      {/* Demo Disclaimer Banner */}
      {session && (
        <div className="bg-amber-50 border border-amber-200 px-5 py-3.5 rounded-sm flex items-start gap-3">
          <span className="text-amber-500 text-base mt-0.5 flex-shrink-0">ⓘ</span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Preview Order History
            </p>
            <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
              Live order history from your Shopify account will appear here automatically after your first purchase.
              Displaying sample orders for reference.
            </p>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        {["ALL", "PROCESSING", "DELIVERED"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs uppercase tracking-[0.18em] font-medium transition-colors cursor-pointer border-b-2 -mb-[1px] ${
              activeTab === tab
                ? "border-black text-black"
                : "border-transparent text-gray-400 hover:text-gray-700"
            }`}
          >
            {tab} ({tab === "ALL" ? mockOrders.length : mockOrders.filter(o => tab === "PROCESSING" ? o.fulfillmentStatus === "UNFULFILLED" : o.fulfillmentStatus === "FULFILLED").length})
          </button>
        ))}
      </div>

      {/* Order List */}
      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white border border-gray-200/80 p-6 sm:p-8 rounded-sm shadow-xs transition-all hover:border-gray-300"
          >
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 mb-6 gap-4">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 block">
                    Order Number
                  </span>
                  <span className="text-sm font-medium text-gray-900 font-mono">
                    {order.orderNumber}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 block">
                    Date Placed
                  </span>
                  <span className="text-sm text-gray-700">{order.date}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 block">
                    Total Amount
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {order.total}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    order.fulfillmentStatus === "FULFILLED"
                      ? "bg-emerald-600"
                      : "bg-amber-500 animate-pulse"
                  }`}
                />
                <span className="text-xs uppercase tracking-[0.15em] font-medium text-gray-800">
                  {order.statusLabel}
                </span>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-4">
              <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium">
                Items ({order.itemsCount})
              </p>
              <ul className="divide-y divide-gray-100 border-t border-gray-100">
                {order.items.map((item, index) => (
                  <li
                    key={index}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-500">{item.variant}</p>
                    </div>
                    <span className="text-xs text-gray-500 font-mono">
                      Qty: {item.quantity} — {item.price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Order Actions */}
            <div className="pt-6 mt-4 border-t border-gray-100 flex flex-wrap items-center justify-end gap-4">
              {order.trackingNumber && (
                <button
                  type="button"
                  onClick={() => setSelectedOrder({ ...order, action: "TRACKING" })}
                  className="border border-gray-300 bg-white hover:border-black text-gray-800 px-5 py-2.5 text-xs font-medium uppercase tracking-widest transition-colors cursor-pointer"
                >
                  {order.fulfillmentStatus === "FULFILLED" ? "Delivery History" : "Track Package"}
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedOrder({ ...order, action: "RETURN" })}
                className="border border-gray-300 bg-white hover:border-black text-gray-800 px-5 py-2.5 text-xs font-medium uppercase tracking-widest transition-colors cursor-pointer"
              >
                Initiate Return
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrder({ ...order, action: "DETAILS" })}
                className="bg-black text-white px-5 py-2.5 text-xs font-medium uppercase tracking-widest hover:bg-gray-800 transition-colors cursor-pointer"
              >
                View Order Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Modal / Detail Overlay */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white max-w-2xl w-full p-6 sm:p-8 rounded-sm shadow-xl space-y-6 animate-fadeIn my-auto">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-medium block">
                  {selectedOrder.action === "TRACKING" && "Live Shiprocket Tracking Portal"}
                  {selectedOrder.action === "RETURN" && "Return Request Portal"}
                  {selectedOrder.action === "DETAILS" && "Order Breakdown"}
                </span>
                <h3 className="text-xl font-light text-gray-900 mt-1">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-black text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {selectedOrder.action === "TRACKING" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-gray-50/80 p-3.5 border border-gray-200/80">
                  <div>
                    <span className="text-gray-400 uppercase tracking-widest block text-[9px]">Carrier / Partner</span>
                    <span className="font-medium text-gray-900">
                      {trackingData?.trackingData?.tracking_data?.carrier || "Bluedart Express Privé"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase tracking-widest block text-[9px]">AWB Tracking Number</span>
                    <span className="font-mono text-gray-900 font-medium">{selectedOrder.trackingNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 uppercase tracking-widest block text-[9px]">Expected Delivery</span>
                    <span className="font-medium text-emerald-700 font-mono">
                      {trackingData?.trackingData?.tracking_data?.expected_date || "Tomorrow by 6:00 PM"}
                    </span>
                  </div>
                </div>

                {isLoadingTracking ? (
                  <div className="py-12 flex flex-col items-center justify-center space-y-3">
                    <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs uppercase tracking-widest text-gray-400">Connecting to Shiprocket API...</p>
                  </div>
                ) : (
                  <>
                    {/* Amazon-style Progress Timeline Stepper */}
                    <div className="px-2 pt-2 pb-6 border-b border-gray-100">
                      <OrderTrackingStepper currentStatus={trackingData?.statusId || 4} />
                    </div>

                    {/* Detailed Scan Log History */}
                    <div className="space-y-3">
                      <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">
                        Chronological Shipment Scans
                      </p>
                      <div className="space-y-3 max-h-52 overflow-y-auto pr-2 divide-y divide-gray-100">
                        {trackingData?.trackingData?.tracking_data?.shipment_track?.map((scan, idx) => (
                          <div key={idx} className="pt-2.5 first:pt-0 flex flex-col sm:flex-row sm:justify-between sm:items-start text-xs gap-1">
                            <div>
                              <p className="font-medium text-gray-900">{scan.current_status}</p>
                              {scan.location && (
                                <p className="text-[11px] text-gray-500">{scan.location}</p>
                              )}
                            </div>
                            <span className="text-gray-400 font-mono text-[10px] whitespace-nowrap">{scan.date}</span>
                          </div>
                        )) || (
                          <p className="text-xs text-gray-500">Live tracking milestones synced with carrier.</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {selectedOrder.action === "RETURN" && (
              <div className="space-y-5 text-sm">
                <p className="text-gray-600 leading-relaxed">
                  Our VIP Concierge offers complimentary home pickup for returns within 30 days of delivery.
                  Your return will be processed within 3–5 business days after pickup.
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-1">
                      Reason for Return
                    </label>
                    <select
                      value={returnReason}
                      onChange={(e) => setReturnReason(e.target.value)}
                      className="w-full border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-black rounded-none cursor-pointer"
                    >
                      <option value="">Select a reason</option>
                      <option>Size issue — too large</option>
                      <option>Size issue — too small</option>
                      <option>Different from description</option>
                      <option>Quality concern</option>
                      <option>Changed my mind</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-1">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={returnNotes}
                      onChange={(e) => setReturnNotes(e.target.value)}
                      placeholder="Any additional details..."
                      className="w-full border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-black rounded-none resize-none"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <a
                    href={`https://wa.me/919820012345?text=${encodeURIComponent(`Return request for order ${selectedOrder.orderNumber}. Reason: ${returnReason || "Not specified"}. Notes: ${returnNotes || "None"}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-2.5 text-xs font-medium uppercase tracking-widest hover:bg-[#1ebe5d] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp Concierge
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1 bg-black text-white px-4 py-2.5 text-xs font-medium uppercase tracking-widest hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            )}

            {selectedOrder.action === "DETAILS" && (
              <div className="space-y-4 text-sm text-gray-600">
                <p>
                  <strong className="text-gray-900">Status:</strong> {selectedOrder.statusLabel}
                </p>
                <p>
                  <strong className="text-gray-900">Total Charged:</strong> {selectedOrder.total}
                </p>
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-800 mb-2">Line Items:</p>
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-xs py-1">
                      <span>{it.title} ({it.variant})</span>
                      <span className="font-mono">{it.price}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-black text-white px-6 py-2.5 text-xs uppercase tracking-widest hover:bg-gray-800 cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
