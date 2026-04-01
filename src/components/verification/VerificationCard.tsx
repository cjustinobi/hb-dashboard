import React, { useState } from 'react';
import { ExternalLink, FileText, Building2, User } from 'lucide-react';
import { AdminUser } from '../../types';
import { formatDate } from '../../utils/time';
import PromptModal from '../modals/PromptModal';
import ActionSuccessModal from '../modals/ActionSuccessModal';
import api from '../../services/api';

interface Document {
  name: string;
  url: string | null;
  size?: string;
  uploadedAt?: string;
}

interface VerificationCardProps {
  user: AdminUser;
  type: 'specialist' | 'hospital';
  documents?: Document[];
  onActionComplete: () => void;
}

const VerificationCard: React.FC<VerificationCardProps> = ({
  user,
  type,
  documents = [],
  onActionComplete,
}) => {
  const [rejectModal, setRejectModal] = useState(false);
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });
  const [loading, setLoading] = useState(false);

  const displayName =
    type === 'hospital'
      ? `${user.first_name} ${user.last_name}`.trim()
      : `Dr. ${user.first_name} ${user.last_name}`.trim();

  const handleApprove = async () => {
    setLoading(true);
    try {
      if (type === 'specialist') {
        await api.patch(`/admin/specialists/${user.id}/status`, { verified: true });
      } else {
        await api.patch(`/admin/hospitals/${user.id}/status`, { license_status: true });
      }
      onActionComplete();
      setSuccessModal({
        isOpen: true,
        title: 'Approved Successfully',
        message:
          type === 'specialist'
            ? 'This specialist has been approved and is now active on the platform.'
            : 'This hospital has been approved and is now active on the platform.',
      });
    } catch (err) {
      console.error('Approve failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (reason: string) => {
    setLoading(true);
    try {
      if (type === 'specialist') {
        await api.patch(`/admin/specialists/${user.id}/status`, { verified: false, reason });
      } else {
        await api.patch(`/admin/hospitals/${user.id}/status`, { license_status: false, reason });
      }
      onActionComplete();
      setSuccessModal({
        isOpen: true,
        title: 'Rejected',
        message: 'The verification request has been rejected with the provided reason.',
      });
    } catch (err) {
      console.error('Reject failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center space-x-4 mb-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-100">
              {user.image_url ? (
                <img src={user.image_url} alt={displayName} className="w-full h-full object-cover" />
              ) : type === 'hospital' ? (
                <Building2 className="text-gray-400" size={24} />
              ) : (
                <User className="text-gray-400" size={24} />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">{displayName}</h3>
              <span className="inline-block mt-1 px-2.5 py-0.5 bg-green-50 text-green-700 text-xs font-semibold rounded-full">
                {type === 'hospital' ? 'General Hospital' : 'Specialist'}
              </span>
            </div>
          </div>

          {/* Meta info */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Address:</span>
              <span className="text-gray-700 font-medium text-right max-w-[60%] truncate">
                {user.address || 'Not provided'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Contact Person:</span>
              <span className="text-gray-700 font-medium">{displayName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Applied:</span>
              <span className="text-gray-700 font-medium">{formatDate(user.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="p-5 flex-1">
          <p className="text-sm font-bold text-gray-800 mb-3">Uploaded Documents</p>
          <div className="space-y-2">
            {documents.length > 0 ? (
              documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-blue-50/60 rounded-xl"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-400">
                        {doc.size || '2.4 MB'} · Uploaded {doc.uploadedAt || formatDate(user.created_at)}
                      </p>
                    </div>
                  </div>
                  {doc.url ? (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 text-sm font-semibold hover:underline flex items-center"
                    >
                      View <ExternalLink size={12} className="ml-1" />
                    </a>
                  ) : (
                    <span className="text-gray-300 text-sm">N/A</span>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-400 text-sm italic">
                No documents uploaded.
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-5 pt-0 grid grid-cols-2 gap-3">
          <button
            onClick={handleApprove}
            disabled={loading}
            className="py-3 bg-green-700 text-white text-sm font-semibold rounded-xl hover:bg-green-800 transition-colors disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={() => setRejectModal(true)}
            disabled={loading}
            className="py-3 bg-white border border-red-300 text-red-500 text-sm font-semibold rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            Reject With reason
          </button>
        </div>
      </div>

      <PromptModal
        isOpen={rejectModal}
        onClose={() => setRejectModal(false)}
        onSubmit={handleReject}
        title="Reject Verification"
        message={`Please provide a clear reason for rejecting this ${type}'s verification request.`}
        placeholder="Reason for rejection..."
        submitText="Reject"
        isDestructive={true}
      />

      <ActionSuccessModal
        isOpen={successModal.isOpen}
        onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
        title={successModal.title}
        message={successModal.message}
      />
    </>
  );
};

export default VerificationCard;
