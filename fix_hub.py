with open('src/components/FloatingActionHub.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    "{ icon: <Star size={16} strokeWidth={1.5} />, label: \"Reviews\" },\n    ",
    ""
)

# And remove the Star import since it's now unused
content = content.replace(
    "import { MessageCircle, Star, Gift, X, HelpCircle } from 'lucide-react';",
    "import { MessageCircle, Gift, X, HelpCircle } from 'lucide-react';"
)

with open('src/components/FloatingActionHub.tsx', 'w') as f:
    f.write(content)
print("Removed Reviews from FloatingActionHub")
