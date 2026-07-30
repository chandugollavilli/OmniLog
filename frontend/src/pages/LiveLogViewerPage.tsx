import React, { useState, useEffect } from 'react';
import { FirewallLog } from '../types';
import { useSocket } from '../hooks/useSocket';
import { LogTable } from '../components/logs/LogTable';
import { LogDetailModal } from '../components/logs/LogDetailModal';
import { Pause, Play, Download, Trash2, Filter } from 'lucide-react';

export const LiveLogViewerPage: React.FC = () => {
  const [logs, setLogs] = useState<FirewallLog[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [filterAction, setFilterAction] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedLog, setSelectedLog] = useState<FirewallLog | null>(null);

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.emit('subscribe:logs');

    socket.on('new_log', (log: FirewallLog) => {
      if (!isPaused) {
        setLogs((prev) => [log, ...prev.slice(0, 199)]);
      }
    });

    return () => {
      socket.emit('unsubscribe:logs');
      socket.off('new_log');
    };
  }, [socket, isPaused]);

  const filteredLogs = logs.filter((log) => {
    if (filterAction !== 'all' && log.action !== filterAction) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        log.srcip?.includes(q) ||
        log.dstip?.includes(q) ||
        log.user?.toLowerCase().includes(q) ||
        log.app?.toLowerCase().includes(q) ||
        log.msg?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `omnilog_live_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Realtime Live Log Stream</h1>
          <p className="text-xs text-slate-400 mt-1">Continuous FortiGate Syslog ingestion over Socket.IO</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
              isPaused
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
            }`}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            <span>{isPaused ? 'Resume Stream' : 'Pause Stream'}</span>
          </button>

          <button
            onClick={() => setLogs([])}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Buffer</span>
          </button>

          <button
            onClick={exportJSON}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-md transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search IP, User, Application, or Message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
          >
            <option value="all">All Actions</option>
            <option value="accept">Accept / Pass</option>
            <option value="deny">Deny / Drop</option>
            <option value="close">Close</option>
          </select>
        </div>
      </div>

      {/* Live Log Table */}
      <LogTable logs={filteredLogs} onSelectLog={(log) => setSelectedLog(log)} />

      <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
};
