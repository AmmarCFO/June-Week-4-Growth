import React, { useState, useMemo } from 'react';
import { RAW_DEALS } from '../constants';
import { RawDeal } from '../types';

const formatCurrency = (value: number) => {
    return `${value.toLocaleString('ar-SA', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} ر.س`;
};

// Map values to Arabic for dropdowns
const translateRep = (name: string) => {
    const repMap: { [key: string]: string } = {
        "Amal": "أمل",
        "Al-Shihana": "الشيهانة",
        "Raghad": "رغد",
        "Fahmida": "فهميدة",
        "Salsabila": "سلسبيل",
        "Raghad / Al-Shihana": "رغد / الشيهانة"
    };
    return repMap[name] || name;
};

const translateChannel = (channel: string) => {
    const chMap: { [key: string]: string } = {
        "TikTok": "تيك توك (TikTok)",
        "Meta (Instagram)": "ميتا (انستغرام)",
        "Meta (Facebook)": "ميتا (فيسبوك)",
        "Social Media (generic)": "وسائل التواصل (عام)",
        "Referral": "قناة الإحالة (Referral)",
        "Other Portal (Bayut)": "بوابات (بيوت)",
        "Other Portal (Airbnb)": "بوابات (إير بي إن بي)",
        "Existing Tenant": "نزيل سابق",
        "Walk-in": "زيارة مباشرة",
        "Organic Search": "البحث العضوي",
        "Unknown": "غير محدد"
    };
    return chMap[channel] || channel;
};

const translateBranch = (branch: string) => {
    const brMap: { [key: string]: string } = {
        "Mathwa 33": "مثوى ٣٣ (العليا)",
        "Mathwa 43": "مثوى ٤٣ (التعاون)",
        "Mathwa 55": "مثوى ٥٥ (المدينة)",
        "Mathwa 13": "مثوى ١٣ (العارض)",
        "Mathwa 38": "مثوى ٣٨ (السليمانية)",
        "Mathwa 5": "مثوى ٥ (العارض)",
        "Mathwa 31": "مثوى ٣١ (السلام)",
        "Mathwa 53": "مثوى ٥٣ (المروج)",
        "Mathwa 32": "مثوى ٣٢ (القيروان)",
        "Mathwa 20": "مثوى ٢٠ (الزهراء)",
        "Mathwa 51": "مثوى ٥١ (النرجس)",
        "Mathwa 17": "مثوى ١٧ (الياسمين)",
        "Mathwa 23": "مثوى ٢٣ (اليرموك)",
        "Mathwa 56": "مثوى ٥٦ (المدينة)",
        "Mathwa 15": "مثوى ١٥ (الياسمين)",
        "Mathwa 42": "مثوى ٤٢ (العارض)",
        "Mathwa 7": "مثوى ٧ (العارض)",
        "Mathwa 37": "مثوى ٣٧ (العارض)"
    };
    return brMap[branch] || branch;
};

