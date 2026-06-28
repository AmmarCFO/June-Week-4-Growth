import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  'المبالغ المحصلة': number;
  'الإيرادات المستهدفة': number;
}

interface BranchComparisonChartProps {
  data: ChartData[];
}

const BranchComparisonChart_ar: React.FC<BranchComparisonChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 150 }}>
        <ResponsiveContainer>
            <BarChart
                data={data}
                margin={{
                    top: 5,
                    right: 20,
                    left: 20,
                    bottom: 5,
                }}
                layout="vertical"
                barSize={30}
            >
                <XAxis type="number" stroke="#4A2C5A" axisLine={false} tickLine={false} tick={{ fill: '#4A2C5A', fontSize: 12 }} tickFormatter={(value) => `${Number(value) / 1000} ألف`} />
                <YAxis dataKey="name" type="category" stroke="#4A2C5A" width={120} tick={{ fill: '#4A2C5A', fontSize: 12, width: 110 }} axisLine={false} tickLine={false} tickMargin={10} />
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(5px)',
                        border: '1px solid #A99484',
                        borderRadius: '0.5rem',
                        color: '#4A2C5A',
                        direction: 'rtl',
                    }} 
                    formatter={(value: number, name: string) => [`${value.toLocaleString('ar-SA')} ريال`, name]}
                />
                <Legend wrapperStyle={{ color: '#4A2C5A', direction: 'rtl', paddingTop: '10px' }} iconSize={10} />
                <Bar dataKey="الإيرادات المستهدفة" fill="#A99484" radius={[0, 4, 4, 0]} />
                <Bar dataKey="المبالغ المحصلة" fill="#8A6E99" radius={[0, 4, 4, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default BranchComparisonChart_ar;