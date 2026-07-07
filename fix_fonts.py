with open('src/components/layout/Navbar.jsx', 'r') as f:
    content = f.read()

content = content.replace('className={`text-2xl font-bold flex items-center', 'className={`text-2xl font-bold flex items-center font-heading tracking-tight')
content = content.replace('<span className="tracking-tight">AJANS ROTA</span>', '<span>AJANS ROTA</span>')

with open('src/components/layout/Navbar.jsx', 'w') as f:
    f.write(content)

with open('src/components/layout/Footer.jsx', 'r') as f:
    content = f.read()

content = content.replace('className="inline-flex items-center gap-3 text-2xl font-bold', 'className="inline-flex items-center gap-3 text-2xl font-bold font-heading tracking-tight')

with open('src/components/layout/Footer.jsx', 'w') as f:
    f.write(content)
