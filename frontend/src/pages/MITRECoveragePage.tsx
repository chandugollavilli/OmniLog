import React from 'react';
import { ShieldCheck, Cpu, Target, CheckCircle2 } from 'lucide-react';

export const MITRECoveragePage: React.FC = () => {
  const mitreTactics = [
    {
      name: 'Initial Access',
      techniques: [
        { id: 'T1190', name: 'Exploit Public App', covered: true },
        { id: 'T1566', name: 'Phishing', covered: false },
      ],
    },
    {
      name: 'Execution',
      techniques: [
        { id: 'T1059', name: 'Command Scripting', covered: true },
        { id: 'T1204', name: 'User Execution', covered: true },
      ],
    },
    {
      name: 'Credential Access',
      techniques: [
        { id: 'T1110', name: 'Brute Force', covered: true },
        { id: 'T1003', name: 'OS Credential Dumping', covered: true },
      ],
    },
    {
      name: 'Discovery',
      techniques: [
        { id: 'T1046', name: 'Network Service Scanning', covered: true },
        { id: 'T1087', name: 'Account Discovery', covered: false },
      ],
    },
    {
      name: 'Exfiltration',
      techniques: [
        { id: 'T1041', name: 'Exfiltration Over C2 Channel', covered: true },
        { id: 'T1048', name: 'Exfiltration Over Alternative Protocol', covered: true },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">MITRE ATT&CK Threat Coverage Matrix</h1>
          <p className="text-xs text-slate-400 mt-1">SIEM detection rule mapping to adversary tactics & techniques</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>82% Framework Coverage</span>
        </div>
      </div>

      {/* Grid of Tactics & Techniques */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {mitreTactics.map((tactic, idx) => (
          <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-brand-400 uppercase tracking-wider border-b border-slate-800 pb-2">
              {tactic.name}
            </h3>
            <div className="space-y-2">
              {tactic.techniques.map((tech) => (
                <div
                  key={tech.id}
                  className={`p-2.5 rounded-lg border text-xs space-y-1 transition-all ${
                    tech.covered
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-500'
                  }`}
                >
                  <p className="font-mono font-bold text-[10px]">{tech.id}</p>
                  <p className="font-semibold text-slate-200">{tech.name}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
