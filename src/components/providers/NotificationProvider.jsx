'use client';

import React from 'react';
import { useNotificationsStore } from '@/lib/store';
import { Toast } from '@/components/ui';

export function NotificationProvider({ children }) {
  const { notifications, removeNotification } = useNotificationsStore();

  return (
    <>
      {children}
      
      {/* Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm w-full">
        {notifications.map((notification) => (
          <Toast
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </>
  );
}
