import os

filepath = "/Users/soucius/.gemini/antigravity/scratch/izmir-digital-agency/src/App.jsx"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Let's inspect the target areas. We can replace using unique anchors.
# Anchor 1: In Tab 1: Integration (Google Ads event script down to GA4/GTM/TikTok Pixel)
# Let's look for:
target_tab1 = """                  <div className="admin-form-group">
                    <label>Google Ads Custom Event Script (Dönüşüm Olay Scripti)</label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginTop: '1rem' }}>
                  
                  {/* LOGOS GROUP */}"""

# We want to replace the whole broken tab 1 block back to the correct fields.
# Let's find exactly from `Google Ads Custom Event Script` label down to `TikTok Pixel Ayarları` header.
start_idx_tab1 = content.find('Google Ads Custom Event Script (Dönüşüm Olay Scripti)')
end_idx_tab1 = content.find('TikTok Pixel Ayarları')

if start_idx_tab1 == -1 or end_idx_tab1 == -1:
    print("Error: Could not find Tab 1 target landmarks.")
    exit(1)

# Let's see what is inside this range.
print("Target Tab 1 block found between", start_idx_tab1, "and", end_idx_tab1)

original_tab1_insert = """Google Ads Custom Event Script (Dönüşüm Olay Scripti)</label>
                    <textarea 
                      rows="2"
                      value={settingsData.google_ads_event_script || ''} 
                      onChange={(e) => setSettingsData({ ...settingsData, google_ads_event_script: e.target.value })} 
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff', fontFamily: 'monospace', fontSize: '0.8rem' }} 
                      placeholder="gtag('event', 'conversion', {...})"
                    />
                  </div>
                </div>

                <h3 style={{ marginTop: '2rem', marginBottom: '1.25rem', fontSize: '1.1rem', color: 'var(--text-light)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-chart-line" style={{ color: '#f57c00', fontSize: '1.1rem' }}></i> Google Analytics 4 (GA4) Ayarları
                </h3>
                <div className="admin-form-group">
                  <label>GA4 Ölçüm Kimliği (Measurement ID - G-XXXXXXX)</label>
                  <input 
                    type="text" 
                    value={settingsData.google_analytics_id || ''} 
                    onChange={(e) => setSettingsData({ ...settingsData, google_analytics_id: e.target.value })} 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff' }} 
                    placeholder="Örn: G-P123456789" 
                  />
                </div>

                <h3 style={{ marginTop: '2rem', marginBottom: '1.25rem', fontSize: '1.1rem', color: 'var(--text-light)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-tags" style={{ color: '#00cba9', fontSize: '1.1rem' }}></i> Google Tag Manager (GTM) Ayarları
                </h3>
                <div className="admin-form-group" style={{ marginBottom: '2rem' }}>
                  <label>Google Tag Manager ID (GTM-XXXXXXX)</label>
                  <input 
                    type="text" 
                    value={settingsData.gtm_id || ''} 
                    onChange={(e) => setSettingsData({ ...settingsData, gtm_id: e.target.value })} 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff' }} 
                    placeholder="Örn: GTM-ABC1234" 
                  />
                </div>

                <h3 style={{ marginTop: '2rem', marginBottom: '1.25rem', fontSize: '1.1rem', color: 'var(--text-light)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-image" style={{ color: 'var(--primary)', fontSize: '1.1rem' }}></i> Görsel ve Logo Varlık Ayarları
                </h3>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Açık Tema Logosu URL (Scrolled Navbar)</label>
                    <input type="text" value={settingsData.logo_dark || ''} onChange={(e) => setSettingsData({ ...settingsData, logo_dark: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff' }} placeholder="Örn: /images/logo_dark.png" />
                  </div>
                  <div className="admin-form-group">
                    <label>Koyu/Şeffaf Tema Logosu URL (Hero Navbar & Footer)</label>
                    <input type="text" value={settingsData.logo_light || ''} onChange={(e) => setSettingsData({ ...settingsData, logo_light: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff' }} placeholder="Örn: /images/logo_light.png" />
                  </div>
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Hakkımızda Sayfası Hikaye Görseli URL</label>
                    <input type="text" value={settingsData.about_story_image || ''} onChange={(e) => setSettingsData({ ...settingsData, about_story_image: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff' }} placeholder="Örn: /images/remote_freedom.png" />
                  </div>
                  <div className="admin-form-group">
                    <label>İletişim Sayfası Harita Görseli URL</label>
                    <input type="text" value={settingsData.contact_map_image || ''} onChange={(e) => setSettingsData({ ...settingsData, contact_map_image: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff' }} placeholder="Örn: /images/aegean_map_light.png" />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Müşteri Yorumları Sayfası Hero Görseli URL</label>
                  <input type="text" value={settingsData.testimonials_hero_image || ''} onChange={(e) => setSettingsData({ ...settingsData, testimonials_hero_image: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff' }} placeholder="Örn: /images/izmir_references_hero.png" />
                </div>

                <h3 style={{ marginTop: '2rem', marginBottom: '1.25rem', fontSize: '1.1rem', color: 'var(--text-light)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  """

