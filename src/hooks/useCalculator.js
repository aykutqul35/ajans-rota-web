import { useState } from 'react';

/**
 * Custom hook for all calculator-related state and computed values.
 * Extracts ~40 useState declarations + computed values from App.jsx.
 */
export default function useCalculator(servicesData, settingsData) {
  // Calculator tab
  const [calculatorTab, setCalculatorTab] = useState('fee');
  const [feeAdBudget, setFeeAdBudget] = useState(50000);
  const [pricingModel, setPricingModel] = useState('hybrid');
  const [targetRevenue, setTargetRevenue] = useState(500000);
  const [selectedServices, setSelectedServices] = useState({
    google_ads: true,
    meta_ads: true,
    seo: false,
    design: false,
    consultancy: false
  });

  // ROI Calculator States (General)
  const [googleSpend, setGoogleSpend] = useState(15000);
  const [googleRoas, setGoogleRoas] = useState(3.5);
  const [metaSpend, setMetaSpend] = useState(10000);
  const [metaRoas, setMetaRoas] = useState(4.0);

  // E-commerce Calculator States
  const [ecomTraffic, setEcomTraffic] = useState(15000);
  const [ecomAov, setEcomAov] = useState(650);
  const [ecomSpend, setEcomSpend] = useState(25000);
  const [ecomRevenue, setEcomRevenue] = useState(85000);

  // B2B Calculator States
  const [b2bSpend, setB2bSpend] = useState(15000);
  const [b2bLeads, setB2bLeads] = useState(120);
  const [b2bConversion, setB2bConversion] = useState(8);
  const [b2bLtv, setB2bLtv] = useState(12000);

  // Additional
  const [budgetIndex, setBudgetIndex] = useState(2);
  const [commitment, setCommitment] = useState(1);
  const [reportingPackage, setReportingPackage] = useState('temel');
  const [smPackage, setSmPackage] = useState('orta');
  const [webDesignType, setWebDesignType] = useState('');

  // Sector states
  const [ecomSector, setEcomSector] = useState('');
  const handleEcomSectorChange = val => {
    setEcomSector(val);
    if (val === 'giyim') { setEcomAov(500); setEcomTraffic(20000); setEcomSpend(25000); }
    else if (val === 'elektronik') { setEcomAov(2500); setEcomTraffic(10000); setEcomSpend(30000); }
    else if (val === 'kozmetik') { setEcomAov(350); setEcomTraffic(30000); setEcomSpend(20000); }
  };

  const [b2bSector, setB2bSector] = useState('');
  const handleB2bSectorChange = val => {
    setB2bSector(val);
    if (val === 'yazilim') { setB2bLeads(50); setB2bSpend(15000); setB2bConversion(5); setB2bLtv(50000); }
    else if (val === 'makine') { setB2bLeads(30); setB2bSpend(20000); setB2bConversion(10); setB2bLtv(150000); }
    else if (val === 'hizmet') { setB2bLeads(100); setB2bSpend(10000); setB2bConversion(15); setB2bLtv(10000); }
  };

  // ── Computed Values: E-commerce ──
  const baselineEcomOrders = ecomAov > 0 ? Math.round(ecomRevenue / ecomAov) : 0;
  const baselineEcomCR = ecomTraffic > 0 ? baselineEcomOrders / ecomTraffic * 100 : 0;
  const baselineEcomRoas = ecomSpend > 0 ? (ecomRevenue / ecomSpend).toFixed(1) : '0';
  const baselineEcomCac = baselineEcomOrders > 0 ? Math.round(ecomSpend / baselineEcomOrders) : 0;
  const rotaEcomTraffic = Math.round(ecomTraffic * 1.15);
  const rotaEcomCR = parseFloat((baselineEcomCR * 1.5).toFixed(2));
  const rotaEcomAov = Math.round(ecomAov * 1.2);
  const rotaEcomOrders = Math.round(rotaEcomTraffic * (rotaEcomCR / 100));
  const rotaEcomRevenue = rotaEcomOrders * rotaEcomAov;
  const rotaEcomRoas = ecomSpend > 0 ? (rotaEcomRevenue / ecomSpend).toFixed(1) : '0';
  const rotaEcomCac = rotaEcomOrders > 0 ? Math.round(ecomSpend / rotaEcomOrders) : 0;
  const rotaEcomRevenueIncrease = rotaEcomRevenue - ecomRevenue;
  const ecomBudgetSavings = rotaEcomRevenue > 0 ? Math.round(ecomSpend * (1 - ecomRevenue / rotaEcomRevenue)) : 0;

  // ── Computed Values: B2B ──
  const baselineB2bCustomers = Math.round(b2bLeads * (b2bConversion / 100));
  const baselineB2bRevenue = baselineB2bCustomers * b2bLtv;
  const baselineB2bCpl = b2bLeads > 0 ? Math.round(b2bSpend / b2bLeads) : 0;
  const baselineB2bCac = baselineB2bCustomers > 0 ? Math.round(b2bSpend / baselineB2bCustomers) : 0;
  const baselineB2bRoi = b2bSpend > 0 ? (baselineB2bRevenue / b2bSpend).toFixed(1) : '0';
  const rotaB2bLeads = Math.round(b2bLeads * 1.2);
  const rotaB2bConversion = parseFloat((b2bConversion * 1.3).toFixed(1));
  const rotaB2bCustomers = Math.round(rotaB2bLeads * (rotaB2bConversion / 100));
  const rotaB2bRevenue = rotaB2bCustomers * b2bLtv;
  const rotaB2bCpl = rotaB2bLeads > 0 ? Math.round(b2bSpend / rotaB2bLeads) : 0;
  const rotaB2bCacFinal = rotaB2bCustomers > 0 ? Math.round(b2bSpend / rotaB2bCustomers) : 0;
  const rotaB2bRoi = b2bSpend > 0 ? (rotaB2bRevenue / b2bSpend).toFixed(1) : '0';
  const rotaB2bRevenueIncrease = rotaB2bRevenue - baselineB2bRevenue;

  // ── Computed Values: Fee Calculator ──
  const isSocialSelected = !!selectedServices.social;
  const selectedCount = Object.values(selectedServices).filter(Boolean).length;
  const isOnlySocialSelected = isSocialSelected && selectedCount === 1;

  const smPackagePrice = isSocialSelected
    ? smPackage === 'baslangic'
      ? Number(settingsData.sm_pkg_baslangic_price) || 8000
      : smPackage === 'zirve'
      ? Number(settingsData.sm_pkg_zirve_price) || 18000
      : Number(settingsData.sm_pkg_orta_price) || 12000
    : 0;

  const rawBaseRetainer = Object.keys(selectedServices).reduce((sum, key) => {
    if (selectedServices[key] && servicesData[key]) {
      if (key !== 'design' && key !== 'social') {
        const fee = Number(servicesData[key].baseFee) || 20000;
        return sum + fee;
      }
    }
    return sum;
  }, 0);

  const isOnlyDesignSelected = selectedServices.design && selectedCount === 1;

  let bundleDiscountPercent = 0;
  if (selectedCount === 2) bundleDiscountPercent = 5;
  else if (selectedCount === 3) bundleDiscountPercent = 10;
  else if (selectedCount === 4) bundleDiscountPercent = 15;
  else if (selectedCount === 5) bundleDiscountPercent = 20;
  else if (selectedCount >= 6) bundleDiscountPercent = 25;

  const bundleDiscountAmount = Math.round(rawBaseRetainer * (bundleDiscountPercent / 100));
  const budgetMultiplier = isOnlyDesignSelected ? 1.0 : 1.0 + feeAdBudget * 0.000003;
  const standardBaseRetainer = Math.round(rawBaseRetainer * budgetMultiplier);
  const scaledBundleDiscountAmount = Math.round(standardBaseRetainer * (bundleDiscountPercent / 100));
  const activeBaseRetainer = standardBaseRetainer - scaledBundleDiscountAmount;
  const activePricingModel = isOnlyDesignSelected ? 'hybrid' : pricingModel;

  let calculatedAgencyFee = 0;
  let managementFeeDesc = '';
  let baseRetainerLabel = '';

  if (activePricingModel === 'hybrid') {
    const showCommission = feeAdBudget >= 100000 && !isOnlyDesignSelected;
    const commissionFee = showCommission ? feeAdBudget * 0.12 : 0;
    calculatedAgencyFee = Math.round(activeBaseRetainer + commissionFee);
    managementFeeDesc = showCommission ? `%12 Bütçe Yönetimi (${commissionFee.toLocaleString('tr-TR')} ₺)` : '';
    baseRetainerLabel = isOnlyDesignSelected
      ? `Web Tasarım Bedeli (${standardBaseRetainer.toLocaleString('tr-TR')} ₺)`
      : isSocialSelected
      ? `Seçilen Paket Bedeli (${smPackagePrice.toLocaleString('tr-TR')} ₺)`
      : `Hizmet Sabit Bedeli (${standardBaseRetainer.toLocaleString('tr-TR')} ₺)`;
  } else {
    const reducedBase = Math.round(activeBaseRetainer * 0.8);
    const standardReducedBase = Math.round(standardBaseRetainer * 0.8);
    const performanceBonus = targetRevenue * 0.015;
    calculatedAgencyFee = Math.round(reducedBase + performanceBonus);
    managementFeeDesc = `%1.5 Ciro Primi Bedeli (${performanceBonus.toLocaleString('tr-TR')} ₺)`;
    baseRetainerLabel = isSocialSelected
      ? `Seçilen Paket Bedeli (${smPackagePrice.toLocaleString('tr-TR')} ₺)`
      : `E-Ticaret Yarı-Sabit Bedel (${standardReducedBase.toLocaleString('tr-TR')} ₺)`;
  }

  // Reporting Package Fee
  let reportingFee = 0;
  if (reportingPackage === 'gelismis') reportingFee = 1500;
  else if (reportingPackage === 'premium') reportingFee = 3500;
  else if (reportingPackage === 'kurumsal') reportingFee = 7000;

  calculatedAgencyFee = calculatedAgencyFee + reportingFee + smPackagePrice;

  // Commitment Contract Discounts
  let discountPercent = 0;
  if (commitment === 3) discountPercent = 5;
  else if (commitment === 6) discountPercent = 15;
  else if (commitment === 9) discountPercent = 25;

  const discountAmount = Math.round(calculatedAgencyFee * (discountPercent / 100));
  const finalAgencyFee = calculatedAgencyFee - discountAmount;

  return {
    // Tab
    calculatorTab, setCalculatorTab,
    // Fee
    feeAdBudget, setFeeAdBudget,
    pricingModel, setPricingModel,
    targetRevenue, setTargetRevenue,
    selectedServices, setSelectedServices,
    // ROI
    googleSpend, setGoogleSpend, googleRoas, setGoogleRoas,
    metaSpend, setMetaSpend, metaRoas, setMetaRoas,
    // E-commerce
    ecomTraffic, setEcomTraffic, ecomAov, setEcomAov,
    ecomSpend, setEcomSpend, ecomRevenue, setEcomRevenue,
    ecomSector, handleEcomSectorChange,
    // B2B
    b2bSpend, setB2bSpend, b2bLeads, setB2bLeads,
    b2bConversion, setB2bConversion, b2bLtv, setB2bLtv,
    b2bSector, handleB2bSectorChange,
    // Additional
    budgetIndex, setBudgetIndex,
    commitment, setCommitment,
    reportingPackage, setReportingPackage,
    smPackage, setSmPackage,
    webDesignType, setWebDesignType,
    // Computed: E-commerce
    baselineEcomOrders, baselineEcomCR, baselineEcomRoas, baselineEcomCac,
    rotaEcomCR, rotaEcomOrders, rotaEcomRevenue, rotaEcomRoas, rotaEcomCac,
    rotaEcomRevenueIncrease, ecomBudgetSavings,
    // Computed: B2B
    baselineB2bCustomers, baselineB2bRevenue, baselineB2bCpl, baselineB2bCac, baselineB2bRoi,
    rotaB2bLeads, rotaB2bConversion, rotaB2bCustomers, rotaB2bRevenue,
    rotaB2bCpl, rotaB2bCacFinal, rotaB2bRoi, rotaB2bRevenueIncrease,
    // Computed: Fee
    isSocialSelected, selectedCount, isOnlyDesignSelected,
    bundleDiscountPercent, bundleDiscountAmount,
    activePricingModel, calculatedAgencyFee,
    discountPercent, discountAmount, finalAgencyFee,
    baseRetainerLabel, managementFeeDesc,
    rawBaseRetainer, smPackagePrice,
  };
}
