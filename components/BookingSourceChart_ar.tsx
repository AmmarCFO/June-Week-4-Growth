
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from 'recharts';

interface BookingSourceData {
  name: string;
  value: number;
}

interface BookingSourceChartProps {
  data: BookingSourceData[];
}

const COLORS = ['#A99484', '#8A6E99', '#2A5B64', '#4A2C5A', '#C98B8B'];

const BookingSourceChart_ar: React.FC<BookingSourceChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <p className="text-center text-[#4A2C5A]/70">لا توجد بيانات متاحة عن مصادر الحجز.</p>;
  }

  const totalBookings = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/50 mb-16 relative overflow-hidden text-right">
      {/* Decorative background blob */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#4A2C5A]/5 rounded-full blur-3xl pointer-events-none"></div>

      <h3 className="text-2xl font-bold text-[#4A2C5A] mb-8 text-center sm:text-right relative z-10">قنوات اكتساب المستأجرين</h3>
      
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
        {/* Chart Section */}
        <div className="w-full lg:w-1/2 h-[300px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
                nameKey="name"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="drop-shadow-sm" />
                ))}
                <Label
                  value={totalBookings}
                  position="center"
                  className="text-5xl font-extrabold fill-[#4A2C5A]"
                  style={{ fontFamily: 'Cairo, sans-serif' }}
                  dy={-10}
                />
                <Label
                  value="إجمالي الحجوزات"
                  position="center"
                  className="text-sm font-semibold fill-[#4A2C5A]/60 tracking-wider font-cairo"
                  style={{ fontFamily: 'Cairo, sans-serif' }}
                  dy={25}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend Section */}
        <div className="w-full lg:w-1/2 text-right">
          <div className="space-y-3 sm:space-y-4">
            {data.map((entry, index) => {
              const percentage = ((entry.value / totalBookings) * 100).toFixed(1);
              return (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 sm:p-4 rounded-xl hover:bg-white/50 transition-colors duration-300 group cursor-default"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div 
                      className="w-2.5 h-10 sm:w-3 sm:h-12 rounded-full shadow-sm" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <div>
                      <p className="font-bold text-[#4A2C5A] text-base sm:text-lg font-cairo leading-tight">{entry.name}</p>
                      <p className="text-[10px] sm:text-xs text-[#4A2C5A]/50 font-semibold uppercase tracking-wider font-cairo">{percentage}% من الإجمالي</p>
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="block text-xl sm:text-2xl font-bold text-[#4A2C5A] leading-none">{entry.value}</span>
                    <span className="text-[10px] sm:text-xs text-[#4A2C5A]/50 font-medium font-cairo font-normal">مستأجر</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSourceChart_ar;
