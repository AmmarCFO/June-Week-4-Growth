
import React, { useState, useEffect } from 'react';
import { ApartmentType, type Branch, type NewBooking } from '../types';

interface AddBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (booking: NewBooking) => void;
  branches: Branch[];
}

const translateType = (type: ApartmentType) => {
    switch(type) {
        case ApartmentType.STUDIO: return 'استوديو';
        case ApartmentType.ONE_BEDROOM: return 'غرفة نوم واحدة';
        case ApartmentType.TWO_BEDROOM: return 'غرفتين نوم';
        default: return type;
    }
};

const translateBranchName = (name: string) => {
    if (name === 'Mabaat 33 - Al Olaya') {
        return 'مبات ٣٣ - العليا';
    }
    return name;
};

const AddBookingModal_ar: React.FC<AddBookingModalProps> = ({ isOpen, onClose, onSubmit, branches }) => {
  const [branchId, setBranchId] = useState(branches[0]?.id || '');
  const [apartmentId, setApartmentId] = useState('');
  const [contractDurationMonths, setContractDurationMonths] = useState(12);
  const [howHeard, setHowHeard] = useState('');

  const translatedBranches = branches.map(b => ({
      ...b,
      name: translateBranchName(b.name)
  }))

  const vacantApartments = branches.find(b => b.id === branchId)?.apartments.filter(a => a.status === 'VACANT') || [];

  useEffect(() => {
    setApartmentId(vacantApartments[0]?.id || '');
  }, [branchId, branches, vacantApartments]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchId || !apartmentId || !contractDurationMonths || !howHeard) {
      alert('الرجاء تعبئة جميع الحقول.');
      return;
    }
    onSubmit({
      branchId,
      apartmentId,
      contractDurationMonths: Number(contractDurationMonths),
      howHeard,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm font-cairo" onClick={onClose}>
      <div className="bg-[#F1ECE6] rounded-2xl shadow-xl w-full max-w-lg p-8 m-4 text-right" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-[#4A2C5A] mb-6">إضافة حجز جديد</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="branch" className="block text-sm font-medium text-[#4A2C5A]/80">الفرع</label>
            <select
              id="branch"
              value={branchId}
              onChange={e => setBranchId(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300/50 focus:outline-none focus:ring-[#A99484] focus:border-[#A99484] sm:text-sm rounded-md bg-white/80"
            >
              {translatedBranches.map(branch => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="apartment" className="block text-sm font-medium text-[#4A2C5A]/80">الشقق الشاغرة</label>
            <select
              id="apartment"
              value={apartmentId}
              onChange={e => setApartmentId(e.target.value)}
              disabled={vacantApartments.length === 0}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300/50 focus:outline-none focus:ring-[#A99484] focus:border-[#A99484] sm:text-sm rounded-md bg-white/80"
            >
              {vacantApartments.length > 0 ? vacantApartments.map(apt => (
                <option key={apt.id} value={apt.id}>
                  شقة #{apt.number} ({translateType(apt.type)} - {apt.monthlyRent} ريال/شهر)
                </option>
              )) : <option>لا توجد شقق شاغرة في هذا الفرع</option>}
            </select>
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-[#4A2C5A]/80">مدة العقد (بالأشهر)</label>
            <input
              type="number"
              id="duration"
              min="1"
              value={contractDurationMonths}
              onChange={e => setContractDurationMonths(Number(e.target.value))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300/50 focus:outline-none focus:ring-[#A99484] focus:border-[#A99484] sm:text-sm rounded-md bg-white/80"
            />
          </div>

           <div>
            <label htmlFor="source" className="block text-sm font-medium text-[#4A2C5A]/80">مصدر اكتساب العميل (مثال: بيوت، إعلان فيسبوك)</label>
            <input
              type="text"
              id="source"
              value={howHeard}
              onChange={e => setHowHeard(e.target.value)}
              placeholder="كيف سمع المستأجر عنا؟"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300/50 focus:outline-none focus:ring-[#A99484] focus:border-[#A99484] sm:text-sm rounded-md bg-white/80"
            />
          </div>

          <div className="flex justify-start gap-4 pt-4">
            <button
              type="submit"
              className="px-6 py-2 text-sm font-semibold text-white bg-[#4A2C5A] rounded-md hover:bg-opacity-90 transition-colors"
            >
              إضافة الحجز
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-sm font-semibold text-[#4A2C5A] bg-gray-500/20 rounded-md hover:bg-gray-500/30 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookingModal_ar;
