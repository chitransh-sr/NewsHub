import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export const Toast = ({ toast, onClose }) => {
  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 size={18} className="toast-icon success" />,
    error: <AlertCircle size={18} className="toast-icon error" />,
    info: <Info size={18} className="toast-icon info" />
  };

  return (
    <div className={`toast-notification ${toast.type || "info"}`}>
      <div className="toast-content">
        {icons[toast.type] || icons.info}
        <span>{toast.message}</span>
      </div>
      <button className="toast-close" onClick={onClose} aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  );
};

export default Toast;
