import React from 'react';
import StatsCard from '../components/Dashboard/StatsCard';
import QuickActions from '../components/Dashboard/QuickActions';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, TrendingDown, Droplets, Weight, Skull } from 'lucide-react';

const Dashboard = () => {
  // داده‌های نمونه (در نسخه واقعی از API یا LocalStorage می‌آید)
  const stats = {
    totalBirds: 20000,
    age: 25,
    avgWeight: 2150,
    mortality: 340,
    feedConsumed: 45200,
    fcr: 1.75,
    waterConsumed: 8500
  };

  const mortalityData = [
    { day: 1, mortality: 12 },
    { day: 2, mortality: 8 },
    { day: 3, mortality: 15 },
    { day: 4, mortality: 10 },
    { day: 5, mortality: 7 },
    { day: 6, mortality: 9 },
    { day: 7, mortality: 11 },
  ];

  const growthData = [
    { day: 1, actual: 180, standard: 185 },
    { day: 7, actual: 320, standard: 330 },
    { day: 14, actual: 680, standard: 700 },
    { day: 21, actual: 1150, standard: 1200 },
    { day: 25, actual: 2150, standard: 2200 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">داشبورد مدیریت مزرعه</h1>
      
      {/* کارت‌های آمار */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="تعداد کل جوجه‌ها" 
          value={stats.totalBirds.toLocaleString()} 
          icon={<Activity className="w-6 h-6 text-green-600" />}
          change="+2.5%"
        />
        <StatsCard 
          title="سن گله" 
          value={`${stats.age} روز`} 
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
        />
        <StatsCard 
          title="میانگین وزن" 
          value={`${stats.avgWeight} گرم`} 
          icon={<Weight className="w-6 h-6 text-purple-600" />}
          change="+120g"
        />
        <StatsCard 
          title="تلفات کل" 
          value={stats.mortality.toLocaleString()} 
          icon={<Skull className="w-6 h-6 text-red-600" />}
          change="1.7%"
          trend="down"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard 
          title="دان مصرفی" 
          value={`${stats.feedConsumed.toLocaleString()} کیلوگرم`} 
          icon={<TrendingUp className="w-6 h-6 text-yellow-600" />}
        />
        <StatsCard 
          title="ضریب تبدیل (FCR)" 
          value={stats.fcr} 
          icon={<Activity className="w-6 h-6 text-indigo-600" />}
          change="-0.05"
          trend="down"
        />
      </div>

      {/* اکشن‌های سریع */}
      <QuickActions />

      {/* نمودارها */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">روند تلفات روزانه</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mortalityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="mortality" fill="#ef4444" name="تلفات" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">مقایسه رشد با استاندارد</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#10b981" name="وزن فعلی" />
              <Line type="monotone" dataKey="standard" stroke="#6b7280" name="وزن استاندارد" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
