import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Badge } from '../components/common/Badge';
import { ShieldAlert, CheckCircle, Clock, Plus, UserCheck } from 'lucide-react';

export const IncidentBoardPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: incidents, isLoading } = useQuery<any[]>({
    queryKey: ['incidents'],
    queryFn: async () => {
      const res = await api.get('/incidents');
      return res.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await api.patch(`/incidents/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">SOC Incident Management Board</h1>
          <p className="text-xs text-slate-400 mt-1">Incident triage, owner assignment, timeline history, and SLA tracking</p>
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column: NEW */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="text-xs font-bold text-slate-200 uppercase">New Triage</span>
              <span className="text-xs font-mono bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20">
                {incidents?.filter((i) => i.status === 'NEW').length || 0}
              </span>
            </div>
            {incidents
              ?.filter((i) => i.status === 'NEW')
              .map((incident) => (
                <div key={incident.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-white">{incident.title}</h4>
                    <Badge variant={incident.severity === 'HIGH' || incident.severity === 'CRITICAL' ? 'deny' : 'warning'}>
                      {incident.severity}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400">{incident.description}</p>
                  <button
                    onClick={() => updateStatusMutation.mutate({ id: incident.id, status: 'INVESTIGATING' })}
                    className="w-full py-1.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-[11px] rounded-lg transition-colors"
                  >
                    Start Investigation
                  </button>
                </div>
              ))}
          </div>

          {/* Column: INVESTIGATING */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="text-xs font-bold text-amber-400 uppercase">Investigating</span>
              <span className="text-xs font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
                {incidents?.filter((i) => i.status === 'INVESTIGATING').length || 0}
              </span>
            </div>
            {incidents
              ?.filter((i) => i.status === 'INVESTIGATING')
              .map((incident) => (
                <div key={incident.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm hover:border-slate-700 transition-colors">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-white">{incident.title}</h4>
                    <Badge variant="warning">{incident.severity}</Badge>
                  </div>
                  <p className="text-[11px] text-slate-400">{incident.description}</p>
                  <button
                    onClick={() => updateStatusMutation.mutate({ id: incident.id, status: 'RESOLVED' })}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] rounded-lg transition-colors"
                  >
                    Mark Resolved
                  </button>
                </div>
              ))}
          </div>

          {/* Column: RESOLVED */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg">
              <span className="text-xs font-bold text-emerald-400 uppercase">Resolved</span>
              <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {incidents?.filter((i) => i.status === 'RESOLVED').length || 0}
              </span>
            </div>
            {incidents
              ?.filter((i) => i.status === 'RESOLVED')
              .map((incident) => (
                <div key={incident.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm opacity-75">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-white">{incident.title}</h4>
                    <Badge variant="accept">Resolved</Badge>
                  </div>
                  <p className="text-[11px] text-slate-400">{incident.description}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
