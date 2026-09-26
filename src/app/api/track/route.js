import { NextResponse } from 'next/server';

// Helper function to authenticate with Shiprocket API using credentials
async function getShiprocketToken() {
  if (process.env.SHIPROCKET_API_TOKEN) {
    return process.env.SHIPROCKET_API_TOKEN;
  }

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

    if (!token) {
      return NextResponse.json({ error: 'Failed to authenticate tracking provider' }, { status: 500 });
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
