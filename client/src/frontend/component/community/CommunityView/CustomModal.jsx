import React from 'react';

function CustomModal({ isOpen, onRequestClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <button onClick={onRequestClose} className="bg-gray-300 text-black p-2 rounded mr-2">Cancel</button>
          <button onClick={onConfirm} className="bg-red-500 text-white p-2 rounded">Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default CustomModal;
