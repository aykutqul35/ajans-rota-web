import React from 'react';

export default function ContactForm(props) {
  const { isSubmitted, formData, setFormData, handleContactSubmit, servicesData, reportFullName, setReportFullName, reportEmail, setReportEmail, reportWebsite, setReportWebsite, reportPhone, setReportPhone, reportLoading, reportError, handleReportSubmit, proposalFullName, setProposalFullName, proposalEmail, setProposalEmail, proposalWebsite, setProposalWebsite, proposalPhone, setProposalPhone, proposalLoading, proposalError, handleProposalSubmit, webDesignFullName, setWebDesignFullName, webDesignEmail, setWebDesignEmail, webDesignPhone, setWebDesignPhone, webDesignMessage, setWebDesignMessage, webDesignLoading, webDesignSubmitted, calculatorTab, feeAdBudget, activePricingModel, calculatedAgencyFee, discountPercent, discountAmount, finalAgencyFee, managementFeeDesc, rawBaseRetainer, scaledBundleDiscountAmount, performanceBundleDiscountAmount, ecomBudgetSavings, b2bBudgetSavings, rotaEcomRevenueIncrease, rotaB2bRevenueIncrease, ecomSpend, b2bSpend, targetRevenue, isCombined, handleGenerateReport, handleGenerateProposal } = props;

    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return isSubmitted ? <div className="form-success-message">
        <i className="fa-solid fa-circle-check" style={{
        fontSize: '1.5rem'
      }}></i>
        <div>
          <strong>Mesajınız Başarıyla İletildi!</strong>
          <p style={{
          margin: '5px 0 0',
          fontSize: '0.85rem',
          color: 'rgba(14, 165, 233, 0.8)'
        }}>
            Dijital uzmanlarımız markanızı inceleyip sizinle en kısa sürede iletişime geçecektir.
          </p>
        </div>
      </div> : <form className="contact-form" onSubmit={handleContactSubmit}>
        <div className="form-group">
          <label htmlFor="fullName">Ad Soyad *</label>
          <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Örn. Ahmet Yılmaz" required className="form-input" />
        </div>

        <div className="form-group-row">
          <div className="form-group">
            <label htmlFor="email">E-Posta *</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="ahmet@sirket.com" required className="form-input" />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Telefon *</label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="0500 000 00 00" required className="form-input" />
          </div>
        </div>

        <div className={props.hideService ? "form-group" : "form-group-row"}>
          <div className="form-group" style={{ width: '100%' }}>
            <label htmlFor="company">Şirket Adı / Web Sitesi</label>
            <input type="text" id="company" name="company" value={formData.company} onChange={handleInputChange} placeholder="sirketadi.com" className="form-input" />
          </div>
          {!props.hideService && (
            <div className="form-group" style={{ width: '100%' }}>
              <label htmlFor="service">İhtiyacınız Olan Hizmet</label>
              <select id="service" name="service" value={formData.service} onChange={handleInputChange} className="form-input form-select">
                {Object.keys(servicesData || {}).map(key => <option key={key} value={(servicesData || {})[key]?.title}>
                    {(servicesData || {})[key]?.title}
                  </option>)}
              </select>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="message">Hedeflerinizden Bahsedin</label>
          <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Mevcut bütçeniz, hedefleriniz veya sormak istedikleriniz..." className="form-input form-textarea"></textarea>
        </div>

        <button type="submit" className="btn btn-primary form-submit-btn" disabled={isSubmitted}>
          <>Ücretsiz Büyüme Analizi Al <i className="fa-solid fa-arrow-right"></i></>
        </button>
      </form>;
  };
