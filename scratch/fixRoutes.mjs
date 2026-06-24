import fs from 'fs';
import path from 'path';

const APP_JSX = path.join(process.cwd(), 'src', 'App.jsx');
let code = fs.readFileSync(APP_JSX, 'utf-8');

// Fix IzmirPageView
code = code.replace(
  /<Route path="\/neden-izmir" element=\{<IzmirPageView onBack\{\(\) => navigateTo\('\/'\)\} \/> onNavToContact=\{[\s\S]*? \/>\}/,
  `<Route path="/neden-izmir" element={<IzmirPageView onBack={() => navigate('/')} onNavToContact={() => navigate('/iletisim')} onSaveLead={simulateLeadLocally} />} />`
);

// We'll just replace the entire Routes block manually because it's only about 30 lines long.
const correctRoutesBlock = `      <Routes>
        <Route path="/admin" element={<AdminDashboardView settingsData={settingsData} setSettingsData={setSettingsData} servicesData={servicesData} setServicesData={setServicesData} teamMembersData={teamMembersData} setTeamMembersData={setTeamMembersData} blogsData={blogsData} setBlogsData={setBlogsData} testimonialsData={testimonialsData} setTestimonialsData={setTestimonialsData} leadsData={leadsData} setLeadsData={setLeadsData} authToken={authToken} setAuthToken={setAuthToken} clientReports={clientReports} setClientReports={setClientReports} onLogout={() => navigate('/')} />} />
        <Route path="/neden-izmir" element={<IzmirPageView onBack={() => navigate('/')} onNavToContact={() => navigate('/iletisim')} onSaveLead={simulateLeadLocally} />} />
        <Route path="/seo-analizi" element={<SeoAuditPageView onBack={() => navigate('/')} onNavToContact={() => navigate('/iletisim')} onSaveLead={simulateLeadLocally} logHit={logHit} />} />
        <Route path="/kobi-endeksi" element={<KobiIndexPageView onBack={() => navigate('/')} onSaveLead={simulateLeadLocally} logHit={logHit} />} />
        <Route path="/kreatif-vitrin" element={<CreativeShowcasePageView onBack={() => navigate('/')} />} />
        <Route path="/rakip-analizi" element={<CompetitorAnalysisPageView onBack={() => navigate('/')} onSaveLead={simulateLeadLocally} logHit={logHit} />} />
        <Route path="/akademi" element={<AkademiPageView onBack={() => navigate('/')} onSaveLead={simulateLeadLocally} logHit={logHit} />} />
        <Route path="/seffaf-panel" element={<Suspense fallback={<SkeletonLoader />}><ClientTransparencyPageView clientReports={clientReports} onBack={() => navigate('/')} onContactClick={() => navigate('/iletisim')} /></Suspense>} />
        <Route path="/hakkimizda" element={<AboutPageView onBack={() => navigate('/')} onNavToContact={() => navigate('/iletisim')} settingsData={settingsData} />} />
        <Route path="/gizlilik-politikasi" element={<LegalPageView onBack={() => navigate('/')} currentPath={'/gizlilik-politikasi'} settingsData={settingsData} />} />
        <Route path="/kullanim-kosullari" element={<LegalPageView onBack={() => navigate('/')} currentPath={'/kullanim-kosullari'} settingsData={settingsData} />} />
        <Route path="/kvkk-aydinlatma-metni" element={<LegalPageView onBack={() => navigate('/')} currentPath={'/kvkk-aydinlatma-metni'} settingsData={settingsData} />} />
        <Route path="/cerez-politikasi" element={<LegalPageView onBack={() => navigate('/')} currentPath={'/cerez-politikasi'} settingsData={settingsData} />} />
        <Route path="/ekiplerimiz" element={<TeamPageView onBack={() => navigate('/')} onNavToContact={() => navigate('/iletisim')} teamMembers={teamMembersData} onSaveLead={simulateLeadLocally} testimonialsData={testimonialsData} />} />
        <Route path="/blog" element={<BlogPageView onBack={() => navigate('/')} onNavToContact={() => navigate('/iletisim')} blogPosts={blogsData} initialSlug={null} />} />
        <Route path="/blog/:slug" element={<BlogPageView onBack={() => navigate('/')} onNavToContact={() => navigate('/iletisim')} blogPosts={blogsData} />} />
        <Route path="/hizmetlerimiz/:slug" element={<ServicePageView onBack={() => navigate('/')} onNavToContact={() => navigate('/iletisim')} budgetSteps={budgetSteps} servicesData={servicesData} testimonialsData={testimonialsData} />} />
        <Route path="/" element={<>`;

// Let's find where it starts and ends
const startIndex = code.indexOf('{/* Admin Page */}');
const endIndex = code.indexOf('{/* 3. Homepage Landing Sections */}');

if (startIndex !== -1 && endIndex !== -1) {
  code = code.substring(0, startIndex) + correctRoutesBlock + '\n\n      {/* 3. Homepage Landing Sections */}' + code.substring(endIndex + 36);
  fs.writeFileSync(APP_JSX, code);
  console.log('Fixed Routes block');
} else {
  console.log('Could not find boundaries');
}
