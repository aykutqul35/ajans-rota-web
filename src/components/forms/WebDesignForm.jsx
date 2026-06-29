import React from 'react';

export default function WebDesignForm(props) {
  const { isSubmitted, formData, webDesignType, setWebDesignType, setWebDesignSubmitted, handleWebDesignSubmit, setFormData, handleContactSubmit, reportFullName, setReportFullName, reportEmail, setReportEmail, reportWebsite, setReportWebsite, reportPhone, setReportPhone, reportLoading, reportError, handleReportSubmit, proposalFullName, setProposalFullName, proposalEmail, setProposalEmail, proposalWebsite, setProposalWebsite, proposalPhone, setProposalPhone, proposalLoading, proposalError, handleProposalSubmit, webDesignFullName, setWebDesignFullName, webDesignEmail, setWebDesignEmail, webDesignPhone, setWebDesignPhone, webDesignMessage, setWebDesignMessage, webDesignLoading, webDesignSubmitted, calculatorTab, feeAdBudget, activePricingModel, calculatedAgencyFee, discountPercent, discountAmount, finalAgencyFee, managementFeeDesc, rawBaseRetainer, scaledBundleDiscountAmount, performanceBundleDiscountAmount, ecomBudgetSavings, b2bBudgetSavings, rotaEcomRevenueIncrease, rotaB2bRevenueIncrease, ecomSpend, b2bSpend, targetRevenue, isCombined, handleGenerateReport, handleGenerateProposal } = props;

    return <div style={{
      marginTop: isCombined ? '1.5rem' : '0'
    }}>
        <span style={{
        fontFamily: 'var(--font-heading)',
        fontWeight: 600,
        color: 'var(--text-light)',
        fontSize: '1rem',
        marginBottom: '0.75rem',
        display: 'block'
      }}>
          🖥️ Web Tasarım Proje Türü
        </span>
        <p style={{
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        marginBottom: '1.25rem',
        lineHeight: '1.4'
      }}>
          {isCombined ? "Seçtiğiniz diğer hizmetlerin yanına eklenecek web tasarım projesi türünü seçin:" : "Bilgi almak istediğiniz web tasarım projesi türünü seçin:"}
        </p>
        
        <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
          <button type="button" onClick={() => setWebDesignType('kurumsal')} className={`filter-btn ${webDesignType === 'kurumsal' ? 'active' : ''}`} style={{
          flex: 1,
          padding: '1rem',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          border: webDesignType === 'kurumsal' ? '2px solid var(--primary)' : '2px solid var(--glass-border)',
          backgroundColor: webDesignType === 'kurumsal' ? 'var(--primary-glow)' : 'rgba(15, 23, 42, 0.01)',
          color: 'var(--text-light)',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}>
            <i className="fa-solid fa-building" style={{
            fontSize: '1.5rem',
            color: webDesignType === 'kurumsal' ? 'var(--primary)' : 'var(--text-muted)'
          }}></i>
            <span style={{
            fontWeight: '600',
            fontSize: '0.85rem',
            marginTop: '0.25rem'
          }}>Kurumsal Site</span>
            <span style={{
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            textAlign: 'center'
          }}>Hizmet ve Tanıtım Odaklı</span>
          </button>

          <button type="button" onClick={() => setWebDesignType('e-ticaret')} className={`filter-btn ${webDesignType === 'e-ticaret' ? 'active' : ''}`} style={{
          flex: 1,
          padding: '1rem',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          border: webDesignType === 'e-ticaret' ? '2px solid var(--primary)' : '2px solid var(--glass-border)',
          backgroundColor: webDesignType === 'e-ticaret' ? 'var(--primary-glow)' : 'rgba(15, 23, 42, 0.01)',
          color: 'var(--text-light)',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}>
            <i className="fa-solid fa-store" style={{
            fontSize: '1.5rem',
            color: webDesignType === 'e-ticaret' ? 'var(--primary)' : 'var(--text-muted)'
          }}></i>
            <span style={{
            fontWeight: '600',
            fontSize: '0.85rem',
            marginTop: '0.25rem'
          }}>E-Ticaret Sitesi</span>
            <span style={{
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            textAlign: 'center'
          }}>Satış ve Ödeme Entegreli</span>
          </button>
        </div>

        {webDesignType && <div style={{
        borderTop: '1px solid var(--glass-border)',
        paddingTop: '1.25rem'
      }}>
            {webDesignSubmitted ? <div style={{
          backgroundColor: 'var(--primary-glow)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          padding: '1.5rem',
          color: 'var(--text-light)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
                <i className="fa-solid fa-circle-check" style={{
            color: 'var(--primary)',
            fontSize: '2.5rem'
          }}></i>
                <span style={{
            fontWeight: '600',
            fontSize: '1rem',
            color: 'var(--primary)'
          }}>Talebiniz Alındı!</span>
                <p style={{
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            margin: '0',
            lineHeight: '1.4'
          }}>
                  {isCombined ? `Seçtiğiniz aylık hizmetler ve web tasarım projeniz için teklifimiz hazırlanacaktır. Uzmanlarımız ${webDesignEmail} veya ${webDesignPhone} üzerinden sizinle iletişime geçecektir.` : `Detaylı analizimiz ve size özel web tasarım teklifimiz için uzmanlarımız ${webDesignEmail} veya ${webDesignPhone} üzerinden sizinle iletişime geçecektir.`}
                </p>
                <button onClick={() => {
            setWebDesignSubmitted(false);
            setWebDesignFullName('');
            setWebDesignEmail('');
            setWebDesignPhone('');
            setWebDesignMessage('');
            setWebDesignType('');
          }} className="btn-primary" style={{
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            fontSize: '0.75rem',
            marginTop: '0.5rem',
            cursor: 'pointer'
          }}>
                  Yeni Talep Oluştur
                </button>
              </div> : <form onSubmit={handleWebDesignSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
                <span style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            color: 'var(--text-light)',
            fontSize: '0.85rem',
            display: 'block'
          }}>
                  ✏️ İletişim & Proje Detayları
                </span>
                
                <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem'
          }}>
                  <label style={{
              color: 'var(--text-light)',
              fontSize: '0.75rem'
            }}>Ad Soyad *</label>
                  <input type="text" required placeholder="Örn: Ahmet Yılmaz" value={webDesignFullName} onChange={e => setWebDesignFullName(e.target.value)} style={{
              padding: '0.6rem 0.8rem',
              borderRadius: '8px',
              border: '1px solid var(--glass-border)',
              backgroundColor: 'rgba(15, 23, 42, 0.03)',
              color: 'var(--text-light)',
              fontSize: '0.8rem',
              outline: 'none'
            }} />
                </div>

                <div className="form-row-grid">
                  <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.3rem'
            }}>
                    <label style={{
                color: 'var(--text-light)',
                fontSize: '0.75rem'
              }}>E-posta *</label>
                    <input type="email" required placeholder="Örn: ahmet@sirketiniz.com" value={webDesignEmail} onChange={e => setWebDesignEmail(e.target.value)} style={{
                padding: '0.6rem 0.8rem',
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
              gap: '0.3rem'
            }}>
                    <label style={{
                color: 'var(--text-light)',
                fontSize: '0.75rem'
              }}>Telefon *</label>
                    <input type="tel" required placeholder="Örn: 0555 123 4567" value={webDesignPhone} onChange={e => setWebDesignPhone(e.target.value)} style={{
                padding: '0.6rem 0.8rem',
                borderRadius: '8px',
                border: '1px solid var(--glass-border)',
                backgroundColor: 'rgba(15, 23, 42, 0.03)',
                color: 'var(--text-light)',
                fontSize: '0.8rem',
                outline: 'none'
              }} />
                  </div>
                </div>

                <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.3rem'
          }}>
                  <label style={{
              color: 'var(--text-light)',
              fontSize: '0.75rem'
            }}>Mesaj / Proje Detayları (Opsiyonel)</label>
                  <textarea rows="3" placeholder="Projenizle ilgili özel istekleriniz, referans siteler veya hedefleriniz..." value={webDesignMessage} onChange={e => setWebDesignMessage(e.target.value)} style={{
              padding: '0.6rem 0.8rem',
              borderRadius: '8px',
              border: '1px solid var(--glass-border)',
              backgroundColor: 'rgba(15, 23, 42, 0.03)',
              color: 'var(--text-light)',
              fontSize: '0.8rem',
              outline: 'none',
              resize: 'vertical'
            }} />
                </div>

                <button type="submit" disabled={webDesignLoading} className="btn-primary" style={{
            borderRadius: '8px',
            padding: '0.65rem 1rem',
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: 'none',
            marginTop: '0.25rem',
            width: '100%',
            height: 'auto'
          }}>
                  {webDesignLoading ? 'Bilgileriniz Gönderiliyor...' : 'Bilgi ve Fiyat Teklifi Al'}
                </button>
              </form>}
          </div>}
      </div>;
  };
