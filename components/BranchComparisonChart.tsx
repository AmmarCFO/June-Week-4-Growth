import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  'Cash Collected': number;
  'Target Revenue': number;
}

interface BranchComparisonChartProps {
  data: ChartData[];
}

const BranchComparisonChart: React.FC<BranchComparisonChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 150 }}>
        <ResponsiveContainer>
            <BarChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
                layout="vertical"
                barSize={30}
            >
                <XAxis type="number" stroke="#4A2C5A" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => `SAR ${Number(value) / 1000}k`} />
                <YAxis dataKey="name" type="category" stroke="#4A2C5A" width={120} tick={{ fill: '#4A2C5A', fontSize: 12, width: 110 }} axisLine={false} tickLine={false} tickMargin={5} />
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(5px)',
                        border: '1px solid #A99484',
                        borderRadius: '0.5rem',
                        color: '#4A2C5A'
                    }} 
                    formatter={(value: number) => `SAR ${value.toLocaleString()}`}
                />
                <Legend wrapperStyle={{ color: '#4A2C5A', paddingTop: '10px' }} iconSize={10} />
                <Bar dataKey="Target Revenue" fill="#A99484" radius={[0, 4, 4, 0]} />
                <Bar dataKey="Cash Collected" fill="#8A6E99" radius={[0, 4, 4, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default BranchComparisonChart;