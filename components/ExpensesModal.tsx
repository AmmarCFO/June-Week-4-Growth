
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseIcon } from './Icons';

interface ExpenseItem {
    name_en: string;
    name_ar: string;
    value: number;
}

interface ExpensesModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'en' | 'ar';
  expenses: ExpenseItem[];
}

const ExpensesModal: React.FC<ExpensesModalProps> = ({ isOpen, onClose, lang, expenses }) => {
  const isRTL = lang === 'ar';
  const total = expenses.reduce((sum, item) => sum + item.value, 0);

  const formatCurrency = (value: number) => {
    return lang === 'en' 
        ? `SAR ${value.toLocaleString('en-US')}`
        : `${value.toLocaleString('ar-SA')} ريال`;
  };

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
            className={`relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh] ${isRTL ? 'text-right' : 'text-left'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
        >
             <div className="bg-gray-50/50 border-b border-gray-100 p-6 flex justify-between items-center">
                 <div>
                    <h3 className="text-xl font-bold text-[#4A2C5A]">
                        {lang === 'en' ? 'Other Marketing Expenses' : 'مصاريف تسويقية أخرى'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                        {lang === 'en' ? 'Content & Production Breakdown' : 'تفاصيل المحتوى والإنتاج'}
                    </p>
                 </div>
                 <button 
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
                 >
                    <CloseIcon className="w-5 h-5" />
                 </button>
             </div>

             <div className="p-6 overflow-y-auto">
                 <div className="space-y-3">
                    {expenses.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-purple-100 transition-colors">
                            <span className="font-bold text-[#1D1D1F]">
                                {lang === 'en' ? item.name_en : item.name_ar}
                            </span>
                            <span className="font-mono font-semibold text-[#4A2C5A]">
                                {formatCurrency(item.value)}
                            </span>
                        </div>
                    ))}
                 </div>
                 
                 <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                     <span className="font-bold text-gray-500 uppercase tracking-widest text-xs">
                        {lang === 'en' ? 'Total' : 'الإجمالي'}
                     </span>
                     <span className="text-xl font-black text-[#4A2C5A]">
                        {formatCurrency(total)}
                     </span>
                 </div>
             </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ExpensesModal;
