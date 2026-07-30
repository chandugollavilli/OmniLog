import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Report } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { FileText, Download, Plus, FileSpreadsheet, Calendar } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [reportType, setReportType] = useState('DAILY');
  const [format, setFormat] = useState<'PDF' | 'CSV'>('PDF');
  const [title, setTitle] = useState('Daily Executive Security Audit Report');

  const queryClient = useQueryClient();

  const { data: reports, isLoading } = useQuery<Report[]>({
    queryKey: ['reports'],
    queryFn: async () => {
      const res = await api.get('/reports');
      return res.data;
    },
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const startDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const endDate = new Date().toISOString();

      await api.post('/reports/generate', {
        title,
        type: reportType,
        format,
        startDate,
        endDate,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Compliance & Executive Reports</h1>
          <p className="text-xs text-slate-400 mt-1">Generate PDF and CSV reports for FortiGate security audits</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500"
          />
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as 'PDF' | 'CSV')}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-500"
          >
            <option value="PDF">PDF Report</option>
            <option value="CSV">CSV Data Export</option>
          </select>
          <button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-lg shadow-md transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>{generateMutation.isPending ? 'Compiling...' : 'Generate Report'}</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports?.length === 0 ? (
            <div className="col-span-full p-8 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-xl">
              No reports generated yet. Click "Generate Report" above to compile a PDF/CSV audit document.
            </div>
          ) : (
            reports?.map((report) => (
              <div key={report.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 hover:border-slate-700 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-lg">
                    {report.format === 'PDF' ? <FileText className="w-6 h-6 text-red-400" /> : <FileSpreadsheet className="w-6 h-6 text-emerald-400" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{report.title}</h3>
                    <p className="text-[10px] text-slate-400 font-mono">{report.type} Audit Report</p>
                  </div>
                </div>

                <div className="text-xs text-slate-400 pt-2 border-t border-slate-800 space-y-1">
                  <p className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-500" /> Generated: {new Date(report.createdAt).toLocaleString()}</p>
                </div>

                <a
                  href={report.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold rounded-lg transition-colors border border-slate-700"
                >
                  <Download className="w-4 h-4" /> Download {report.format}
                </a>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
