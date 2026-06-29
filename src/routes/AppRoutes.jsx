import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import SkeletonLoader from '../components/SkeletonLoader';
import { getSmartGreeting } from '../utils/helpers';
import { budgetSteps, whyAgencyData } from '../data/mockData';
import ProtectedRoute from '../components/ProtectedRoute';
import HomePage from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';

const ClientTransparencyPageView = lazy(() => import('../components/ClientTransparencyPageView'));
const ServicePageView = lazy(() => import('../pages/ServicePageView'));
const IzmirPageView = lazy(() => import('../pages/IzmirPageView'));
const TestimonialsPageView = lazy(() => import('../pages/TestimonialsPageView'));
const ContactPageView = lazy(() => import('../pages/ContactPageView'));
const SeoAuditPageView = lazy(() => import('../pages/SeoAuditPageView'));
const KobiIndexPageView = lazy(() => import('../pages/KobiIndexPageView'));
const CreativeShowcasePageView = lazy(() => import('../pages/CreativeShowcasePageView'));
const CompetitorAnalysisPageView = lazy(() => import('../pages/CompetitorAnalysisPageView'));
const AkademiPageView = lazy(() => import('../pages/AkademiPageView'));
const AboutPageView = lazy(() => import('../pages/AboutPageView'));
const LegalPageView = lazy(() => import('../pages/LegalPageView'));
const TeamPageView = lazy(() => import('../pages/TeamPageView'));
const BlogPageView = lazy(() => import('../pages/BlogPageView'));
const AdminDashboardView = lazy(() => import('../pages/AdminDashboardView'));
const Login = lazy(() => import('../pages/admin/Login'));
const LocationPageView = lazy(() => import('../pages/LocationPageView'));

