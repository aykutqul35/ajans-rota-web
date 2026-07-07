with open('src/index.css', 'r') as f:
    content = f.read()

# Check if we already have the reset
if '/* Tailwind preflight essentials */' not in content:
    # Insert it right after the basic reset
    reset_css = """
/* Tailwind preflight essentials */
a { text-decoration: none; color: inherit; }
ul, ol { list-style: none; }
button { background: transparent; border: none; cursor: pointer; color: inherit; }
"""
    content = content.replace('* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}', '* {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}' + reset_css)
    
    with open('src/index.css', 'w') as f:
        f.write(content)

