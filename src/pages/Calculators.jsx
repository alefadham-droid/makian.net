import React, { useState } from 'react';
import WaterCalculator from '../components/Calculators/WaterCalculator';
import VaccineCalculator from '../components/Calculators/VaccineCalculator';
import FeedCalculator from '../components/Calculators/FeedCalculator';
import ProfitEstimator from '../components/Calculators/ProfitEstimator';
import { Calculator, Droplets, Syringe, Wheat, DollarSign } from 'lucide-react';

const Calculators = () => {
  const [activeTab, setActiveTab] = useState('water');

  const tabs = [
    { id: 'water', name: 'ماشین حساب آب', icon: <Droplets className="w-5 h-5" /> },
    { id: 'vaccine', name: 'ماشین حساب واکسن', icon: <Syringe className="w-5 h-5" /> },
    { id: 'feed', name: 'تخمین دان باقی‌مانده', icon: <Wheat className="w-5 h-5" /> },
    { id: 'profit', name: 'تخمین سود', icon: <DollarSign className="w-5 h-5" /> },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">ابزارهای محاسباتی</h1>
      
      {/* تب‌ها */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 space-x-reverse">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.icon}
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* محتوای تب‌ها */}
      <div className="mt-6">
        {activeTab === 'water' && <WaterCalculator />}
        {activeTab === 'vaccine' && <VaccineCalculator />}
        {activeTab === 'feed' && <FeedCalculator />}
        {activeTab === 'profit' && <ProfitEstimator />}
      </div>
    </div>
  );
};

export default Calculators;
