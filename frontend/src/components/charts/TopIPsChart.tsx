import React from 'react';
import { EChartWrapper } from './EChartWrapper';

interface TopIPsProps {
  data: Array<{ ip: string; count: number }>;
  title?: string;
}

export const TopIPsChart: React.FC<TopIPsProps> = ({ data, title = 'Top Source IPs' }) => {
  const ips = data.map((d) => d.ip);
  const counts = data.map((d) => d.count);

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
      type: 'value',
      axisLabel: { color: '#94a3b8' },
      splitLine: { lineStyle: { color: '#1e293b' } },
    },
    yAxis: {
      type: 'category',
      data: ips.reverse(),
      axisLabel: { color: '#cbd5e1', fontSize: 11 },
    },
    series: [
      {
        name: 'Logs Count',
        type: 'bar',
        data: counts.reverse(),
        itemStyle: {
          color: '#3b82f6',
          borderRadius: [0, 4, 4, 0],
        },
      },
    ],
  };

  return <EChartWrapper option={option} height="260px" />;
};
