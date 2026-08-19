import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return NextResponse.json({ error: "Missing lat/lon parameters" }, { status: 400 });
    }

    // Server-side fetch functions to avoid CORS and AdBlocker issues.
    // Setting timeouts using AbortController to ensure the API responds quickly.
    const fetchWithTimeout = async (url, options = {}, timeoutMs = 3000) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        if (!response.ok) return null;
        return await response.json();
      } catch (error) {
        clearTimeout(id);
        return null;
      }
    };

    const esriPromise = fetchWithTimeout(
      `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?f=json&location=${lon},${lat}`
    );

    const bdcPromise = fetchWithTimeout(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
    );

    // Server-side allows us to safely set the required User-Agent for Nominatim
    const nomPromise = fetchWithTimeout(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
      { headers: { "User-Agent": "MouleetaShop/1.0 (support@mouleeta.com)" } }
    );

    const [esriRes, bdcRes, nomRes] = await Promise.all([esriPromise, bdcPromise, nomPromise]);

    const detectedCity =
      esriRes?.address?.City ||
      esriRes?.address?.MetroArea ||
      esriRes?.address?.Subregion ||
      bdcRes?.city ||
      bdcRes?.locality ||
      nomRes?.address?.city ||
      nomRes?.address?.town ||
      nomRes?.address?.district ||
      nomRes?.address?.county ||
      nomRes?.address?.village ||
      "";

    const detectedState =
      esriRes?.address?.Region ||
      bdcRes?.principalSubdivision ||
      nomRes?.address?.state ||
      nomRes?.address?.state_district ||
      "";

    const detectedZip =
      esriRes?.address?.Postal ||
      bdcRes?.postcode ||
      nomRes?.address?.postcode ||
      "";

    const detectedRoad =
      esriRes?.address?.Address ||
      esriRes?.address?.District ||
      esriRes?.address?.PlaceName ||
      nomRes?.address?.road ||
      nomRes?.address?.suburb ||
      nomRes?.address?.neighbourhood ||
      "";

    return NextResponse.json({
      city: detectedCity,
      state: detectedState,
      zip: detectedZip,
      road: detectedRoad,
    });
  } catch (error) {
    console.error("Geocoding proxy error:", error);
    return NextResponse.json({ error: "Failed to resolve location" }, { status: 500 });
  }
}
