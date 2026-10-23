import React, { useState, useRef, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { Bell, Check, Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';

export default function NotificationDropdown() {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllRead, loadNotifications } =
    useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user?.uid) {
      loadNotifications(user.uid);
    }
  }, [user, loadNotifications]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const typeIcons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />,
    error: <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />,
    info: <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />,
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        aria-label="Notifications"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="text-xs bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-300 font-medium px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead(user?.uid)}
                className="text-xs text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1 font-medium"
              >
                <Check className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No notifications right now
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.notificationId}
                  onClick={() => !notif.read && markAsRead(notif.notificationId)}
                  className={`p-3.5 flex items-start gap-3 transition cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                    !notif.read ? 'bg-sky-50/50 dark:bg-sky-950/20' : ''
                  }`}
                >
                  {typeIcons[notif.type] || typeIcons.info}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <p
                        className={`text-xs font-semibold truncate ${
                          !notif.read
                            ? 'text-slate-900 dark:text-white font-bold'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {notif.title}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {notif.createdAt ? formatDate(notif.createdAt) : ''}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0 mt-1.5" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
