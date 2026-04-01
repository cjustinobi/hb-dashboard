import React from 'react';
import Modal from '../common/Modal';
import { AppointmentResponse } from '../../types';
import { formatDate, calculateAge } from '../../utils/time';
import { Star } from 'lucide-react';

interface CareDetailsModalProps {
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

const InfoRow: React.FC<{ label: string; value: string | React.ReactNode; valueClass?: string }> = ({
  label,
  value,
  valueClass = 'text-gray-900',
}) => (
  <div className="flex justify-between items-center border-t border-gray-100 pt-3 first:border-0 first:pt-0">
    <span className="text-sm text-gray-400">{label}</span>
    <div className={`text-sm font-medium ${valueClass}`}>{value}</div>
  </div>
);

const CareDetailsModal: React.FC<CareDetailsModalProps> = ({
  isOpen,
  onClose,
  appointment,
}) => {
  if (!appointment) return null;

  const { 
    appointment: appt, 
    user, 
    specialist, 
    specialist_info, 
    specialty,
    blood_request: br 
  } = appointment;

  const formatConsultationType = (type?: string) => {
    if (!type) return 'In Person';
    return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Care Appointment Details" width="max-w-lg">
      <div className="px-6 pb-6 space-y-4">
        {/* Basic Information */}
        <Section title="Basic Information">
          <InfoRow label="Name:" value={`${user.first_name} ${user.last_name}`} />
          <InfoRow label="Age:" value={user.dob ? calculateAge(user.dob) : 'N/A'} />
          <InfoRow label="Gender:" value={user.gender || 'N/A'} />
          <InfoRow label="Contact:" value={user.phone || user.email} />
        </Section>

        {/* Specialist Information */}
        <Section title="Specialist Information">
          <InfoRow label="Name:" value={`Dr. ${specialist.first_name} ${specialist.last_name}`} />
          <InfoRow label="Specialty:" value={specialty?.name || 'General'} />
          <InfoRow label="Experience:" value={specialist_info?.years_of_experience ? `${specialist_info.years_of_experience}+ years` : 'N/A'} />
          <InfoRow 
            label="Rating:" 
            value={
              <div className="flex items-center space-x-1">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                <span>4.5</span>
              </div>
            } 
          />
        </Section>

        {/* Consultation Details */}
        <Section title="Consultation Details">
          <InfoRow label="Date & Time:" value={formatDate(appt.scheduled_time)} />
          <InfoRow label="Type:" value={formatConsultationType(specialist_info?.consultation_type)} />
          <InfoRow label="Reference ID:" value={`HB-DA-${appt.id.slice(0, 8).toUpperCase()}`} />
        </Section>

        {/* Symptoms & Medical Details */}
        <Section title="Symptoms & Medical Details">
          <InfoRow 
            label="Severity:" 
            value={br.urgency || 'Normal'} 
            valueClass={
              br.urgency === 'Emergency' ? 'text-red-600' : 
              br.urgency === 'Urgent' ? 'text-amber-600' : 
              'text-blue-600'
            }
          />
        </Section>
      </div>

      <div className="px-6 pb-6">
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

export default CareDetailsModal;
