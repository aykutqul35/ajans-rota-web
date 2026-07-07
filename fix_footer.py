import re

with open('src/components/layout/Footer.jsx', 'r') as f:
    content = f.read()

# Make it light theme
content = content.replace('bg-slate-900', 'bg-slate-50')
content = content.replace('text-white', 'text-slate-800')
content = content.replace('text-slate-300', 'text-slate-600')
content = content.replace('text-slate-400', 'text-slate-500')
content = content.replace('text-slate-500', 'text-slate-400')
content = content.replace('border-slate-800', 'border-slate-200')
content = content.replace('border-slate-700', 'border-slate-200')
content = content.replace('bg-slate-800/40', 'bg-white')
content = content.replace('bg-slate-800/50', 'bg-white')
content = content.replace('bg-slate-800', 'bg-white')
content = content.replace('hover:bg-slate-800', 'hover:bg-slate-50')

with open('src/components/layout/Footer.jsx', 'w') as f:
    f.write(content)

