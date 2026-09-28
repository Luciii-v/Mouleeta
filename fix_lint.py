with open('src/components/FacebookPixel.tsx', 'r') as f:
    content = f.read()

content = content.replace("fbq: any;", "fbq: (...args: unknown[]) => void;")
content = content.replace("_fbq: any;", "_fbq: (...args: unknown[]) => void;")

with open('src/components/FacebookPixel.tsx', 'w') as f:
    f.write(content)


with open('src/components/ProductReviews.tsx', 'r') as f:
    content2 = f.read()

# Remove the useEffect entirely
import re
content2 = re.sub(r'  useEffect\(\(\) => \{\n    if \(session\?\.user\) \{\n      if \(session\.user\.name && !authorName\) setAuthorName\(session\.user\.name\);\n      // If we had an email state, we\'d set it here too\n    \}\n  \}, \[session\]\);\n', '', content2)

# Change the input to fallback to session name if authorName is empty, but we also want them to be able to type.
# Actually, if we just want to default it:
content2 = content2.replace('value={authorName}', 'value={authorName || session?.user?.name || ""}')
content2 = content2.replace('onChange={(e) => setAuthorName(e.target.value)}', 'onChange={(e) => setAuthorName(e.target.value)}')

with open('src/components/ProductReviews.tsx', 'w') as f:
    f.write(content2)

print("Fixed lint errors")
