import re

with open('src/components/CartDrawer.tsx', 'r') as f:
    content = f.read()

payment_icons = """
            {/* Payment Trust Icons */}
            <div className="flex items-center justify-center gap-3 mt-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              {/* Apple Pay */}
              <svg width="34" height="22" viewBox="0 0 34 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="34" height="22" rx="3" fill="#1A1A1A"/>
                <path d="M14.6 13.9C14.6 12.3 15.9 11.4 18.2 11.3C18.2 11.2 18.2 11.1 18.2 11C18.2 9.5 17 8.5 15.2 8.5C13.8 8.5 12.5 9.4 11.8 9.4C11 9.4 10.1 8.6 9.1 8.6C7.8 8.6 6.5 9.4 5.9 10.5C4.5 13 5.4 16.7 6.8 18.6C7.5 19.5 8.2 20.6 9.2 20.6C10.2 20.6 10.6 19.9 11.8 19.9C13 19.9 13.3 20.6 14.4 20.6C15.4 20.6 16.1 19.6 16.7 18.6C17.5 17.5 17.8 16.4 17.8 16.3C17.7 16.2 14.6 15.1 14.6 13.9ZM12.7 7.2C13.3 6.5 13.7 5.5 13.5 4.5C12.7 4.6 11.6 5.1 11 5.8C10.5 6.4 10.1 7.4 10.3 8.3C11.2 8.4 12.1 7.9 12.7 7.2Z" fill="white"/>
              </svg>
              {/* Google Pay */}
              <svg width="34" height="22" viewBox="0 0 34 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="34" height="22" rx="3" fill="white" stroke="#E5E5E5"/>
                <path d="M13.6 11.3L12.3 14.7H11.2L12.9 10.4L11.1 5.6H12.3L13.5 9.2C13.6 9.5 13.7 9.8 13.7 10C13.8 9.8 13.9 9.5 14 9.2L15.3 5.6H16.4L13.6 11.3Z" fill="#5F6368"/>
                <path d="M19.3 12.5C18.6 12.5 18 12.3 17.6 11.9C17.1 11.5 16.9 11 16.9 10.4C16.9 9.7 17.1 9.2 17.6 8.9C18.1 8.5 18.8 8.3 19.5 8.3C20.2 8.3 20.7 8.4 21.1 8.6V8.4C21.1 7.9 20.9 7.4 20.5 7.1C20.2 6.8 19.8 6.7 19.3 6.7C18.9 6.7 18.6 6.8 18.3 6.9C18 7.1 17.8 7.3 17.7 7.6L16.8 6.9C17 6.4 17.4 6.1 17.9 5.8C18.4 5.6 18.9 5.5 19.5 5.5C20.4 5.5 21.1 5.8 21.6 6.3C22 6.8 22.3 7.5 22.3 8.3V12.3H21.2V11.5H21.2C20.7 12.2 20.1 12.5 19.3 12.5ZM19.5 11.6C20 11.6 20.4 11.4 20.7 11.1C21 10.8 21.2 10.4 21.2 10C20.9 9.7 20.4 9.6 19.7 9.6C19.2 9.6 18.8 9.7 18.5 9.9C18.2 10.1 18 10.4 18 10.7C18 11.3 18.5 11.6 19.5 11.6Z" fill="#5F6368"/>
              </svg>
              {/* Visa Placeholder */}
              <div className="w-[34px] h-[22px] bg-stone-100 rounded-[3px] border border-stone-200 flex items-center justify-center">
                <span className="font-jost text-[8px] font-bold text-blue-800">VISA</span>
              </div>
            </div>
"""

# Inject right after the closing </motion.button> for checkout
content = content.replace("            </motion.button>\n          </div>", "            </motion.button>\n" + payment_icons + "\n          </div>")

with open('src/components/CartDrawer.tsx', 'w') as f:
    f.write(content)
print("CartDrawer patched.")
