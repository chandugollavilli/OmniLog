import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'accept' | 'deny' | 'warning' | 'info' | 'critical' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral' }) => {
  const variantStyles = {
    accept: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    deny: 'bg-red-500/10 text-red-400 border-red-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    critical: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    neutral: 'bg-slate-800 text-slate-400 border-slate-700',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantStyles[variant]}`}>
      {children}
    </span>
  );
};
