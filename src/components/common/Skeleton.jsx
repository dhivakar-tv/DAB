import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
      </div>
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
    </div>
  );
}

export function SkeletonTableRows({ rows = 4, cols = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="animate-pulse border-b border-slate-100 dark:border-slate-800">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <td key={cIdx} className="p-4">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3"
        >
          <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
