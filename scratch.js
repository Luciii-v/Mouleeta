const domain = 'kvd0hr-0x.myshopify.com';
const accessToken = '0a5a47b14cf14e856ff1c78d39ca3dc8';
const apiVersion = '2024-04';

const query = `
{
  products(first: 250) {
    edges {
      node {
        title
        handle
      }
    }
  }
}
`;

fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Storefront-Access-Token': accessToken,
  },
  body: JSON.stringify({ query }),
})
  .then(res => res.json())
  .then(data => {
    const products = data.data.products.edges;
    products.forEach(p => {
      const title = p.node.title.toLowerCase();
      if (title.includes('tie n dye') || title.includes('pintuck')) {
        console.log(`Title: ${p.node.title}, Handle: ${p.node.handle}`);
      }
    });
  })
  .catch(console.error);
