import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/dbService';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Add toast notification
  const showToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newToast = { id, message, type };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch in-app notifications
  const loadNotifications = useCallback(async (userId) => {
    if (!userId) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    try {
      const items = await getNotifications(userId);
      setNotifications(items);
      const unread = items.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Failed to load notifications', err);
    }
  }, []);

  const markAsRead = async (notifId) => {
    await markNotificationAsRead(notifId);
    setNotifications((prev) =>
      prev.map((n) => (n.notificationId === notifId ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllRead = async (userId) => {
    await markAllNotificationsAsRead(userId);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        showToast,
        removeToast,
        notifications,
        unreadCount,
        loadNotifications,
        markAsRead,
        markAllRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
