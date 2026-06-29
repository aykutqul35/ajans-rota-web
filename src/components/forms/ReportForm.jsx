import React from 'react';

export default function ReportForm(props) {
  const { isSubmitted, formData, setFormData, handleContactSubmit, reportFullName, setReportFullName, reportEmail, setReportEmail, reportWebsite, setReportWebsite, reportPhone, setReportPhone, reportLoading, reportError, handleReportSubmit, proposalFullName, setProposalFullName, proposalEmail, setProposalEmail, proposalWebsite, setProposalWebsite, proposalPhone, setProposalPhone, proposalLoading, proposalError, handleProposalSubmit, webDesignFullName, setWebDesignFullName, webDesignEmail, setWebDesignEmail, webDesignPhone, setWebDesignPhone, webDesignMessage, setWebDesignMessage, webDesignLoading, webDesignSubmitted, calculatorTab, feeAdBudget, activePricingModel, calculatedAgencyFee, discountPercent, discountAmount, finalAgencyFee, managementFeeDesc, rawBaseRetainer, scaledBundleDiscountAmount, performanceBundleDiscountAmount, ecomBudgetSavings, b2bBudgetSavings, rotaEcomRevenueIncrease, rotaB2bRevenueIncrease, ecomSpend, b2bSpend, targetRevenue, isCombined, handleGenerateReport, handleGenerateProposal } = props;

    const curTab = calculatorTab;
    return <>
        {!isReportGenerated ? <div style={{
        marginTop: '1rem',
        borderTop: '1px solid var(--glass-border)',
        paddingTop: '1rem'
      }}>
            <span style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 600,
          color: 'var(--text-light)',
          fontSize: '0.85rem',
          marginBottom: '0.4rem',
          display: 'block'
        }}>
              📬 Dijital Büyüme Raporunuzu Alın
            </span>
            <p style={{
          color: 'var(--text-muted)',
          fontSize: '0.75rem',
          marginBottom: '0.6rem',
          lineHeight: '1.4'
        }}>
              Yukarıdaki simülasyon verilerine göre hazırlanan büyüme stratejisi raporunu anında e-postanıza gönderelim.
            </p>
            <form onSubmit={handleGenerateReport} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem'
        }}>
              <div className="report-form-grid">
                <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
                  <label style={{
                color: 'var(--text-light)',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>Ad Soyad *</label>
                  <input type="text" required placeholder="Örn: Ahmet Yılmaz" value={reportFullName} onChange={e => {
                setReportFullName(e.target.value);
                setReportError('');
              }} style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                backgroundColor: 'rgba(15, 23, 42, 0.03)',
                color: 'var(--text-light)',
                fontSize: '0.8rem',
                outline: 'none'
              }} />
                </div>

                <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
                  <label style={{
                color: 'var(--text-light)',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>E-posta Adresi *</label>
                  <input type="email" required placeholder="Örn: sirketiniz@alanadi.com" value={reportEmail} onChange={e => {
                setReportEmail(e.target.value);
                setReportError('');
              }} style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                backgroundColor: 'rgba(15, 23, 42, 0.03)',
                color: 'var(--text-light)',
                fontSize: '0.8rem',
                outline: 'none'
              }} />
                </div>
              </div>

              <div className="report-form-grid">
                <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
                  <label style={{
                color: 'var(--text-light)',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>Web Sitesi Adresi *</label>
                  <input type="text" required placeholder="Örn: www.sirketiniz.com" value={reportWebsite} onChange={e => {
                setReportWebsite(e.target.value);
                setReportError('');
              }} style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                backgroundColor: 'rgba(15, 23, 42, 0.03)',
                color: 'var(--text-light)',
                fontSize: '0.8rem',
                outline: 'none'
              }} />
                </div>

                <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
                  <label style={{
                color: 'var(--text-light)',
                fontSize: '0.75rem',
                fontWeight: '500'
              }}>Telefon Numarası *</label>
                  <input type="tel" required placeholder="Örn: 0555 123 4567" value={reportPhone} onChange={e => {
                setReportPhone(e.target.value);
                setReportError('');
              }} style={{
                padding: '0.5rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                backgroundColor: 'rgba(15, 23, 42, 0.03)',
                color: 'var(--text-light)',
                fontSize: '0.8rem',
                outline: 'none'
              }} />
                </div>
              </div>

              <button type="submit" disabled={reportLoading} className={curTab === 'roas_b2b' ? 'btn-b2b-submit' : 'btn-ecom-submit'} style={{
            borderRadius: '8px',
            padding: '0.55rem 1rem',
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: 'none',
            marginTop: '0.2rem',
            width: '100%',
            height: 'auto'
          }}>
                {reportLoading ? 'Raporunuz Hazırlanıyor...' : 'Raporumu Oluştur'}
              </button>
            </form>
            {reportError && <span style={{
          color: '#ef4444',
          fontSize: '0.75rem',
          marginTop: '0.5rem',
          display: 'block'
        }}>{reportError}</span>}
          </div> : <div style={{
        marginTop: '1rem',
        borderTop: '1px solid var(--glass-border)',
        paddingTop: '1rem'
      }}>
            <div style={{
          backgroundColor: curTab === 'roas_b2b' ? 'rgba(13, 148, 136, 0.08)' : 'var(--primary-glow)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          padding: '0.65rem 0.85rem',
          color: curTab === 'roas_b2b' ? 'var(--secondary)' : 'var(--primary)',
          fontSize: '0.8rem',
          marginBottom: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
              <i className="fa-solid fa-circle-check" style={{
            color: curTab === 'roas_b2b' ? 'var(--secondary)' : 'var(--primary)'
          }}></i>
              <span>Rapor başarıyla oluşturuldu ve <strong>{reportEmail}</strong> adresine gönderildi!</span>
            </div>

            {/* Rapor Önizleme Kartı */}
            <div style={{
          backgroundColor: 'rgba(15, 23, 42, 0.01)',
          border: '1px solid var(--glass-border)',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          fontSize: '0.8rem',
          color: 'var(--text-main)',
          lineHeight: '1.5'
        }}>
              <div style={{
            borderBottom: '1px solid var(--glass-border)',
            paddingBottom: '0.4rem',
            marginBottom: '0.6rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
                <strong style={{
              color: 'var(--text-light)',
              fontSize: '0.85rem'
            }}>
                  {curTab === 'roas_b2b' ? '📈 AJANS ROTA - B2B BÜYÜME RAPORU' : '📈 AJANS ROTA - E-TİCARET BÜYÜME RAPORU'}
                </strong>
                <span style={{
              fontSize: '0.7rem',
              color: 'var(--text-muted)'
            }}>{new Date().toLocaleDateString('tr-TR')}</span>
              </div>

              <div style={{
            marginBottom: '0.6rem',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            backgroundColor: 'rgba(15, 23, 42, 0.02)',
            padding: '0.4rem 0.5rem',
            borderRadius: '6px',
            border: '1px solid var(--glass-border)'
          }}>
                <div><strong>Ad Soyad:</strong> {reportFullName}</div>
                <div><strong>Web Sitesi:</strong> {reportWebsite}</div>
                <div><strong>Telefon:</strong> {reportPhone}</div>
                <div><strong>E-posta:</strong> {reportEmail}</div>
              </div>

              {curTab === 'roas_b2b' ? <>
                  {(() => {
              const curCustomers = Math.round(b2bLeads * (b2bConversion / 100));
              const curCiro = curCustomers * b2bLtv;
              const curCpl = b2bLeads > 0 ? Math.round(b2bSpend / b2bLeads) : 0;
              const curCac = curCustomers > 0 ? Math.round(b2bSpend / curCustomers) : 0;
              const curRoi = b2bSpend > 0 ? (curCiro / b2bSpend).toFixed(1) : 0;
              const newLeads = Math.round(b2bLeads * 1.2);
              const newConversion = parseFloat((b2bConversion * 1.3).toFixed(1));
              const newCustomers = Math.round(newLeads * (newConversion / 100));
              const newCiro = newCustomers * b2bLtv;
              const newCpl = newLeads > 0 ? Math.round(b2bSpend / newLeads) : 0;
              const newCac = newCustomers > 0 ? Math.round(b2bSpend / newCustomers) : 0;
              const newRoi = b2bSpend > 0 ? (newCiro / b2bSpend).toFixed(1) : 0;
              return <ul style={{
                paddingLeft: '1.2rem',
                margin: '0 0 0.6rem 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                listStyleType: 'square'
              }}>
                        <li><strong>Mevcut Durum:</strong> {curCustomers} Müşteri / CPL: {curCpl} ₺ (ROI: {curRoi}x)</li>
                        <li style={{
                  color: 'var(--secondary)',
                  fontWeight: 600
                }}><strong>Rota Simülasyonu:</strong> {newCustomers} Müşteri / CPL: {newCpl} ₺ (ROI: {newRoi}x)</li>
                        <li><strong>Mevcut Gelir:</strong> {curCiro.toLocaleString('tr-TR')} ₺</li>
                        <li style={{
                  color: 'var(--secondary)',
                  fontWeight: 700
                }}><strong>Potansiyel Gelir:</strong> {newCiro.toLocaleString('tr-TR')} ₺</li>
                        <li style={{
                  borderTop: '1px dashed var(--glass-border)',
                  paddingTop: '0.25rem',
                  marginTop: '0.15rem'
                }}>
                          <strong>CAC Maliyeti Tasarrufu:</strong> {curCac} ₺ &rarr; <strong style={{
                    color: '#16a34a'
                  }}>{newCac} ₺</strong>
                        </li>
                      </ul>;
            })()}
                </> : <>
                  {(() => {
              const curOrders = ecomAov > 0 ? Math.round(ecomRevenue / ecomAov) : 0;
              const curCR = ecomTraffic > 0 ? curOrders / ecomTraffic * 100 : 0;
              const curRoas = ecomSpend > 0 ? (ecomRevenue / ecomSpend).toFixed(1) : 0;
              const curCac = curOrders > 0 ? Math.round(ecomSpend / curOrders) : 0;
              const newTraffic = Math.round(ecomTraffic * 1.15);
              const newCR = parseFloat((curCR * 1.5).toFixed(2));
              const newAov = Math.round(ecomAov * 1.2);
              const newOrders = Math.round(newTraffic * (newCR / 100));
              const newCiro = newOrders * newAov;
              const newRoas = ecomSpend > 0 ? (newCiro / ecomSpend).toFixed(1) : 0;
              const newCac = newOrders > 0 ? Math.round(ecomSpend / newOrders) : 0;
              const budgetSavings = newCiro > 0 ? Math.round(ecomSpend * (1 - ecomRevenue / newCiro)) : 0;
              return <ul style={{
                paddingLeft: '1.2rem',
                margin: '0 0 0.6rem 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                listStyleType: 'square'
              }}>
                        <li><strong>Mevcut Durum:</strong> {curOrders} Sipariş / Dönüşüm: %{curCR.toFixed(2)} / ROAS: {curRoas}x (CAC: {curCac} ₺)</li>
                        <li style={{
                  color: 'var(--primary)',
                  fontWeight: 600
                }}><strong>Rota Simülasyonu:</strong> {newOrders} Sipariş / Dönüşüm: %{newCR.toFixed(2)} / ROAS: {newRoas}x (CAC: {newCac} ₺)</li>
                        <li><strong>Mevcut Ciro:</strong> {ecomRevenue.toLocaleString('tr-TR')} ₺</li>
                        <li style={{
                  color: 'var(--primary)',
                  fontWeight: 700
                }}><strong>Potansiyel Ciro:</strong> {newCiro.toLocaleString('tr-TR')} ₺</li>
                        <li style={{
                  borderTop: '1px dashed var(--glass-border)',
                  paddingTop: '0.25rem',
                  marginTop: '0.15rem'
                }}>
                          <strong>Ciro Artışı:</strong> <strong style={{
                    color: 'var(--primary)'
                  }}>+{(newCiro - ecomRevenue).toLocaleString('tr-TR')} ₺</strong>
                        </li>
                        <li>
                          <strong>Bütçe Tasarrufu:</strong> <strong style={{
                    color: '#16a34a'
                  }}>{budgetSavings.toLocaleString('tr-TR')} ₺</strong>
                        </li>
                      </ul>;
            })()}
                </>}

              <p style={{
            margin: '0',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            fontStyle: 'italic'
          }}>
                💡 <strong>Tavsiye:</strong> Bütçe dağılımıyla maksimum verim alabilmek için web sitenizin dönüşüm optimizasyonunu tamamlayın.
              </p>

              <button onClick={() => {
            setIsReportGenerated(false);
            setReportFullName('');
            setReportEmail('');
            setReportWebsite('');
            setReportPhone('');
          }} style={{
            marginTop: '0.75rem',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.75rem',
            textDecoration: 'underline',
            cursor: 'pointer',
            padding: '0'
          }}>
                Yeni Bir Rapor Oluştur
              </button>
            </div>
          </div>}
      </>;
  };
