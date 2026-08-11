const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-04';

async function run() {
  const email = "vivaanveermahatha@gmail.com";
  const searchRes = await fetch(
    `https://${domain}/admin/api/${apiVersion}/customers/search.json?query=email:${encodeURIComponent(email)}`,
    {
      headers: {
        'X-Shopify-Access-Token': adminToken,
        'Content-Type': 'application/json',
      },
    }
  );
  const searchData = await searchRes.json();
  const existingCustomer = searchData.customers && searchData.customers.length > 0 ? searchData.customers[0] : null;

  if (existingCustomer) {
    console.log("Customer found:", existingCustomer.id);
    const updateRes = await fetch(
      `https://${domain}/admin/api/${apiVersion}/customers/${existingCustomer.id}.json`,
      {
        method: 'PUT',
        headers: {
          'X-Shopify-Access-Token': adminToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: {
            id: existingCustomer.id,
            accepts_marketing: true,
          },
        }),
      }
    );
    console.log("Update status:", updateRes.status);
    console.log("Update response:", await updateRes.text());
  } else {
    console.log("Customer not found.");
  }
}
run().catch(console.error);
