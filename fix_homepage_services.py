with open('src/pages/HomePage.jsx', 'r') as f:
    content = f.read()

# Add import
import_stmt = "import FuturisticServices from '../components/home/FuturisticServices';\n"
if import_stmt not in content:
    content = content.replace("import StaggerContainer, { StaggerItem } from '../components/StaggerContainer';", "import StaggerContainer, { StaggerItem } from '../components/StaggerContainer';\n" + import_stmt)

# Extract the block to replace
start_idx = content.find('<section id="services" className="services">')
end_idx = content.find('</section>', start_idx) + len('</section>')

if start_idx != -1 and end_idx != -1:
    new_section = """{/* Futuristic 3D Services Ecosystem */}
      <FuturisticServices handleServiceClick={handleServiceClick} />"""
    
    content = content[:start_idx] + new_section + content[end_idx:]
    
    with open('src/pages/HomePage.jsx', 'w') as f:
        f.write(content)
    print("Replaced successfully!")
else:
    print("Could not find section!")
