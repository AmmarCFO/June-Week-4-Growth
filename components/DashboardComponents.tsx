
import React from 'react';

export const Section: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
  titleColor?: string;
}> = ({ title, children, className, titleColor = 'text-white' }) => (
  <section className={`py-12 sm:py-24 my-6 sm:my-8 ${className}`}>
    <div className="max-w-5xl mx-auto px-4">
        <h2 className={`text-center text-3xl sm:text-4xl md:text-5xl font-extrabold ${titleColor} mb-10 sm:mb-20 tracking-tighter`}>{title}</h2>
        {children}
    </div>
  </section>
);

export const Metric: React.FC<{
  value: string;
  label: string;
  valueColor?: string;
  labelColor?: string;
}> = ({ value, label, valueColor = 'text-white', labelColor = 'text-white/80' }) => (
  <div className="text-center px-2">
    <p className={`text-5xl sm:text-7xl lg:text-8xl font-bold ${valueColor} tracking-tighter drop-shadow-sm`}>{value}</p>
    <p className={`text-base sm:text-xl ${labelColor} mt-4 sm:mt-6 max-w-lg mx-auto font-light leading-relaxed`}>{label}</p>
  </div>
);

interface ShareBreakdownProps {
  title: string;
  totalValue: number | { min: number; max: number };
  mabaatSharePercentage: number;
  mabaatLabel: string;
  investorLabel: string;
  formatCurrency: (value: number) => string;
  className?: string;
  valueClassName?: string;
  cardClassName?: string;
  investorCardClassName?: string;
}

export const ShareBreakdown: React.FC<ShareBreakdownProps> = ({
  title,
  totalValue,
  mabaatSharePercentage,
  mabaatLabel,
  investorLabel,
  formatCurrency,
  className = 'text-white',
  valueClassName = 'text-2xl sm:text-3xl',
  cardClassName = 'bg-white/5 border border-white/10',
  investorCardClassName,
}) => {
  const investorSharePercentage = 1 - mabaatSharePercentage;
  const activeInvestorCardClass = investorCardClassName || cardClassName;

  const calculateShare = (value: number) => ({
    mabaat: value * mabaatSharePercentage,
    investor: value * investorSharePercentage
  });

  let mabaatDisplay: string;
  let investorDisplay: string;

  if (typeof totalValue === 'number') {
    const shares = calculateShare(totalValue);
    mabaatDisplay = formatCurrency(shares.mabaat);
    investorDisplay = formatCurrency(shares.investor);
  } else {
    const minShares = calculateShare(totalValue.min);
    const maxShares = calculateShare(totalValue.max);
    mabaatDisplay = `${formatCurrency(minShares.mabaat)} to ${formatCurrency(maxShares.mabaat)}`;
    investorDisplay = `${formatCurrency(minShares.investor)} to ${formatCurrency(maxShares.investor)}`;
  }
  
  const toRangeString = (display: string) => {
    if (display.includes('to')) {
        const parts = display.split(' to ');
        return (
            <span className="flex flex-col sm:flex-row sm:items-baseline justify-center sm:gap-2">
                <span>{parts[0]}</span>
                <span className="text-sm sm:text-base opacity-60 mx-1 sm:mx-0 font-normal">to</span>
                <span>{parts[1]}</span>
            </span>
        )
    }
    return display;
  }

  return (
    <div className={`mt-10 sm:mt-16 text-center ${className}`}>
      <h4 className="text-xs font-bold tracking-[0.2em] opacity-60 uppercase mb-6 sm:mb-8">{title}</h4>
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
        <div className={`${cardClassName} p-6 sm:p-8 rounded-3xl w-full flex-1 transition-transform duration-500 hover:-translate-y-2`}>
          <p className="text-xs font-bold uppercase opacity-50 tracking-widest mb-2 sm:mb-3">{mabaatLabel}</p>
          <p className={`${valueClassName} font-bold tracking-tight`}>{toRangeString(mabaatDisplay)}</p>
        </div>
        <div className={`${activeInvestorCardClass} p-6 sm:p-8 rounded-3xl w-full flex-1 transition-transform duration-500 hover:-translate-y-2`}>
          <p className="text-xs font-bold uppercase opacity-50 tracking-widest mb-2 sm:mb-3">{investorLabel}</p>
          <p className={`${valueClassName} font-bold tracking-tight`}>{toRangeString(investorDisplay)}</p>
        </div>
      </div>
    </div>
  );
};

export const OccupancyRadial: React.FC<{
  percentage: number;
  label: string;
  subLabel: string;
  color: string;
}> = ({ percentage, label, subLabel, color }) => {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/50 p-6 sm:p-8 rounded-[2rem] shadow-lg flex flex-col items-center justify-center text-center h-full transition-all duration-500 hover:scale-105 hover:shadow-2xl">
      <h3 className="text-lg font-bold text-[#4A2C5A] mb-6 sm:mb-8">{label}</h3>
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center mb-6 sm:mb-8">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1500 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
            <span className="text-3xl sm:text-4xl font-extrabold text-[#4A2C5A] tracking-tight">{percentage}%</span>
        </div>
      </div>
      <p className="text-sm font-medium text-[#4A2C5A]/60 px-2 sm:px-4">{subLabel}</p>
    </div>
  );
};
