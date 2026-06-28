
import React from 'react';
import { Apartment, ApartmentStatus } from '../types';

interface ApartmentTableProps {
  apartments: Apartment[];
}

const ApartmentTable: React.FC<ApartmentTableProps> = ({ apartments }) => {
  const formatCurrency = (value: number) => {
    return `SAR ${value.toLocaleString()}`;
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

  const getStatusText = (status: ApartmentStatus) => {
    switch (status) {
      case ApartmentStatus.RENTED:
        return 'Rented';
      case ApartmentStatus.RESERVED:
        return 'Reserved for Short Term';
      case ApartmentStatus.VACANT:
      default:
        return 'Vacant';
    }
  };

  const totalCashCollected = apartments.reduce((sum, apt) => sum + apt.cashCollected, 0);
  const totalLifetimeValue = apartments.reduce((sum, apt) => sum + (apt.lifetimeValue || 0), 0);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-[#4A2C5A]/70">Apt #</th>
              <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-[#4A2C5A]/70">Type</th>
              <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-[#4A2C5A]/70">Status</th>
              <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-[#4A2C5A]/70">Monthly Rent</th>
              <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-[#4A2C5A]/70">Cash Collected</th>
              <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-[#4A2C5A]/70">Lifetime Value</th>
              <th scope="col" className="py-3.5 px-4 text-left text-sm font-semibold text-[#4A2C5A]/70">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#A99484]/30">
            {apartments.map((apt) => (
              <tr key={apt.id}>
                <td className="whitespace-nowrap py-4 px-4 text-sm font-medium text-[#4A2C5A]">{apt.number}</td>
                <td className="whitespace-nowrap py-4 px-4 text-sm text-[#4A2C5A]/80">{apt.type}</td>
                <td className="whitespace-nowrap py-4 px-4 text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(apt.status)}`}>
                    {getStatusText(apt.status)}
                  </span>
                </td>
                <td className="whitespace-nowrap py-4 px-4 text-sm text-[#4A2C5A]/80">
                  {formatCurrency(apt.monthlyRent)}
                  {apt.status === ApartmentStatus.RESERVED && apt.monthlyRent > 0 && (
                    <span className="block text-xs text-[#4A2C5A]/60">(minimum STR target)</span>
                  )}
                </td>
                <td className="whitespace-nowrap py-4 px-4 text-sm text-[#4A2C5A]/80">{formatCurrency(apt.cashCollected)}</td>
                <td className="whitespace-nowrap py-4 px-4 text-sm text-[#4A2C5A]/80">{formatCurrency(apt.lifetimeValue || 0)}</td>
                <td className="whitespace-nowrap py-4 px-4 text-sm text-[#4A2C5A]/80">{apt.howHeard || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-[#A99484]/20">
            <tr>
              <td colSpan={4} className="py-3 px-4 text-right text-sm font-bold text-[#4A2C5A]">Total</td>
              <td className="whitespace-nowrap py-3 px-4 text-sm font-bold text-[#4A2C5A]">{formatCurrency(totalCashCollected)}</td>
              <td className="whitespace-nowrap py-3 px-4 text-sm font-bold text-[#4A2C5A]">{formatCurrency(totalLifetimeValue)}</td>
              <td className="py-3 px-4"></td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p className="text-xs text-center text-[#4A2C5A]/60 mt-4">
        Cumulative Cash Collected and Lifetime Value as of 27th November 2025
      </p>
    </>
  );
};

export default ApartmentTable;
