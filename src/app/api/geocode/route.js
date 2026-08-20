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

    // Photon API is excellent for rural Indian postal codes
    const photonPromise = fetchWithTimeout(
      `https://photon.komoot.io/reverse?lon=${lon}&lat=${lat}`
    );

    const [esriRes, bdcRes, nomRes, photonRes] = await Promise.all([esriPromise, bdcPromise, nomPromise, photonPromise]);

    const photonFeature = photonRes?.features?.[0]?.properties || {};

    let detectedCity =
      esriRes?.address?.City ||
      esriRes?.address?.MetroArea ||
      esriRes?.address?.Subregion ||
      photonFeature?.city ||
      photonFeature?.town ||
      bdcRes?.city ||
      bdcRes?.locality ||
      nomRes?.address?.city ||
      nomRes?.address?.town ||
      nomRes?.address?.district ||
      nomRes?.address?.county ||
      nomRes?.address?.village ||
      photonFeature?.name ||
      "";

    const detectedState =
      esriRes?.address?.Region ||
      photonFeature?.state ||
      bdcRes?.principalSubdivision ||
      nomRes?.address?.state ||
      nomRes?.address?.state_district ||
      "";

    let detectedZip =
      esriRes?.address?.Postal ||
      photonFeature?.postcode ||
      bdcRes?.postcode ||
      nomRes?.address?.postcode ||
      "";

    // Ultimate fallback for India: If we got the city & state but NO ZIP, query the Indian Postal API
    if (!detectedZip && detectedCity && detectedState) {
      try {
        const pinRes = await fetchWithTimeout(`https://api.postalpincode.in/postoffice/${encodeURIComponent(detectedCity)}`, {}, 2000);
        if (pinRes && pinRes[0]?.Status === "Success" && pinRes[0]?.PostOffice?.length > 0) {
          // Find a post office that matches the detected state (to avoid confusing Dadri, UP with Dadri, Haryana)
          const matchedPO = pinRes[0].PostOffice.find(
            (po) => po.State?.toLowerCase() === detectedState.toLowerCase() || po.Region?.toLowerCase().includes(detectedState.toLowerCase())
          );
          if (matchedPO && matchedPO.Pincode) {
            detectedZip = matchedPO.Pincode;
          } else if (pinRes[0].PostOffice[0].Pincode) {
            // Fallback to the first result if state didn't exactly match
            detectedZip = pinRes[0].PostOffice[0].Pincode;
          }
        }
      } catch (e) {
        // Ignore postal fallback failure
      }
    }

    const detectedRoad =
      esriRes?.address?.Address ||
      esriRes?.address?.District ||
      esriRes?.address?.PlaceName ||
      nomRes?.address?.road ||
      nomRes?.address?.suburb ||
      nomRes?.address?.neighbourhood ||
      photonFeature?.street ||
      photonFeature?.district ||
      "";

    // NCR Region Normalization: Administrative Tehsils vs Colloquial Cities
    if (detectedCity.toLowerCase() === "dadri") {
      if (detectedZip === "201009" || detectedZip.startsWith("2013") || bdcRes?.locality?.toLowerCase().includes("noida")) {
        detectedCity = "Greater Noida";
      }
    }

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
