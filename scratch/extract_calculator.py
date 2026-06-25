import re

with open('src/App.jsx', 'r') as f:
    lines = f.readlines()

start_jsx = -1
end_jsx = -1

for i, line in enumerate(lines):
    if '{/* 4. Calculator Section */}' in line:
        start_jsx = i
    if '{/* 5. Contact / Booking Section */}' in line or '<section id="contact"' in line:
        if start_jsx != -1 and i > start_jsx and end_jsx == -1:
            end_jsx = i

print(f"JSX block: {start_jsx} to {end_jsx}")

