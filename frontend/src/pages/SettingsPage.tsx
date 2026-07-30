import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Settings, Cpu, HardDrive, Shield, Server, CheckCircle, RefreshCw } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { data: health, isLoading, refetch } = useQuery({
    queryKey: ['systemHealth'],
    queryFn: async () => {
      const res = await api.get('/health');
      return res.data;
    },
    refetchInterval: 5000,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">System Settings & Health Diagnostics</h1>
          <p className="text-xs text-slate-400 mt-1">Syslog listener status, PostgreSQL health, memory utilization</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors border border-slate-700"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Diagnostics</span>
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Node & Memory Health */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-lg">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Backend Process Engine</h3>
                <p className="text-xs text-slate-400 font-mono">Uptime: {Math.round((health?.uptime || 0) / 60)} Minutes</p>
              </div>
            </div>

            <div className="text-xs space-y-2 pt-2 border-t border-slate-800 text-slate-300">
              <p className="flex justify-between"><span className="text-slate-400">Database Link:</span> <span className="font-semibold text-emerald-400">{health?.database}</span></p>
              <p className="flex justify-between"><span className="text-slate-400">Memory RSS:</span> <span className="font-mono text-white">{health?.memory?.rssMB} MB</span></p>
              <p className="flex justify-between"><span className="text-slate-400">Heap Used:</span> <span className="font-mono text-white">{health?.memory?.heapUsedMB} / {health?.memory?.heapTotalMB} MB</span></p>
            </div>
          </div>

          {/* Syslog Receiver Ports */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Syslog Ingestion Ports</h3>
                <p className="text-xs text-slate-400">Configured FortiGate forwarding endpoints</p>
              </div>
            </div>

            <div className="text-xs space-y-2 pt-2 border-t border-slate-800 text-slate-300">
              <p className="flex justify-between"><span className="text-slate-400">UDP Syslog Listener:</span> <span className="font-mono text-emerald-400">Port 514 / 5140 (UDP)</span></p>
              <p className="flex justify-between"><span className="text-slate-400">TCP Syslog Listener:</span> <span className="font-mono text-emerald-400">Port 514 / 5140 (TCP)</span></p>
              <p className="flex justify-between"><span className="text-slate-400">TLS Encrypted Syslog:</span> <span className="font-mono text-emerald-400">Port 6514 (TLS)</span></p>
              <p className="flex justify-between"><span className="text-slate-400">Log Queue Depth:</span> <span className="font-mono text-white">{health?.queue?.queueLength || 0} buffered logs</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
