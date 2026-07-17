"use client";

import React from "react";

export default function OrderTrackingStepper({ currentStatus = 1 }) {
  const steps = [
    { id: 1, label: "Order Confirmed" },
    { id: 2, label: "Preparing" },
    { id: 3, label: "Waiting for Pickup" },
    { id: 4, label: "Dispatched" },
    { id: 5, label: "Delivered" },
  ];

  return (
    <div className="w-full py-4">
      {/* Desktop Horizontal Timeline / Mobile Vertical Timeline */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-1 md:gap-0 relative">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStatus;
          const isActive = step.id === currentStatus;
          const isFuture = step.id > currentStatus;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step.id}>
              {/* Step Node & Label Container */}
              <div className="flex md:flex-col items-center md:items-center gap-4 md:gap-3 flex-1 md:flex-initial z-10">
                {/* Circular Node */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono transition-all duration-300 flex-shrink-0 ${
                    isCompleted
                      ? "bg-gray-900 text-white"
                      : isActive
                      ? "bg-gray-900 text-white ring-4 ring-gray-200 font-bold shadow-sm"
                      : "border border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  {isCompleted ? "✓" : step.id}
                </div>

                {/* Status Text Below (Desktop) / Adjacent (Mobile) */}
                <div className="md:text-center md:max-w-[110px]">
                  <p
                    className={`text-[10px] tracking-widest uppercase transition-colors duration-300 ${
                      isActive
                        ? "text-gray-900 font-bold"
                        : isCompleted
                        ? "text-gray-800 font-semibold"
                        : "text-gray-400 font-medium"
                    }`}
                  >
                    {step.label}
                  </p>
                  {isActive && (
                    <span className="inline-block md:block mt-0.5 md:mt-1 text-[9px] text-emerald-700 tracking-wider font-mono font-medium">
                      • ACTIVE STATUS
                    </span>
                  )}
                </div>
              </div>

              {/* Connecting Line (Horizontal on Desktop, Vertical on Mobile) */}
              {!isLast && (
                <>
                  {/* Desktop Horizontal Connecting Line */}
                  <div className="hidden md:block flex-1 h-[2px] bg-gray-200 mt-4 mx-2 relative overflow-hidden self-start">
                    <div
                      className={`h-full bg-gray-900 transition-all duration-500 ease-out ${
                        isCompleted ? "w-full" : "w-0"
                      }`}
                    />
                  </div>

                  {/* Mobile Vertical Connecting Line */}
                  <div className="block md:hidden w-[2px] h-8 bg-gray-200 ml-4 -my-2 relative overflow-hidden">
                    <div
                      className={`w-full bg-gray-900 transition-all duration-500 ease-out ${
                        isCompleted ? "h-full" : "h-0"
                      }`}
                    />
                  </div>
                </>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
