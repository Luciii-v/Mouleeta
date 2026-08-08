"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import OrderTrackingStepper from "@/components/OrderTrackingStepper";
import OrderBreakdownModal from "@/components/OrderBreakdownModal";

export default function OrdersPage() {
  const { data: session } = useSession();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("ALL");
  const [trackingData, setTrackingData] = useState(null);
  const [isLoadingTracking, setIsLoadingTracking] = useState(false);
  const [returnItems, setReturnItems] = useState({});
  const [returnReasons, setReturnReasons] = useState({});
  const [compensationPreference, setCompensationPreference] = useState("");
  const [returnNotes, setReturnNotes] = useState("");

  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        }
        setIsLoadingOrders(false);
      })
      .catch((err) => {
        console.error("Failed to load orders:", err);
        setIsLoadingOrders(false);
      });
  }, []);

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

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "PROCESSING") return order.fulfillmentStatus === "UNFULFILLED";
    if (activeTab === "DELIVERED") return order.fulfillmentStatus === "FULFILLED";
    return true;
  });

  const isReturnEligible = (order) => {
    if (order.fulfillmentStatus !== "FULFILLED" || order.paymentStatus !== "PAID") return false;
    if (!order.deliveryDate) return false;
    const deliveryDate = new Date(order.deliveryDate);
    const now = new Date();
    const diffTime = Math.abs(now - deliveryDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 5;
  };

  const handleReturnSubmit = async () => {
    try {
      const selectedItemIds = Object.keys(returnItems).filter(id => returnItems[id]);
      if (selectedItemIds.length === 0) return alert("Please select at least one item to return.");
      
      const payload = {
        orderId: selectedOrder.id,
        items: selectedItemIds.map(id => ({
          itemId: id,
          reason: returnReasons[id]
        })),
        compensationPreference,
        notes: returnNotes
      };

      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to submit return request");

      alert("Return request submitted successfully. Our VIP Concierge team will review it shortly.");
      setSelectedOrder(null);
    } catch (err) {
      console.error(err);
      alert("There was an error submitting your return. Please try again.");
    }
  };

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
            {tab} ({tab === "ALL" ? orders.length : orders.filter(o => tab === "PROCESSING" ? o.fulfillmentStatus === "UNFULFILLED" : o.fulfillmentStatus === "FULFILLED").length})
          </button>
        ))}
      </div>

      {/* Order List */}
      <div className="space-y-6">
        {isLoadingOrders ? (
          <div className="text-center py-12">
            <span className="text-sm tracking-widest text-gray-500 uppercase">Loading Orders...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 border border-gray-200/80 rounded-sm bg-white">
            <span className="text-sm tracking-widest text-gray-500 uppercase">No orders found</span>
          </div>
        ) : (
          filteredOrders.map((order) => (
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
              {isReturnEligible(order) ? (
                <button
                  type="button"
                  onClick={() => setSelectedOrder({ ...order, action: "RETURN" })}
                  className="border border-gray-300 bg-white hover:border-black text-gray-800 px-5 py-2.5 text-xs font-medium uppercase tracking-widest transition-colors cursor-pointer"
                >
                  Initiate Return
                </button>
              ) : (
                <div className="relative group inline-block">
                  <button
                    type="button"
                    disabled
                    className="border border-gray-200 bg-gray-50 text-gray-400 px-5 py-2.5 text-xs font-medium uppercase tracking-widest cursor-not-allowed"
                  >
                    Initiate Return
                  </button>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block w-48 p-2 bg-black text-white text-[10px] rounded shadow-lg text-center z-10">
                    Returns can only be initiated within 5 days of delivery.
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={() => setSelectedOrder({ ...order, action: "DETAILS" })}
                className="bg-black text-white px-5 py-2.5 text-xs font-medium uppercase tracking-widest hover:bg-gray-800 transition-colors cursor-pointer"
              >
                View Order Details
              </button>
            </div>
          </div>
        ))
        )}
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

            {(selectedOrder.action === "TRACKING" || selectedOrder.action === "RETURN") && (
              <div className="space-y-6">
                {selectedOrder.action === "TRACKING" && (
                  <>
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
                          <OrderTrackingStepper currentStatus={trackingData?.statusId || (selectedOrder?.fulfillmentStatus === "FULFILLED" ? (selectedOrder?.deliveryDate ? 5 : 4) : 2)} />
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
                  </>
                )}

                {selectedOrder.action === "RETURN" && (
                  <div className="space-y-5 text-sm">
                    <p className="text-gray-600 leading-relaxed">
                      Our VIP Concierge offers complimentary home pickup for returns within 30 days of delivery.
                      Your return will be processed within 3–5 business days after pickup.
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-2">
                          Select Items to Return
                        </label>
                        <div className="space-y-3">
                          {selectedOrder.items.map((item) => (
                            <div key={item.id} className="border border-gray-200 p-3 flex flex-col gap-3">
                              <div className="flex items-start gap-3">
                                <input
                                  type="checkbox"
                                  checked={!!returnItems[item.id]}
                                  onChange={(e) => {
                                    setReturnItems(prev => ({ ...prev, [item.id]: e.target.checked }));
                                    if (!e.target.checked) {
                                      const newReasons = { ...returnReasons };
                                      delete newReasons[item.id];
                                      setReturnReasons(newReasons);
                                    }
                                  }}
                                  className="mt-1"
                                />
                                <div>
                                  <p className="text-sm font-medium text-gray-800">{item.title}</p>
                                  <p className="text-xs text-gray-500">{item.variant}</p>
                                </div>
                              </div>
                              {returnItems[item.id] && (
                                <div className="pl-6">
                                  <select
                                    value={returnReasons[item.id] || ""}
                                    onChange={(e) => setReturnReasons(prev => ({ ...prev, [item.id]: e.target.value }))}
                                    className="w-full border border-gray-300 px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-black rounded-none cursor-pointer"
                                  >
                                    <option value="">Select a reason (Required)</option>
                                    <option>Size issue — too large</option>
                                    <option>Size issue — too small</option>
                                    <option>Different from description</option>
                                    <option>Quality concern / Defective</option>
                                    <option>Item arrived late</option>
                                    <option>Changed my mind</option>
                                  </select>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-700 block mb-1">
                          Compensation Preference
                        </label>
                        <select
                          value={compensationPreference}
                          onChange={(e) => setCompensationPreference(e.target.value)}
                          className="w-full border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-black rounded-none cursor-pointer"
                        >
                          <option value="">Select preference</option>
                          <option value="REFUND">Refund to Original Payment Method</option>
                          <option value="REPLACEMENT">Replacement (Subject to availability)</option>
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
                        href={`https://wa.me/919820012345?text=${encodeURIComponent(`Return request for order ${selectedOrder.orderNumber}.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-2.5 text-xs font-medium uppercase tracking-widest hover:bg-[#1ebe5d] transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp Concierge
                      </a>
                      <button
                        type="button"
                        onClick={handleReturnSubmit}
                        disabled={
                          !compensationPreference ||
                          Object.keys(returnItems).filter(id => returnItems[id]).length === 0 ||
                          Object.keys(returnItems).filter(id => returnItems[id]).some(id => !returnReasons[id])
                        }
                        className="flex-1 bg-black text-white px-4 py-2.5 text-xs font-medium uppercase tracking-widest hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Submit Request
                      </button>
                    </div>
                  </div>
                )}
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

      {/* New Redesigned Order Breakdown Modal */}
      <OrderBreakdownModal
        isOpen={selectedOrder?.action === "DETAILS"}
        onClose={() => setSelectedOrder(null)}
        orderNumber={selectedOrder?.orderNumber || ""}
        status={selectedOrder?.statusLabel || ""}
        totalPaid={selectedOrder?.total || ""}
        items={selectedOrder?.items?.map(it => ({
          name: it.title,
          price: it.price,
          qty: it.quantity,
          image: it.image,
          options: it.options,
          variant: it.variant
        })) || []}
      />
    </div>
  );
}
