export const useCalculatorData = (appState) => {
  const { googleSpend, metaSpend, googleRevenue, metaRevenue, ecomAov, ecomRevenue, ecomTraffic, ecomSpend, b2bLeads, b2bConversion, b2bLtv, b2bSpend, selectedServices, smPackage, settingsData, servicesData, feeAdBudget, pricingModel, commitment, reportingPackage, targetRevenue } = appState;
  
  const totalAdBudget = googleSpend + metaSpend;
  const totalRevenue = googleRevenue + metaRevenue;
  const overallRoas = totalAdBudget > 0 ? (totalRevenue / totalAdBudget).toFixed(1) : 0;
  const totalNetProfit = totalRevenue - totalAdBudget;

  // E-Commerce calculations
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

  // B2B calculations
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
  const rotaB2bCac = rotaB2bCustomers > 0 ? Math.round(b2bSpend / rotaB2bLeads) : 0; // Wait, let's use rotaB2bCustomers instead of leads for CAC
  const rotaB2bCacFinal = rotaB2bCustomers > 0 ? Math.round(b2bSpend / rotaB2bCustomers) : 0;
  const rotaB2bRoi = b2bSpend > 0 ? (rotaB2bRevenue / b2bSpend).toFixed(1) : '0';
  const rotaB2bRevenueIncrease = rotaB2bRevenue - baselineB2bRevenue;
  const b2bBudgetSavings = rotaB2bRevenue > 0 ? Math.round(b2bSpend * (1 - baselineB2bRevenue / rotaB2bRevenue)) : 0;

  // Sosyal Medya paketi seçili mi?
  const isSocialSelected = !!selectedServices.social;

  // Calculate selected services count (must be before isOnlySocialSelected)
  const selectedCount = Object.values(selectedServices).filter(Boolean).length;

  // SM tek seçili mi? (slider ve çalışma modeli gizleme için)
  const isOnlySocialSelected = isSocialSelected && selectedCount === 1;

  // Sosyal Medya paket fiyatı (settingsData'dan okunur)
  const smPackagePrice = isSocialSelected
    ? smPackage === 'baslangic'
      ? Number(settingsData.sm_pkg_baslangic_price) || 8000
      : smPackage === 'zirve'
      ? Number(settingsData.sm_pkg_zirve_price) || 18000
      : Number(settingsData.sm_pkg_orta_price) || 12000
    : 0;

  // Agency Fee calculations
  // Dynamic base fee calculation per service — social baseFee yerine smPackagePrice ayrıca eklenir
  const rawBaseRetainer = Object.keys(selectedServices).reduce((sum, key) => {
    if (selectedServices[key] && servicesData[key]) {
      if (key !== 'design' && key !== 'social') {
        const fee = Number(servicesData[key].baseFee) || 20000;
        return sum + fee;
      }
    }
    return sum;
  }, 0);

  // Check if only Conversion-Oriented Web Design is selected
  const isOnlyDesignSelected = selectedServices.design && selectedCount === 1;

  // Tiered Multi-service bundle discount: 2 services = 5%, 3 = 10%, 4 = 15%, 5 = 20%, 6 or more = 25%
  let bundleDiscountPercent = 0;
  if (selectedCount === 2) bundleDiscountPercent = 5;else if (selectedCount === 3) bundleDiscountPercent = 10;else if (selectedCount === 4) bundleDiscountPercent = 15;else if (selectedCount === 5) bundleDiscountPercent = 20;else if (selectedCount >= 6) bundleDiscountPercent = 25;
  const bundleDiscountAmount = Math.round(rawBaseRetainer * (bundleDiscountPercent / 100));
  const discountedRawBase = rawBaseRetainer - bundleDiscountAmount;

  // Account complexity scales with ad budget: base retainer increases up to 1.5x
  // Adjusted scaling factor to match Izmir market: 1.0 + (budget * 0.000003)
  const budgetMultiplier = isOnlyDesignSelected ? 1.0 : 1.0 + feeAdBudget * 0.000003;

  // Standard base retainer before bundle discount but scaled by complexity
  const standardBaseRetainer = Math.round(rawBaseRetainer * budgetMultiplier);

  // Scaled bundle discount amount to display in the result breakdown
  const scaledBundleDiscountAmount = Math.round(standardBaseRetainer * (bundleDiscountPercent / 100));

  const activeBaseRetainer = standardBaseRetainer - scaledBundleDiscountAmount;
  const activePricingModel = isOnlyDesignSelected ? 'hybrid' : pricingModel;
  let calculatedAgencyFee = 0;
  let managementFeeDesc = '';
  let baseRetainerLabel = '';
  
  let showCommission = false;
  let commissionFee = 0;
  let reducedBase = 0;
  let standardReducedBase = 0;
  let performanceBonus = 0;
  
  if (activePricingModel === 'hybrid') {
    // 12% ad spend commission applies only to budgets of 100k and above
    showCommission = feeAdBudget >= 100000 && !isOnlyDesignSelected;
    commissionFee = showCommission ? feeAdBudget * 0.12 : 0;
    calculatedAgencyFee = Math.round(activeBaseRetainer + commissionFee);
    managementFeeDesc = showCommission ? `%12 Bütçe Yönetimi (${commissionFee.toLocaleString('tr-TR')} ₺)` : '';
    baseRetainerLabel = isOnlyDesignSelected
      ? `Web Tasarım Bedeli (${standardBaseRetainer.toLocaleString('tr-TR')} ₺)`
      : isSocialSelected
      ? `Seçilen Paket Bedeli (${smPackagePrice.toLocaleString('tr-TR')} ₺)`
      : `Hizmet Sabit Bedeli (${standardBaseRetainer.toLocaleString('tr-TR')} ₺)`;
  } else {
    // Performance Model: 20% discount on base retainer + 1.5% of Target Revenue
    // Under performance model, the base is reduced by 20%
    reducedBase = Math.round(activeBaseRetainer * 0.8);
    standardReducedBase = Math.round(standardBaseRetainer * 0.8);
    performanceBonus = targetRevenue * 0.015;
    calculatedAgencyFee = Math.round(reducedBase + performanceBonus);
    managementFeeDesc = `%1.5 Ciro Primi Bedeli (${performanceBonus.toLocaleString('tr-TR')} ₺)`;
    baseRetainerLabel = isSocialSelected
      ? `Seçilen Paket Bedeli (${smPackagePrice.toLocaleString('tr-TR')} ₺)`
      : `E-Ticaret Yarı-Sabit Bedel (${standardReducedBase.toLocaleString('tr-TR')} ₺)`;
  }

  // Calculate performance bundle discount
  const performanceBundleDiscountAmount = Math.round(standardBaseRetainer * 0.8 * (bundleDiscountPercent / 100));

  // Calculate Reporting Package Fee (under-the-hood base fee addition)
  let reportingFee = 0;
  if (reportingPackage === 'gelismis') reportingFee = 1500;else if (reportingPackage === 'premium') reportingFee = 3500;else if (reportingPackage === 'kurumsal') reportingFee = 7000;

  // Add reporting fee to calculatedAgencyFee
  calculatedAgencyFee = calculatedAgencyFee + reportingFee;

  // Sosyal Medya paket fiyatı sabit tutulur — multiplier ve bundle discount dışındadır
  calculatedAgencyFee = calculatedAgencyFee + smPackagePrice;

  // Commitment Contract Discounts: 3 months = 5%, 6 months = 15%, 9 months = 25%
  let discountPercent = 0;
  if (commitment === 3) discountPercent = 5;else if (commitment === 6) discountPercent = 15;else if (commitment === 9) discountPercent = 25;
  const discountAmount = Math.round(calculatedAgencyFee * (discountPercent / 100));
  const finalAgencyFee = calculatedAgencyFee - discountAmount;

  return {
    totalAdBudget,
    totalRevenue,
    overallRoas,
    totalNetProfit,
    baselineEcomOrders,
    baselineEcomCR,
    baselineEcomRoas,
    baselineEcomCac,
    rotaEcomTraffic,
    rotaEcomCR,
    rotaEcomAov,
    rotaEcomOrders,
    rotaEcomRevenue,
    rotaEcomRoas,
    rotaEcomCac,
    rotaEcomRevenueIncrease,
    ecomBudgetSavings,
    baselineB2bCustomers,
    baselineB2bRevenue,
    baselineB2bCpl,
    baselineB2bCac,
    baselineB2bRoi,
    rotaB2bLeads,
    rotaB2bConversion,
    rotaB2bCustomers,
    rotaB2bRevenue,
    rotaB2bCpl,
    rotaB2bCac,
    rotaB2bCacFinal,
    rotaB2bRoi,
    rotaB2bRevenueIncrease,
    b2bBudgetSavings,
    isSocialSelected,
    selectedCount,
    isOnlySocialSelected,
    smPackagePrice,
    rawBaseRetainer,
    isOnlyDesignSelected,
    bundleDiscountPercent,
    bundleDiscountAmount,
    discountedRawBase,
    budgetMultiplier,
    standardBaseRetainer,
    scaledBundleDiscountAmount,
    activeBaseRetainer,
    activePricingModel,
    calculatedAgencyFee,
    managementFeeDesc,
    baseRetainerLabel,
    showCommission,
    commissionFee,
    reducedBase,
    standardReducedBase,
    performanceBonus,
    performanceBundleDiscountAmount,
    reportingFee,
    discountPercent,
    discountAmount,
    finalAgencyFee
  };
};
