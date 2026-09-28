with open('src/components/CartDrawer.tsx', 'r') as f:
    content = f.read()

import re

old_badges_regex = r'\{/\* Payment Trust Icons \*/\}.*?\{/\* Visa Placeholder \*/\}\s*<div className="w-\[34px\] h-\[22px\] bg-stone-100 rounded-\[3px\] border border-stone-200 flex items-center justify-center">\s*<span className="font-jost text-\[8px\] font-bold text-blue-800">VISA</span>\s*</div>\s*</div>'

new_badges = """{/* Payment Trust Icons */}
            <div className="flex items-center justify-center gap-3 mt-4 opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <div className="h-[22px] px-3 bg-stone-100 rounded-[3px] border border-stone-200 flex items-center justify-center">
                <span className="font-jost text-[9px] font-bold tracking-widest text-stone-700">APPLE PAY</span>
              </div>
              <div className="h-[22px] px-3 bg-stone-100 rounded-[3px] border border-stone-200 flex items-center justify-center">
                <span className="font-jost text-[9px] font-bold tracking-widest text-stone-700">GPAY</span>
              </div>
              <div className="h-[22px] px-3 bg-stone-100 rounded-[3px] border border-stone-200 flex items-center justify-center">
                <span className="font-jost text-[9px] font-bold tracking-widest text-stone-700">VISA</span>
              </div>
            </div>"""

content = re.sub(old_badges_regex, new_badges, content, flags=re.DOTALL)

with open('src/components/CartDrawer.tsx', 'w') as f:
    f.write(content)
print("Patched CartDrawer properly")
