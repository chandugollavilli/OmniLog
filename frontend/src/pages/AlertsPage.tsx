import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Alert } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Bell, ShieldAlert, CheckCircle, AlertTriangle, Plus } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [ruleForm, setRuleForm] = useState({
    name: 'Brute Force Defense Rule',
    description: 'Trigger alert when >20 denied connections detected from single IP',
    eventType: 'BRUTE_FORCE',
    severity: 'HIGH',
    condition: JSON.stringify({ threshold: 20, windowMins: 5 }),
  });

  const queryClient = useQueryClient();

  const { data: alerts, isLoading } = useQuery<Alert[]>({
    queryKey: ['alerts'],
    queryFn: async () => {
      const res = await api.get('/alerts');
      return res.data;
    },
    refetchInterval: 5000,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await api.patch(`/alerts/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  const createRuleMutation = useMutation({
    mutationFn: async (rule: typeof ruleForm) => {
      await api.post('/alerts/rules', rule);
    },
    onSuccess: () => {
      setIsRuleModalOpen(false);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Security Incident Alerts</h1>
          <p className="text-xs text-slate-400 mt-1">Automated threat engine & SOC incident response queue</p>
        </div>
        <button
          onClick={() => setIsRuleModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-lg shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Alert Rule</span>
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <div className="space-y-3">
          {alerts?.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-xl">
              No active security incidents detected. System monitoring clean.
            </div>
          ) : (
            alerts?.map((alert) => (
              <div key={alert.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl shrink-0 mt-1">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-bold text-white">{alert.title}</h3>
                      <Badge variant={alert.severity === 'CRITICAL' || alert.severity === 'HIGH' ? 'deny' : 'warning'}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400">{alert.description}</p>
                    <div className="flex gap-4 text-[10px] text-slate-500 font-mono pt-1">
                      <span>Source IP: {alert.sourceIp || 'N/A'}</span>
                      <span>Triggered: {new Date(alert.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  {alert.status === 'OPEN' && (
                    <button
                      onClick={() => updateStatusMutation.mutate({ id: alert.id, status: 'ACKNOWLEDGED' })}
                      className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold rounded-lg hover:bg-amber-500/20 transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                  {alert.status !== 'RESOLVED' && (
                    <button
                      onClick={() => updateStatusMutation.mutate({ id: alert.id, status: 'RESOLVED' })}
                      className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-lg hover:bg-emerald-500/20 transition-colors"
                    >
                      Resolve Incident
                    </button>
                  )}
                  {alert.status === 'RESOLVED' && (
                    <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-emerald-400" /> Resolved
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create Rule Modal */}
      <Modal isOpen={isRuleModalOpen} onClose={() => setIsRuleModalOpen(false)} title="Configure Alert Engine Rule">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createRuleMutation.mutate(ruleForm);
          }}
          className="space-y-4 text-xs"
        >
          <div>
            <label className="block font-semibold text-slate-400 mb-1">Rule Name</label>
            <input
              type="text"
              value={ruleForm.name}
              onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-400 mb-1">Event Type</label>
            <select
              value={ruleForm.eventType}
              onChange={(e) => setRuleForm({ ...ruleForm, eventType: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
            >
              <option value="BRUTE_FORCE">Brute Force Attempt</option>
              <option value="PORT_SCAN">Port Scan Activity</option>
              <option value="VPN_FAILED_LOGIN">Failed VPN Login Spike</option>
              <option value="HIGH_BANDWIDTH">High Bandwidth Download</option>
              <option value="MALWARE">UTM Malware Detection</option>
              <option value="SSH_ATTACK">SSH Connection Spike</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-400 mb-1">Severity Level</label>
            <select
              value={ruleForm.severity}
              onChange={(e) => setRuleForm({ ...ruleForm, severity: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 font-semibold text-white rounded-lg transition-colors mt-2"
          >
            Save Alert Rule
          </button>
        </form>
      </Modal>
    </div>
  );
};
