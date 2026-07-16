import { useState } from 'react';

export default function ContactForm(props) {
  const { isSubmitted, formData, setFormData, handleContactSubmit, servicesData } = props;

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  
  // Local state for the new questions
  const [budget, setBudget] = useState('');
  const [goal, setGoal] = useState('');

  const availableDates = [
    { label: "15 Haz", day: "Pzt" },
    { label: "16 Haz", day: "Sal" },
    { label: "17 Haz", day: "Çar" },
    { label: "18 Haz", day: "Per" },
    { label: "19 Haz", day: "Cum" }
  ];
  
  const timeSlots = ["10:00", "11:30", "13:00", "14:30", "16:00"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep1 = () => {
    if (selectedDate && selectedTime) {
      setStep(2);
    }
  };

  const handleNextStep2 = () => {
    if (budget && goal) {
      setStep(3);
      // Append date, time, budget, and goal to the message field
      setFormData(prev => ({ 
        ...prev, 
        message: `[RANDEVU TALEBİ]\nTarih: ${selectedDate.label}, Saat: ${selectedTime}\nAylık Bütçe: ${budget}\nÖncelikli Hedef: ${goal}\n\nEk Notlar: ` + (prev.message || "")
      }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="form-success-message" style={{ textAlign: 'center', padding: '3rem 1.5rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
        <i className="fa-solid fa-calendar-check" style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '1rem' }}></i>
        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Randevunuz Planlandı!</h3>
        <p style={{ margin: '0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Danışmanlarımız <strong>{formData.email}</strong> üzerinden toplantı linkini iletecektir. Görüşmek üzere!
        </p>
      </div>
    );
  }

  return (
    <div className="contact-form-wrapper" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', gap: '0.5rem' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', opacity: step >= 1 ? 1 : 0.5, transition: '0.3s' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: step >= 1 ? 'var(--primary)' : 'var(--glass-border)', color: step >= 1 ? '#000' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>1</span>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: step >= 1 ? 'var(--primary)' : 'var(--text-muted)', display: 'none' }}>Gün</span>
         </div>
         <div style={{ width: '20px', height: '1px', background: 'var(--glass-border)' }}></div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', opacity: step >= 2 ? 1 : 0.5, transition: '0.3s' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: step >= 2 ? 'var(--primary)' : 'var(--glass-border)', color: step >= 2 ? '#000' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>2</span>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: step >= 2 ? 'var(--primary)' : 'var(--text-muted)', display: 'none' }}>Proje</span>
         </div>
         <div style={{ width: '20px', height: '1px', background: 'var(--glass-border)' }}></div>
         <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', opacity: step >= 3 ? 1 : 0.5, transition: '0.3s' }}>
            <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: step >= 3 ? 'var(--primary)' : 'var(--glass-border)', color: step >= 3 ? '#000' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold' }}>3</span>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', color: step >= 3 ? 'var(--primary)' : 'var(--text-muted)' }}>İletişim</span>
         </div>
      </div>

      {step === 1 && (
        <div className="booking-step-1 fade-in">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-light)' }}>Büyüme Stratejisi Görüşmesi</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>30 dakikalık ücretsiz analiz için uygun olduğunuz tarihi seçin.</p>
          
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.75rem', color: 'var(--text-light)', fontWeight: '600' }}>1. Gün Seçin</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {availableDates.map((date, i) => (
              <button 
                key={i} 
                type="button"
                onClick={() => setSelectedDate(date)}
                style={{ 
                  flex: '0 0 auto',
                  minWidth: '70px',
                  padding: '0.75rem 0.5rem', 
                  borderRadius: '12px', 
                  border: selectedDate?.label === date.label ? '1px solid var(--primary)' : '1px solid var(--glass-border)', 
                  background: selectedDate?.label === date.label ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)',
                  color: selectedDate?.label === date.label ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem',
                  transition: 'all 0.2s'
                }}
              >
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase' }}>{date.day}</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 'bold', color: selectedDate?.label === date.label ? 'var(--text-light)' : 'var(--text-muted)' }}>{date.label}</span>
              </button>
            ))}
          </div>

          {selectedDate && (
            <div className="fade-in">
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.75rem', color: 'var(--text-light)', fontWeight: '600' }}>2. Saat Seçin (TSİ)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '2rem' }}>
                {timeSlots.map((time, i) => (
                  <button 
                    key={i} 
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    style={{ 
                      padding: '0.6rem', 
                      borderRadius: '8px', 
                      border: selectedTime === time ? '1px solid var(--primary)' : '1px solid var(--glass-border)', 
                      background: selectedTime === time ? 'var(--primary)' : 'rgba(255,255,255,0.02)',
                      color: selectedTime === time ? '#000' : 'var(--text-muted)',
                      fontWeight: '600',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            type="button" 
            onClick={handleNextStep1} 
            disabled={!selectedDate || !selectedTime}
            className="btn btn-primary" 
            style={{ width: '100%', opacity: (!selectedDate || !selectedTime) ? 0.5 : 1 }}
          >
            Devam Et <i className="fa-solid fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="booking-step-2 fade-in">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-light)' }}>Proje Detayları</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Görüşmeye daha iyi hazırlanabilmemiz için işinizi biraz anlatın.</p>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.75rem', color: 'var(--text-light)', fontWeight: '600' }}>Aylık Dijital Reklam Bütçeniz</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
              {["50.000₺'den az", "50.000₺ - 150.000₺", "150.000₺ - 500.000₺", "500.000₺ ve üzeri"].map((opt, i) => (
                <button 
                  key={i} 
                  type="button"
                  onClick={() => setBudget(opt)}
                  style={{ 
                    padding: '0.75rem 1rem', 
                    borderRadius: '8px', 
                    border: budget === opt ? '1px solid var(--primary)' : '1px solid var(--glass-border)', 
                    background: budget === opt ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)',
                    color: budget === opt ? 'var(--primary)' : 'var(--text-light)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <i className={`fa-regular ${budget === opt ? 'fa-circle-dot' : 'fa-circle'}`} style={{ marginRight: '0.5rem' }}></i> {opt}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.75rem', color: 'var(--text-light)', fontWeight: '600' }}>Ajansımızdan Temel Beklentiniz</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem' }}>
              {["ROAS (Reklam Getirisi) Artışı", "Yeni Müşteri (Lead) Kazanımı", "Marka Bilinirliği & Dönüşüm", "Tüm Dijital Süreçlerin Yönetimi"].map((opt, i) => (
                <button 
                  key={i} 
                  type="button"
                  onClick={() => setGoal(opt)}
                  style={{ 
                    padding: '0.75rem 1rem', 
                    borderRadius: '8px', 
                    border: goal === opt ? '1px solid var(--primary)' : '1px solid var(--glass-border)', 
                    background: goal === opt ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.02)',
                    color: goal === opt ? 'var(--primary)' : 'var(--text-light)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <i className={`fa-regular ${goal === opt ? 'fa-circle-dot' : 'fa-circle'}`} style={{ marginRight: '0.5rem' }}></i> {opt}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
             <button type="button" onClick={() => setStep(1)} className="btn btn-secondary" style={{ padding: '0.75rem 1rem' }}><i className="fa-solid fa-arrow-left"></i></button>
             <button 
               type="button" 
               onClick={handleNextStep2} 
               disabled={!budget || !goal}
               className="btn btn-primary" 
               style={{ flex: 1, opacity: (!budget || !goal) ? 0.5 : 1 }}
             >
               Son Adıma Geç <i className="fa-solid fa-arrow-right" style={{ marginLeft: '0.5rem' }}></i>
             </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form className="contact-form booking-step-3 fade-in" onSubmit={handleContactSubmit}>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.15)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
             <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>Seçilen Randevu</span>
                <strong style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>{selectedDate?.label}, {selectedTime}</strong>
             </div>
             <button type="button" onClick={() => setStep(1)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', textDecoration: 'underline', cursor: 'pointer' }}>Değiştir</button>
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Ad Soyad *</label>
            <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Örn. Ahmet Yılmaz" required className="form-input" />
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="email">Kurumsal E-Posta *</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="isim@sirketiniz.com" required className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Telefon *</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="0500 000 00 00" required className="form-input" />
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group" style={{ width: '100%' }}>
              <label htmlFor="company">Şirket Adı / Web Sitesi</label>
              <input type="text" id="company" name="company" value={formData.company} onChange={handleInputChange} placeholder="sirketadi.com" className="form-input" />
            </div>
            {!props.hideService && (
              <div className="form-group" style={{ width: '100%' }}>
                <label htmlFor="service">Öncelikli Konu</label>
                <select id="service" name="service" value={formData.service} onChange={handleInputChange} className="form-input form-select">
                  {Object.keys(servicesData || {}).map(key => <option key={key} value={(servicesData || {})[key]?.title}>
                      {(servicesData || {})[key]?.title}
                    </option>)}
                </select>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
             <button type="button" onClick={() => setStep(2)} className="btn btn-secondary" style={{ padding: '0.75rem 1rem' }}><i className="fa-solid fa-arrow-left"></i></button>
             <button type="submit" className="btn btn-primary form-submit-btn" disabled={isSubmitted} style={{ flex: 1 }}>
               Randevuyu Onayla <i className="fa-solid fa-check" style={{ marginLeft: '0.5rem' }}></i>
             </button>
          </div>
        </form>
      )}
    </div>
  );
}