# Wait, let's construct the replacement text for the broken tab 1.
# The content from start_idx_tab1 to end_idx_tab1 needs to be replaced.
# Let's construct it precisely.
# Note: we need to keep the beginning of the line up to "Google Ads Custom Event Script (Dönüşüm Olay Scripti)</label>"
# And we need to end with "TikTok Pixel Ayarları" header.
# Let's write the code for Tab 1:
corrected_tab1 = """Google Ads Custom Event Script (Dönüşüm Olay Scripti)</label>
                    <textarea 
                      rows="2"
                      value={settingsData.google_ads_event_script || ''} 
                      onChange={(e) => setSettingsData({ ...settingsData, google_ads_event_script: e.target.value })} 
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff', fontFamily: 'monospace', fontSize: '0.8rem' }} 
                      placeholder="gtag('event', 'conversion', {...})"
                    />
                  </div>
                </div>

                <h3 style={{ marginTop: '2rem', marginBottom: '1.25rem', fontSize: '1.1rem', color: 'var(--text-light)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-chart-line" style={{ color: '#f57c00', fontSize: '1.1rem' }}></i> Google Analytics 4 (GA4) Ayarları
                </h3>
                <div className="admin-form-group">
                  <label>GA4 Ölçüm Kimliği (Measurement ID - G-XXXXXXX)</label>
                  <input 
                    type="text" 
                    value={settingsData.google_analytics_id || ''} 
                    onChange={(e) => setSettingsData({ ...settingsData, google_analytics_id: e.target.value })} 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff' }} 
                    placeholder="Örn: G-P123456789" 
                  />
                </div>

                <h3 style={{ marginTop: '2rem', marginBottom: '1.25rem', fontSize: '1.1rem', color: 'var(--text-light)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-tags" style={{ color: '#00cba9', fontSize: '1.1rem' }}></i> Google Tag Manager (GTM) Ayarları
                </h3>
                <div className="admin-form-group" style={{ marginBottom: '2rem' }}>
                  <label>Google Tag Manager ID (GTM-XXXXXXX)</label>
                  <input 
                    type="text" 
                    value={settingsData.gtm_id || ''} 
                    onChange={(e) => setSettingsData({ ...settingsData, gtm_id: e.target.value })} 
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff' }} 
                    placeholder="Örn: GTM-ABC1234" 
                  />
                </div>

                <h3 style={{ marginTop: '2rem', marginBottom: '1.25rem', fontSize: '1.1rem', color: 'var(--text-light)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="fa-solid fa-image" style={{ color: 'var(--primary)', fontSize: '1.1rem' }}></i> Görsel ve Logo Varlık Ayarları
                </h3>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Açık Tema Logosu URL (Scrolled Navbar)</label>
                    <input type="text" value={settingsData.logo_dark || ''} onChange={(e) => setSettingsData({ ...settingsData, logo_dark: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff' }} placeholder="Örn: /images/logo_dark.png" />
                  </div>
                  <div className="admin-form-group">
                    <label>Koyu/Şeffaf Tema Logosu URL (Hero Navbar & Footer)</label>
                    <input type="text" value={settingsData.logo_light || ''} onChange={(e) => setSettingsData({ ...settingsData, logo_light: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff' }} placeholder="Örn: /images/logo_light.png" />
                  </div>
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Hakkımızda Sayfası Hikaye Görseli URL</label>
                    <input type="text" value={settingsData.about_story_image || ''} onChange={(e) => setSettingsData({ ...settingsData, about_story_image: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff' }} placeholder="Örn: /images/remote_freedom.png" />
                  </div>
                  <div className="admin-form-group">
                    <label>İletişim Sayfası Harita Görseli URL</label>
                    <input type="text" value={settingsData.contact_map_image || ''} onChange={(e) => setSettingsData({ ...settingsData, contact_map_image: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff' }} placeholder="Örn: /images/aegean_map_light.png" />
                  </div>
                </div>
                <div className="admin-form-group" style={{ marginBottom: '2rem' }}>
                  <label>Müşteri Yorumları Sayfası Hero Görseli URL</label>
                  <input type="text" value={settingsData.testimonials_hero_image || ''} onChange={(e) => setSettingsData({ ...settingsData, testimonials_hero_image: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: '#fff' }} placeholder="Örn: /images/izmir_references_hero.png" />
                </div>

                <h3 style={{ marginTop: '2rem', marginBottom: '1.25rem', fontSize: '1.1rem', color: 'var(--text-light)', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  """

