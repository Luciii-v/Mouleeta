with open('src/components/ProductReviews.tsx', 'r') as f:
    content = f.read()

import re

# Add eslint-disable comments before every line containing `(window as any)`
# We have three lines to patch inside the useEffect:
#     if ((window as any).jdgm && (window as any).jdgm.initializeWidget) {
#       setTimeout(() => {
#         (window as any).jdgm.initializeWidget();
#       }, 500);

old_use_effect = """  useEffect(() => {
    // Re-initialize Judge.me widget when component mounts or product changes
    if ((window as any).jdgm && (window as any).jdgm.initializeWidget) {
      setTimeout(() => {
        (window as any).jdgm.initializeWidget();
      }, 500);
    }
  }, [productId]);"""

new_use_effect = """  useEffect(() => {
    // Re-initialize Judge.me widget when component mounts or product changes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).jdgm && (window as any).jdgm.initializeWidget) {
      setTimeout(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).jdgm.initializeWidget();
      }, 500);
    }
  }, [productId]);"""

content = content.replace(old_use_effect, new_use_effect)

with open('src/components/ProductReviews.tsx', 'w') as f:
    f.write(content)
print("Patched ESLint in ProductReviews")
