"use client";

import { redirect } from "next/navigation";

// Checkout is handled via Shopify Hosted Checkout.
// Users are redirected to Shopify's checkout URL by the CartDrawer → /api/checkout flow.
// If someone navigates to /checkout directly, send them back to the homepage.
export default function CheckoutPage() {
  redirect("/");
}
