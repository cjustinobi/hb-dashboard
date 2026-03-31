import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';
import { AdminPatientProfileResponse } from '../../types';
import { formatDate } from '../../utils/time';
import { Loader2, AlertCircle } from 'lucide-react';

interface PatientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string | null;
}

const PatientProfileModal: React.FC<PatientProfileModalProps> = ({ isOpen, onClose, patientId }) => {
  const [data, setData] = useState<AdminPatientProfileResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProfile = useCallback(async () => {
    if (!patientId) return;
    setLoading(true);
    setError('');
    try {
      const response = await api.get<{ data: AdminPatientProfileResponse }>(`/admin/users/${patientId}`);
      setData(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch patient profile');
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    if (isOpen && patientId) {
      fetchProfile();
    } else {
      setData(null);
      setError('');
    }
  }, [isOpen, patientId, fetchProfile]);

  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Patient Profile" 
      width="max-w-3xl"
    >
      <div className="p-8 bg-gray-50/50 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-gray-500 font-medium">Fetching profile details...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 text-red-500">
            <AlertCircle size={40} />
            <p className="font-medium">{error}</p>
            <button 
              onClick={fetchProfile}
              className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : data ? (
          <>
            {/* Basic Information */}
            <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Basic Information</h3>
              <div className="space-y-4">
                <InfoRow label="Name" value={`${data.profile.first_name} ${data.profile.last_name}`} />
                <InfoRow label="Email" value={data.profile.email} />
                <InfoRow label="Phone" value={data.profile.phone || '—'} />
                <InfoRow label="Country" value={data.profile.country || 'Nigeria'} />
                <InfoRow label="Join Date" value={formatDate(data.profile.created_at)} />
                <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-400 font-medium">Status:</span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    data.profile.email_verified 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {data.profile.email_verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
            </section>

            {/* Appointment History */}
            <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Appointment History</h3>
              <div className="space-y-4">
                {data.appointments.length === 0 ? (
                  <p className="text-gray-400 text-sm italic">No appointment history found.</p>
                ) : (
                  data.appointments.map((appt, i) => (
                    <div key={i} className="py-3 border-b border-gray-50 last:border-0">
                      <p className="text-gray-900 font-medium">
                        Consultation with {appt.specialist_name} ({appt.specialty})
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(appt.scheduled_time)} — <span className="capitalize">{appt.status.toLowerCase()}</span>
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Donation History */}
            <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Donation History</h3>
              <div className="space-y-4">
                {data.donations.length === 0 ? (
                  <p className="text-gray-400 text-sm italic">No donation history found.</p>
                ) : (
                  data.donations.map((donation, i) => (
                    <div key={i} className="py-3 border-b border-gray-50 last:border-0">
                      <p className="text-gray-900 font-medium">
                        Blood Donation at {donation.hospital_name}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(donation.created_at)} — <span className="capitalize">{donation.status.toLowerCase()}</span>
                        {donation.blood_type && ` (${donation.blood_type} • ${donation.units || 0}ml)`}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>

            {/* Medical Notes */}
            <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Medical Notes</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {data.profile.medical_notes || 'No medical notes shared by specialists.'}
              </p>
            </section>
          </>
        ) : null}
      </div>
    </Modal>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
    <span className="text-gray-400 font-medium">{label}:</span>
    <span className="text-gray-900 font-bold">{value}</span>
  </div>
);

export default PatientProfileModal;
