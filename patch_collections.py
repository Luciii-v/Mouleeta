import re

with open('src/lib/shopify.ts', 'r') as f:
    content = f.read()

# Add getCollections function
get_collections_func = """
export async function getCollections(): Promise<{ title: string; handle: string }[]> {
  const query = `
    query getCollections {
      collections(first: 10) {
        edges {
          node {
            title
            handle
          }
        }
      }
    }
  `;
  try {
    const res = await shopifyFetch<{ data: { collections: { edges: Array<{ node: { title: string; handle: string } }> } } }>({
      query,
      cache: 'force-cache',
      tags: ['collections']
    });
    return res.body?.data?.collections?.edges.map(e => e.node) || [];
  } catch (error) {
    console.error('Failed to fetch collections:', error);
    return [];
  }
}
"""

if "export async function getCollections" not in content:
    content += "\n" + get_collections_func
    with open('src/lib/shopify.ts', 'w') as f:
        f.write(content)
    print("Added getCollections")
else:
    print("Already exists")
