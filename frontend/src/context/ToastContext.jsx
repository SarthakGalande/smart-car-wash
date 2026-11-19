import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type, message, title, duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message, title }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, [removeToast]);

  const toast = {
    success: (msg, title = 'Success') => addToast('success', msg, title),
    error: (msg, title = 'Error') => addToast('danger', msg, title),
    warning: (msg, title = 'Notice') => addToast('warning', msg, title),
    info: (msg, title = 'Information') => addToast('info', msg, title)
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={20} className="text-success flex-shrink-0" />;
      case 'danger': return <AlertCircle size={20} className="text-danger flex-shrink-0" />;
      case 'warning': return <AlertTriangle size={20} className="text-warning flex-shrink-0" />;
      default: return <Info size={20} className="text-info flex-shrink-0" />;
    }
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="scw-toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`scw-toast toast-${t.type}`}>
            {getIcon(t.type)}
            <div className="flex-grow-1">
              {t.title && <div className="fw-bold small">{t.title}</div>}
              <div className="small opacity-90">{t.message}</div>
            </div>
            <button
              type="button"
              className="btn btn-sm text-white p-0 opacity-75 hover-opacity-100"
              onClick={() => removeToast(t.id)}
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
