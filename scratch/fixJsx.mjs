import fs from 'fs';
import path from 'path';

const APP_JSX = path.join(process.cwd(), 'src', 'App.jsx');
let code = fs.readFileSync(APP_JSX, 'utf-8');

// The regex script did this:
// return `<Route path="${path}" element={${element.trim()}} />`;
// But it matched element as: <IzmirPageView onBack={() => navigateTo('/')}
// Wait, why did it match only part of it? Because of `\}`. It stopped at `navigateTo('/')}`

code = code.replace(/element=\{<([A-Za-z]+)([\s\S]*?)\/>\s+(onNavToContact|onSaveLead|settingsData|currentPath|teamMembers|blogPosts|servicesData|logHit)=([\s\S]*?)\}\s*\/>/g, (match, compName, p2, p3, p4) => {
    // This is broken. Let's just fix it manually using a simpler script or git checkout.
    return match; // dummy
});

fs.writeFileSync(APP_JSX, code);
