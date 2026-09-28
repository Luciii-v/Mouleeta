import os
import glob

def add_dynamic(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    if 'export const dynamic' not in content:
        content = "export const dynamic = 'force-dynamic';\n" + content
        with open(filepath, 'w') as f:
            f.write(content)

api_routes = glob.glob('src/app/api/**/route.*', recursive=True)
for route in api_routes:
    add_dynamic(route)

print("Added force-dynamic to API routes")
