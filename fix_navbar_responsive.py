with open('src/index.css', 'r') as f:
    content = f.read()

# The block of CSS to extract is between `@media (max-width: 768px) { \n  .navbar {` and `  .nav-cta {\n    display: none;\n  }`
start_str = """@media (max-width: 768px) {
  .navbar {"""
end_str = """  .nav-cta {
    display: none;
  }"""

if start_str in content and end_str in content:
    start_idx = content.find(start_str)
    # The end of the block we want to extract
    end_block_idx = content.find(end_str) + len(end_str)
    
    # Extract the navbar rules
    navbar_rules_inside = content[start_idx + len("@media (max-width: 768px) {\n"):end_block_idx]
    
    # Remove them from the 768px media query
    content = content[:start_idx + len("@media (max-width: 768px) {\n")] + content[end_block_idx:]
    
    # Create the new 1280px media query block
    new_media_query = f"""@media (max-width: 1280px) {{
{navbar_rules_inside}
}}

"""
    
    # Insert it above @media (max-width: 1024px)
    insert_str = "/* Responsiveness adjustments */\n"
    if insert_str in content:
        content = content.replace(insert_str, insert_str + new_media_query)
        
        with open('src/index.css', 'w') as f:
            f.write(content)
        print("Successfully extracted navbar rules to 1280px media query!")
    else:
        print("Could not find insertion point!")
else:
    print("Could not find start or end string in index.css")
