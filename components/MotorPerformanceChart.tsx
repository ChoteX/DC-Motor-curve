import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import type { MotorDataPoint } from '../types';

interface MotorPerformanceChartProps {
  data: MotorDataPoint[];
}

const MotorPerformanceChart: React.FC<MotorPerformanceChartProps> = ({ data }) => {
  const [visibility, setVisibility] = useState({
    torque: true,
    current: true,
    power: true,
    efficiency: true,
  });

  const handleLegendClick = (e: any) => {
    const { dataKey } = e;
    if (visibility.hasOwnProperty(dataKey)) {
        setVisibility(prev => ({ ...prev, [dataKey]: !prev[dataKey as keyof typeof visibility] }));
    }
  };

  const COLORS = {
      torque: '#4299E1',
      current: '#F56565',
      power: '#F6E05E',
      efficiency: '#48BB78'
  };
  
  const renderLegendText = (value: string, entry: any) => {
    const { color, dataKey } = entry;
    const isVisible = visibility[dataKey as keyof typeof visibility];
    return (
      <span style={{ color: isVisible ? color : '#A0AEC0', textDecoration: isVisible ? 'none' : 'line-through' }}>
        {value}
      </span>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 30,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
        <XAxis 
          dataKey="rpm" 
          name="RPM" 
          type="number"
          domain={[0, 'dataMax']}
          label={{ value: 'RPM', position: 'insideBottom', offset: -15, fill: '#A0AEC0', fontSize: 16 }}
          stroke="#A0AEC0"
          tick={{ fill: '#CBD5E0', fontSize: 14 }}
        />
        
        {/* Left Y-Axes */}
        <YAxis 
          yAxisId="power" 
          stroke={COLORS.power}
          domain={[0, 'dataMax']}
          tick={{ fill: COLORS.power, fontSize: 14 }}
        />
        <YAxis 
          yAxisId="current" 
          stroke={COLORS.current}
          domain={[0, 'dataMax']}
          tick={{ fill: COLORS.current, fontSize: 14 }}
        />

        {/* Right Y-Axes */}
        <YAxis 
          yAxisId="torque" 
          orientation="right" 
          stroke={COLORS.torque}
          domain={[0, dataMax => parseFloat((Math.ceil(dataMax * 10) / 10).toFixed(1))]}
          tick={{ fill: COLORS.torque, fontSize: 14 }}
        />
        <YAxis 
          yAxisId="efficiency" 
          orientation="right" 
          stroke={COLORS.efficiency}
          domain={[0, 1]}
          tickFormatter={(tick) => `${(tick * 100).toFixed(0)}%`}
          tick={{ fill: COLORS.efficiency, fontSize: 14 }}
        />

        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'rgba(30, 41, 59, 0.9)', 
            borderColor: '#4A5568',
            borderRadius: '0.5rem' 
          }}
          labelStyle={{ color: '#E2E8F0', fontWeight: 'bold' }}
          formatter={(value: number, name: string) => {
              if (name === 'Efficiency') {
                  return [`${(value * 100).toFixed(1)}%`, name];
              }
              if (name === 'Torque') {
                  return [`${value.toFixed(3)} Nm`, name];
              }
              if (name === 'Current') {
                  return [`${value.toFixed(2)} A`, name];
              }
               if (name === 'Power') {
                  return [`${value.toFixed(2)} W`, name];
              }
              return [value, name];
          }}
        />
        <Legend 
            wrapperStyle={{ fontSize: '16px', paddingTop: '30px', cursor: 'pointer' }}
            onClick={handleLegendClick}
            formatter={renderLegendText}
        />
        <Line yAxisId="torque" type="monotone" dataKey="torque" name="Torque" stroke={COLORS.torque} strokeWidth={3} dot={false} hide={!visibility.torque} />
        <Line yAxisId="current" type="monotone" dataKey="current" name="Current" stroke={COLORS.current} strokeWidth={3} dot={false} hide={!visibility.current} />
        <Line yAxisId="power" type="monotone" dataKey="power" name="Power" stroke={COLORS.power} strokeWidth={3} dot={false} hide={!visibility.power} />
        <Line yAxisId="efficiency" type="monotone" dataKey="efficiency" name="Efficiency" stroke={COLORS.efficiency} strokeWidth={3} dot={false} hide={!visibility.efficiency} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MotorPerformanceChart;