import React from 'react';
import { EChartWrapper } from './EChartWrapper';

interface AttackMapProps {
  countries: Array<{ country: string; count: number }>;
}

export const AttackMapChart: React.FC<AttackMapProps> = ({ countries }) => {
  const categories = countries.map((c) => c.country);
  const dataCounts = countries.map((c) => c.count);

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#cbd5e1' },
      splitLine: { lineStyle: { color: '#1e293b' } },
    },
    series: [
      {
        name: 'Attacks / Traffic Count',
        type: 'bar',
        data: dataCounts,
        itemStyle: {
          color: '#ef4444',
          borderRadius: [4, 4, 0, 0],
        },
      },
    ],
  };

  return <EChartWrapper option={option} height="280px" />;
};
