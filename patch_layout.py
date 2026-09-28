with open('src/app/layout.tsx', 'r') as f:
    content = f.read()

import_statement = "import FacebookPixel from '@/components/FacebookPixel';\n"
if import_statement not in content:
    content = content.replace("import './globals.css';", "import './globals.css';\n" + import_statement)
    content = content.replace("</body>", "  <FacebookPixel />\n      </body>")

with open('src/app/layout.tsx', 'w') as f:
    f.write(content)
print("Injected FacebookPixel into layout.tsx")
