import React from 'react';
import { STATUS_COLORS } from '../../utils/constants';

export default function Badge({ status, className = '' }) {
  const styling = STATUS_COLORS[status] || {
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
    dot: 'bg-slate-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${styling.badge} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styling.dot}`} />
      {status}
    </span>
  );
}
