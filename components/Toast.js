'use client';

import { useEffect, useState } from 'react';

export default function Toast({ message, type = 'success' }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const bgColor = type === 'success' ? 'bg-emerald-50 border-emerald-500' : 'bg-red-50 border-red-500';
  const textColor = type === 'success' ? 'text-emerald-800' : 'text-red-800';
  const icon = type === 'success' ? '✅' : '❌';

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
      <div className={`border-l-4 ${bgColor} p-4 rounded-xl shadow-xl bg-white/90 backdrop-blur-sm animate-fade-in-up`}>
        <div className={`flex items-center ${textColor}`}>
          <span className="text-xl mr-3">{icon}</span>
          <span className="font-medium text-sm">{message}</span>
        </div>
      </div>
    </div>
  );
}
