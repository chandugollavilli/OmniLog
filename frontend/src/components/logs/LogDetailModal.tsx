import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { FirewallLog } from '../../types';
import { Badge } from '../common/Badge';

interface LogDetailProps {
  log: FirewallLog | null;
  onClose: () => void;
}

export const LogDetailModal: React.FC<LogDetailProps> = ({ log, onClose }) => {
  const [activeTab, setActiveTab] = useState<'structured' | 'json' | 'raw'>('structured');

  if (!log) return null;

  const isAccept = log.action === 'accept' || log.action === 'pass';

  return (
    <Modal isOpen={!!log} onClose={onClose} title={`Firewall Log Entry #${log.id.substring(0, 8)}`}>
      <div className="space-y-4">
        {/* Tab Headers */}
        <div className="flex gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('structured')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'structured' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Structured View
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'json' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            JSON Payload
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'raw' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Raw Syslog
          </button>
        </div>

        {activeTab === 'structured' && (
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
              <p className="text-slate-400">Timestamp: <span className="text-white font-mono">{new Date(log.timestamp).toLocaleString()}</span></p>
              <p className="text-slate-400">Device Name: <span className="text-white font-semibold">{log.devname || 'N/A'}</span></p>
              <p className="text-slate-400">Device Serial: <span className="text-white font-mono">{log.devid || 'N/A'}</span></p>
              <p className="text-slate-400">Log Type / Subtype: <span className="text-white">{log.type} / {log.subtype}</span></p>
              <p className="text-slate-400">Action: <Badge variant={isAccept ? 'accept' : 'deny'}>{log.action || 'unknown'}</Badge></p>
              <p className="text-slate-400">Log Level: <span className="text-amber-400 font-semibold">{log.level || 'info'}</span></p>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
              <p className="text-slate-400">Source IP: <span className="text-brand-400 font-mono font-semibold">{log.srcip || 'N/A'}</span>:{log.srcport}</p>
              <p className="text-slate-400">Destination IP: <span className="text-brand-400 font-mono font-semibold">{log.dstip || 'N/A'}</span>:{log.dstport}</p>
              <p className="text-slate-400">User: <span className="text-white font-semibold">{log.user || 'N/A'}</span></p>
              <p className="text-slate-400">Application: <span className="text-emerald-400 font-semibold">{log.app || 'N/A'}</span></p>
              <p className="text-slate-400">Policy: <span className="text-white">{log.polname || `ID ${log.policyid}`}</span></p>
              <p className="text-slate-400">Bytes Sent / Rcvd: <span className="text-white font-mono">{log.sentbyte || 0} / {log.rcvdbyte || 0} B</span></p>
            </div>
          </div>
        )}

        {activeTab === 'json' && (
          <pre className="p-4 bg-slate-950 rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto border border-slate-800">
            {JSON.stringify(log, null, 2)}
          </pre>
        )}

        {activeTab === 'raw' && (
          <div className="p-4 bg-slate-950 rounded-lg text-xs font-mono text-slate-300 break-all border border-slate-800">
            {log.raw}
          </div>
        )}
      </div>
    </Modal>
  );
};
