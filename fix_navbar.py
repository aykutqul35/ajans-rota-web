import re

with open('src/components/layout/Navbar.jsx', 'r') as f:
    content = f.read()

# Change lg: to xl: for better responsiveness with many menu items
content = content.replace('lg:', 'xl:')

# Prevent main navigation titles from wrapping
content = content.replace('font-semibold text-[1.05rem]', 'font-semibold text-[1.05rem] whitespace-nowrap')

# Prevent dropdown links from wrapping
content = content.replace('font-medium text-sm', 'font-medium text-sm whitespace-nowrap')

# Change max-width check in javascript from 1024 to 1280 (xl breakpoint)
content = content.replace('window.innerWidth <= 1024', 'window.innerWidth <= 1280')

with open('src/components/layout/Navbar.jsx', 'w') as f:
    f.write(content)

