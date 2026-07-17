import { NextResponse } from 'next/server';

// Helper function to authenticate with Shiprocket API using credentials
async function getShiprocketToken() {
  // If static token is already provided in environment, use it
  if (process.env.SHIPROCKET_API_TOKEN) {
    return process.env.SHIPROCKET_API_TOKEN;
  }

  // Otherwise, authenticate using email and password from .env.local / Vercel
  const email = process.env.SHIPROCKET_API_EMAIL;
  const password = process.env.SHIPROCKET_API_PASSWORD;

  if (!email || !password) {
    return null;
  }

  try {
    const authRes = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!authRes.ok) {
      console.error(`Shiprocket auth failed with status: ${authRes.status}`);
      return null;
    }

    const authData = await authRes.json();
    return authData.token || null;
  } catch (error) {
    console.error("Error authenticating with Shiprocket API:", error);
    return null;
  }
}

export async function GET(request) {
  // 1. Get the AWB from the frontend request URL
  const { searchParams } = new URL(request.url);
  const awb = searchParams.get('awb');

  if (!awb) {
    return NextResponse.json({ error: 'Tracking number is required' }, { status: 400 });
  }

  try {
    // Authenticate and get token
    const token = await getShiprocketToken();

    // If AWB starts with our mock prefix 'MOU-TRK-' or if no token is available,
    // return full realistic simulation data for testing the UI stepper
    if (!token || awb?.startsWith('MOU-TRK-')) {
      return NextResponse.json({
        statusId: 4, // 4: Dispatched (In Transit)
        trackingData: {
          tracking_data: {
            track_status: 6,
            shipment_status: "IN TRANSIT",
            carrier: "Bluedart Express Privé",
            expected_date: "Tomorrow by 6:00 PM",
            shipment_track: [
              {
                current_status: "In Transit to Destination Hub - Bandra West, Mumbai",
                date: "2026-07-16 14:30:00",
                location: "Mumbai Sorting Facility"
              },
              {
                current_status: "Dispatched from Mouleeta Central Warehouse",
                date: "2026-07-15 18:00:00",
                location: "Surat Hub"
              },
              {
                current_status: "Package Picked Up by Bluedart VIP Logistics",
                date: "2026-07-15 11:20:00",
                location: "Surat Facility"
              },
              {
                current_status: "Order Prepared & Bespoke Packaging Completed",
                date: "2026-07-14 16:45:00",
                location: "Mouleeta Atelier"
              },
              {
                current_status: "Order Confirmed & Payment Verified",
                date: "2026-07-14 09:15:00",
                location: "Online Store"
              }
            ]
          }
        },
        isSimulation: true
      });
    }

    // 2. Fetch the live tracking data directly from Shiprocket using live token
    const shiprocketResponse = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awb}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!shiprocketResponse.ok) {
      throw new Error(`Shiprocket API responded with status: ${shiprocketResponse.status}`);
    }

    const data = await shiprocketResponse.json();

    // 3. Map Shiprocket's complex data to clean 1-5 UI scale
    // Shiprocket status codes:
    // 1: Confirmed/New, 17: Packed/Ready to ship, 18: Out for pickup/Pickup scheduled
    // 6: In Transit/Dispatched, 7: Delivered
    const trackInfo = data?.tracking_data || {};
    const statusCode = trackInfo.track_status;
    const statusText = (trackInfo.shipment_status || "").toUpperCase();

    let currentStatus = 1; // Default to Confirmed

    if (statusCode === 7 || statusText.includes('DELIVERED')) {
      currentStatus = 5;
    } else if (statusCode === 6 || statusText.includes('IN TRANSIT') || statusText.includes('SHIPPED') || statusText.includes('OUT FOR DELIVERY') || statusText.includes('DISPATCHED')) {
      currentStatus = 4;
    } else if (statusCode === 18 || statusText.includes('PICKUP') || statusText.includes('WAITING')) {
      currentStatus = 3;
    } else if (statusCode === 17 || statusText.includes('PACKED') || statusText.includes('READY')) {
      currentStatus = 2;
    } else if (statusCode === 1 || statusCode === 0 || statusText.includes('CONFIRMED')) {
      currentStatus = 1;
    }

    // 4. Send the clean data back to React component
    return NextResponse.json({
      statusId: currentStatus,
      trackingData: data,
      isSimulation: false
    });

  } catch (error) {
    console.error("Shiprocket tracking error:", error);
    return NextResponse.json({ error: 'Failed to fetch tracking data' }, { status: 500 });
  }
}
