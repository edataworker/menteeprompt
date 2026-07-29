import { useEffect, useState } from 'react';

export default function Toast({ message, type = 'success' }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const bgColor = type === 'success' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const icon = type === 'success' ? '✅' : '❌';

  return (
    <div
      className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 border-l-4 ${bgColor} p-4 rounded-lg shadow-lg max-w-md w-full mx-4 z-50`}
    >
      <div className={`flex items-center ${textColor}`}>
        <span className="text-xl mr-3">{icon}</span>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  );
}