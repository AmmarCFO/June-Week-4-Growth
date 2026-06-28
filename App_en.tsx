import React, { useState, useMemo } from 'react';
import { BOOKINGS, SYNC_DATA, Booking } from './constants';
import { CUSTOMER_PAYMENTS, CustomerPayment } from './payments_data';
import Header from './components/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

// Custom formatters
const formatSAR = (value: number) => {
    return `SAR ${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: value % 1 === 0 ? 0 : 2 })}`;
};

const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } 
    }
};

const App_en: React.FC<{ onToggleLanguage: () => void }> = ({ onToggleLanguage }) => {
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
                booking.name.toLowerCase().includes(query) ||
                booking.branch.toLowerCase().includes(query) ||
                booking.location.toLowerCase().includes(query) ||
                booking.channel.toLowerCase().includes(query)
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
        name: item.source,
        value: item.juneCash,
        ltv: item.ltv,
        color: item.color
    }));

    // Direct VS Indirect chart data
    const directIndirectChartData = SYNC_DATA.directIndirectBreakdown.map(item => ({
        name: item.type.split(' ')[0],
        value: item.juneCash,
        ltv: item.ltv,
        color: item.color
    }));

    return (
        <div className="min-h-screen pb-20 selection:bg-[#4A2C5A] selection:text-white bg-[#F5F5F7] font-sans antialiased">
            <Header onToggleLanguage={onToggleLanguage} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Hero Title Block */}
                <div className="mb-10 sm:mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
                    >
                        <div>
                            <span className="text-xs sm:text-sm font-bold tracking-widest text-[#4A2C5A] uppercase bg-[#4A2C5A]/10 px-3 py-1 rounded-full">
                                Executive Performance Report
                            </span>
                            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-950 tracking-tight mt-3">
                                Mathwaa June <span className="text-[#4A2C5A]">Marketing Revenue</span>
                            </h1>
                            <p className="text-sm sm:text-base text-gray-500 font-medium mt-2">
                                Period: June 1–28, 2026 · Reporting basis: cash collected (1-month management fee) VS future LTV
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-white/70 backdrop-blur border border-gray-200 rounded-2xl px-4 py-3 shadow-sm self-start md:self-auto">
                            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-xs font-semibold text-gray-700 font-mono uppercase tracking-wider">
                                Sales Records Verified
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* SECTION 0: MARKETING INVESTMENT & ROI */}
                <motion.div 
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-[#1E1B24] border border-[#4A2C5A]/25 rounded-[2rem] p-6 sm:p-8 shadow-xl mb-10 sm:mb-12 relative overflow-hidden"
                    id="marketing-spend-roi-dashboard"
                >
                    {/* Decorative subtle ambient background light */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#4A2C5A]/10 blur-3xl rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />

                    {/* Header */}
                    <div className="mb-8 border-b border-white/5 pb-6 relative z-10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <span className="text-xs sm:text-sm font-bold tracking-widest text-purple-300 uppercase bg-purple-500/15 px-3 py-1 rounded-full">
                                    Primary ROI Performance
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3">Marketing Spend & ROI Dashboard</h2>
                                <p className="text-xs text-slate-400 font-semibold mt-0.5">Campaign cost audit & verified ROI ratios evaluation</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => setShowFormulasModal(true)}
                                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-purple-300 hover:bg-white/10 bg-white/5 border border-white/10 rounded-xl transition-all shadow-sm cursor-pointer"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    <span>Formulas</span>
                                </button>
                                <div className="bg-white/10 text-slate-200 border border-white/5 text-xs font-bold px-3 py-2 rounded-xl font-mono">
                                    Audit Base: 1:28 June 2026
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Spend Breakdown Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 relative z-10">
                        <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-5 shadow-sm transition-all hover:bg-white/[0.05]">
                            <p className="text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest mb-1">Meta Ads Spend</p>
                            <p className="text-xl sm:text-2xl font-extrabold text-white font-mono">SAR 4,836</p>
                            <span className="text-[10px] text-indigo-300/60 font-semibold mt-1.5 block">June 1:28 Campaign</span>
                        </div>
                        <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-5 shadow-sm transition-all hover:bg-white/[0.05]">
                            <p className="text-sky-400 text-[10px] font-extrabold uppercase tracking-widest mb-1">TikTok Ads Spend</p>
                            <p className="text-xl sm:text-2xl font-extrabold text-white font-mono">SAR 8,758</p>
                            <span className="text-[10px] text-sky-300/60 font-semibold mt-1.5 block">June 1:28 Campaign</span>
                        </div>
                        <div className="bg-white/[0.03] border border-white/[0.08] rounded-3xl p-5 shadow-sm transition-all hover:bg-white/[0.05]">
                            <p className="text-amber-400 text-[10px] font-extrabold uppercase tracking-widest mb-1">Content Creation</p>
                            <p className="text-xl sm:text-2xl font-extrabold text-white font-mono">SAR 500</p>
                            <span className="text-[10px] text-amber-300/60 font-semibold mt-1.5 block">Creative Production</span>
                        </div>
                        <div className="bg-purple-950/25 border border-[#4A2C5A]/30 rounded-3xl p-5 shadow-sm transition-all hover:bg-purple-950/35 col-span-2 sm:col-span-1">
                            <p className="text-purple-300 text-[10px] font-extrabold uppercase tracking-widest mb-1">Total Paid Ads</p>
                            <p className="text-xl sm:text-2xl font-extrabold text-purple-200 font-mono">SAR 13,594</p>
                            <span className="text-[10px] text-purple-300/60 font-semibold mt-1.5 block">Meta + TikTok Media</span>
                        </div>
                        <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-3xl p-5 shadow-sm transition-all hover:bg-emerald-950/40 col-span-2 sm:col-span-2 lg:col-span-1">
                            <p className="text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest mb-1">Total Marketing Spend</p>
                            <p className="text-xl sm:text-2xl font-extrabold text-emerald-300 font-mono">SAR 14,094</p>
                            <span className="text-[10px] text-emerald-400/60 font-semibold mt-1.5 block">Media + Creative Overhead</span>
                        </div>
                    </div>

                    {/* Unified ROI Ratios Section - Premium & Colorful Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        {/* June Cash Collected ROI Card */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-purple-950/35 via-white/[0.01] to-[#1E1B24] border border-purple-500/20 rounded-[2rem] p-6 sm:p-8 shadow-sm hover:border-purple-500/30 transition-all duration-300">
                            {/* Decorative Top Accent Bar */}
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-[#A855F7]" />
                            
                            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 justify-between">
                                <div className="space-y-3 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-extrabold px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-md font-mono uppercase tracking-wider">Cash Return</span>
                                        <span className="text-[10px] font-extrabold px-2 py-0.5 bg-white/5 text-slate-400 rounded-md font-mono">Spend Base: SAR 14,094</span>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-extrabold text-white">June Cash Collected ROI</h3>
                                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                                        For every <strong className="text-white font-bold">1 SAR</strong> spent on total marketing (media + content overhead), <strong className="text-purple-300 font-extrabold">1.73 SAR</strong> in cash was collected in June (management fee).
                                    </p>
                                    <div className="text-[11px] text-purple-300/80 bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 font-mono">
                                        Calculation: SAR 24,431.5 Cash / SAR 14,094 Spend
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="relative w-36 h-36 rounded-full border-[12px] border-purple-950 border-t-purple-500 flex flex-col items-center justify-center bg-[#15131a] shadow-md hover:scale-105 transition-transform duration-300">
                                        <span className="text-3xl font-black text-purple-300 tracking-tight font-mono">1.73x</span>
                                        <span className="text-[9px] text-slate-400 font-extrabold mt-1 uppercase tracking-widest text-center">Cash ROI</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contract LTV ROI Card */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950/35 via-white/[0.01] to-[#1E1B24] border border-emerald-500/20 rounded-[2rem] p-6 sm:p-8 shadow-sm hover:border-emerald-500/30 transition-all duration-300">
                            {/* Decorative Top Accent Bar */}
                            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />

                            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 justify-between">
                                <div className="space-y-3 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-md font-mono uppercase tracking-wider">Lifecycle LTV</span>
                                        <span className="text-[10px] font-extrabold px-2 py-0.5 bg-white/5 text-slate-400 rounded-md font-mono">Spend Base: SAR 14,094</span>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-extrabold text-white">Contract LTV ROI</h3>
                                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                                        For every <strong className="text-white font-bold">1 SAR</strong> spent on total marketing, <strong className="text-emerald-400 font-extrabold">7.22 SAR</strong> in future contracted Lifetime Value (LTV) was secured.
                                    </p>
                                    <div className="text-[11px] text-emerald-300/80 bg-white/[0.02] border border-white/[0.05] rounded-xl p-3 font-mono">
                                        Calculation: SAR 101,762 LTV / SAR 14,094 Spend
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="relative w-36 h-36 rounded-full border-[12px] border-emerald-950 border-t-emerald-500 flex flex-col items-center justify-center bg-[#15131a] shadow-md hover:scale-105 transition-transform duration-300">
                                        <span className="text-3xl font-black text-emerald-400 tracking-tight font-mono">7.22x</span>
                                        <span className="text-[9px] text-slate-400 font-extrabold mt-1 uppercase tracking-widest text-center">LTV ROI</span>
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
                        className="bg-white hover:border-[#4A2C5A]/45 border border-gray-200/60 rounded-3xl p-6 sm:p-7 shadow-sm transition-all duration-300 relative overflow-hidden group"
                        id="kpi-june-cash"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#4A2C5A]/5 blur-2xl rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                        <div className="mb-4">
                            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">June Cash Collected</p>
                        </div>
                        <p className="text-3xl sm:text-4xl font-bold text-gray-950 tracking-tight">
                            {formatSAR(SYNC_DATA.heroKPIs.juneCashCollected)}
                        </p>
                        <p className="text-xs text-gray-500 font-medium mt-3 border-t border-gray-100 pt-3">
                            Actual management fee this month
                        </p>
                    </motion.div>

                    {/* KPI 2: Performance Cash */}
                    <motion.div 
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.05 }}
                        className="bg-white hover:border-[#4A2C5A]/45 border border-gray-200/60 rounded-3xl p-6 sm:p-7 shadow-sm transition-all duration-300 relative overflow-hidden group"
                        id="kpi-performance-cash"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-2xl rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                        <div className="mb-4">
                            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">Performance Marketing Cash</p>
                        </div>
                        <p className="text-3xl sm:text-4xl font-bold text-[#4A2C5A] tracking-tight">
                            {formatSAR(SYNC_DATA.heroKPIs.performanceCash)}
                        </p>
                        <p className="text-xs text-[#4A2C5A] font-bold mt-3 border-t border-gray-100 pt-3 flex items-center justify-between">
                            <span>Contribution Rate</span>
                            <span>{SYNC_DATA.heroKPIs.performanceCashPct}%</span>
                        </p>
                    </motion.div>

                    {/* KPI 3: LTV */}
                    <motion.div 
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.1 }}
                        className="bg-white hover:border-[#4A2C5A]/45 border border-gray-200/60 rounded-3xl p-6 sm:p-7 shadow-sm transition-all duration-300 relative overflow-hidden group"
                        id="kpi-ltv"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-2xl rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
                        <div className="mb-4">
                            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">Total LTV Generated</p>
                        </div>
                        <p className="text-3xl sm:text-4xl font-bold text-gray-950 tracking-tight">
                            {formatSAR(SYNC_DATA.heroKPIs.totalLtvGenerated)}
                        </p>
                        <p className="text-xs text-emerald-600 font-semibold mt-3 border-t border-gray-100 pt-3">
                            Future contracted cash value
                        </p>
                    </motion.div>

                    {/* KPI 4: Bookings Breakdown */}
                    <motion.div 
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        transition={{ delay: 0.15 }}
                        className="bg-[#1D1D1F] border border-white/5 rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden text-white"
                        id="kpi-bookings-split"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider">Bookings Distribution</p>
                            <span className="px-2.5 py-0.5 bg-white/10 text-white text-[9px] font-bold rounded-full font-mono">
                                Total: {SYNC_DATA.heroKPIs.approvedCount + SYNC_DATA.heroKPIs.cancelledCount + SYNC_DATA.heroKPIs.renewalCount}
                            </span>
                        </div>
                        <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{SYNC_DATA.heroKPIs.approvedCount}</span>
                            <span className="text-xs text-gray-400 font-bold">/ {SYNC_DATA.heroKPIs.cancelledCount} / {SYNC_DATA.heroKPIs.renewalCount}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-1 text-[10px] text-gray-400 font-semibold border-t border-white/10 pt-4 mt-4">
                            <div>
                                <span className="block text-emerald-400 text-sm font-bold">{SYNC_DATA.heroKPIs.approvedCount}</span>
                                Approved
                            </div>
                            <div>
                                <span className="block text-red-400 text-sm font-bold">{SYNC_DATA.heroKPIs.cancelledCount}</span>
                                Cancelled
                            </div>
                            <div>
                                <span className="block text-gray-400 text-sm font-bold">{SYNC_DATA.heroKPIs.renewalCount}</span>
                                Renewals
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* KPI CAPTION */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-10 sm:mb-12 bg-[#4A2C5A]/5 border border-[#4A2C5A]/15 rounded-2xl p-4 flex items-start shadow-inner"
                >
                    <p className="text-xs sm:text-sm text-[#4A2C5A] leading-relaxed font-medium">
                        <strong>Correction vs prior report:</strong> June revenue is now reported on a <strong>cash-collected (one month)</strong> basis rather than full contract duration. The full contracted lifetime duration figure is now transparently reported separately as <strong>LTV</strong>.
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
                        id="performance-vs-other-card"
                    >
                        <div>
                            <div className="mb-4">
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">June Cash: Performance vs Other</h2>
                                <p className="text-xs text-gray-400 font-medium mt-1">Acquisition channels performance breakdown</p>
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
                                        <RechartsTooltip formatter={(val: number) => formatSAR(val)} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-2xl font-bold text-gray-950">{formatSAR(SYNC_DATA.heroKPIs.juneCashCollected)}</span>
                                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Total Cash</span>
                                </div>
                            </div>

                            {/* Source Table */}
                            <div className="overflow-hidden border border-gray-100 rounded-2xl mt-4">
                                <table className="min-w-full divide-y divide-gray-100 text-left text-xs sm:text-sm">
                                    <thead className="bg-gray-55 text-gray-500 font-bold">
                                        <tr>
                                            <th className="py-2.5 px-4 font-semibold text-gray-600">Source</th>
                                            <th className="py-2.5 px-4 text-right font-semibold text-gray-600">June Cash</th>
                                            <th className="py-2.5 px-4 text-right font-semibold text-gray-600">% Cash</th>
                                            <th className="py-2.5 px-4 text-right font-semibold text-gray-600">LTV Generated</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                                        {SYNC_DATA.sourceBreakdown.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50/50">
                                                <td className="py-3 px-4 flex items-center gap-2">
                                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                                    {item.source}
                                                </td>
                                                <td className="py-3 px-4 text-right font-mono font-bold text-gray-900">{formatSAR(item.juneCash)}</td>
                                                <td className="py-3 px-4 text-right text-gray-400 font-mono">{item.pctOfCash}%</td>
                                                <td className="py-3 px-4 text-right font-mono text-gray-900">{formatSAR(item.ltv)}</td>
                                            </tr>
                                        ))}
                                        <tr className="bg-gray-50/70 font-bold text-gray-900">
                                            <td className="py-3 px-4">Total</td>
                                            <td className="py-3 px-4 text-right font-mono">{formatSAR(SYNC_DATA.heroKPIs.juneCashCollected)}</td>
                                            <td className="py-3 px-4 text-right font-mono">100%</td>
                                            <td className="py-3 px-4 text-right font-mono">{formatSAR(SYNC_DATA.heroKPIs.totalLtvGenerated)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Caption block */}
                        <div className="mt-6 bg-gray-50 border border-gray-100 rounded-2xl p-4">
                            <p className="text-xs text-gray-500 leading-relaxed font-medium italic">
                                &ldquo;Performance marketing drives the majority of cash collected this month. Note the flip on LTV &mdash; other sources hold more future value, because many long 12-month contracts (referrals, portals, existing tenants) sit in 'other,' while paid-social wins skew to short 1:2 month stays.&rdquo;
                            </p>
                        </div>
                    </motion.div>

                    {/* SECTION 3: DIRECT vs INDIRECT (Spillover Effect) */}
                    <motion.div 
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="lg:col-span-6 bg-gradient-to-br from-indigo-50/10 via-white to-purple-50/10 border border-[#4A2C5A]/15 rounded-[2rem] p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden"
                        id="direct-vs-indirect-card"
                    >
                        {/* Colorful Top Border Accent */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400" />
                        
                        <div>
                            <div className="mb-4">
                                <span className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                                    Attribution Channels
                                </span>
                                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-950 mt-2">Direct vs Indirect Attribution</h2>
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
                                        <RechartsTooltip formatter={(val: number) => formatSAR(val)} />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-2xl font-extrabold text-[#4A2C5A]">{formatSAR(SYNC_DATA.heroKPIs.performanceCash)}</span>
                                    <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-widest mt-0.5">Perf. Cash</span>
                                </div>
                            </div>

                            {/* Direct vs Indirect Table */}
                            <div className="overflow-hidden border border-gray-100 rounded-2xl mt-4 bg-white shadow-sm">
                                <table className="min-w-full divide-y divide-gray-100 text-left text-xs sm:text-sm">
                                    <thead className="bg-gradient-to-r from-gray-50 to-indigo-50/10 text-gray-500 font-bold">
                                        <tr>
                                            <th className="py-3 px-4 font-bold text-gray-700">Attribution Type</th>
                                            <th className="py-3 px-4 text-right font-bold text-gray-700">June Cash</th>
                                            <th className="py-3 px-4 text-right font-bold text-gray-700">% Perf Cash</th>
                                            <th className="py-3 px-4 text-right font-bold text-gray-700">LTV</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 font-medium text-gray-700">
                                        {SYNC_DATA.directIndirectBreakdown.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-indigo-50/20 transition-colors duration-150">
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                                        <span className="font-bold text-gray-900">{item.type.split(' ')[0]}</span>
                                                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                                                            item.type.includes('live') 
                                                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/50' 
                                                                : 'bg-slate-50 text-slate-500 border border-slate-200/50'
                                                        }`}>
                                                            {item.type.includes('live') ? 'Active' : 'No Campaign'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-950">{formatSAR(item.juneCash)}</td>
                                                <td className="py-3.5 px-4 text-right text-indigo-600 font-mono font-bold">{item.pctOfPerfCash}%</td>
                                                <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-950">{formatSAR(item.ltv)}</td>
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
                    className="bg-white border border-gray-200/60 rounded-[2rem] p-6 sm:p-8 shadow-sm mb-10 sm:mb-12"
                    id="july-bookings-card"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950">July-Start Future Pipeline</h2>
                            <p className="text-xs text-gray-400 font-medium mt-0.5">Bookings won in June with check-ins in July (Collect SAR 0 June Cash)</p>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold px-4 py-2 rounded-2xl self-start sm:self-auto font-mono">
                            Total Pipeline LTV: {formatSAR(SYNC_DATA.julyStartLtvTotal)}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {SYNC_DATA.julyStartBookings.map((booking, idx) => (
                            <div key={idx} className="bg-gray-55 border border-gray-100 rounded-2xl p-4 flex flex-col justify-between hover:shadow-inner transition-all">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="text-xs font-bold text-gray-800 tracking-tight">{booking.name}</h4>
                                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#4A2C5A]/10 text-[#4A2C5A] rounded-md font-mono">{booking.branch}</span>
                                </div>
                                <div className="flex justify-between items-baseline pt-2 border-t border-gray-100">
                                    <span className="text-[10px] text-gray-400 font-bold uppercase">Contract LTV</span>
                                    <span className="text-xs font-bold text-gray-900 font-mono">{formatSAR(booking.ltv)}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-[11px] text-gray-400 mt-4 italic font-semibold text-center uppercase tracking-wider">
                        Note: These 7 bookings contribute 0 to June cash collected but generate significant future cash value recorded in LTV totals.
                    </p>
                </motion.div>

                {/* SECTION 5: CUSTOMER PAYMENTS STATUS & AUDIT */}
                <motion.div 
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-white border border-gray-200/60 rounded-[2rem] p-6 sm:p-8 shadow-sm mb-10 sm:mb-12"
                    id="customer-payments-card"
                >
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950">Customer Payments & Financial Audit</h2>
                            <p className="text-xs text-gray-400 font-medium mt-0.5">Detailed view of rent collections and Mathwaa's management fee shares across 48 customers</p>
                        </div>
                    </div>

                    {/* Payment KPIs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
                        {/* KPI 1: Collected */}
                        <div className="bg-emerald-50/50 border border-emerald-100/70 p-5 rounded-2xl">
                            <p className="text-xs font-bold text-emerald-750">Collected Payments (Rent)</p>
                            <p className="text-2xl font-bold text-emerald-800 mt-1 font-mono">{formatSAR(paymentMetrics.paidRent)}</p>
                            <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-emerald-100/40 text-xs font-semibold text-emerald-700">
                                <span>Collected Mathwaa Share</span>
                                <span className="font-mono">{formatSAR(paymentMetrics.paidMathwaa)}</span>
                            </div>
                        </div>

                        {/* KPI 2: Pending */}
                        <div className="bg-amber-50/50 border border-amber-100/70 p-5 rounded-2xl">
                            <p className="text-xs font-bold text-amber-750">Pending Payments (Rent)</p>
                            <p className="text-2xl font-bold text-amber-800 mt-1 font-mono">{formatSAR(paymentMetrics.pendingRent)}</p>
                            <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-amber-100/40 text-xs font-semibold text-amber-700">
                                <span>Pending Mathwaa Share</span>
                                <span className="font-mono">{formatSAR(paymentMetrics.pendingMathwaa)}</span>
                            </div>
                        </div>

                        {/* KPI 3: Count & Ratio */}
                        <div className="bg-indigo-50/40 border border-indigo-100/60 p-5 rounded-2xl flex flex-col justify-between">
                            <div>
                                <p className="text-xs font-bold text-indigo-750">Collection Progress (Customers)</p>
                                <p className="text-2xl font-bold text-indigo-850 mt-1 font-mono">
                                    {paymentMetrics.paidCount} <span className="text-xs text-indigo-500 font-medium">out of {paymentMetrics.totalCount}</span>
                                </p>
                            </div>
                            <div className="mt-3">
                                <div className="w-full bg-indigo-100/75 rounded-full h-1.5 overflow-hidden">
                                    <div 
                                        className="bg-indigo-650 h-1.5 rounded-full animate-pulse" 
                                        style={{ width: `${(paymentMetrics.paidCount / paymentMetrics.totalCount) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters & Search for Payments */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 p-4 bg-gray-55 rounded-2xl border border-gray-100">
                        <div className="w-full md:w-72 relative">
                            <input 
                                type="text" 
                                placeholder="Search customer name or branch..." 
                                value={paymentSearch}
                                onChange={(e) => setPaymentSearch(e.target.value)}
                                className="w-full text-xs sm:text-sm px-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-[#4A2C5A] transition-all"
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
                                All ({paymentMetrics.totalCount})
                            </button>
                            <button 
                                onClick={() => setPaymentFilter('paid')}
                                className={`flex-1 md:flex-none text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                                    paymentFilter === 'paid' 
                                        ? 'bg-emerald-600 text-white' 
                                        : 'bg-white text-gray-650 hover:bg-gray-100 border border-gray-200'
                                }`}
                            >
                                Paid / Confirmed ({paymentMetrics.paidCount})
                            </button>
                            <button 
                                onClick={() => setPaymentFilter('unpaid')}
                                className={`flex-1 md:flex-none text-xs font-bold px-4 py-2 rounded-xl transition-all ${
                                    paymentFilter === 'unpaid' 
                                        ? 'bg-amber-600 text-white' 
                                        : 'bg-white text-gray-650 hover:bg-gray-100 border border-gray-200'
                                }`}
                            >
                                Pending / Stuck ({paymentMetrics.totalCount - paymentMetrics.paidCount})
                            </button>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto -mx-6 sm:-mx-8">
                        <div className="inline-block min-w-full align-middle px-6 sm:px-8">
                            <table className="min-w-full divide-y divide-gray-100 text-left text-xs sm:text-sm">
                                <thead className="bg-gray-55 text-gray-500 font-bold uppercase tracking-wider select-none">
                                    <tr>
                                        <th className="py-3 px-4 text-left">Customer</th>
                                        <th className="py-3 px-4 text-center">Branch</th>
                                        <th className="py-3 px-4 text-right">Rent Paid (Value)</th>
                                        <th className="py-3 px-4 text-right">Mathwaa Share</th>
                                        <th className="py-3 px-4 text-left">Payment Status / Obstacle</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white font-medium text-gray-700">
                                    {filteredPayments.map((p, idx) => (
                                        <tr key={idx} className="hover:bg-gray-55/65 transition-colors duration-150">
                                            <td className="py-3.5 px-4 font-bold text-gray-900 text-left font-sans">
                                                <div>{p.matchedName}</div>
                                                <div className="text-[10px] text-gray-400 font-normal">{p.inputName} / {p.matchedNameAr}</div>
                                            </td>
                                            <td className="py-3.5 px-4 text-center font-mono font-bold text-gray-500">
                                                <span className="px-2 py-0.5 bg-gray-100 border border-gray-200/50 rounded-md">
                                                    {p.branch}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-900">
                                                {formatSAR(p.rent)}
                                            </td>
                                            <td className="py-3.5 px-4 text-right font-mono font-bold text-[#4A2C5A]">
                                                {formatSAR(p.juneCash)}
                                            </td>
                                            <td className="py-3.5 px-4 text-left">
                                                {p.status === 'Confirmed' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold rounded-full">
                                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                                        Confirmed / Paid
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
                                                            {p.status === 'Due July' ? 'Due July 1st' : p.status === 'Pending Approval' ? 'Pending Approval' : p.status === 'Facing Issue' ? 'Facing Issue' : 'Pending Payment'}
                                                        </span>
                                                        {p.reason && (
                                                            <div className="text-[10px] text-gray-400 font-semibold leading-relaxed ml-2">
                                                                ← Stuck: {p.reason}
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
                                                No matches found for your search criteria.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>

                {/* SECTION 5: ALL BOOKINGS LEDGER */}
                <motion.div 
                    variants={cardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="bg-white border border-gray-200/60 rounded-[2rem] p-6 sm:p-8 shadow-sm mb-10 sm:mb-12"
                    id="bookings-ledger-card"
                >
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-950">Bookings Ledger</h2>
                            <p className="text-xs text-gray-400 font-medium mt-0.5">Comprehensive audit ledger of all 52 bookings in the June 1–28 period</p>
                        </div>

                        {/* Dynamic Counter */}
                        <div className="text-xs font-bold text-[#4A2C5A] bg-[#4A2C5A]/5 px-3.5 py-2 rounded-xl self-start xl:self-auto">
                            Showing {filteredAndSortedBookings.length} of 52 Bookings
                        </div>
                    </div>

                    {/* Filter and Search Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-6 p-4 bg-gray-55 rounded-2xl border border-gray-100">
                        {/* Search */}
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search by name, channel..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full text-xs sm:text-sm px-4 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-[#4A2C5A] transition-all"
                            />
                        </div>

                        {/* Attribution Filter */}
                        <select 
                            value={attributionFilter}
                            onChange={(e) => setAttributionFilter(e.target.value)}
                            className="text-xs sm:text-sm px-3 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-[#4A2C5A] transition-all"
                        >
                            <option value="all">All Attribution Sources</option>
                            <option value="Performance/Direct">Performance Direct</option>
                            <option value="Performance/Indirect">Performance Indirect</option>
                            <option value="Other">Other Sources</option>
                            <option value="Performance">Performance (General)</option>
                        </select>

                        {/* Status Filter */}
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="text-xs sm:text-sm px-3 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-[#4A2C5A] transition-all"
                        >
                            <option value="all">All Statuses</option>
                            <option value="Approved">Approved</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Renewal">Renewal</option>
                        </select>

                        {/* Branch Filter */}
                        <select 
                            value={branchFilter}
                            onChange={(e) => setBranchFilter(e.target.value)}
                            className="text-xs sm:text-sm px-3 py-2 bg-white rounded-xl border border-gray-200 focus:outline-none focus:border-[#4A2C5A] transition-all"
                        >
                            <option value="all">All Branches</option>
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
                            className="text-xs font-semibold py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-all"
                        >
                            Clear Filters
                        </button>
                    </div>

                    {/* Bookings Ledger Table */}
                    <div className="overflow-x-auto -mx-6 sm:-mx-8">
                        <div className="inline-block min-w-full align-middle px-6 sm:px-8">
                            <table className="min-w-full divide-y divide-gray-100 text-left text-xs sm:text-sm">
                                <thead className="bg-gray-55 text-gray-500 font-bold uppercase tracking-wider select-none">
                                    <tr>
                                        <th onClick={() => toggleSort('id')} className="py-3.5 px-3 cursor-pointer hover:bg-gray-100/50 transition-colors">
                                            # {sortField === 'id' && (sortDirection === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th onClick={() => toggleSort('name')} className="py-3.5 px-3 cursor-pointer hover:bg-gray-100/50 transition-colors">
                                            Name {sortField === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th onClick={() => toggleSort('branch')} className="py-3.5 px-3 cursor-pointer hover:bg-gray-100/50 transition-colors">
                                            Branch {sortField === 'branch' && (sortDirection === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th onClick={() => toggleSort('location')} className="py-3.5 px-3 cursor-pointer hover:bg-gray-100/50 transition-colors">
                                            Location {sortField === 'location' && (sortDirection === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th onClick={() => toggleSort('monthlyRent')} className="py-3.5 px-3 text-right cursor-pointer hover:bg-gray-100/50 transition-colors">
                                            Monthly SAR {sortField === 'monthlyRent' && (sortDirection === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th onClick={() => toggleSort('channel')} className="py-3.5 px-3 cursor-pointer hover:bg-gray-100/50 transition-colors">
                                            Channel {sortField === 'channel' && (sortDirection === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th onClick={() => toggleSort('attribution')} className="py-3.5 px-3 cursor-pointer hover:bg-gray-100/50 transition-colors">
                                            Attribution {sortField === 'attribution' && (sortDirection === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th onClick={() => toggleSort('status')} className="py-3.5 px-3 cursor-pointer hover:bg-gray-100/50 transition-colors">
                                            Status {sortField === 'status' && (sortDirection === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th onClick={() => toggleSort('checkIn')} className="py-3.5 px-3 cursor-pointer hover:bg-gray-100/50 transition-colors">
                                            Check-In {sortField === 'checkIn' && (sortDirection === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th onClick={() => toggleSort('juneCash')} className="py-3.5 px-3 text-right cursor-pointer hover:bg-gray-100/50 transition-colors">
                                            June Cash {sortField === 'juneCash' && (sortDirection === 'asc' ? '▲' : '▼')}
                                        </th>
                                        <th onClick={() => toggleSort('ltv')} className="py-3.5 px-3 text-right cursor-pointer hover:bg-gray-100/50 transition-colors">
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
                                                    <td className="py-3 px-3 font-semibold text-gray-900">{booking.name}</td>
                                                    <td className="py-3 px-3 font-mono text-[11px] text-[#4A2C5A]">{booking.branch}</td>
                                                    <td className="py-3 px-3 text-gray-500">{booking.location}</td>
                                                    <td className="py-3 px-3 text-right font-mono text-gray-600">{booking.monthlyRent.toLocaleString()}</td>
                                                    <td className="py-3 px-3 text-gray-500 text-[11px]">{booking.channel}</td>
                                                    <td className="py-3 px-3">
                                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                                            booking.attribution.includes('Direct') ? 'bg-[#4A2C5A]/15 text-[#4A2C5A]' : 
                                                            booking.attribution.includes('Indirect') ? 'bg-purple-100 text-purple-700' :
                                                            booking.attribution === 'Other' ? 'bg-gray-100 text-gray-600' :
                                                            'bg-[#4A2C5A]/10 text-[#4A2C5A]'
                                                        }`}>
                                                            {booking.attribution}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-3">
                                                        <span className={statusBadgeClass}>{booking.status}</span>
                                                    </td>
                                                    <td className="py-3 px-3 text-gray-500 font-mono text-[11px]">{booking.checkIn}</td>
                                                    <td className="py-3 px-3 text-right font-mono font-bold text-gray-950">
                                                        {booking.juneCash === 0 ? '-' : formatSAR(booking.juneCash)}
                                                    </td>
                                                    <td className="py-3 px-3 text-right font-mono font-bold text-[#4A2C5A]">
                                                        {booking.ltv === 0 ? '-' : formatSAR(booking.ltv)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </AnimatePresence>
                                    {filteredAndSortedBookings.length === 0 && (
                                        <tr>
                                            <td colSpan={11} className="py-8 text-center text-gray-400 font-semibold uppercase tracking-wider">
                                                No matches found for active filters
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
                        Mathwaa : June Marketing Revenue Report · Period 1:28 June 2026 · Revenue = Mathwaa management-fee share, cash-collected basis (1 month); LTV = full committed term. Verified from sales records.
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
                                className="relative bg-white rounded-3xl p-6 sm:p-8 shadow-xl max-w-2xl w-full border border-gray-100 overflow-y-auto max-h-[90vh] z-10 text-left"
                            >
                                {/* Close Button */}
                                <button 
                                    onClick={() => setShowFormulasModal(false)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>

                                <h3 className="text-xl font-bold text-gray-950 mb-6">ROI Formulas & Calculation Audit</h3>
                                
                                <div className="space-y-6 text-sm text-gray-600 leading-relaxed">
                                    <p>
                                        Our Return on Investment (ROI) indicators assess marketing performance against two distinct return bases derived from performance bookings in June:
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-55 p-4 rounded-2xl border border-gray-100">
                                        <div>
                                            <span className="text-xs font-bold text-gray-400 uppercase">A. June Cash Base</span>
                                            <p className="font-extrabold text-gray-950 font-mono text-base mt-1">SAR 24,431.50</p>
                                            <p className="text-xs text-gray-500 mt-1">Mathwaa's 1-month management fee collected in June from direct/indirect channels.</p>
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-gray-400 uppercase">B. Contract LTV Base</span>
                                            <p className="font-extrabold text-gray-950 font-mono text-base mt-1">SAR 101,762.00</p>
                                            <p className="text-xs text-gray-500 mt-1">Mathwaa's full future contracted revenue expected over the customer lifecycle.</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-5 space-y-4">
                                        <h4 className="font-bold text-gray-950 text-base">Model A: ROI on Paid Ads Only</h4>
                                        <p className="text-xs text-gray-500 font-semibold">Evaluates media spend of <strong className="text-gray-900 font-bold">SAR 13,594</strong> (Meta: SAR 4,836 + TikTok: SAR 8,758).</p>
                                        <div className="space-y-3 font-mono text-xs bg-gray-55 border border-gray-100 p-3.5 rounded-xl">
                                            <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                                                <span className="text-gray-500">June Cash Collected ROI</span>
                                                <span className="font-bold text-gray-900">24,431.5 / 13,594 = 1.80x</span>
                                            </div>
                                            <div className="flex justify-between items-center py-1.5">
                                                <span className="text-gray-500">Long-term Contract LTV ROI</span>
                                                <span className="font-bold text-[#4A2C5A]">101,762 / 13,594 = 7.49x</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-5 space-y-4">
                                        <h4 className="font-bold text-gray-950 text-base">Model B: ROI on Total Marketing</h4>
                                        <p className="text-xs text-gray-500 font-semibold">Evaluates total marketing cost of <strong className="text-gray-900 font-bold">SAR 14,094</strong> (Paid Ads: SAR 13,594 + Content Creation: SAR 500).</p>
                                        <div className="space-y-3 font-mono text-xs bg-gray-55 border border-gray-100 p-3.5 rounded-xl">
                                            <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                                                <span className="text-gray-500">June Cash Collected ROI</span>
                                                <span className="font-bold text-gray-900">24,431.5 / 14,094 = 1.73x</span>
                                            </div>
                                            <div className="flex justify-between items-center py-1.5">
                                                <span className="text-gray-500">Long-term Contract LTV ROI</span>
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

export default App_en;
