import React, { useState, useMemo } from 'react';
import { BOOKINGS, SYNC_DATA, Booking } from './constants';
import { CUSTOMER_PAYMENTS, CustomerPayment } from './payments_data';
import Header_ar from './components/Header_ar';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip
} from 'recharts';

// Custom Arabic currency formatter
const formatSAR_Ar = (value: number) => {
    return `${value.toLocaleString('ar-SA', { minimumFractionDigits: 0, maximumFractionDigits: value % 1 === 0 ? 0 : 2 })} ريال`;
};

const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } 
    }
};

const App_ar: React.FC<{ onToggleLanguage: () => void }> = ({ onToggleLanguage }) => {
    // Interactive state for bookings table
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [attributionFilter, setAttributionFilter] = useState<string>('all');
    const [branchFilter, setBranchFilter] = useState<string>('all');
    const [sortField, setSortField] = useState<keyof Booking>('id');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [showFormulasModal, setShowFormulasModal] = useState(false);

    // Interactive state for customer payment list
    const [paymentSearch, setPaymentSearch] = useState('');
    const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>('all');

    // Filter and sort bookings
    const filteredAndSortedBookings = useMemo(() => {
        let result = [...BOOKINGS];

        // Apply Search
        if (searchTerm.trim() !== '') {
            const query = searchTerm.toLowerCase();
            result = result.filter(booking => 
                booking.name_ar.toLowerCase().includes(query) ||
                booking.name.toLowerCase().includes(query) ||
                booking.branch.toLowerCase().includes(query) ||
                booking.location_ar.toLowerCase().includes(query) ||
                booking.channel_ar.toLowerCase().includes(query)
            );
        }

        // Apply Status Filter
        if (statusFilter !== 'all') {
            result = result.filter(booking => booking.status.toLowerCase() === statusFilter.toLowerCase());
        }

        // Apply Attribution Filter
        if (attributionFilter !== 'all') {
            result = result.filter(booking => booking.attribution.toLowerCase() === attributionFilter.toLowerCase());
        }

        // Apply Branch Filter
        if (branchFilter !== 'all') {
            result = result.filter(booking => booking.branch === branchFilter);
        }

        // Apply Sorting
        result.sort((a, b) => {
            let aValue = a[sortField];
            let bValue = b[sortField];

            if (typeof aValue === 'string') {
                aValue = (aValue as string).toLowerCase();
                bValue = (bValue as string).toLowerCase();
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        return result;
    }, [searchTerm, statusFilter, attributionFilter, branchFilter, sortField, sortDirection]);

    // Unique branches list for dropdown
    const uniqueBranches = useMemo(() => {
        const branches = BOOKINGS.map(b => b.branch);
        return Array.from(new Set(branches)).sort();
    }, []);

    const toggleSort = (field: keyof Booking) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Filtered customer payments list
    const filteredPayments = useMemo(() => {
        let result = [...CUSTOMER_PAYMENTS];

        // Apply Search
        if (paymentSearch.trim() !== '') {
            const query = paymentSearch.toLowerCase();
            result = result.filter(item => 
                item.inputName.toLowerCase().includes(query) ||
                item.matchedName.toLowerCase().includes(query) ||
                item.matchedNameAr.toLowerCase().includes(query) ||
                item.branch.toLowerCase().includes(query)
            );
        }

        // Apply Status Filter
        if (paymentFilter === 'paid') {
            result = result.filter(item => item.status === 'Confirmed');
        } else if (paymentFilter === 'unpaid') {
            result = result.filter(item => item.status !== 'Confirmed');
        }

        return result;
    }, [paymentSearch, paymentFilter]);

    // Computed payment metrics
    const paymentMetrics = useMemo(() => {
        const totalRent = CUSTOMER_PAYMENTS.reduce((sum, item) => sum + item.rent, 0);
        const totalMathwaa = CUSTOMER_PAYMENTS.reduce((sum, item) => sum + item.juneCash, 0);

        const paidRent = CUSTOMER_PAYMENTS.filter(item => item.status === 'Confirmed').reduce((sum, item) => sum + item.rent, 0);
        const paidMathwaa = CUSTOMER_PAYMENTS.filter(item => item.status === 'Confirmed').reduce((sum, item) => sum + item.juneCash, 0);

        const pendingRent = CUSTOMER_PAYMENTS.filter(item => item.status !== 'Confirmed').reduce((sum, item) => sum + item.rent, 0);
        const pendingMathwaa = CUSTOMER_PAYMENTS.filter(item => item.status !== 'Confirmed').reduce((sum, item) => sum + item.juneCash, 0);

        const paidCount = CUSTOMER_PAYMENTS.filter(item => item.status === 'Confirmed').length;
        const totalCount = CUSTOMER_PAYMENTS.length;

        return {
            totalRent,
            totalMathwaa,
            paidRent,
            paidMathwaa,
            pendingRent,
            pendingMathwaa,
            paidCount,
            totalCount
        };
    }, []);

    // Performance VS Other chart data
    const sourceChartData = SYNC_DATA.sourceBreakdown.map(item => ({
        name: item.source_ar,
        value: item.juneCash,
        color: item.color
    }));

    // Direct VS Indirect chart data
    const directIndirectChartData = SYNC_DATA.directIndirectBreakdown.map(item => ({
        name: item.type_ar.split(' ')[0],
        value: item.juneCash,
        color: item.color
    }));

    return (
        <div className="min-h-screen pb-20 selection:bg-[#4A2C5A] selection:text-white bg-[#F5F5F7] font-cairo antialiased" dir="rtl">
            <Header_ar onToggleLanguage={onToggleLanguage} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
                
                {/* Hero Title Block */}
                <div className="mb-10 sm:mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col md:flex-row-reverse md:items-end justify-between gap-4"
                    >
                        <div className="text-right">
                            <span className="text-xs sm:text-sm font-bold tracking-wider text-[#4A2C5A] uppercase bg-[#4A2C5A]/10 px-3 py-1 rounded-full inline-block">
                                تقرير الأداء الإداري والمالي
                            </span>
                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-950 mt-3">
                                تقرير إيرادات تسويق <span className="text-[#4A2C5A]">مثوى لشهر يونيو</span>
                            </h1>
                            <p className="text-sm sm:text-base text-gray-500 font-medium mt-2">
                                الفترة: ١-٢٨ يونيو ٢٠٢٦ · أساس إعداد التقرير: النقد المحصل فعلياً (رسوم الإدارة لشهر واحد) مقابل القيمة التعاقدية المستقبلية (LTV)
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-white/70 backdrop-blur border border-gray-200 rounded-2xl px-4 py-3 shadow-sm self-start md:self-auto flex-row-reverse">
                            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-xs font-bold text-gray-700 font-mono uppercase">
                                تم التدقيق من سجلات المبيعات
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* SECTION 0: MARKETING INVESTMENT & ROI */}
                <motion.div 
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-[#1E1B24] border border-[#4A2C5A]/25 rounded-[2rem] p-6 sm:p-8 shadow-xl mb-10 sm:mb-12 text-right relative overflow-hidden"
                    id="marketing-spend-roi-dashboard"
                >
                    {/* Decorative subtle ambient background light */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#4A2C5A]/10 blur-3xl rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />

                    {/* Header */}
                    <div className="mb-8 border-b border-white/5 pb-6 text-right relative z-10">
                        <div className="flex flex-col sm:flex-row-reverse sm:items-center justify-between gap-4">
                            <div>
                                <span className="text-xs sm:text-sm font-bold tracking-wider text-purple-300 bg-purple-500/15 px-3 py-1 rounded-full inline-block">
                                    مؤشرات العائد الأساسية على الاستثمار
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3">لوحة تحكم الإنفاق التسويقي وعائد الاستثمار</h2>
                                <p className="text-xs text-slate-400 font-semibold mt-0.5">تدقيق نفقات الحملات الإعلانية وتقييم نسب العائد المحقق</p>
                            </div>
                            <div className="flex items-center gap-3 flex-row-reverse">
                                <button 
                                    onClick={() => setShowFormulasModal(true)}
                                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-purple-300 hover:bg-white/10 bg-white/5 border border-white/10 rounded-xl transition-all shadow-sm cursor-pointer flex-row-reverse"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <span>المعادلات الحسابية</span>
                                </button>
                                <div className="bg-white/10 text-slate-200 border border-white/5 text-xs font-bold px-3 py-2 rounded-xl font-mono">
                                    فترة التدقيق: ١:٢٨ يونيو ٢٠٢٦
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Spend Breakdown Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 relative z-10" dir="rtl">
                        <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-5 shadow-sm transition-all hover:bg-white/[0.05] text-right">
                            <p className="text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest mb-1">الإنفاق على إعلانات ميتا</p>
                            <p className="text-xl sm:text-2xl font-extrabold text-white font-mono">٤,٨٣٦ ريال</p>
                            <span className="text-[10px] text-indigo-300/60 font-semibold mt-1.5 block">حملة ١:٢٨ يونيو</span>
                        </div>
                        <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-5 shadow-sm transition-all hover:bg-white/[0.05] text-right">
                            <p className="text-sky-400 text-[10px] font-extrabold uppercase tracking-widest mb-1">الإنفاق على إعلانات تيك توك</p>
                            <p className="text-xl sm:text-2xl font-extrabold text-white font-mono">٨,٧٥٨ ريال</p>
                            <span className="text-[10px] text-sky-300/60 font-semibold mt-1.5 block">حملة ١:٢٨ يونيو</span>
                        </div>
                        <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-5 shadow-sm transition-all hover:bg-white/[0.05] text-right">
                            <p className="text-amber-400 text-[10px] font-extrabold uppercase tracking-widest mb-1">صناعة وتطوير المحتوى</p>
                            <p className="text-xl sm:text-2xl font-extrabold text-white font-mono">٥٠٠ ريال</p>
                            <span className="text-[10px] text-amber-300/60 font-semibold mt-1.5 block">الإنتاج الإبداعي</span>
                        </div>
                        <div className="bg-purple-950/25 border border-[#4A2C5A]/30 rounded-3xl p-5 shadow-sm transition-all hover:bg-purple-950/35 col-span-2 sm:col-span-1 text-right">
                            <p className="text-purple-300 text-[10px] font-extrabold uppercase tracking-widest mb-1">إجمالي الإعلانات المدفوعة</p>
                            <p className="text-xl sm:text-2xl font-extrabold text-purple-200 font-mono">١٣,٥٩٤ ريال</p>
                            <span className="text-[10px] text-purple-300/60 font-semibold mt-1.5 block">ميتا + تيك توك</span>
                        </div>
                        <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-3xl p-5 shadow-sm transition-all hover:bg-emerald-950/40 col-span-2 sm:col-span-2 lg:col-span-1 text-right">
                            <p className="text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest mb-1">إجمالي الإنفاق التسويقي</p>
                            <p className="text-xl sm:text-2xl font-extrabold text-emerald-300 font-mono">١٤,٠٩٤ ريال</p>
                            <span className="text-[10px] text-emerald-400/60 font-semibold mt-1.5 block">الإعلانات + الإنتاج الإبداعي</span>
                        </div>
                    </div>

                    {/* Unified ROI Ratios Section - Premium & Colorful Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10" dir="rtl">
                        {/* June Cash Collected ROI Card */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-purple-950/35 via-white/[0.01] to-[#1E1B24] border border-purple-500/20 rounded-[2rem] p-6 sm:p-8 shadow-sm hover:border-purple-500/30 transition-all duration-300 text-right">
                            {/* Decorative Top Accent Bar */}
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-[#A855F7]" />
                            
                            <div className="flex flex-col sm:flex-row-reverse items-center gap-6 sm:gap-8 justify-between">
                                <div className="space-y-3 flex-1 text-right">
                                    <div className="flex items-center gap-2 justify-start flex-row-reverse">
                                        <span className="text-[10px] font-extrabold px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-md font-mono uppercase tracking-wider">العائد النقدي</span>
                                        <span className="text-[10px] font-extrabold px-2 py-0.5 bg-white/5 text-slate-400 rounded-md font-mono">أساس الإنفاق: ١٤,٠٩٤ ريال</span>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-extrabold text-white">عائد نقد يونيو المحصل</h3>
                                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
                                        مقابل كل <strong className="text-white font-bold">١ ريال</strong> يُنفق على التسويق الإجمالي (الإعلانات + تكاليف المحتوى)، تم تحصيل <strong className="text-purple-300 font-extrabold">١.٧٣ ريال</strong> نقدًا كرسوم إدارة في يونيو.
                                    </p>
                                    <div className="text-[11px] text-purple-300/80 bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 font-mono text-right" dir="ltr">
                                        Calculation: SAR 24,431.5 Cash / SAR 14,094 Spend
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="relative w-36 h-36 rounded-full border-[12px] border-purple-950 border-t-purple-500 flex flex-col items-center justify-center bg-[#15131a] shadow-md hover:scale-105 transition-transform duration-300">
                                        <span className="text-3xl font-black text-purple-300 tracking-tight font-mono">1.73x</span>
                                        <span className="text-[9px] text-slate-400 font-extrabold mt-1 uppercase tracking-widest text-center">عائد الكاش</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contract LTV ROI Card */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950/35 via-white/[0.01] to-[#1E1B24] border border-emerald-500/20 rounded-[2rem] p-6 sm:p-8 shadow-sm hover:border-emerald-500/30 transition-all duration-300 text-right">
                            {/* Decorative Top Accent Bar */}
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />

                            <div className="flex flex-col sm:flex-row-reverse items-center gap-6 sm:gap-8 justify-between">
                                <div className="space-y-3 flex-1 text-right">
                                    <div className="flex items-center gap-2 justify-start flex-row-reverse">
                                        <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-md font-mono uppercase tracking-wider">العقود التراكمية LTV</span>
                                        <span className="text-[10px] font-extrabold px-2 py-0.5 bg-white/5 text-slate-400 rounded-md font-mono">أساس الإنفاق: ١٤,٠٩٤ ريال</span>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-extrabold text-white">عائد القيمة التعاقدية المستقبلية (LTV)</h3>
                                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-semibold">
                                        مقابل كل <strong className="text-white font-bold">١ ريال</strong> يُنفق على التسويق الإجمالي، تم تأمين <strong className="text-emerald-400 font-extrabold">٧.٢٢ ريال</strong> كقيمة تعاقدية مستقبلية طوال دورة حياة المستأجر.
                                    </p>
                                    <div className="text-[11px] text-emerald-300/80 bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 font-mono text-right" dir="ltr">
                                        Calculation: SAR 101,762 LTV / SAR 14,094 Spend
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="relative w-36 h-36 rounded-full border-[12px] border-emerald-950 border-t-emerald-500 flex flex-col items-center justify-center bg-[#15131a] shadow-md hover:scale-105 transition-transform duration-300">
                                        <span className="text-3xl font-black text-emerald-400 tracking-tight font-mono">7.22x</span>
                                        <span className="text-[9px] text-slate-400 font-extrabold mt-1 uppercase tracking-widest text-center">عائد الـ LTV</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* SECTION 1: HERO KPIs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 sm:mb-12">
                    {/* KPI 1: June Cash */}
                    <motion.div 
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-white hover:border-[#4A2C5A]/45 border border-gray-200/60 rounded-3xl p-6 sm:p-7 shadow-sm transition-all duration-300 relative overflow-hidden group text-right"
                        id="kpi-june-cash-ar"
                    >
                        <div className="absolute top-0 left-0 w-32 h-32 bg-[#4A2C5A]/5 blur-2xl rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                        <div className="mb-4 text-right">
                            <p className="text-gray-400 text-xs font-bold uppercase">النقد المحصل في يونيو</p>
                        </div>
                        <p className="text-3xl sm:text-4xl font-bold text-gray-950">
                            {formatSAR_Ar(SYNC_DATA.heroKPIs.juneCashCollected)}
                        </p>
                        <p className="text-xs text-gray-500 font-semibold mt-3 border-t border-gray-100 pt-3">
                            حصة رسوم الإدارة الفعلية لهذا الشهر
                        </p>
                    </motion.div>

                    {/* KPI 2: Performance Cash */}
                    <motion.div 
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.05 }}
                        className="bg-white hover:border-[#4A2C5A]/45 border border-gray-200/60 rounded-3xl p-6 sm:p-7 shadow-sm transition-all duration-300 relative overflow-hidden group text-right"
                        id="kpi-performance-cash-ar"
                    >
                        <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/5 blur-2xl rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                        <div className="mb-4 text-right">
                            <p className="text-gray-400 text-xs font-bold uppercase">نقد التسويق بالأداء</p>
                        </div>
                        <p className="text-3xl sm:text-4xl font-bold text-[#4A2C5A]">
                            {formatSAR_Ar(SYNC_DATA.heroKPIs.performanceCash)}
                        </p>
                        <p className="text-xs text-[#4A2C5A] font-bold mt-3 border-t border-gray-100 pt-3 flex items-center justify-between flex-row-reverse">
                            <span>نسبة المساهمة</span>
                            <span>{SYNC_DATA.heroKPIs.performanceCashPct.toLocaleString('ar-SA')}%</span>
                        </p>
                    </motion.div>

                    {/* KPI 3: LTV */}
                    <motion.div 
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.1 }}
                        className="bg-white hover:border-[#4A2C5A]/45 border border-gray-200/60 rounded-3xl p-6 sm:p-7 shadow-sm transition-all duration-300 relative overflow-hidden group text-right"
                        id="kpi-ltv-ar"
                    >
                        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 blur-2xl rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                        <div className="mb-4 text-right">
                            <p className="text-gray-400 text-xs font-bold uppercase">إجمالي الـ LTV المحققة</p>
                        </div>
                        <p className="text-3xl sm:text-4xl font-bold text-gray-950">
                            {formatSAR_Ar(SYNC_DATA.heroKPIs.totalLtvGenerated)}
                        </p>
                        <p className="text-xs text-emerald-650 font-bold mt-3 border-t border-gray-100 pt-3">
                            القيمة التعاقدية المستقبلية الملتزم بها
                        </p>
                    </motion.div>

                    {/* KPI 4: Bookings Breakdown */}
                    <motion.div 
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.15 }}
                        className="bg-[#1D1D1F] border border-white/5 rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden text-white text-right"
                        id="kpi-bookings-split-ar"
                    >
                        <div className="flex justify-between items-start mb-3 flex-row-reverse">
                            <p className="text-gray-400 text-xs font-bold">توزيع الحجوزات</p>
                            <span className="px-2.5 py-0.5 bg-white/10 text-white text-[9px] font-bold rounded-full font-mono">
                                الإجمالي: {(SYNC_DATA.heroKPIs.approvedCount + SYNC_DATA.heroKPIs.cancelledCount + SYNC_DATA.heroKPIs.renewalCount).toLocaleString('ar-SA')}
                            </span>
                        </div>
                        <div className="flex items-baseline gap-2 mt-1 justify-start">
                            <span className="text-3xl sm:text-4xl font-bold text-white">{(SYNC_DATA.heroKPIs.approvedCount).toLocaleString('ar-SA')}</span>
                            <span className="text-xs text-gray-400 font-bold">/ {(SYNC_DATA.heroKPIs.cancelledCount).toLocaleString('ar-SA')} / {(SYNC_DATA.heroKPIs.renewalCount).toLocaleString('ar-SA')}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1 text-[10px] text-gray-400 font-bold border-t border-white/10 pt-4 mt-4 text-center">
                            <div>
                                <span className="block text-emerald-400 text-sm font-bold">{(SYNC_DATA.heroKPIs.approvedCount).toLocaleString('ar-SA')}</span>
                                مقبول
                            </div>
                            <div>
                                <span className="block text-red-400 text-sm font-bold">{(SYNC_DATA.heroKPIs.cancelledCount).toLocaleString('ar-SA')}</span>
                                ملغى
                            </div>
                            <div>
                                <span className="block text-gray-450 text-sm font-bold">{(SYNC_DATA.heroKPIs.renewalCount).toLocaleString('ar-SA')}</span>
                                تجديد
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* KPI CAPTION */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-10 sm:mb-12 bg-[#4A2C5A]/5 border border-[#4A2C5A]/15 rounded-2xl p-4 flex items-start shadow-inner text-right"
                >
                    <p className="text-xs sm:text-sm text-[#4A2C5A] leading-relaxed font-semibold">
                        <strong>تصحيح مقارنة بالتقرير السابق:</strong> يتم الآن الإبلاغ عن إيرادات يونيو على أساس <strong>النقد المحصل فعلياً (رسوم الإدارة لشهر واحد)</strong> بدلاً من كامل مدة العقد. القيمة الإجمالية التعاقدية المستقبلية يتم توضيحها الآن بشكل منفصل كـ <strong>LTV</strong>.
                    </p>
                </motion.div>

                {/* SECTION 2 & 3: JUNE CASH SPLITS & HALO EFFECT */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10 sm:mb-12">
                    
                    {/* SECTION 2: PERFORMANCE vs OTHER */}
                    <motion.div 
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="lg:col-span-6 bg-white border border-gray-200/60 rounded-[2rem] p-6 sm:p-8 shadow-sm flex flex-col justify-between"
                        id="performance-vs-other-card-ar"
                    >
                        <div>
                            <div className="mb-4 text-right">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">نقد يونيو: التسويق بالأداء مقابل المصادر الأخرى</h2>
                                <p className="text-xs text-gray-400 font-bold mt-1">تحليل الأداء حسب قنوات الاستقطاب</p>
                            </div>

                            {/* Donut Chart Block */}
                            <div className="h-64 w-full relative my-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={sourceChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={100}
                                            paddingAngle={4}
                                            dataKey="value"
                                        >
                                            {sourceChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                                    <span className="text-xl sm:text-2xl font-bold text-gray-950">{formatSAR_Ar(SYNC_DATA.heroKPIs.juneCashCollected)}</span>
                                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">إجمالي النقد المحصل</span>
                                </div>
                            </div>

                            {/* Source Table */}
                            <div className="overflow-hidden border border-gray-100 rounded-2xl mt-4 text-right">
                                <table className="min-w-full divide-y divide-gray-100 text-right text-xs sm:text-sm" dir="rtl">
                                    <thead className="bg-gray-55 text-gray-500 font-bold">
                                        <tr>
                                            <th className="py-2.5 px-4 font-semibold text-gray-655">المصدر</th>
                                            <th className="py-2.5 px-4 text-left font-semibold text-gray-655">نقد يونيو</th>
                                            <th className="py-2.5 px-4 text-left font-semibold text-gray-655">% من النقد</th>
                                            <th className="py-2.5 px-4 text-left font-semibold text-gray-655">إجمالي LTV</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 font-medium text-gray-750">
                                        {SYNC_DATA.sourceBreakdown.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-gray-55">
                                                <td className="py-3 px-4 flex items-center gap-2 justify-start">
                                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                                    {item.source_ar}
                                                </td>
                                                <td className="py-3 px-4 text-left font-mono font-bold text-gray-950">{formatSAR_Ar(item.juneCash)}</td>
                                                <td className="py-3 px-4 text-left text-gray-450 font-mono">{item.pctOfCash.toLocaleString('ar-SA')}%</td>
                                                <td className="py-3 px-4 text-left font-mono text-gray-955">{formatSAR_Ar(item.ltv)}</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-gray-50/70 font-bold text-gray-950">
                                            <td className="py-3 px-4">الإجمالي</td>
                                            <td className="py-3 px-4 text-left font-mono">{formatSAR_Ar(SYNC_DATA.heroKPIs.juneCashCollected)}</td>
                                            <td className="py-3 px-4 text-left font-mono">١٠٠%</td>
                                            <td className="py-3 px-4 text-left font-mono">{formatSAR_Ar(SYNC_DATA.heroKPIs.totalLtvGenerated)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Caption block */}
                        <div className="mt-6 bg-gray-55 border border-gray-100 rounded-2xl p-4 text-right">
                            <p className="text-xs text-gray-500 leading-relaxed font-semibold italic">
                                &ldquo;يدفع التسويق بالأداء غالبية النقد المحصل هذا الشهر. لاحظ الانعكاس في قيمة LTV، حيث تحتفظ المصادر الأخرى بقيمة مستقبلية أكبر، لأن العديد من العقود الطويلة التي تصل إلى ١٢ شهراً (الإحالات، المنصات العقارية، والمستأجرون الحاليون) تقع ضمن 'المصادر الأخرى'، في حين تميل صفقات شبكات التواصل الاجتماعي المدفوعة إلى الإقامات القصيرة التي تتراوح بين شهر وشهرين.&rdquo;
                            </p>
                        </div>
                    </motion.div>

                    {/* SECTION 3: DIRECT vs INDIRECT (Spillover Effect) */}
                    <motion.div 
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="lg:col-span-6 bg-gradient-to-br from-indigo-50/10 via-white to-purple-50/10 border border-[#4A2C5A]/15 rounded-[2rem] p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden text-right"
                        id="direct-vs-indirect-card-ar"
                    >
                        {/* Colorful Top Border Accent */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400" />
                        
                        <div>
                            <div className="mb-4 text-right">
                                <span className="text-[10px] font-bold tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md inline-block">
                                    قنوات إسناد المبيعات
                                </span>
                                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-950 mt-2">الإسناد المباشر مقابل غير المباشر (التأثير الجانبي)</h2>
                            </div>

                            {/* Direct VS Indirect mini chart */}
                            <div className="h-64 w-full relative my-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={directIndirectChartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={100}
                                            paddingAngle={4}
                                            dataKey="value"
                                        >
                                            {directIndirectChartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                                    <span className="text-xl sm:text-2xl font-extrabold text-[#4A2C5A]">{formatSAR_Ar(SYNC_DATA.heroKPIs.performanceCash)}</span>
                                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">نقد الأداء</span>
                                </div>
                            </div>

                            {/* Direct vs Indirect Table */}
                            <div className="overflow-hidden border border-gray-100 rounded-2xl mt-4 bg-white shadow-sm text-right">
                                <table className="min-w-full divide-y divide-gray-100 text-right text-xs sm:text-sm" dir="rtl">
                                    <thead className="bg-gradient-to-l from-gray-50 to-indigo-50/10 text-gray-500 font-bold">
                                        <tr>
                                            <th className="py-3 px-4 font-bold text-gray-700">نوع الإسناد</th>
                                            <th className="py-3 px-4 text-left font-bold text-gray-700">نقد يونيو</th>
                                            <th className="py-3 px-4 text-left font-bold text-gray-700">% من نقد الأداء</th>
                                            <th className="py-3 px-4 text-left font-bold text-gray-700">LTV</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 font-medium text-gray-750">
                                        {SYNC_DATA.directIndirectBreakdown.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-indigo-50/20 transition-colors duration-150">
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-2 justify-start">
                                                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                                        <span className="font-bold text-gray-900">{item.type_ar.split(' ')[0]}</span>
                                                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                                                            item.type.includes('live') 
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50' 
                                                                : 'bg-slate-50 text-slate-500 border border-slate-200/50'
                                                        }`}>
                                                            {item.type.includes('live') ? 'حملة نشطة' : 'بدون حملة'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 text-left font-mono font-bold text-gray-950">{formatSAR_Ar(item.juneCash)}</td>
                                                <td className="py-3.5 px-4 text-left text-indigo-600 font-mono font-bold">{item.pctOfPerfCash.toLocaleString('ar-SA')}%</td>
                                                <td className="py-3.5 px-4 text-left font-mono font-bold text-gray-955">{formatSAR_Ar(item.ltv)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>

                </div>

                {/* SECTION 4: JULY-START BOOKINGS (FUTURE PIPELINE) */}
                <motion.div 
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-white border border-gray-200/60 rounded-[2rem] p-6 sm:p-8 shadow-sm mb-10 sm:mb-12 text-right"
                    id="july-bookings-card-ar"
                >
                    <div className="flex flex-col sm:flex-row-reverse sm:items-center justify-between gap-3 mb-6">
                        <div className="text-right">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950">حجوزات تبدأ في يوليو (قناة التدفق المستقبلي)</h2>
                            <p className="text-xs text-gray-400 font-bold mt-0.5">حجوزات تم كسبها في يونيو ولكن يبدأ تسجيل دخولها في يوليو (تحصل ٠ ريال في يونيو)</p>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold px-4 py-2 rounded-2xl self-start sm:self-auto font-mono">
                            إجمالي LTV التدفق المستقبلي: {formatSAR_Ar(SYNC_DATA.julyStartLtvTotal)}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {SYNC_DATA.julyStartBookings.map((booking, idx) => (
                            <div key={idx} className="bg-gray-55 border border-gray-100 rounded-2xl p-4 flex flex-col justify-between hover:shadow-inner transition-all text-right">
                                <div className="flex justify-between items-start mb-2 flex-row-reverse">
                                    <h4 className="text-xs font-bold text-gray-855">{booking.name_ar}</h4>
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#4A2C5A]/10 text-[#4A2C5A] rounded-md font-mono">{booking.branch}</span>
                                </div>
                                <div className="flex justify-between items-baseline pt-2 border-t border-gray-100 flex-row-reverse">
                                    <span className="text-[10px] text-gray-400 font-bold">LTV العقد</span>
                                    <span className="text-xs font-bold text-gray-900 font-mono">{formatSAR_Ar(booking.ltv)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-[11px] text-gray-450 mt-4 italic font-bold text-center uppercase tracking-wider">
                        تنويه: تساهم هذه الحجوزات السبعة بـ ٠ ريال في النقد الفعلي المحصل في يونيو ولكنها تحقق قيمة تعاقدية مستقبلية هامة مسجلة في مجاميع LTV.
                    </p>
                </motion.div>

                {/* SECTION 5: CUSTOMER PAYMENTS STATUS & AUDIT */}
                <motion.div 
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-white border border-gray-200/60 rounded-[2rem] p-6 sm:p-8 shadow-sm mb-10 sm:mb-12 text-right"
                    id="customer-payments-card-ar"
                >
                    <div className="flex flex-col xl:flex-row-reverse xl:items-center justify-between gap-4 mb-6">
                        <div className="text-right">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950">حالة دفع العملاء والتدقيق المالي</h2>
                            <p className="text-xs text-gray-400 font-bold mt-0.5">تفصيل حالة التحصيل والتدفّق لمستحقات وحصّة مثوى التسويقيّة لـ ٤٨ عميلاً</p>
                        </div>
                    </div>

                    {/* Payment KPIs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
                        {/* KPI 1: Collected */}
                        <div className="bg-emerald-50/50 border border-emerald-100/70 p-5 rounded-2xl">
                            <p className="text-xs font-bold text-emerald-700">المبالغ المحصلة (إيجارات)</p>
                            <p className="text-2xl font-bold text-emerald-800 mt-1 font-mono">{formatSAR_Ar(paymentMetrics.paidRent)}</p>
                            <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-emerald-100/40 text-xs font-semibold text-emerald-700 flex-row-reverse">
                                <span>حصة إدارة مثوى المحصلة</span>
                                <span className="font-mono">{formatSAR_Ar(paymentMetrics.paidMathwaa)}</span>
                            </div>
                        </div>

                        {/* KPI 2: Pending */}
                        <div className="bg-amber-50/50 border border-amber-100/70 p-5 rounded-2xl">
                            <p className="text-xs font-bold text-amber-700">المبالغ المعلقة بانتظار السداد</p>
                            <p className="text-2xl font-bold text-amber-800 mt-1 font-mono">{formatSAR_Ar(paymentMetrics.pendingRent)}</p>
                            <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-amber-100/40 text-xs font-semibold text-amber-700 flex-row-reverse">
                                <span>حصة إدارة مثوى المعلقة</span>
                                <span className="font-mono">{formatSAR_Ar(paymentMetrics.pendingMathwaa)}</span>
                            </div>
                        </div>

                        {/* KPI 3: Count & Ratio */}
                        <div className="bg-indigo-50/40 border border-indigo-100/60 p-5 rounded-2xl flex flex-col justify-between">
                            <div>
                                <p className="text-xs font-bold text-indigo-700">نسبة العملاء المسددين</p>
                                <p className="text-2xl font-bold text-indigo-800 mt-1 font-mono">
                                    {paymentMetrics.paidCount.toLocaleString('ar-SA')} <span className="text-xs text-indigo-500">من أصل {paymentMetrics.totalCount.toLocaleString('ar-SA')}</span>
                                </p>
                            </div>
                            <div className="mt-3">
                                <div className="w-full bg-indigo-100/70 rounded-full h-1.5 overflow-hidden">
                                    <div 
                                        className="bg-indigo-650 h-1.5 rounded-full" 
                                        style={{ width: `${(paymentMetrics.paidCount / paymentMetrics.totalCount) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters & Search for Payments */}
                    <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-4 mb-6 p-4 bg-gray-55 rounded-2xl border border-gray-100" dir="rtl">
                        <div className="w-full md:w-72 relative">
                            <input 
                                type="text" 
                                placeholder="ابحث باسم العميل أو الفرع..." 
                                value={paymentSearch}
                                onChange={(e) => setPaymentSearch(e.target.value)}
                                className="w-full text-xs sm:text-sm px-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-[#4A2C5A] transition-all text-right"
                            />
                        </div>

                        <div className="flex gap-2 w-full md:w-auto">
                            <button 
                                onClick={() => setPaymentFilter('all')}
                                className={`flex-1 md:flex-none text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                                    paymentFilter === 'all' 
                                        ? 'bg-[#4A2C5A] text-white' 
                                        : 'bg-white text-gray-650 hover:bg-gray-100 border border-gray-200'
                                }`}
                            >
                                الكل ({paymentMetrics.totalCount.toLocaleString('ar-SA')})
                            </button>
                            <button 
                                onClick={() => setPaymentFilter('paid')}
                                className={`flex-1 md:flex-none text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                                    paymentFilter === 'paid' 
                                        ? 'bg-emerald-600 text-white' 
                                        : 'bg-white text-gray-650 hover:bg-gray-100 border border-gray-200'
                                }`}
                            >
                                مؤكد / مسدد ({paymentMetrics.paidCount.toLocaleString('ar-SA')})
                            </button>
                            <button 
                                onClick={() => setPaymentFilter('unpaid')}
                                className={`flex-1 md:flex-none text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                                    paymentFilter === 'unpaid' 
                                        ? 'bg-amber-600 text-white' 
                                        : 'bg-white text-gray-650 hover:bg-gray-100 border border-gray-200'
                                }`}
                            >
                                معلق / متوقف ({(paymentMetrics.totalCount - paymentMetrics.paidCount).toLocaleString('ar-SA')})
                            </button>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto -mx-6 sm:-mx-8">
                        <div className="inline-block min-w-full align-middle px-6 sm:px-8">
                            <table className="min-w-full divide-y divide-gray-100 text-right text-xs sm:text-sm" dir="rtl">
                                <thead className="bg-gray-55 text-gray-500 font-bold uppercase tracking-wider select-none">
                                    <tr>
                                        <th className="py-3 px-4 text-right">العميل</th>
                                        <th className="py-3 px-4 text-center">الفرع</th>
                                        <th className="py-3 px-4 text-left">قيمة الدفع (الإيجار)</th>
                                        <th className="py-3 px-4 text-left">حصة مثوى (الإدارة)</th>
                                        <th className="py-3 px-4 text-right">حالة السداد / موضع التوقف</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white font-medium text-gray-700">
                                    {filteredPayments.map((p, idx) => (
                                        <tr key={idx} className="hover:bg-gray-55/65 transition-colors duration-150">
                                            <td className="py-3.5 px-4 font-bold text-gray-900 text-right">
                                                <div>{p.inputName}</div>
                                                <div className="text-[10px] text-gray-400 font-normal">{p.matchedNameAr} / {p.matchedName}</div>
                                            </td>
                                            <td className="py-3.5 px-4 text-center font-mono font-bold text-gray-500">
                                                <span className="px-2 py-0.5 bg-gray-100 border border-gray-200/50 rounded-md">
                                                    {p.branch}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-left font-mono font-bold text-gray-900">
                                                {formatSAR_Ar(p.rent)}
                                            </td>
                                            <td className="py-3.5 px-4 text-left font-mono font-bold text-[#4A2C5A]">
                                                {formatSAR_Ar(p.juneCash)}
                                            </td>
                                            <td className="py-3.5 px-4 text-right">
                                                {p.status === 'Confirmed' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold rounded-full">
                                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                                        مؤكد / مسدد
                                                    </span>
                                                ) : (
                                                    <div className="space-y-1">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full ${
                                                            p.status === 'Due July'
                                                                ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                                                : p.status === 'Pending Approval'
                                                                ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                                                : p.status === 'Facing Issue'
                                                                ? 'bg-red-50 text-red-700 border border-red-100'
                                                                : 'bg-rose-50 text-rose-700 border border-rose-100'
                                                        }`}>
                                                            <span className={`w-1.5 h-1.5 rounded-full ${
                                                                p.status === 'Due July' ? 'bg-blue-500' : p.status === 'Pending Approval' ? 'bg-amber-500' : 'bg-rose-500'
                                                            }`} />
                                                            {p.status_ar}
                                                        </span>
                                                        {p.reason_ar && (
                                                            <div className="text-[10px] text-gray-400 font-semibold leading-relaxed mr-2">
                                                                ← متوقف بسبب: {p.reason_ar}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredPayments.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-gray-400 font-bold">
                                                لا توجد نتائج تطابق خيارات البحث الفرديّة
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>

                {/* SECTION 6: ALL BOOKINGS LEDGER */}
                <motion.div 
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-white border border-gray-200/60 rounded-[2rem] p-6 sm:p-8 shadow-sm mb-10 sm:mb-12 text-right"
                    id="bookings-ledger-card-ar"
                >
                    <div className="flex flex-col xl:flex-row-reverse xl:items-center justify-between gap-4 mb-6">
                        <div className="text-right">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950">دفتر سجل الحجوزات الشامل</h2>
                            <p className="text-xs text-gray-400 font-bold mt-0.5">سجل تدقيق كامل لكافة الحجوزات الـ ٥٢ خلال الفترة من ١ إلى ٢٨ يونيو ٢٠٢٦</p>
                        </div>

                        {/* Dynamic Counter */}
                        <div className="text-xs font-bold text-[#4A2C5A] bg-[#4A2C5A]/5 px-3.5 py-2 rounded-xl self-start xl:self-auto">
                            يتم عرض {filteredAndSortedBookings.length} من أصل ٥٢ حجزاً
                        </div>
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-6 p-4 bg-gray-55 rounded-2xl border border-gray-100" dir="rtl">
                        {/* Search */}
                        <div className="relative text-right">
                            <input 
                                type="text" 
                                placeholder="ابحث بالاسم، القناة الإعلانية..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full text-xs sm:text-sm px-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-[#4A2C5A] transition-all text-right"
                            />
                        </div>

                        {/* Attribution Filter */}
                        <select 
                            value={attributionFilter}
                            onChange={(e) => setAttributionFilter(e.target.value)}
                            className="text-xs sm:text-sm px-3 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-[#4A2C5A] transition-all"
                        >
                            <option value="all">كل قنوات الإسناد</option>
                            <option value="Performance/Direct">الأداء المباشر</option>
                            <option value="Performance/Indirect">الأداء غير المباشر</option>
                            <option value="Other">مصادر أخرى</option>
                            <option value="Performance">أداء عام</option>
                        </select>

                        {/* Status Filter */}
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="text-xs sm:text-sm px-3 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-[#4A2C5A] transition-all"
                        >
                            <option value="all">كل الحالات تعاقدياً</option>
                            <option value="Approved">مقبول</option>
                            <option value="Cancelled">ملغى</option>
                            <option value="Renewal">تجديد</option>
                        </select>

                        {/* Branch Filter */}
                        <select 
                            value={branchFilter}
                            onChange={(e) => setBranchFilter(e.target.value)}
                            className="text-xs sm:text-sm px-3 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-[#4A2C5A] transition-all"
                        >
                            <option value="all">كل الفروع</option>
                            {uniqueBranches.map(branch => (
                                <option key={branch} value={branch}>{branch}</option>
                            ))}
                        </select>

                        {/* Reset Buttons */}
                        <button 
                            onClick={() => {
                                setSearchTerm('');
                                setStatusFilter('all');
                                setAttributionFilter('all');
                                setBranchFilter('all');
                                setSortField('id');
                                setSortDirection('asc');
                            }}
                            className="text-xs font-bold py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-all"
                        >
                            إعادة تعيين المرشحات
                        </button>
                    </div>

                    {/* Bookings Ledger Table */}
                    <div className="overflow-x-auto -mx-6 sm:-mx-8">
                        <div className="inline-block min-w-full align-middle px-6 sm:px-8">
                            <table className="min-w-full divide-y divide-gray-100 text-right text-xs sm:text-sm" dir="rtl">
                                <thead className="bg-gray-55 text-gray-500 font-bold uppercase tracking-wider select-none">
                                    <tr>
                                        <th onClick={() => toggleSort('id')} className="py-3.5 px-3 cursor-pointer hover:bg-gray-100/50 transition-colors">
                                            # {sortField === 'id' && (sortDirection === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th onClick={() => toggleSort('name_ar')} className="py-3.5 px-3 cursor-pointer hover:bg-gray-100/50 transition-colors">
                                            الاسم {sortField === 'name_ar' && (sortDirection === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th onClick={() => toggleSort('branch')} className="py-3.5 px-3 cursor-pointer hover:bg-gray-100/50 transition-colors">
                                            الفرع {sortField === 'branch' && (sortDirection === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th onClick={() => toggleSort('location_ar')} className="py-3.5 px-3 cursor-pointer hover:bg-gray-100/50 transition-colors">
                                            الموقع {sortField === 'location_ar' && (sortDirection === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th onClick={() => toggleSort('monthlyRent')} className="py-3.5 px-3 text-left cursor-pointer hover:bg-gray-100/50 transition-colors">
                                            الإيجار الشهري {sortField === 'monthlyRent' && (sortDirection === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th onClick={() => toggleSort('channel_ar')} className="py-3.5 px-3 cursor-pointer hover:bg-gray-100/50 transition-colors">
                                            القناة {sortField === 'channel_ar' && (sortDirection === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th onClick={() => toggleSort('attribution')} className="py-3.5 px-3 cursor-pointer hover:bg-gray-100/50 transition-colors">
                                            الإسناد {sortField === 'attribution' && (sortDirection === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th onClick={() => toggleSort('status')} className="py-3.5 px-3 cursor-pointer hover:bg-gray-100/50 transition-colors">
                                            الحالة {sortField === 'status' && (sortDirection === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th onClick={() => toggleSort('checkIn')} className="py-3.5 px-3 cursor-pointer hover:bg-gray-100/50 transition-colors">
                                            الدخول {sortField === 'checkIn' && (sortDirection === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th onClick={() => toggleSort('juneCash')} className="py-3.5 px-3 text-left cursor-pointer hover:bg-gray-100/50 transition-colors">
                                            نقد يونيو {sortField === 'juneCash' && (sortDirection === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th onClick={() => toggleSort('ltv')} className="py-3.5 px-3 text-left cursor-pointer hover:bg-gray-100/50 transition-colors">
                                            LTV {sortField === 'ltv' && (sortDirection === 'asc' ? '▲' : '▼')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                                    <AnimatePresence>
                                        {filteredAndSortedBookings.map((booking, index) => {
                                            // Conditional styling for statuses
                                            let bgClass = "hover:bg-gray-50/50 transition-colors";
                                            let statusBadgeClass = "px-2 py-0.5 rounded-full text-[10px] font-bold inline-block";
                                            
                                            if (booking.status === 'Cancelled') {
                                                bgClass = "bg-red-50/40 hover:bg-red-50/60 transition-colors text-gray-500";
                                                statusBadgeClass = "px-2 py-0.5 rounded-full text-[10px] font-bold inline-block bg-red-100 text-red-700";
                                            } else if (booking.status === 'Renewal') {
                                                bgClass = "bg-gray-100/40 hover:bg-gray-100/60 transition-colors text-gray-500";
                                                statusBadgeClass = "px-2 py-0.5 rounded-full text-[10px] font-bold inline-block bg-gray-200 text-gray-700";
                                            } else {
                                                statusBadgeClass = "px-2 py-0.5 rounded-full text-[10px] font-bold inline-block bg-emerald-100 text-emerald-800";
                                            }

                                            return (
                                                <tr key={booking.id} className={bgClass}>
                                                    <td className="py-3 px-3 text-gray-400 font-mono text-[11px]">{booking.id}</td>
                                                    <td className="py-3 px-3 font-bold text-gray-900">{booking.name_ar}</td>
                                                    <td className="py-3 px-3 font-mono text-[11px] text-[#4A2C5A]">{booking.branch}</td>
                                                    <td className="py-3 px-3 text-gray-500">{booking.location_ar}</td>
                                                    <td className="py-3 px-3 text-left font-mono text-gray-600">{booking.monthlyRent.toLocaleString('ar-SA')}</td>
                                                    <td className="py-3 px-3 text-gray-500 text-[11px]">{booking.channel_ar}</td>
                                                    <td className="py-3 px-3">
                                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                                            booking.attribution.includes('Direct') ? 'bg-[#4A2C5A]/15 text-[#4A2C5A]' : 
                                                            booking.attribution.includes('Indirect') ? 'bg-purple-100 text-purple-700' :
                                                            booking.attribution === 'Other' ? 'bg-gray-100 text-gray-600' :
                                                            'bg-[#4A2C5A]/10 text-[#4A2C5A]'
                                                        }`}>
                                                            {booking.attribution_ar}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-3">
                                                        <span className={statusBadgeClass}>{booking.status_ar}</span>
                                                    </td>
                                                    <td className="py-3 px-3 text-gray-500 font-mono text-[11px]">{booking.checkIn_ar}</td>
                                                    <td className="py-3 px-3 text-left font-mono font-bold text-gray-950">
                                                        {booking.juneCash === 0 ? '-' : formatSAR_Ar(booking.juneCash)}
                                                    </td>
                                                    <td className="py-3 px-3 text-left font-mono font-bold text-[#4A2C5A]">
                                                        {booking.ltv === 0 ? '-' : formatSAR_Ar(booking.ltv)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </AnimatePresence>
                                    {filteredAndSortedBookings.length === 0 && (
                                        <tr>
                                            <td colSpan={11} className="py-8 text-center text-gray-400 font-bold uppercase tracking-wider">
                                                لا توجد نتائج تطابق مرشحات البحث النشطة
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>

                {/* SECTION 7: FOOTER */}
                <motion.footer 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-16 text-center border-t border-gray-200/60 pt-10 px-4"
                >
                    <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed max-w-4xl mx-auto">
                        مثوى : تقرير إيرادات تسويق شهر يونيو · الفترة من ١ إلى ٢٨ يونيو ٢٠٢٦ · الإيراد يمثل حصة شركة مثوى من رسوم الإدارة على أساس النقد المحصل (شهر واحد)، وتوضح الـ LTV القيمة المستقبلية التعاقدية الكاملة. الأرقام مدققة من سجلات المبيعات.
                    </p>
                </motion.footer>

                {/* Formulas Modal */}
                <AnimatePresence>
                    {showFormulasModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            {/* Backdrop */}
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowFormulasModal(false)}
                                className="fixed inset-0 bg-gray-950/40 backdrop-blur-sm"
                            />
                            {/* Modal Body */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl max-w-2xl w-full border border-gray-100 overflow-y-auto max-h-[90vh] z-10 text-right"
                                dir="rtl"
                            >
                                {/* Close Button */}
                                <button 
                                    onClick={() => setShowFormulasModal(false)}
                                    className="absolute top-4 left-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                <h3 className="text-xl font-bold text-gray-950 mb-6">معادلات العائد على الاستثمار وتدقيق الحسابات</h3>
                                
                                <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
                                    <p>
                                        تقيس مؤشرات العائد على الاستثمار (ROI) الأداء التسويقي بناءً على أساسين مختلفين للعائد المحقق من حجوزات شهر يونيو:
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-55 p-4 rounded-2xl border border-gray-100 text-right">
                                        <div>
                                            <span className="text-xs font-bold text-gray-400 uppercase">أ. أساس نقد يونيو المحصل</span>
                                            <p className="font-extrabold text-gray-950 font-mono text-base mt-1">٢٤,٤٣١.٥٠ ريال</p>
                                            <p className="text-xs text-gray-500 mt-1">حصة مثوى من رسوم الإدارة المحصلة فعلياً خلال شهر يونيو من القنوات المباشرة وغير المباشرة.</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-gray-400 uppercase">ب. أساس القيمة التعاقدية (LTV)</span>
                                            <p className="font-extrabold text-gray-950 font-mono text-base mt-1">١٠١,٧٦٢.٠٠ ريال</p>
                                            <p className="text-xs text-gray-500 mt-1">إجمالي الإيرادات المستقبلية المتوقعة من حصة مثوى طوال دورة حياة العميل الملتزم بها تعاقدياً.</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-5 space-y-4">
                                        <h4 className="font-bold text-gray-950 text-base">النموذج الأول: العائد على الإعلانات المدفوعة فقط</h4>
                                        <p className="text-xs text-gray-500 font-semibold">يقيم الإنفاق الإعلاني الصافي البالغ <strong className="text-gray-900 font-bold">١٣,٥٩٤ ريال</strong> (ميتا: ٤,٨٣ ك + تيك توك: ٨,٧٥٨ ريال).</p>
                                        <div className="space-y-3 font-mono text-xs bg-gray-55 border border-gray-100 p-3.5 rounded-xl">
                                            <div className="flex justify-between items-center py-1.5 border-b border-gray-100 flex-row-reverse">
                                                <span className="text-gray-500">عائد كاش يونيو المحصل</span>
                                                <span className="font-bold text-gray-900">24,431.5 / 13,594 = 1.80x</span>
                                            </div>
                                            <div className="flex justify-between items-center py-1.5 flex-row-reverse">
                                                <span className="text-gray-500">عائد القيمة التعاقدية المستقبلية (LTV)</span>
                                                <span className="font-bold text-[#4A2C5A]">101,762 / 13,594 = 7.49x</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-5 space-y-4">
                                        <h4 className="font-bold text-gray-950 text-base">النموذج الثاني: العائد على الإنفاق التسويقي الإجمالي</h4>
                                        <p className="text-xs text-gray-500 font-semibold">يقيم الإنفاق التسويقي الكلي البالغ <strong className="text-gray-900 font-bold">١٤,٠٩٤ ريال</strong> (الإعلانات: ١٣,٥٩٤ ريال + صناعة المحتوى: ٥٠٠ ريال).</p>
                                        <div className="space-y-3 font-mono text-xs bg-gray-55 border border-gray-100 p-3.5 rounded-xl">
                                            <div className="flex justify-between items-center py-1.5 border-b border-gray-100 flex-row-reverse">
                                                <span className="text-gray-500">عائد كاش يونيو المحصل</span>
                                                <span className="font-bold text-gray-900">24,431.5 / 14,094 = 1.73x</span>
                                            </div>
                                            <div className="flex justify-between items-center py-1.5 flex-row-reverse">
                                                <span className="text-gray-500">عائد القيمة التعاقدية المستقبلية (LTV)</span>
                                                <span className="font-bold text-emerald-600">101,762 / 14,094 = 7.22x</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

            </main>
        </div>
    );
};

export default App_ar;
