import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Radio,
  Search,
  Shield,
  Bell,
  FileText,
  Users,
  FileCode2,
  Settings,
  ShieldCheck,
  Bot,
  AlertOctagon,
  Target,
  Layers,
  FileCode,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Security Copilot', href: '/ai-assistant', icon: Bot },
  { name: 'SOC Incident Board', href: '/incidents', icon: AlertOctagon },
  { name: 'MITRE ATT&CK Matrix', href: '/mitre-matrix', icon: Target },
  { name: 'Sigma Rule Engine', href: '/sigma-rules', icon: FileCode },
  { name: 'Pipeline Performance', href: '/pipeline-health', icon: Layers },
  { name: 'Live Log Viewer', href: '/live-logs', icon: Radio },
  { name: 'Log Search', href: '/search', icon: Search },
  { name: 'Firewalls', href: '/devices', icon: Shield },
  { name: 'Alerts', href: '/alerts', icon: Bell },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Audit Logs', href: '/audit-logs', icon: FileCode2 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-800">
          <div className="p-2 bg-gradient-to-tr from-brand-600 to-blue-400 rounded-lg shadow-lg shadow-brand-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">OmniLog V3</h1>
            <p className="text-xs text-slate-400 font-medium">Enterprise SIEM Platform</p>
          </div>
        </div>

        <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-600/20 text-brand-400 border border-brand-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};
