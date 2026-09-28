with open('src/app/layout.tsx', 'r') as f:
    content = f.read()

old_toast = """        <Toaster 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: '#1A1A1A',
              color: '#F9F8F6',
              border: '1px solid #333',
              borderRadius: '0px',
              fontFamily: 'var(--font-inter)',
              letterSpacing: '0.05em',
            }
          }} 
        />"""

new_toast = """        <Toaster 
          position="bottom-right"
          toastOptions={{
            unstyled: true,
            classNames: {
              toast: 'bg-white border border-stone-200 shadow-2xl rounded-none flex flex-col p-6 w-[350px] gap-2 items-start',
              title: 'font-jost text-sm tracking-[0.1em] uppercase font-medium text-stone-900',
              description: 'font-inter text-xs text-stone-500 font-light',
              icon: 'hidden',
            },
          }}
        />"""

content = content.replace(old_toast, new_toast)

with open('src/app/layout.tsx', 'w') as f:
    f.write(content)
