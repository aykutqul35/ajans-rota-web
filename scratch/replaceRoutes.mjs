import fs from 'fs';
import path from 'path';

const APP_JSX = path.join(process.cwd(), 'src', 'App.jsx');
let code = fs.readFileSync(APP_JSX, 'utf-8');

// Replace standard equality checks
code = code.replace(/\{currentPath === '([^']+)' && ([\s\S]*?)\}/g, (match, path, element) => {
    // Some elements are wrapped in Suspense or fragments, but they are JSX expressions.
    return `<Route path="${path}" element={${element.trim()}} />`;
});

// Replace array includes checks
code = code.replace(/\{\['([^']+)', '([^']+)', '([^']+)', '([^']+)'\]\.includes\(currentPath\) && ([\s\S]*?)\}/g, (match, p1, p2, p3, p4, element) => {
    return `
      <Route path="${p1}" element={${element.trim()}} />
      <Route path="${p2}" element={${element.trim()}} />
      <Route path="${p3}" element={${element.trim()}} />
      <Route path="${p4}" element={${element.trim()}} />
    `;
});

// Replace startsWith checks for /blog/ and /hizmetlerimiz/
// For blog
code = code.replace(/\{\(currentPath === '\/blog' \|\| currentPath\.startsWith\('\/blog\/'\)\) && ([\s\S]*?)\}/g, (match, element) => {
    return `<Route path="/blog" element={${element.trim()}} />
      <Route path="/blog/:slug" element={${element.trim()}} />`;
});

// For services
code = code.replace(/\{currentPath\.startsWith\('\/hizmetlerimiz\/'\) && ([\s\S]*?)\}/g, (match, element) => {
    return `<Route path="/hizmetlerimiz/:slug" element={${element.trim()}} />`;
});

// For Admin
code = code.replace(/if \(currentPath === '\/admin'\) \{[\s\S]*?return ([\s\S]*?);[\s\S]*?\}/g, '');
code = code.replace(/\{\/\* 1\. Neden İzmir Page \*\/\}/g, '{\/* Admin Page *\/}\n      <Route path="/admin" element={<AdminDashboardView settingsData={settingsData} setSettingsData={setSettingsData} servicesData={servicesData} setServicesData={setServicesData} teamMembersData={teamMembersData} setTeamMembersData={setTeamMembersData} blogsData={blogsData} setBlogsData={setBlogsData} testimonialsData={testimonialsData} setTestimonialsData={setTestimonialsData} leadsData={leadsData} setLeadsData={setLeadsData} authToken={authToken} setAuthToken={setAuthToken} clientReports={clientReports} setClientReports={setClientReports} onLogout={() => navigateTo(\'/\')} />} />\n\n      {\/* 1. Neden İzmir Page *\/}');

// Then we need to wrap all the extracted <Route>s in <Routes>...</Routes>
// But since the elements are mixed with comments, it's better to find the start of the first Route and end of the last Route.
code = code.replace(/<Route path="\/neden-izmir"/, '<Routes>\n        <Route path="/neden-izmir"');
code = code.replace(/<Route path="\/hizmetlerimiz\/:slug" element=\{<ServicePageView[\s\S]*?\/>\} \/>/, match => match + '\n      ');

fs.writeFileSync(APP_JSX, code);
console.log('Routes replaced');