# Reconstruct Tab 1 in content
content_fixed_tab1 = content[:start_idx_tab1] + corrected_tab1 + content[end_idx_tab1:]

# Now let's find Tab 2's visual settings and replace them with the uploader layout block!
# In content_fixed_tab1, we should find the SECOND occurrence of:
# "Görsel ve Logo Varlık Ayarları"
# Or we can search for the fields specifically under `activeTab === 'settings'`.
active_tab_settings_idx = content_fixed_tab1.find("activeTab === 'settings'")
if active_tab_settings_idx == -1:
    print("Error: Could not find activeTab === 'settings' block.")
    exit(1)

visuals_header_tab2_offset = content_fixed_tab1.find("Görsel ve Logo Varlık Ayarları", active_tab_settings_idx)
if visuals_header_tab2_offset == -1:
    print("Error: Could not find visual header in Tab 2.")
    exit(1)

# Now, we want to find the inputs below it, down to the Google Gemini API key label.
end_visuals_tab2_offset = content_fixed_tab1.find("Google Gemini API Anahtarı", visuals_header_tab2_offset)
if end_visuals_tab2_offset == -1:
    print("Error: Could not find Gemini API key input in Tab 2.")
    exit(1)

# Let's inspect the target block to be replaced:
# Between visuals_header_tab2_offset and end_visuals_tab2_offset, we have the inputs:
# logo_dark, logo_light, about_story_image, contact_map_image, testimonials_hero_image.
# We will replace everything from `</h3>` (following the header) down to `<div className="admin-form-group">` (preceding the Gemini API Key input).

# Let's find the closing `</h3>` of the header
header_close_idx = content_fixed_tab1.find("</h3>", visuals_header_tab2_offset)
if header_close_idx == -1:
    print("Error: Could not find closing </h3> for Tab 2 visual header.")
    exit(1)

header_close_idx += len("</h3>")

# Let's find the starting `<div className="admin-form-group">` of Gemini API key input
gemini_div_idx = content_fixed_tab1.rfind("<div className=\"admin-form-group\">", visuals_header_tab2_offset, end_visuals_tab2_offset)
if gemini_div_idx == -1:
    print("Error: Could not find starting div for Gemini input in Tab 2.")
    exit(1)