export const DealsLedgerAr: React.FC = () => {
    const [search, setSearch] = useState('');
    const [selectedRep, setSelectedRep] = useState('');
    const [selectedChannel, setSelectedChannel] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');

    const reps = useMemo(() => {
        const set = new Set<string>();
        RAW_DEALS.forEach(d => {
            if (d.salesRep.includes('/')) {
                d.salesRep.split('/').forEach(r => set.add(r.trim()));
            } else {
                set.add(d.salesRep);
            }
        });
        return Array.from(set).sort();
    }, []);

    const channels = useMemo(() => {
        return Array.from(new Set(RAW_DEALS.map(d => d.channel))).sort();
    }, []);

    const branches = useMemo(() => {
        return Array.from(new Set(RAW_DEALS.map(d => d.branch))).sort();
    }, []);

    // Filter deals
    const filteredDeals = useMemo(() => {
        return RAW_DEALS.filter(deal => {
            const matchesSearch = deal.tenantName.toLowerCase().includes(search.toLowerCase()) || 
                                  (deal.notes && deal.notes.toLowerCase().includes(search.toLowerCase()));
            
            const matchesRep = !selectedRep || deal.salesRep.includes(selectedRep);
            const matchesChannel = !selectedChannel || deal.channel === selectedChannel;
            const matchesBranch = !selectedBranch || deal.branch === selectedBranch;

            return matchesSearch && matchesRep && matchesChannel && matchesBranch;
        });
    }, [search, selectedRep, selectedChannel, selectedBranch]);

    // Recalculated aggregates
    const aggregates = useMemo(() => {
        let totalGross = 0;
        let totalNet = 0;
        filteredDeals.forEach(d => {
            totalGross += d.committedGross;
            totalNet += d.mathwaaNet;
        });
        return {
            count: filteredDeals.length,
            totalGross,
            totalNet
        };
    }, [filteredDeals]);

    return (
        <div id="deals-ledger" className="bg-[#1D1D1F] text-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl border border-white/10 overflow-hidden flex flex-col group text-right" dir="rtl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white font-sans">سجل الصفقات المغلقة المعتمد</h3>
                    <p className="text-sm font-medium text-gray-400 mt-1">سجل تفصيلي بكافة المعاملات المبرمة من ١١ مايو إلى ١١ يونيو ٢٠٢٦</p>
                </div>
                <div className="bg-purple-900/40 text-purple-300 font-bold px-4 py-2 rounded-full text-xs uppercase tracking-wider border border-purple-500/20">
                    تمت مطابقة {aggregates.count} صفقة
                </div>
            </div>

            {/* Filter controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">البحث عن اسم النزيل</label>
                    <input 
                        type="text" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="اكتب للبحث..."
                        className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-purple-400 rounded-2xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all text-right"
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">ممثل المبيعات</label>
                    <select 
                        value={selectedRep}
                        onChange={(e) => setSelectedRep(e.target.value)}
                        className="w-full bg-[#1D1D1F] border border-white/10 hover:border-white/20 focus:border-purple-400 rounded-2xl px-4 py-3 text-sm text-white outline-none transition-all appearance-none cursor-pointer text-right"
                    >
                        <option value="">جميع ممثلي المبيعات</option>
                        {reps.map(rep => <option key={rep} value={rep}>{translateRep(rep)}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">قناة الاستقطاب</label>
                    <select 
                        value={selectedChannel}
                        onChange={(e) => setSelectedChannel(e.target.value)}
                        className="w-full bg-[#1D1D1F] border border-white/10 hover:border-white/20 focus:border-purple-400 rounded-2xl px-4 py-3 text-sm text-white outline-none transition-all appearance-none cursor-pointer text-right"
                    >
                        <option value="">كافة القنوات الاستقطابية</option>
                        {channels.map(ch => <option key={ch} value={ch}>{translateChannel(ch)}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">فرع العقار</label>
                    <select 
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="w-full bg-[#1D1D1F] border border-white/10 hover:border-white/20 focus:border-purple-400 rounded-2xl px-4 py-3 text-sm text-white outline-none transition-all appearance-none cursor-pointer text-right"
                    >
                        <option value="">جميع فروع الصفقات</option>
                        {branches.map(br => <option key={br} value={br}>{translateBranch(br)}</option>)}
                    </select>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.02]">
                <table className="w-full text-right border-collapse" dir="rtl">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                            <th className="py-4 px-5 text-right">معرف</th>
                            <th className="py-4 px-5 text-right">اسم النزيل</th>
                            <th className="py-4 px-5 text-right">ممثلة المبيعات</th>
                            <th className="py-4 px-5 text-right">الفرع والموقع</th>
                            <th className="py-4 px-5 text-right">قناة الاستقطاب</th>
                            <th className="py-4 px-5 text-left">الإيجار الشهري</th>
                            <th className="py-4 px-5 text-center">أشهر الالتزام</th>
                            <th className="py-4 px-5 text-left">قيمة العقد الإجمالية</th>
                            <th className="py-4 px-5 text-left text-purple-300">صافي حصة مثوى (LTV)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm font-medium">
                        {filteredDeals.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="py-12 text-center text-gray-500 font-medium tracking-wide">
                                    لا تتوفر أي سجلات صفقات تطابق الاختيارات المحددة حالياً.
                                </td>
                            </tr>
                        ) : (
                            filteredDeals.map(deal => (
                                <tr key={deal.id} className="hover:bg-white/[0.03] transition-colors">
                                    <td className="py-4 px-5 text-gray-500 font-mono text-xs">#{deal.id}</td>
                                    <td className="py-4 px-5 text-white font-sans">{deal.tenantName}</td>
                                    <td className="py-4 px-5 text-gray-300">{translateRep(deal.salesRep)}</td>
                                    <td className="py-4 px-5 text-gray-300">
                                        <span className="block font-sans">{translateBranch(deal.branch)}</span>
                                    </td>
                                    <td className="py-4 px-5 text-gray-300">
                                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-400 font-sans">
                                            {translateChannel(deal.channel)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-5 text-left tabular-nums">
                                        {deal.monthlyRent ? formatCurrency(deal.monthlyRent) : <span className="text-gray-500 italic text-xs">إقامة قصيرة</span>}
                                    </td>
                                    <td className="py-4 px-5 text-center text-gray-300 tabular-nums">{deal.committedMonths}</td>
                                    <td className="py-4 px-5 text-left tabular-nums text-white">
                                        {formatCurrency(deal.committedGross)}
                                    </td>
                                    <td className="py-4 px-5 text-left tabular-nums text-purple-300 font-semibold">
                                        {formatCurrency(deal.mathwaaNet)}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    {filteredDeals.length > 0 && (
                        <tfoot className="bg-white/5 font-bold border-t border-white/10">
                            <tr className="text-xs uppercase tracking-wider">
                                <td colSpan={5} className="py-5 px-5 text-gray-400 text-right">المجاميع المطابقة</td>
                                <td className="py-5 px-5"></td>
                                <td className="py-5 px-5"></td>
                                <td className="py-5 px-5 text-left text-base text-white tabular-nums">
                                    {formatCurrency(aggregates.totalGross)}
                                </td>
                                <td className="py-5 px-5 text-left text-lg text-purple-300 tabular-nums">
                                    {formatCurrency(aggregates.totalNet)}
                                </td>
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>

            {/* Mobile View Card Lists */}
            <div className="md:hidden space-y-4">
                {filteredDeals.length === 0 ? (
                    <p className="py-8 text-center text-gray-500 text-sm">لا توجد سجلات صفقات مبرمة متطابقة للبحث.</p>
                ) : (
                    filteredDeals.map(deal => (
                        <div key={deal.id} className="bg-white/[0.03] border border-white/5 rounded-2xl p-5 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-mono text-gray-500">#{deal.id} - {deal.contractStart}</p>
                                    <h4 className="font-bold text-white mt-1">{deal.tenantName}</h4>
                                </div>
                                <span className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded-lg text-gray-400">
                                    {translateChannel(deal.channel)}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5 text-xs text-right">
                                <div>
                                    <p className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">ممثلة المبيعات</p>
                                    <p className="text-white mt-0.5">{translateRep(deal.salesRep)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">فرع العقار</p>
                                    <p className="text-white mt-0.5">{translateBranch(deal.branch)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 font-bold uppercase tracking-wider text-[9px]">عقد الإيجار</p>
                                    <p className="text-white mt-0.5">
                                        {deal.monthlyRent ? `${formatCurrency(deal.monthlyRent)}/شهرياً` : 'إقامة قصيرة'} × {deal.committedMonths} أشهر
                                    </p>
                                </div>
                                <div>
                                    <p className="text-purple-400 font-bold uppercase tracking-wider text-[9px]">صافي حصة مثوى / القيمة الإجمالية</p>
                                    <p className="text-purple-300 font-bold mt-0.5">
                                        {formatCurrency(deal.mathwaaNet)} <span className="text-gray-500 font-normal">/ {formatCurrency(deal.committedGross)}</span>
                                    </p>
                                </div>
                            </div>
                            {deal.notes && (
                                <div className="bg-black/20 p-2.5 rounded-xl border border-white/5 text-right">
                                    <p className="text-[10px] text-gray-400 italic">ملاحظات: {deal.notes}</p>
                                </div>
                            )}
                        </div>
                    ))
                )}

                {filteredDeals.length > 0 && (
                    <div className="bg-purple-900/10 border border-purple-500/20 rounded-2xl p-5 mt-4 space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-purple-300">مجاميع الفلترة الحالية</p>
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400 font-medium">إجمالي قيمة صفقات الملاك</span>
                            <span className="font-bold text-white tabular-nums">{formatCurrency(aggregates.totalGross)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm pt-2 border-t border-white/5">
                            <span className="text-purple-300 font-bold">صافي حصة مثوى (LTV)</span>
                            <span className="font-extrabold text-[#C084FC] tabular-nums text-lg">{formatCurrency(aggregates.totalNet)}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
