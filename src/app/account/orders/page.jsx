"use client";

import React, { useState, useEffect } from "react";
import OrderTrackingStepper from "@/components/OrderTrackingStepper";

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("ALL");
  const [trackingData, setTrackingData] = useState(null);
  const [isLoadingTracking, setIsLoadingTracking] = useState(false);

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
              {order.fulfillmentStatus === "UNFULFILLED" && (
                <button
                  type="button"
                  onClick={() => setSelectedOrder({ ...order, action: "TRACKING" })}
                  className="border border-gray-300 bg-white hover:border-black text-gray-800 px-5 py-2.5 text-xs font-medium uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Track Package
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
              <div className="space-y-4 text-sm text-gray-600">
                <p>
                  Our VIP Concierge offers complimentary home pickup for returns within 30 days of delivery.
                </p>
                <div className="bg-gray-50 p-4 border border-gray-200 rounded-xs">
                  <p className="text-xs font-mono text-gray-700">
                    Return authorization workflow ready for item selection.
                  </p>
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
