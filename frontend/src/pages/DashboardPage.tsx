import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { DashboardMetrics, FirewallLog } from '../types';
import { StatCard } from '../components/common/StatCard';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { TrafficDistributionChart } from '../components/charts/TrafficDistributionChart';
import { TopIPsChart } from '../components/charts/TopIPsChart';
import { LogTable } from '../components/logs/LogTable';
import { LogDetailModal } from '../components/logs/LogDetailModal';
import { useSocket } from '../hooks/useSocket';
import { Activity, ShieldCheck, ShieldAlert, Cpu, Radio, Globe } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [selectedLog, setSelectedLog] = useState<FirewallLog | null>(null);
  const [liveLogs, setLiveLogs] = useState<FirewallLog[]>([]);
  const { socket } = useSocket();

  const { data: metrics, isLoading, refetch } = useQuery<DashboardMetrics>({
    queryKey: ['dashboardMetrics'],
    queryFn: async () => {
      const res = await api.get('/dashboard/metrics');
      return res.data;
    },
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (!socket) return;
    socket.emit('subscribe:logs');

    socket.on('new_log', (log: FirewallLog) => {
      setLiveLogs((prev) => [log, ...prev.slice(0, 9)]);
    });

    return () => {
      socket.emit('unsubscribe:logs');
      socket.off('new_log');
    };
  }, [socket]);

  if (isLoading || !metrics) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Security Operations Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">FortiGate Firewall Log Analytics & Real-Time Threat Stream</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-semibold self-start sm:self-auto">
          <Radio className="w-4 h-4 animate-pulse" />
          <span>Syslog Listener Active</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Logs Processed"
          value={metrics.totalLogs.toLocaleString()}
          icon={Activity}
          change="+12.4%"
          isPositive={true}
          color="blue"
        />
        <StatCard
          title="Allowed Connections"
          value={metrics.allowedCount.toLocaleString()}
          icon={ShieldCheck}
          color="emerald"
        />
        <StatCard
          title="Denied / Dropped Traffic"
          value={metrics.deniedCount.toLocaleString()}
          icon={ShieldAlert}
          color="red"
        />
        <StatCard
          title="Threat Events / UTM"
          value={metrics.threatEventsCount.toLocaleString()}
          icon={Cpu}
          color="amber"
        />
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-white mb-4">Traffic Action Distribution</h3>
          <TrafficDistributionChart allowed={metrics.allowedCount} denied={metrics.deniedCount} />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-white mb-4">Top Source Attackers / IPs</h3>
          <TopIPsChart data={metrics.topSrcIps} title="Top Source IPs" />
        </div>
      </div>

      {/* Top Applications & Top Destination IPs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-white mb-4">Top Applications Detected</h3>
          <div className="space-y-3">
            {metrics.topApps.length === 0 ? (
              <p className="text-xs text-slate-500">No application data yet.</p>
            ) : (
              metrics.topApps.map((app, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="font-semibold text-slate-300">{app.name}</span>
                  <span className="font-mono text-brand-400">{app.count.toLocaleString()} Logs</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-white mb-4">Top Target Destination IPs</h3>
          <div className="space-y-3">
            {metrics.topDstIps.length === 0 ? (
              <p className="text-xs text-slate-500">No destination data yet.</p>
            ) : (
              metrics.topDstIps.map((dst, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="font-mono text-slate-300">{dst.ip}</span>
                  <span className="font-mono text-emerald-400">{dst.count.toLocaleString()} Hits</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Live Log Ticker */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Live Stream Ticker</h3>
          <span className="text-xs text-slate-400">Auto-refreshing via WebSockets</span>
        </div>
        <LogTable logs={liveLogs} onSelectLog={(log) => setSelectedLog(log)} />
      </div>

      <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
};
