import React from 'react';
import { EChartWrapper } from './EChartWrapper';

interface TrafficProps {
  allowed: number;
  denied: number;
}

export const TrafficDistributionChart: React.FC<TrafficProps> = ({ allowed, denied }) => {
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      bottom: '0%',
      textStyle: { color: '#94a3b8' },
    },
    series: [
      {
        name: 'Traffic Status',
        type: 'pie',
        radius: ['50%', '75%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: '#0f172a',
          borderWidth: 2,
        },
        label: { show: false },
        data: [
          { value: allowed, name: 'Allowed', itemStyle: { color: '#10b981' } },
          { value: denied, name: 'Denied / Dropped', itemStyle: { color: '#ef4444' } },
        ],
      },
    ],
  };

  return <EChartWrapper option={option} height="260px" />;
};
