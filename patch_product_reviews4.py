import re

with open('src/components/ProductReviews.tsx', 'r') as f:
    content = f.read()

# Add a timeout state to hide the spinner
new_component = """export default function ProductReviews({ productId, productHandle }: ProductReviewsProps) {
  const numericId = productId ? productId.split('/').pop() : '';
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    // Re-initialize Judge.me widget when component mounts or product changes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).jdgm && (window as any).jdgm.initializeWidget) {
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).jdgm.initializeWidget();
      }, 500);
    }
    
    // Fallback: If Judge.me doesn't replace the content within 5 seconds, hide our spinner
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [productId]);"""

old_component = """export default function ProductReviews({ productId, productHandle }: ProductReviewsProps) {
  const numericId = productId ? productId.split('/').pop() : '';

  useEffect(() => {
    // Re-initialize Judge.me widget when component mounts or product changes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).jdgm && (window as any).jdgm.initializeWidget) {
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).jdgm.initializeWidget();
      }, 500);
    }
  }, [productId]);"""

content = content.replace(old_component, new_component)

# Replace the spinner to use the loading state
old_spinner = """            {/* Fallback loader while Judge.me connects */}
            <div className="flex flex-col items-center justify-center h-48 opacity-50">
              <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin mb-4"></div>
              <p className="font-jost text-xs tracking-widest uppercase text-stone-500">Connecting Judge.me Reviews...</p>
            </div>"""

new_spinner = """            {/* Fallback loader while Judge.me connects */}
            {loading ? (
              <div className="flex flex-col items-center justify-center h-48 opacity-50">
                <div className="w-6 h-6 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin mb-4"></div>
                <p className="font-jost text-xs tracking-widest uppercase text-stone-500">Connecting Judge.me Reviews...</p>
              </div>
            ) : null}"""

content = content.replace(old_spinner, new_spinner)

with open('src/components/ProductReviews.tsx', 'w') as f:
    f.write(content)
print("Added loading state to ProductReviews")
