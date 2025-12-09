// src/components/Modal.jsx
import React from "react";

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow max-w-2xl w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-600">Cerrar</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
