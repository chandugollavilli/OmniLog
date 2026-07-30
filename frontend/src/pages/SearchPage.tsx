import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { FirewallLog } from '../types';
import { LogTable } from '../components/logs/LogTable';
import { LogDetailModal } from '../components/logs/LogDetailModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Search, Filter, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [ip, setIp] = useState('');
  const [action, setAction] = useState('');
  const [user, setUser] = useState('');
  const [selectedLog, setSelectedLog] = useState<FirewallLog | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['searchLogs', page, search, ip, action, user],
    queryFn: async () => {
      const res = await api.get('/logs', {
        params: { page, limit: 50, search, ip, action, user },
      });
      return res.data;
    },
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <h1 className="text-xl font-bold text-white tracking-tight">Historical Log Search</h1>
        <p className="text-xs text-slate-400 mt-1">Faceted query builder across millions of FortiGate Syslogs</p>

        <form onSubmit={handleSearchSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search Keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
          <input
            type="text"
            placeholder="Filter Source or Dst IP..."
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
          <input
            type="text"
            placeholder="Filter Username..."
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
          >
            <option value="">All Actions</option>
            <option value="accept">Accept</option>
            <option value="deny">Deny</option>
            <option value="close">Close</option>
          </select>

          <button
            type="submit"
            className="md:col-span-4 flex items-center justify-center gap-2 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-lg text-xs transition-colors shadow-md"
          >
            <Search className="w-4 h-4" />
            <span>Execute Search Query</span>
          </button>
        </form>
      </div>

      {/* Results Section */}
      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Found {data?.total || 0} matching log entries</span>
            <span>Page {data?.page || 1} of {data?.totalPages || 1}</span>
          </div>

          <LogTable logs={data?.logs || []} onSelectLog={(log) => setSelectedLog(log)} />

          {/* Pagination */}
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <button
              disabled={page >= (data?.totalPages || 1)}
              onClick={() => setPage(page + 1)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:bg-slate-800 disabled:opacity-50"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <LogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  );
};
