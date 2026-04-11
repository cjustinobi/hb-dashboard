import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { ConsultationBenefit } from '../../types';

interface ConsultationBenefitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<ConsultationBenefit>) => Promise<void>;
  initialData?: ConsultationBenefit | null;
  loading?: boolean;
}

const ConsultationBenefitModal: React.FC<ConsultationBenefitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  loading = false,
}) => {
  const [formData, setFormData] = useState<Partial<ConsultationBenefit>>({
    title: '',
    description: '',
    is_active: true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        description: '',
        is_active: true,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Consultation Benefit' : 'Add Consultation Benefit'}
      width="max-w-md"
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
          <input
            type="text"
            required
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Free Follow-up Session"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all min-h-[100px]"
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe what this benefit provides..."
          />
        </div>

        <div className="flex items-center space-x-2 py-2">
          <input
            type="checkbox"
            id="is_active_benefit"
            className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
          />
          <label htmlFor="is_active_benefit" className="text-sm font-medium text-gray-700">
            Active and available for selection
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-red-900/20 hover:bg-red-700 transition-all disabled:opacity-50 flex items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ConsultationBenefitModal;
