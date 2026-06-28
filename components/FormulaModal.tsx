import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseIcon } from './Icons';

interface FormulaModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'ar';
}

const definitions = {
  en: [
    {
      label: "Mathwaa Revenue Share",
      formula: "Rent × Branch Management % (applied over the binding period)",
      description: "Mathwaa's percentage-based management cut from tenants acquired exclusively through paid digital campaigns during the active period."
    },
    {
      label: "Projected June Marketing Spend",
      formula: "Spent MTD (SAR 11,851) + Branch Content (SAR 6,000) + Added Paid Media (SAR 3,000)",
      description: "Forecasted June marketing outlay including standard digital ads, new one-time creative videos, and targeted branch traffic activation."
    },
    {
      label: "Projected July Marketing Spend",
      formula: "Baseline Ceiling (SAR 18,000)",
      description: "Standard baseline marketing budget allocation for July with no additional overages or content production costs planned at this stage."
    },
    {
      label: "Paid Social Valuation Rule",
      formula: "Σ (Paid Social Deals) - renewals, referrals & portal referrals excluded",
      description: "Strict verification model counting only verified Meta & TikTok acquisitions. Pure organic, web search, bank listing hubs, and friends-and-family word-of-mouth are excluded from the calculation."
    }
  ],
  ar: [
    {
      label: "حصة إيرادات مثوى",
      formula: "قيمة الإيجار × نسبة إدارة الفرع المتفق عليها",
      description: "الحصة المئوية المستحقة والمثبتة لشركة مثوى من إيجار المستأجرين المستقطبين عبر الإعلانات الرقمية خلال الفترة الزمنية المعتمدة لعقودهم."
    },
    {
      label: "نفقات تسويق شهر يونيو المتوقعة",
      formula: "الإنفاق المكتمل (١١,٨٥١ ريال) + محتوى الفروع (٦,٠٠٠ ريال) + الحملات المدفوعة (٣,٠٠٠ ريال)",
      description: "إجمالي توقعات تكلفة التسويق بنهاية يونيو، شاملة النفقات الإضافية لخدمات إنتاج الفيديوهات وتنشيط الفروع."
    },
    {
      label: "نفقات تسويق شهر يوليو المتوقعة",
      formula: "الحد الأساسي للميزانية (١٨,٠٠٠ ريال)",
      description: "تخصيص ميزانية التسويق الأساسية المعتادة لشهر يوليو دون أي نفقات إضافية متوقعة في هذه المرحلة."
    },
    {
      label: "قاعدة فرز عقود الإعلانات الرقمية",
      formula: "مجموع (العقود الرقمية المباشرة) - عقود التمديد والإحالات والمنصات غير الإعلانية",
      description: "نموذج تحقق دقيق يسجل فقط المستأجرين المستقطبين فعلياً عبر شبكة ميتا وتيك توك مع إلغاء الإحالات والزيارات العشوائية لضمان سلامة البيانات."
    }
  ]
};

const FormulaModal: React.FC<FormulaModalProps> = ({ isOpen, onClose, lang }) => {
  const content = definitions[lang];
  const isRTL = lang === 'ar';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        />
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh] ${isRTL ? 'text-right' : 'text-left'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
        >
             <div className="bg-gray-50/50 border-b border-gray-100 p-6 flex justify-between items-center">
                 <div className="flex-1">
                    <h3 className="text-2xl font-bold text-[#4A2C5A]">
                        {lang === 'en' ? 'Calculations & Formulas' : 'طرق الاحتساب والمعادلات'}
                    </h3>
                 </div>
                 <button 
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors shrink-0"
                 >
                    <CloseIcon className="w-5 h-5" />
                 </button>
             </div>

             <div className="p-6 overflow-y-auto space-y-6">
                {content.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                        <h4 className="text-[#1D1D1F] font-bold text-lg mb-2">{item.label}</h4>
                        <div className="bg-white rounded-lg p-3 border border-gray-200 mb-3 font-mono text-xs sm:text-sm text-[#4A2C5A] overflow-x-auto">
                            {item.formula}
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            {item.description}
                        </p>
                    </div>
                ))}
             </div>
         </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default FormulaModal;
