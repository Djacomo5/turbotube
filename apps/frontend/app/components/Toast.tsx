'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface ToastContextType {
  toast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            const isSuccess = t.type === 'success';
            const isError = t.type === 'error';
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                className="pointer-events-auto flex items-center justify-between p-4 rounded-xl border glass-panel shadow-lg"
                style={{
                  borderColor: isSuccess
                    ? 'rgba(34, 197, 94, 0.3)'
                    : isError
                    ? 'rgba(239, 68, 68, 0.3)'
                    : 'rgba(255, 0, 60, 0.3)',
                  boxShadow: isSuccess
                    ? '0 4px 20px rgba(34, 197, 94, 0.05)'
                    : isError
                    ? '0 4px 20px rgba(239, 68, 68, 0.05)'
                    : '0 4px 20px rgba(255, 0, 60, 0.05)',
                }}
              >
                <div className="flex items-center gap-3">
                  {isSuccess && <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />}
                  {isError && <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />}
                  {!isSuccess && !isError && <Info className="w-5 h-5 text-brand shrink-0" />}
                  <span className="text-sm font-medium text-zinc-100">{t.message}</span>
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="ml-4 text-zinc-400 hover:text-zinc-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
