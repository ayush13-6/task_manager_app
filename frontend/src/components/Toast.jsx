import { useState } from 'react';

// Simple toast hook — call show(message, type) to show a notification
export function useToast() {
  const [toasts, setToasts] = useState([]);

  function show(message, type = 'success') {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    // Auto-remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }

  return { toasts, show };
}

// Renders all active toasts in bottom-right corner
export function ToastList({ toasts }) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-50">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            px-4 py-3 rounded-xl text-sm font-medium shadow-xl animate-fade-up
            border backdrop-blur-sm
            ${toast.type === 'error'
              ? 'bg-red-950/90 border-red-800 text-red-300'
              : 'bg-green-950/90 border-green-800 text-green-300'
            }
          `}
        >
          {toast.type === 'error' ? '✗' : '✓'} {toast.message}
        </div>
      ))}
    </div>
  );
}
