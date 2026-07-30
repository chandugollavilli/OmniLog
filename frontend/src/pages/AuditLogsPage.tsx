import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { AuditLog } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { FileCode2, ShieldCheck } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { data, isLoading } = useQuery<{ logs: AuditLog[] }>({
    queryKey: ['auditLogs'],
    queryFn: async () => {
      const res = await api.get('/audit');
      return res.data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <h1 className="text-xl font-bold text-white tracking-tight">System Audit Trail</h1>
        <p className="text-xs text-slate-400 mt-1">Immutable administrative audit history for security compliance</p>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-850 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono">
              {data?.logs?.map((audit) => (
                <tr key={audit.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {new Date(audit.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-brand-400 font-bold font-sans">{audit.action}</td>
                  <td className="py-3 px-4 text-slate-200 font-sans">{audit.user?.username || 'System'}</td>
                  <td className="py-3 px-4 text-slate-300">{audit.ipAddress || '-'}</td>
                  <td className="py-3 px-4 text-slate-400 font-sans">{audit.details || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