uploader_layout = """
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem', marginTop: '1rem' }}>
                  
                  {/* LOGOS GROUP */}
                  <div style={{ border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '1.5rem', background: 'rgba(255,255,255,0.4)' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-light)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fa-solid fa-compass" style={{ color: 'var(--primary)' }}></i> Logo Varlıkları
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                      <div>
                        {renderImageUploaderCard('logo_dark', 'Açık Tema Logosu (Masaüstü)', '240x60px', 'Örn: /images/logo_dark.png')}
                      </div>
                      <div>
                        {renderImageUploaderCard('logo_dark_mobile', 'Açık Tema Logosu (Mobil)', '120x45px veya 60x60px', 'Boş bırakılırsa masaüstü logosu kullanılır')}
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
                      <div>
                        {renderImageUploaderCard('logo_light', 'Koyu/Şeffaf Tema Logosu (Masaüstü)', '240x60px', 'Örn: /images/logo_light.png')}
                      </div>
                      <div>
                        {renderImageUploaderCard('logo_light_mobile', 'Koyu/Şeffaf Tema Logosu (Mobil)', '120x45px veya 60x60px', 'Boş bırakılırsa masaüstü logosu kullanılır')}
                      </div>
                    </div>
                  </div>

                  {/* PAGES VISUALS GROUP */}
                  <div style={{ border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '1.5rem', background: 'rgba(255,255,255,0.4)' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-light)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fa-solid fa-images" style={{ color: 'var(--primary)' }}></i> Sayfa Görsel Varlıkları
                    </h4>
                    
                    {/* Hakkımızda */}
                    <div style={{ marginBottom: '1.5rem', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '1.5rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)', display: 'block', marginBottom: '1rem' }}>Hakkımızda Hikaye Görseli</span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                        <div>
                          {renderImageUploaderCard('about_story_image', 'Hikaye Görseli (Masaüstü)', '1200x800px', 'Örn: /images/remote_freedom.png')}
                        </div>
                        <div>
                          {renderImageUploaderCard('about_story_image_mobile', 'Hikaye Görseli (Mobil)', '600x600px (Kare)', 'Boş bırakılırsa masaüstü görseli kullanılır')}
                        </div>
                      </div>
                    </div>

                    {/* İletişim Haritası */}
                    <div style={{ marginBottom: '1.5rem', borderBottom: '1px dashed var(--glass-border)', paddingBottom: '1.5rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)', display: 'block', marginBottom: '1rem' }}>İletişim Hizmet Haritası</span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                        <div>
                          {renderImageUploaderCard('contact_map_image', 'Harita Görseli (Masaüstü)', '1200x600px', 'Örn: /images/aegean_map_light.png')}
                        </div>
                        <div>
                          {renderImageUploaderCard('contact_map_image_mobile', 'Harita Görseli (Mobil)', '600x500px', 'Boş bırakılırsa masaüstü görseli kullanılır')}
                        </div>
                      </div>
                    </div>

                    {/* Referanslar Hero */}
                    <div style={{ marginBottom: '1.5rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)', display: 'block', marginBottom: '1rem' }}>Müşteri Yorumları Kahraman (Hero) Görseli</span>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                        <div>
                          {renderImageUploaderCard('testimonials_hero_image', 'Hero Görseli (Masaüstü)', '1600x500px', 'Örn: /images/izmir_references_hero.png')}
                        </div>
                        <div>
                          {renderImageUploaderCard('testimonials_hero_image_mobile', 'Hero Görseli (Mobil)', '600x400px', 'Boş bırakılırsa masaüstü görseli kullanılır')}
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
                
"""

final_content = content_fixed_tab1[:header_close_idx] + uploader_layout + content_fixed_tab1[gemini_div_idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(final_content)

print("Success: Settings tab and integration fields fixed and updated successfully!")
