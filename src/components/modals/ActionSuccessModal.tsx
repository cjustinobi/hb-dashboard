import React from 'react';
import Modal from '../common/Modal';
import { Check } from 'lucide-react';

interface ActionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const ActionSuccessModal: React.FC<ActionSuccessModalProps> = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="max-w-md" hideHeader={true}>
      <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl">
        {/* Animated Checkmark Circles */}
        <div className="relative flex items-center justify-center mb-8 mt-4">
          <div className="absolute w-32 h-32 bg-green-50 rounded-full animate-pulse"></div>
          <div className="absolute w-24 h-24 bg-green-100/50 rounded-full"></div>
          <div className="relative flex items-center justify-center w-16 h-16 bg-transparent z-10">
            <Check strokeWidth={4} className="text-green-500 w-10 h-10" />
          </div>
        </div>

        {/* Text Presentation */}
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 text-base mb-8">{message}</p>

        {/* Done Action */}
        <button
          onClick={onClose}
          className="w-full py-3.5 bg-red-700 text-white font-medium rounded-xl hover:bg-red-800 transition-colors duration-200"
        >
          Done
        </button>
      </div>
    </Modal>
  );
};

export default ActionSuccessModal;
