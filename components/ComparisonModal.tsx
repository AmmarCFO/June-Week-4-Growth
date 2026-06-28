
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ComparisonLink } from '../types';
import { BayutIcon, AirbnbIcon, LinkIcon, AqarIcon, PhotoIcon, CloseIcon } from './Icons';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  links: ComparisonLink[];
}

const PlatformIcon: React.FC<{ platform: string; className?: string }> = ({ platform, className }) => {
    const p = platform.toLowerCase();
    if (p.includes('bayut')) return <BayutIcon className={className} />;
    if (p.includes('airbnb')) return <AirbnbIcon className={className} />;
    if (p.includes('aqar')) return <AqarIcon className={className} />;
    return (
        <div className={`flex items-center justify-center bg-gray-100 rounded-full ${className}`}>
            <span className="font-bold text-gray-500 text-xs">{platform.charAt(0)}</span>
        </div>
    );
};

const ComparisonModal: React.FC<ComparisonModalProps> = ({ isOpen, onClose, title, links }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
        />
        
        {/* Modal Content */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-[#F5F5F7] w-full max-w-5xl rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl overflow-hidden border border-white/50 flex flex-col max-h-[90vh]"
        >
             {/* Header */}
             <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 p-4 sm:p-8 flex justify-between items-center z-10">
                 <div>
                    <h3 className="text-xl sm:text-3xl font-black text-[#1D1D1F] tracking-tight">{title}</h3>
                    <p className="text-xs sm:text-base text-gray-500 mt-1 font-medium">Market comparison analysis & verified listings</p>
                 </div>
                 <button 
                    onClick={onClose}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors ltr:ml-auto rtl:mr-auto"
                 >
                    <CloseIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                 </button>
             </div>

             {/* Content */}
             <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#F5F5F7] relative">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                     {links.map((link, idx) => {
                         const hasDetails = link.price !== undefined;
                         
                         if (!hasDetails) {
                             // Simple Link Card (Fallback)
                             return (
                                 <a 
                                    key={idx}
                                    href={link.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="group flex items-center gap-4 p-4 sm:p-5 rounded-2xl bg-white hover:shadow-lg transition-all duration-300 border border-gray-100"
                                 >
                                     <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-50 flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <PlatformIcon platform={link.platform} className="w-6 h-6 sm:w-8 sm:h-8" />
                                     </div>
                                     <div className="flex-1 min-w-0 text-start">
                                         <h4 className="font-bold text-[#1D1D1F] truncate text-sm sm:text-base">{link.title}</h4>
                                         <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mt-0.5">{link.platform}</p>
                                     </div>
                                     <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#2A5B64] group-hover:text-white transition-colors">
                                         <LinkIcon className="w-4 h-4 rtl:rotate-180" />
                                     </div>
                                 </a>
                             );
                         }

                         // Rich Comp Card
                         return (
                             <div key={idx} className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-lg transition-all duration-300 group">
                                 <div className="flex justify-between items-start mb-4">
                                     <div className="flex items-center gap-2">
                                        <div className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border border-emerald-200">
                                            {link.type}
                                        </div>
                                     </div>
                                     <div className="text-end">
                                         <span className="block text-lg sm:text-2xl font-black text-[#1D1D1F] tracking-tight">
                                             {link.price?.toLocaleString()} <span className="text-[10px] sm:text-xs font-normal text-gray-500">SAR{link.period || ''}</span>
                                         </span>
                                     </div>
                                 </div>

                                 <div className="flex-1 mb-6 sm:mb-8 text-start">
                                     <h4 className="font-bold text-gray-900 mb-2 text-base sm:text-lg leading-snug">{link.location}</h4>
                                     <div className="flex flex-wrap items-center text-xs font-semibold text-gray-500 gap-2 sm:gap-3">
                                         {link.area && link.area !== 'Unknown' && (
                                            <>
                                                <span className="bg-gray-100 px-2 py-1 rounded-md text-gray-600">{link.area}</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                            </>
                                         )}
                                         <span className="uppercase tracking-wide">{link.platform}</span>
                                     </div>
                                 </div>

                                 <div className="flex items-center gap-2 sm:gap-3 mt-auto">
                                     {link.photosUrl && (
                                         <a 
                                            href={link.photosUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-gray-100 text-gray-700 font-bold text-xs sm:text-sm hover:bg-gray-200 transition-colors active:scale-95"
                                         >
                                             <PhotoIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                             <span>Photos</span>
                                         </a>
                                     )}
                                     <a 
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#1D1D1F] text-white font-bold text-xs sm:text-sm hover:bg-gray-800 transition-colors active:scale-95 shadow-lg shadow-gray-200"
                                     >
                                         <LinkIcon className="w-3 h-3 sm:w-4 sm:h-4 rtl:rotate-180" />
                                         <span>Visit</span>
                                     </a>
                                 </div>
                             </div>
                         );
                     })}
                 </div>
             </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ComparisonModal;