export default function AppRoutes(props) {
  const { isLeadPopupOpen, setIsLeadPopupOpen, isExitIntentPopup, setIsExitIntentPopup, settingsData, setSettingsData, servicesData, setServicesData, teamMembersData, setTeamMembersData, blogsData, setBlogsData, leadsData, setLeadsData, newsletterEmail, setNewsletterEmail, newsletterLoading, setNewsletterLoading, newsletterSubmitted, setNewsletterSubmitted, newsletterError, setNewsletterError, clientReports, setClientReports, authToken, setAuthToken, whyAgencySlide, setWhyAgencySlide, isScrolled, setIsScrolled, isMobileMenuOpen, setIsMobileMenuOpen, calculatorTab, setCalculatorTab, feeAdBudget, setFeeAdBudget, pricingModel, setPricingModel, targetRevenue, setTargetRevenue, selectedServices, setSelectedServices, googleSpend, setGoogleSpend, googleRoas, setGoogleRoas, metaSpend, setMetaSpend, metaRoas, setMetaRoas, ecomTraffic, setEcomTraffic, ecomAov, setEcomAov, ecomSpend, setEcomSpend, ecomRevenue, setEcomRevenue, b2bSpend, setB2bSpend, b2bLeads, setB2bLeads, b2bConversion, setB2bConversion, b2bLtv, setB2bLtv, budgetIndex, setBudgetIndex, reportFullName, setReportFullName, reportEmail, setReportEmail, reportWebsite, setReportWebsite, reportPhone, setReportPhone, proposalFullName, setProposalFullName, proposalEmail, setProposalEmail, proposalWebsite, setProposalWebsite, proposalPhone, setProposalPhone, isReportGenerated, setIsReportGenerated, reportLoading, setReportLoading, reportError, setReportError, isProposalGenerated, setIsProposalGenerated, proposalLoading, setProposalLoading, proposalError, setProposalError, ecomSector, setEcomSector, handleEcomSectorChange, b2bSector, setB2bSector, handleB2bSectorChange, testimonialsData, handleNavClick, handleServiceClick, simulateLeadLocally, logHit, navigate, handleGenerateReport, handleGenerateProposal, renderContactForm, renderWebDesignForm, renderReportForm, renderProposalForm, renderCalculatorResult, handleContactSubmit, setTestimonialsData, commitment, setCommitment, reportingPackage, setReportingPackage, smPackage, setSmPackage, webDesignType, setWebDesignType, webDesignFullName, setWebDesignFullName, webDesignEmail, setWebDesignEmail, webDesignPhone, setWebDesignPhone, webDesignMessage, setWebDesignMessage, webDesignLoading, webDesignSubmitted, baselineEcomOrders, baselineEcomCR, baselineEcomRoas, baselineEcomCac, rotaEcomCR, rotaEcomOrders, rotaEcomRevenue, rotaEcomRoas, rotaEcomCac, rotaEcomRevenueIncrease, ecomBudgetSavings, baselineB2bCustomers, baselineB2bRevenue, baselineB2bCpl, baselineB2bCac, baselineB2bRoi, rotaB2bLeads, rotaB2bConversion, rotaB2bCustomers, rotaB2bRevenue, rotaB2bCpl, rotaB2bCacFinal, rotaB2bRoi, rotaB2bRevenueIncrease, isSocialSelected, selectedCount, isOnlyDesignSelected, isOnlySocialSelected, bundleDiscountPercent, bundleDiscountAmount, activePricingModel, calculatedAgencyFee, discountPercent, discountAmount, finalAgencyFee, baseRetainerLabel, managementFeeDesc, rawBaseRetainer, scaledBundleDiscountAmount, performanceBundleDiscountAmount, b2bBudgetSavings } = props;
  return (
    <Routes>
            <Route path="/rota-management-vault-x9" element={<ProtectedRoute><AdminDashboardView settingsData={settingsData} setSettingsData={setSettingsData} servicesData={servicesData} setServicesData={setServicesData} teamMembersData={teamMembersData} setTeamMembersData={setTeamMembersData} blogsData={blogsData} setBlogsData={setBlogsData} testimonialsData={testimonialsData} setTestimonialsData={setTestimonialsData} leadsData={leadsData} setLeadsData={setLeadsData} authToken={authToken} setAuthToken={setAuthToken} clientReports={clientReports} setClientReports={setClientReports} onLogout={() => { localStorage.removeItem('admin_token'); navigate('/portal-girisi-x9'); }} /></ProtectedRoute>} />
            <Route path="/portal-girisi-x9" element={<Login />} />
            <Route path="/neden-izmir" element={<IzmirPageView onBack={() => navigate('/')} onNavToContact={() => navigate('/iletisim')} onSaveLead={simulateLeadLocally} />} />
            <Route path="/seo-analizi" element={<SeoAuditPageView onBack={() => navigate('/')} onNavToContact={() => navigate('/iletisim')} onSaveLead={simulateLeadLocally} logHit={logHit} />} />
            <Route path="/kobi-endeksi" element={<KobiIndexPageView onBack={() => navigate('/')} onSaveLead={simulateLeadLocally} logHit={logHit} />} />
            <Route path="/kreatif-vitrin" element={<CreativeShowcasePageView onBack={() => navigate('/')} />} />
            <Route path="/rakip-analizi" element={<CompetitorAnalysisPageView onBack={() => navigate('/')} onSaveLead={simulateLeadLocally} logHit={logHit} />} />
            <Route path="/akademi" element={<AkademiPageView onBack={() => navigate('/')} onSaveLead={simulateLeadLocally} logHit={logHit} />} />
            <Route path="/client-portal-secure" element={<Suspense fallback={<SkeletonLoader />}><ClientTransparencyPageView clientReports={clientReports} setClientReports={setClientReports} onBack={() => navigate('/')} onContactClick={() => navigate('/iletisim')} /></Suspense>} />
            <Route path="/hakkimizda" element={<AboutPageView onBack={() => navigate('/')} onNavToContact={() => navigate('/iletisim')} settingsData={settingsData} />} />
            <Route path="/gizlilik-politikasi" element={<LegalPageView onBack={() => navigate('/')} currentPath={'/gizlilik-politikasi'} settingsData={settingsData} />} />
            <Route path="/kullanim-kosullari" element={<LegalPageView onBack={() => navigate('/')} currentPath={'/kullanim-kosullari'} settingsData={settingsData} />} />
            <Route path="/kvkk-aydinlatma-metni" element={<LegalPageView onBack={() => navigate('/')} currentPath={'/kvkk-aydinlatma-metni'} settingsData={settingsData} />} />
            <Route path="/cerez-politikasi" element={<LegalPageView onBack={() => navigate('/')} currentPath={'/cerez-politikasi'} settingsData={settingsData} />} />
            <Route path="/ekiplerimiz" element={<TeamPageView onBack={() => navigate('/')} onNavToContact={() => navigate('/iletisim')} teamMembers={teamMembersData} onSaveLead={simulateLeadLocally} testimonialsData={testimonialsData} />} />
            <Route path="/blog" element={<BlogPageView onBack={() => navigate('/')} onNavToContact={() => navigate('/iletisim')} blogPosts={blogsData} initialSlug={null} />} />
            <Route path="/blog/:slug" element={<BlogPageView onBack={() => navigate('/')} onNavToContact={() => navigate('/iletisim')} blogPosts={blogsData} />} />
            <Route path="/hizmetlerimiz/:slug" element={<ServicePageView onBack={() => navigate('/')} onNavToContact={() => navigate('/iletisim')} budgetSteps={budgetSteps} servicesData={servicesData} testimonialsData={testimonialsData} />} />
            <Route path="/dijital-ajans/:slug" element={<Suspense fallback={<SkeletonLoader />}><LocationPageView /></Suspense>} />
            <Route path="/" element={
              <HomePage
                settingsData={settingsData}
                servicesData={servicesData}
                whyAgencyData={whyAgencyData}
                getSmartGreeting={getSmartGreeting}
                handleNavClick={handleNavClick}
                handleServiceClick={handleServiceClick}
                simulateLeadLocally={simulateLeadLocally}
                logHit={logHit}
                navigate={navigate}
                calculatorTab={calculatorTab} setCalculatorTab={setCalculatorTab}
                feeAdBudget={feeAdBudget} setFeeAdBudget={setFeeAdBudget}
                pricingModel={pricingModel} setPricingModel={setPricingModel}
                targetRevenue={targetRevenue} setTargetRevenue={setTargetRevenue}
                selectedServices={selectedServices} setSelectedServices={setSelectedServices}
                ecomTraffic={ecomTraffic} setEcomTraffic={setEcomTraffic}
                ecomAov={ecomAov} setEcomAov={setEcomAov}
                ecomSpend={ecomSpend} setEcomSpend={setEcomSpend}
                ecomRevenue={ecomRevenue} setEcomRevenue={setEcomRevenue}
                ecomSector={ecomSector} handleEcomSectorChange={handleEcomSectorChange}
                b2bSpend={b2bSpend} setB2bSpend={setB2bSpend} b2bLeads={b2bLeads} setB2bLeads={setB2bLeads} b2bConversion={b2bConversion} setB2bConversion={setB2bConversion} b2bLtv={b2bLtv} setB2bLtv={setB2bLtv}
                b2bSector={b2bSector} handleB2bSectorChange={handleB2bSectorChange}
                budgetIndex={budgetIndex} setBudgetIndex={setBudgetIndex} budgetSteps={budgetSteps}
                commitment={commitment} setCommitment={setCommitment}
                reportingPackage={reportingPackage} setReportingPackage={setReportingPackage}
                smPackage={smPackage} setSmPackage={setSmPackage}
                webDesignType={webDesignType} setWebDesignType={setWebDesignType}
                reportFullName={reportFullName} setReportFullName={setReportFullName}
                reportEmail={reportEmail} setReportEmail={setReportEmail}
                reportWebsite={reportWebsite} setReportWebsite={setReportWebsite}
                reportPhone={reportPhone} setReportPhone={setReportPhone}
                isReportGenerated={isReportGenerated} reportLoading={reportLoading} reportError={reportError}
                handleGenerateReport={handleGenerateReport}
                proposalFullName={proposalFullName} setProposalFullName={setProposalFullName}
                proposalEmail={proposalEmail} setProposalEmail={setProposalEmail}
                proposalWebsite={proposalWebsite} setProposalWebsite={setProposalWebsite}
                proposalPhone={proposalPhone} setProposalPhone={setProposalPhone}
                isProposalGenerated={isProposalGenerated} setIsProposalGenerated={setIsProposalGenerated}
                proposalLoading={proposalLoading} proposalError={proposalError}
                handleGenerateProposal={handleGenerateProposal}
                webDesignFullName={webDesignFullName} setWebDesignFullName={setWebDesignFullName}
                webDesignEmail={webDesignEmail} setWebDesignEmail={setWebDesignEmail}
                webDesignPhone={webDesignPhone} setWebDesignPhone={setWebDesignPhone}
                webDesignMessage={webDesignMessage} setWebDesignMessage={setWebDesignMessage}
                webDesignLoading={webDesignLoading} webDesignSubmitted={webDesignSubmitted}
                baselineEcomOrders={baselineEcomOrders} baselineEcomCR={baselineEcomCR}
                baselineEcomRoas={baselineEcomRoas} baselineEcomCac={baselineEcomCac}
                rotaEcomCR={rotaEcomCR} rotaEcomOrders={rotaEcomOrders}
                rotaEcomRevenue={rotaEcomRevenue} rotaEcomRoas={rotaEcomRoas} rotaEcomCac={rotaEcomCac}
                rotaEcomRevenueIncrease={rotaEcomRevenueIncrease} ecomBudgetSavings={ecomBudgetSavings}
                baselineB2bCustomers={baselineB2bCustomers} baselineB2bRevenue={baselineB2bRevenue}
                baselineB2bCpl={baselineB2bCpl} baselineB2bCac={baselineB2bCac} baselineB2bRoi={baselineB2bRoi}
                rotaB2bLeads={rotaB2bLeads} rotaB2bConversion={rotaB2bConversion}
                rotaB2bCustomers={rotaB2bCustomers} rotaB2bRevenue={rotaB2bRevenue}
                rotaB2bCpl={rotaB2bCpl} rotaB2bCacFinal={rotaB2bCacFinal}
                rotaB2bRoi={rotaB2bRoi} rotaB2bRevenueIncrease={rotaB2bRevenueIncrease}
                isSocialSelected={isSocialSelected} selectedCount={selectedCount}
                isOnlyDesignSelected={isOnlyDesignSelected}
                isOnlySocialSelected={isOnlySocialSelected}
                bundleDiscountPercent={bundleDiscountPercent} bundleDiscountAmount={bundleDiscountAmount}
                activePricingModel={activePricingModel} calculatedAgencyFee={calculatedAgencyFee}
                discountPercent={discountPercent} discountAmount={discountAmount}
                finalAgencyFee={finalAgencyFee}
                baseRetainerLabel={baseRetainerLabel} managementFeeDesc={managementFeeDesc}
                rawBaseRetainer={rawBaseRetainer}
                scaledBundleDiscountAmount={scaledBundleDiscountAmount}
                performanceBundleDiscountAmount={performanceBundleDiscountAmount}
                setProposalError={setProposalError}
                b2bBudgetSavings={b2bBudgetSavings}
                renderReportForm={renderReportForm}
                renderContactForm={renderContactForm}
                renderWebDesignForm={renderWebDesignForm}
                whyAgencySlide={whyAgencySlide} setWhyAgencySlide={setWhyAgencySlide}
              />
            } />
          
          {/* 5. Testimonials Section */}
          <Route path="/referanslar" element={
            <TestimonialsPageView onBack={() => navigate('/')} settingsData={settingsData} testimonialsData={testimonialsData} handleNavClick={handleNavClick} />
          } />
    
          {/* 6 & 7. Yol Haritamız ve İletişim Section */}
          <Route path="/iletisim" element={<>
            <ContactPageView onBack={() => navigate('/')} settingsData={settingsData} />
            <section id="contact" className="contact-section contact-page-layout">
              <div className="container">
                <div className="contact-details-row">
                  <div className="glass-card contact-detail-card">
                    <i className="fa-solid fa-phone"></i>
                    <div>
                      <h5>Bize Ulaşın</h5>
                      <p>{settingsData.phone}</p>
                    </div>
                  </div>
                  <div className="glass-card contact-detail-card">
                    <i className="fa-solid fa-envelope"></i>
                    <div>
                      <h5>E-Posta Gönderin</h5>
                      <p>{settingsData.email}</p>
                    </div>
                  </div>
                  <div className="glass-card contact-detail-card">
                    <i className="fa-solid fa-house-laptop"></i>
                    <div>
                      <h5>Çalışma Modelimiz</h5>
                      <p>{settingsData.address}</p>
                    </div>
                  </div>
                </div>
    
                <div className="contact-page-grid">
                  {/* Left: Aegean Map */}
                  <div className="glass-card contact-map-card">
                    <picture>
                      {settingsData.contact_map_image_mobile && <source media="(max-width: 768px)" srcSet={settingsData.contact_map_image_mobile} />}
                      <img src={settingsData.contact_map_image || "/images/aegean_map_light.png"} alt="Ajans Rota Ege Bölgesi Hizmet Haritası" className="aegean-full-visible-map" />
                    </picture>
                    <div className="map-badge">
                      <i className="fa-solid fa-circle-nodes"></i>
                      <span>Ege'nin Dijital Rotası: Tüm Bölge Bizimle Büyüyor!</span>
                    </div>
                  </div>
    
                  {/* Right: Enlarged Form Card */}
                  <div className="glass-card contact-form-card">
                    <div className="contact-form-header">
                      <h3>Rotanızı Birlikte Çizelim</h3>
                      <p>İzmir'de ve tüm Ege genelinde markanızı dijital pazarda büyütmek için formu doldurun, 24 saat içinde dönüş sağlayalım.</p>
                    </div>
                    {renderContactForm()}
                  </div>
                </div>
              </div>
            </section>
          </>
          } />
          <Route path="*" element={<NotFoundPage onGoHome={() => navigate('/')} />} />
          </Routes>
  );
}
