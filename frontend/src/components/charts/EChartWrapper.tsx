import React from 'react';
import ReactECharts from 'echarts-for-react';

interface EChartWrapperProps {
  option: any;
  height?: string;
}

export const EChartWrapper: React.FC<EChartWrapperProps> = ({ option, height = '300px' }) => {
  return (
    <ReactECharts
      option={option}
      style={{ height, width: '100%' }}
      theme="dark"
      opts={{ renderer: 'canvas' }}
    />
  );
};
