import re

with open('.github/workflows/deploy.yml', 'r') as f:
    content = f.read()

# Change the sync_env function to dynamically use --type
# NEXT_PUBLIC_ keys get --type config (except maybe we can just pass --type depending on the prefix)
new_sync = """          sync_env() {
            local TYPE="secret"
            if [[ "$1" == NEXT_PUBLIC_* ]]; then
              TYPE="config"
            fi
            printf '%s' "$2" | vercel env rm "$1" production --yes --token=${{ secrets.VERCEL_TOKEN }} 2>/dev/null || true
            printf '%s' "$2" | vercel env add "$1" production --type $TYPE --token=${{ secrets.VERCEL_TOKEN }}
          }"""

old_sync = """          sync_env() {
            printf '%s' "$2" | vercel env rm "$1" production --yes --token=${{ secrets.VERCEL_TOKEN }} 2>/dev/null || true
            printf '%s' "$2" | vercel env add "$1" production --token=${{ secrets.VERCEL_TOKEN }}
          }"""

content = content.replace(old_sync, new_sync)

with open('.github/workflows/deploy.yml', 'w') as f:
    f.write(content)
print("deploy.yml patched")
