import React from 'react';
import { FirewallLog } from '../../types';
import { Badge } from '../common/Badge';
import { Eye } from 'lucide-react';

interface LogTableProps {
  logs: FirewallLog[];
  onSelectLog: (log: FirewallLog) => void;
}

export const LogTable: React.FC<LogTableProps> = ({ logs, onSelectLog }) => {
  return (
    <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-900 shadow-sm">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-850 text-slate-400 font-semibold uppercase tracking-wider">
            <th className="py-3 px-4">Timestamp</th>
            <th className="py-3 px-4">Device</th>
            <th className="py-3 px-4">Src IP : Port</th>
            <th className="py-3 px-4">Dst IP : Port</th>
            <th className="py-3 px-4">Action</th>
            <th className="py-3 px-4">App / Service</th>
            <th className="py-3 px-4">User</th>
            <th className="py-3 px-4 text-right">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 font-mono">
          {logs.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-8 text-center text-slate-500 font-sans">
                No logs recorded yet or matching search filter.
              </td>
            </tr>
          ) : (
            logs.map((log) => {
              const isAccept = log.action === 'accept' || log.action === 'pass';
              return (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-slate-300 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans font-medium">{log.devname || 'FortiGate'}</td>
                  <td className="py-3 px-4 text-brand-400 font-semibold">
                    {log.srcip}:{log.srcport || '*'}
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {log.dstip}:{log.dstport || '*'}
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <Badge variant={isAccept ? 'accept' : 'deny'}>{log.action || 'unknown'}</Badge>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans">{log.app || log.service || 'N/A'}</td>
                  <td className="py-3 px-4 text-slate-300 font-sans">{log.user || '-'}</td>
                  <td className="py-3 px-4 text-right font-sans">
                    <button
                      onClick={() => onSelectLog(log)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Inspect Log"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
