// محاسبه ضریب تبدیل غذایی (FCR)
export const calculateFCR = (totalFeed, totalWeight) => {
  if (totalWeight === 0) return 0;
  return Number((totalFeed / totalWeight).toFixed(2));
};

// محاسبه درصد تلفات
export const calculateMortalityRate = (totalMortality, initialChicks) => {
  if (initialChicks === 0) return 0;
  return Number(((totalMortality / initialChicks) * 100).toFixed(2));
};

// محاسبه وزن کل گله
export const calculateTotalWeight = (avgWeight, currentCount) => {
  return (avgWeight * currentCount) / 1000; // تبدیل به کیلوگرم
};

// ماشین حساب آب مصرفی روزانه (بر اساس استانداردها)
export const estimateWaterConsumption = (birdCount, age, avgWeight) => {
  // فرمول تقریبی: آب مصرفی (لیتر) = (سن * 0.2) * تعداد جوجه
  // یا بر اساس وزن: 1.5 تا 2 برابر دان مصرفی
  const baseEstimate = birdCount * (age * 0.15);
  const weightBasedEstimate = birdCount * avgWeight * 0.002;
  return {
    lowEstimate: Math.round(baseEstimate * 0.8),
    highEstimate: Math.round(baseEstimate * 1.2),
    recommendation: Math.round((baseEstimate + weightBasedEstimate) / 2)
  };
};

// ماشین حساب آب واکسن
export const calculateVaccineWater = (birdCount, waterConsumptionPer2Hours, dosePerLiter) => {
  const totalWaterNeeded = Math.ceil(birdCount / dosePerLiter);
  const waterForVaccine = Math.min(totalWaterNeeded, waterConsumptionPer2Hours);
  return {
    waterNeeded: waterForVaccine,
    vaccineDoses: Math.ceil(birdCount / 1000) // هر دز برای 1000 جوجه
  };
};

// تخمین دان باقی‌مانده تا پایان دوره
export const estimateRemainingFeed = (currentAge, targetAge, currentCount, avgWeight, targetFCR) => {
  const remainingDays = targetAge - currentAge;
  if (remainingDays <= 0) return 0;
  
  const dailyFeedPerBird = avgWeight * 0.05; // تخمین خام
  const remainingFeed = currentCount * dailyFeedPerBird * remainingDays;
  
  return Math.round(remainingFeed);
};

// تخمین سود
export const estimateProfit = (
  currentCount,
  avgWeight,
  pricePerKg,
  totalFeedCost,
  otherCosts,
  mortalityCount
) => {
  const totalWeight = (currentCount * avgWeight) / 1000;
  const revenue = totalWeight * pricePerKg;
  const totalCosts = totalFeedCost + otherCosts;
  const profit = revenue - totalCosts;
  const lossFromMortality = mortalityCount * avgWeight * pricePerKg / 1000;
  
  return {
    revenue: Math.round(revenue),
    costs: Math.round(totalCosts),
    profit: Math.round(profit),
    lossFromMortality: Math.round(lossFromMortality),
    roi: Number(((profit / totalCosts) * 100).toFixed(2))
  };
};
