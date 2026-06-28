
import React from 'react';
import { motion } from 'framer-motion';

interface SensitivityMatrixProps {
  lang: 'en' | 'ar';
  scenarioId?: string;
}

const DATA_CONFIG = {
  study_b: {
    en: {
        title: 'Revenue Sensitivity Matrix (Co-living)',
        subtitle: 'Annual revenue impact analysis per townhouse (3 Master Rooms) based on occupancy variations & pricing strategies.',
        scenarios: [
            { name: 'Conservative', price: 'SAR 3,200 / room' },
            { name: 'Realistic', price: 'SAR 3,500 / room' },
            { name: 'Optimistic', price: 'SAR 3,900 / room' }
        ],
    },
    ar: {
        title: 'مصفوفة حساسية الإيرادات (سكن مشترك)',
        subtitle: 'تحليل أثر الإيرادات السنوية لكل تاون هاوس (٣ غرف ماستر) بناءً على متغيرات الإشغال واستراتيجيات التسعير.',
        scenarios: [
            { name: 'متحفظ', price: '٣,٢٠٠ ريال / غرفة' },
            { name: 'واقعي', price: '٣,٥٠٠ ريال / غرفة' },
            { name: 'متفائل', price: '٣,٩٠٠ ريال / غرفة' }
        ],
    },
    values: [
      // Conservative
      [115200, 103680, 92160, 80640, 69120],
      // Realistic
      [126000, 113400, 100800, 88200, 75600],
      // Optimistic
      [140400, 126360, 112320, 98280, 84240]
    ]
  },
  study_c: {
    en: {
        title: 'Revenue Sensitivity Matrix (Co-living Plus)',
        subtitle: 'Annual revenue impact analysis per townhouse (3 Master Rooms + 1 Single Room) with Single Room fixed at SAR 2,900.',
        scenarios: [
            { name: 'Conservative', price: 'M: 3,200 | S: 2,900' },
            { name: 'Realistic', price: 'M: 3,500 | S: 2,900' },
            { name: 'Optimistic', price: 'M: 3,900 | S: 2,900' }
        ],
    },
    ar: {
        title: 'مصفوفة حساسية الإيرادات (سكن مشترك بلس)',
        subtitle: 'تحليل أثر الإيرادات السنوية لكل تاون هاوس (٣ غرف ماستر + ١ غرفة مفردة) مع تثبيت سعر الغرفة المفردة عند ٢,٩٠٠ ريال.',
        scenarios: [
            { name: 'متحفظ', price: 'م: ٣,٢٠٠ | ف: ٢,٩٠٠' },
            { name: 'واقعي', price: 'م: ٣,٥٠٠ | ف: ٢,٩٠٠' },
            { name: 'متفائل', price: 'م: ٣,٩٠٠ | ف: ٢,٩٠٠' }
        ],
    },
    values: [
      // Conservative: (3200*3 + 2900*1)*12 = 150,000
      [150000, 135000, 120000, 105000, 90000],
      // Realistic: (3500*3 + 2900*1)*12 = 160,800
      [160800, 144720, 128640, 112560, 96480],
      // Optimistic: (3900*3 + 2900*1)*12 = 175,200
      [175200, 157680, 140160, 122640, 105120]
    ]
  }
};

const COMMON_LABELS = {
    en: {
        occupancyLabel: 'Occupancy Rate',
        currency: 'SAR',
        low: 'Low Impact',
        high: 'High Impact'
    },
    ar: {
        occupancyLabel: 'معدل الإشغال',
        currency: 'ريال',
        low: 'أثر منخفض',
        high: 'أثر مرتفع'
    }
}

const OCCUPANCY_COLS = [100, 90, 80, 70, 60];

