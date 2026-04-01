import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  title: string;
  message: string;
  placeholder?: string;
  submitText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

const PromptModal: React.FC<PromptModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  message,
  placeholder = 'Type here...',
  submitText = 'Submit',
  cancelText = 'Cancel',
  isDestructive = false,
}) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (isOpen) {
      setValue(''); // Reset on open
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSubmit(value);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="max-w-md" hideHeader={true}>
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-2xl flex flex-col w-full">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 mb-6">{message}</p>
        
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full mb-8 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
          autoFocus
        />

        <div className="flex w-full space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="submit"
            disabled={!value.trim()}
            className={`flex-1 py-3 px-4 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              isDestructive 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {submitText}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PromptModal;
