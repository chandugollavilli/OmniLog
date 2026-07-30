import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { Alert } from '../../types';
import { useSocket } from '../../hooks/useSocket';

export const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;
    socket.on('new_alert', (newAlert: Alert) => {
      setAlerts((prev) => [newAlert, ...prev.slice(0, 19)]);
    });
    return () => {
      socket.off('new_alert');
    };
  }, [socket]);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {alerts.length > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-850">
            <h3 className="text-sm font-semibold text-white">Live Notifications</h3>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
              {alerts.length} New
            </span>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-800">
            {alerts.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">
                No active security alerts. System normal.
              </div>
            ) : (
              alerts.map((alert) => (
                <div key={alert.id || Math.random()} className="p-3.5 hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-start gap-3">
                    {alert.severity === 'CRITICAL' || alert.severity === 'HIGH' ? (
                      <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-200">{alert.title}</p>
                      <p className="text-xs text-slate-400 line-clamp-2">{alert.description}</p>
                      <p className="text-[10px] text-slate-500">{new Date(alert.createdAt || Date.now()).toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
