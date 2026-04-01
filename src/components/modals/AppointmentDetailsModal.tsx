import React from 'react';
import Modal from '../common/Modal';
import { AppointmentResponse } from '../../types';
import { formatDate } from '../../utils/time';

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentResponse | null;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
    <p className="text-sm font-bold text-gray-900">{title}</p>
    {children}
  </div>
);

const InfoRow: React.FC<{ label: string; value: string; valueClass?: string }> = ({
  label,
  value,
  valueClass = 'text-gray-900',
}) => (
  <div className="flex justify-between items-center border-t border-gray-100 pt-3 first:border-0 first:pt-0">
    <span className="text-sm text-gray-400">{label}</span>
    <span className={`text-sm font-medium ${valueClass}`}>{value}</span>
  </div>
);

const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
  isOpen,
  onClose,
  appointment,
}) => {
  if (!appointment) return null;

  const { appointment: appt, user, hospital, blood_request: br } = appointment;
  const isMissed = appt.status?.toLowerCase() === 'cancelled' || appt.status?.toLowerCase() === 'missed';
  const isCompleted = appt.status?.toLowerCase() === 'completed';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Appointment Details" width="max-w-lg">
      <div className="px-6 pb-2 space-y-3">
        {/* Donor Information */}
        <Section title="Donor Information">
          <InfoRow
            label="Donor Name"
            value={`${user.first_name} ${user.last_name}`}
            valueClass="text-blue-600"
          />
          <InfoRow label="Blood Type" value={br.blood_type || 'N/A'} />
        </Section>

        {/* Hospital Information */}
        <Section title="Hospital Information">
          <InfoRow
            label="Hospital Name"
            value={hospital.name}
            valueClass="text-blue-600"
          />
          <InfoRow
            label="Location"
            value={[hospital.city, hospital.state, hospital.country].filter(Boolean).join(', ') || 'N/A'}
          />
        </Section>

        {/* Appointment Details */}
        <Section title="Appointment Details">
          <InfoRow label="Scheduled Time" value={formatDate(appt.scheduled_time)} />
          <InfoRow
            label="Reference ID"
            value={`HB-DA-${appt.id.slice(0, 8).toUpperCase()}`}
          />
        </Section>

        {/* Conditional last section */}
        {isCompleted && (
          <Section title="Donation Record">
            <InfoRow
              label="Units Donated"
              value={br.units ? `${br.units * 450}ml` : 'N/A'}
            />
            <InfoRow
              label="Completion Time"
              value={br.donated_at ? formatDate(br.donated_at) : 'N/A'}
            />
          </Section>
        )}

        {isMissed && (
          <Section title="Missed Appointment">
            <InfoRow
              label="Reason"
              value={appt.cancelled_reason || 'No reason provided'}
            />
          </Section>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 pt-4 pb-6 border-t border-gray-100 mt-3">
        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-50 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-sm"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default AppointmentDetailsModal;
