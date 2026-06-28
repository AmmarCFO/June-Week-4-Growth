
import React from 'react';
import { Apartment, ApartmentStatus, ApartmentType } from '../types';

interface ApartmentTableProps {
  apartments: Apartment[];
}

const ApartmentTable_ar: React.FC<ApartmentTableProps> = ({ apartments }) => {
  const formatCurrency = (value: number) => {
    return `${value.toLocaleString('ar-SA')} ريال`;
  };

  const translateStatus = (status: ApartmentStatus) => {
    switch (status) {
      case ApartmentStatus.RENTED:
        return 'مؤجرة';
      case ApartmentStatus.RESERVED:
        return 'محجوزة للإيجار قصير الأجل';
      case ApartmentStatus.VACANT:
      default:
        return 'شاغرة';
    }
  };

  const getStatusClass = (status: ApartmentStatus) => {
    switch (status) {
      case ApartmentStatus.RENTED:
        return 'bg-teal-100 text-teal-800';
      case ApartmentStatus.RESERVED:
        return 'bg-blue-100 text-blue-800';
      case ApartmentStatus.VACANT:
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };
  
  const translateType = (type: ApartmentType) => {
      switch(type) {
          case ApartmentType.STUDIO: return 'استوديو';
          case ApartmentType.ONE_BEDROOM: return 'غرفة نوم واحدة';
          case ApartmentType.TWO_BEDROOM: return 'غرفتين نوم';
          default: return type;
      }
  };

  const totalCashCollected = apartments.reduce((sum, apt) => sum + apt.cashCollected, 0);
  const totalLifetimeValue = apartments.reduce((sum, apt) => sum + (apt.lifetimeValue || 0), 0);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full text-right">
          <thead>
            <tr>
              <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-[#4A2C5A]/70"># شقة</th>
              <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-[#4A2C5A]/70">النوع</th>
              <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-[#4A2C5A]/70">الحالة</th>
              <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-[#4A2C5A]/70">الإيجار الشهري</th>
              <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-[#4A2C5A]/70">المبلغ المحصل</th>
              <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-[#4A2C5A]/70">القيمة الدائمة</th>
              <th scope="col" className="py-3.5 px-4 text-sm font-semibold text-[#4A2C5A]/70">المصدر</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#A99484]/30">
            {apartments.map((apt) => (
              <tr key={apt.id}>
                <td className="whitespace-nowrap py-4 px-4 text-sm font-medium text-[#4A2C5A]">{apt.number}</td>
                <td className="whitespace-nowrap py-4 px-4 text-sm text-[#4A2C5A]/80">{translateType(apt.type)}</td>
                <td className="whitespace-nowrap py-4 px-4 text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(apt.status)}`}>
                    {translateStatus(apt.status)}
                  </span>
                </td>
                <td className="whitespace-nowrap py-4 px-4 text-sm text-[#4A2C5A]/80">
                  {formatCurrency(apt.monthlyRent)}
                  {apt.status === ApartmentStatus.RESERVED && apt.monthlyRent > 0 && (
                    <span className="block text-xs text-[#4A2C5A]/60">(الحد الأدنى المستهدف للإيجار قصير الأجل)</span>
                  )}
                </td>
                <td className="whitespace-nowrap py-4 px-4 text-sm text-[#4A2C5A]/80">{formatCurrency(apt.cashCollected)}</td>
                <td className="whitespace-nowrap py-4 px-4 text-sm text-[#4A2C5A]/80">{formatCurrency(apt.lifetimeValue || 0)}</td>
                <td className="whitespace-nowrap py-4 px-4 text-sm text-[#4A2C5A]/80">{apt.howHeard || 'غير متوفر'}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-[#A99484]/20">
            <tr>
              <td colSpan={4} className="py-3 px-4 text-left text-sm font-bold text-[#4A2C5A]">الإجمالي</td>
              <td className="whitespace-nowrap py-3 px-4 text-sm font-bold text-[#4A2C5A]">{formatCurrency(totalCashCollected)}</td>
              <td className="whitespace-nowrap py-3 px-4 text-sm font-bold text-[#4A2C5A]">{formatCurrency(totalLifetimeValue)}</td>
              <td className="py-3 px-4"></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="text-xs text-center text-[#4A2C5A]/60 mt-4">
        إجمالي المبالغ المحصلة والقيمة الدائمة حتى ٢٧ نوفمبر ٢٠٢٥
      </p>
    </>
  );
};

export default ApartmentTable_ar;