const SensitivityMatrix: React.FC<SensitivityMatrixProps> = ({ lang, scenarioId = 'study_b' }) => {
  const isRTL = lang === 'ar';
  
  // Select data based on scenario, default to Study B if Study A is passed or unknown
  const scenarioKey = (scenarioId === 'study_c') ? 'study_c' : 'study_b';
  const data = DATA_CONFIG[scenarioKey];
  const t = { ...COMMON_LABELS[lang], ...data[lang] };
  const values = data.values;
  const locale = isRTL ? 'ar-SA' : 'en-US';

  return (
    <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`w-full max-w-6xl mx-auto ${isRTL ? 'font-cairo' : 'font-sans'}`} 
        dir={isRTL ? 'rtl' : 'ltr'}
    >
        {/* Dark Glass Card */}
        <div className="bg-[#09090b] rounded-[24px] sm:rounded-[40px] shadow-2xl border border-white/10 overflow-hidden relative">
             {/* Noise Texture for that premium hardware feel */}
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none"></div>
             
             {/* Ambient Glow */}
             <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#8A6E99]/20 rounded-full blur-[80px] sm:blur-[120px] pointer-events-none mix-blend-screen"></div>

             <div className="relative z-10 p-4 sm:p-12">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between mb-8 sm:mb-12 border-b border-white/5 pb-6 sm:pb-8 gap-6">
                    <div className="text-center sm:text-left rtl:sm:text-right">
                        <h3 className="text-2xl sm:text-4xl font-bold text-white tracking-tight mb-2 sm:mb-3">
                            {t.title}
                        </h3>
                        <p className="text-sm sm:text-lg leading-relaxed text-white/50 max-w-2xl font-medium">
                            {t.subtitle}
                        </p>
                    </div>
                    {/* Legend */}
                    <div className="flex items-center gap-4 bg-white/5 rounded-full px-6 py-3 border border-white/5 whitespace-nowrap overflow-x-auto max-w-full">
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-[#8A6E99] opacity-30"></div>
                             <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{t.low}</span>
                        </div>
                        <div className="w-12 h-[2px] bg-gradient-to-r from-[#8A6E99]/30 to-[#8A6E99] rounded-full"></div>
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-[#8A6E99] shadow-[0_0_8px_#8A6E99]"></div>
                             <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{t.high}</span>
                        </div>
                    </div>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto pb-4 hide-scrollbar">
                     <div className="min-w-[800px]">
                        {/* Column Headers */}
                        <div className="grid grid-cols-6 gap-4 mb-6 px-2">
                             <div className="col-span-1 flex items-end pb-2">
                                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 pl-2">
                                    {t.occupancyLabel}
                                </span>
                             </div>
                             {OCCUPANCY_COLS.map((occ) => (
                                 <div key={occ} className="col-span-1 text-center">
                                     <div className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/5">
                                        <span className="text-sm font-bold text-white">
                                            {occ.toLocaleString(locale)}%
                                        </span>
                                     </div>
                                 </div>
                             ))}
                        </div>

                        {/* Rows */}
                        <div className="space-y-4">
                            {t.scenarios.map((scenario, sIdx) => (
                                <div key={sIdx} className="grid grid-cols-6 gap-4 items-center p-2 rounded-2xl hover:bg-white/5 transition-colors duration-300">
                                    {/* Row Header */}
                                    <div className="col-span-1 pr-4">
                                        <div className="text-[17px] font-bold text-white mb-2 tracking-tight">{scenario.name}</div>
                                        <div className="text-[11px] font-semibold text-[#8A6E99] bg-[#8A6E99]/10 inline-block px-3 py-1 rounded-lg tracking-wide border border-[#8A6E99]/20 whitespace-nowrap">
                                            {scenario.price}
                                        </div>
                                    </div>

                                    {/* Cells */}
                                    {values[sIdx].map((val, vIdx) => {
                                        // Intensity logic based on scenario
                                        const min = values[0][4]; // Lowest value in matrix
                                        const max = values[2][0]; // Highest value in matrix
                                        const percent = (val - min) / (max - min); 
                                        // On dark bg, we want opacity to range from barely visible to vibrant
                                        const opacity = 0.15 + (percent * 0.65); 
                                        
                                        return (
                                            <motion.div 
                                                key={vIdx} 
                                                className="col-span-1 relative h-[4.5rem] rounded-xl flex flex-col items-center justify-center cursor-default group/cell overflow-hidden"
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                                            >
                                                {/* Background Color Layer */}
                                                <div 
                                                    className="absolute inset-0 bg-[#8A6E99] transition-all duration-300" 
                                                    style={{ opacity }}
                                                />
                                                
                                                {/* Shine Effect */}
                                                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover/cell:opacity-100 transition-opacity duration-300" />
                                                
                                                {/* Border */}
                                                <div className="absolute inset-0 border border-white/5 rounded-xl group-hover/cell:border-white/20 transition-colors duration-200" />

                                                {/* Content */}
                                                <div className="relative z-10 text-center">
                                                    <span className="block text-[19px] font-bold text-white tabular-nums tracking-tight drop-shadow-md">
                                                        {val.toLocaleString(locale)}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-white/60 uppercase tracking-wider mt-0.5 opacity-0 group-hover/cell:opacity-100 transition-opacity duration-200 absolute left-0 right-0 -bottom-3 translate-y-2 group-hover/cell:translate-y-0">
                                                        {t.currency}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                     </div>
                </div>

             </div>
        </div>
    </motion.div>
  );
};

export default SensitivityMatrix;
