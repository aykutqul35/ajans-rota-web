with open('src/App.jsx', 'r') as f:
    lines = f.readlines()

start_jsx = 3255
end_jsx = 3255
for i, line in enumerate(lines):
    if '{/* 4. Calculator Section */}' in line:
        start_jsx = i
    if '{/* 5. Contact / Booking Section */}' in line:
        end_jsx = i
        break

if end_jsx == 3255:
    for i, line in enumerate(lines):
        if '<section id="contact"' in line and i > start_jsx:
            end_jsx = i
            break

calc_lines = lines[start_jsx:end_jsx]

# Find services section
services_idx = -1
for i, line in enumerate(lines):
    if '{/* Services Section */}' in line:
        services_idx = i
        break

if services_idx != -1 and len(calc_lines) > 0:
    # Construct new lines
    # Everything up to services section
    new_lines = lines[:services_idx]
    # Then calculator
    new_lines.extend(calc_lines)
    # Then from services up to calculator start
    new_lines.extend(lines[services_idx:start_jsx])
    # Then from calculator end to EOF
    new_lines.extend(lines[end_jsx:])
    
    with open('src/App.jsx', 'w') as f:
        f.writelines(new_lines)
    print("Move successful")
else:
    print(f"Failed to find indices. calc_lines len: {len(calc_lines)}, services_idx: {services_idx}")

