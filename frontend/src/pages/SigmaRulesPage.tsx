import React, { useState } from 'react';
import { Shield, Plus, FileCode, CheckCircle, Play } from 'lucide-react';

export const SigmaRulesPage: React.FC = () => {
  const [rules, setRules] = useState([
    {
      id: 'sigma-001-ssh-deny',
      title: 'Suspicious SSH Connection Denied',
      status: 'ENABLED',
      tactic: 'Credential Access',
      technique: 'T1110',
      hits: 42,
    },
    {
      id: 'sigma-002-port-scan',
      title: 'Multi-Port Probe / Scan Pattern',
      status: 'ENABLED',
      tactic: 'Discovery',
      technique: 'T1046',
      hits: 15,
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Sigma Rule Detection Engine</h1>
          <p className="text-xs text-slate-400 mt-1">Generic YAML detection signatures for cross-platform threat hunting</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-lg shadow-md transition-colors">
          <Plus className="w-4 h-4" />
          <span>Import Sigma Rule (.yml)</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-850 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Rule Title</th>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">MITRE Tactic</th>
              <th className="py-3 px-4">Technique</th>
              <th className="py-3 px-4">Hits</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rules.map((rule) => (
              <tr key={rule.id} className="hover:bg-slate-800/40 font-mono">
                <td className="py-3 px-4 font-bold text-white font-sans">{rule.title}</td>
                <td className="py-3 px-4 text-slate-400">{rule.id}</td>
                <td className="py-3 px-4 text-brand-400 font-sans">{rule.tactic}</td>
                <td className="py-3 px-4 text-emerald-400">{rule.technique}</td>
                <td className="py-3 px-4 text-white font-bold">{rule.hits} Hits</td>
                <td className="py-3 px-4 font-sans">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {rule.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
