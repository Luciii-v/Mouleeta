with open('src/components/ProductReviews.tsx', 'r') as f:
    content = f.read()

# Add useSession import
if "import { useSession } from 'next-auth/react';" not in content:
    content = content.replace("import { toast } from 'sonner';", "import { toast } from 'sonner';\nimport { useSession } from 'next-auth/react';")

# Add useSession hook and useEffect to prefill
new_state_logic = """
  const { data: session } = useSession();
  
  useEffect(() => {
    if (session?.user) {
      if (session.user.name && !authorName) setAuthorName(session.user.name);
      // If we had an email state, we'd set it here too
    }
  }, [session]);
"""

# Inject state logic
if "const { data: session } = useSession();" not in content:
    content = content.replace("const [isLoading, setIsLoading] = useState(true);", "const [isLoading, setIsLoading] = useState(true);\n" + new_state_logic)

# Make the email input controlled if it isn't already (currently it has no value/onChange)
content = content.replace("""<input 
                      type="email" 
                      className="w-full bg-white border border-stone-200 px-4 py-3 font-inter text-sm focus:outline-none focus:border-stone-900"
                      placeholder="For verification only"
                    />""", """<input 
                      type="email" 
                      value={session?.user?.email || ''}
                      readOnly={!!session?.user?.email}
                      className={`w-full bg-white border border-stone-200 px-4 py-3 font-inter text-sm focus:outline-none focus:border-stone-900 ${session?.user?.email ? 'bg-stone-50 text-stone-500 cursor-not-allowed' : ''}`}
                      placeholder="For verification only"
                    />""")

with open('src/components/ProductReviews.tsx', 'w') as f:
    f.write(content)
print("Added next-auth auto-fill to ProductReviews.tsx")
