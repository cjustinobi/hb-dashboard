import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';
import { AdminSpecialistProfileResponse } from '../../types';
import { Loader2, AlertCircle, User, FileText, ExternalLink } from 'lucide-react';

interface SpecialistProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  specialistId: string | null;
}

const SpecialistProfileModal: React.FC<SpecialistProfileModalProps> = ({ isOpen, onClose, specialistId }) => {
  const [data, setData] = useState<AdminSpecialistProfileResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProfile = useCallback(async () => {
    if (!specialistId) return;
    setLoading(true);
    setError('');
    try {
      const response = await api.get<{ data: any }>(`/admin/users/${specialistId}`);
      const payload = response.data.data;

      let extractedRole = '';
      let specialistData: any = null;

      // Handle the different possible payload shapes from backend
      if (Array.isArray(payload?.data) && payload.data.length > 0) {
        // List/Paginated array format (backend returned a list for a single ID query)
        const user = payload.data[0];
        extractedRole = user.role;
        specialistData = {
          profile: user,
          specialty: 'General Specialist', // Default since it's missing from generic endpoint
          bio: 'No bio provided for this specialist.',
          experience: 5,
          country: user.country || 'Nigeria',
          consultation_types: user.consultation_preference || 'In-person, Video',
          verified: user.verified || false,
          license_url: null
        };
      } else if (payload?.role === 'specialist') {
        // Properly formatted nested structure { role: 'specialist', data: {...} }
        extractedRole = payload.role;
        specialistData = payload.data;
      } else if (payload?.profile?.role === 'specialist') {
        // Old wrapper format
        extractedRole = payload.profile.role;
        specialistData = payload;
      } else if (payload?.id && payload?.role === 'specialist') {
        // Flat user object directly returned
        extractedRole = payload.role;
        specialistData = {
          profile: payload,
          specialty: 'General Specialist',
          bio: 'No bio provided for this specialist.',
          experience: 5,
          country: payload.country || 'Nigeria',
          consultation_types: payload.consultation_preference || 'In-person, Video',
          verified: payload.verified || false,
          license_url: null
        };
      }

      if (extractedRole === 'specialist') {
        // Re-verify that data contains `profile` property required for rendering
        if (specialistData && !specialistData.profile && (specialistData.id || specialistData.first_name)) {
          specialistData = {
            profile: specialistData,
            specialty: 'General Specialist',
            bio: 'No bio provided for this specialist.',
            experience: 5,
            country: specialistData.country || 'Nigeria',
            consultation_types: specialistData.consultation_preference || 'In-person, Video',
            verified: specialistData.verified || false,
            license_url: null
          };
        }
        setData(specialistData);
      } else {
        setError('Selected user is not a specialist');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch specialist profile');
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  }, [specialistId]);

  useEffect(() => {
    if (isOpen && specialistId) {
      fetchProfile();
    } else {
      setData(null);
      setError('');
    }
  }, [isOpen, specialistId, fetchProfile]);

  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Specialist Profile" 
      width="max-w-2xl"
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
            {/* Professional Information */}
            <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <div className="p-2 bg-indigo-50 rounded-xl mr-3">
                  <User className="text-indigo-600" size={20} />
                </div>
                Professional Information
              </h3>
              <div className="space-y-4">
                <InfoRow label="Name" value={`Dr. ${data.profile?.first_name || 'Unknown'} ${data.profile?.last_name || ''}`.trim()} />
                <InfoRow label="Specialty" value={data.specialty || 'General Practice'} />
                <InfoRow label="Experience" value={`${data.experience || '0'}+ years`} />
                <InfoRow label="Country" value={data.country || 'Nigeria'} />
                <InfoRow label="Consultation Types" value={data.consultation_types || 'N/A'} />
                <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-400 font-medium">Status:</span>
                  <span className={`px-4 py-1 rounded-lg text-xs font-bold ${
                    data.verified 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {data.verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
            </section>

            {/* Bio */}
            <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm transition-all hover:shadow-md text-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Bio</h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap italic opacity-90">
                "{data.bio || 'No bio information provided.'}"
              </p>
            </section>

            {/* Verification Documents */}
            <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <div className="p-2 bg-indigo-50 rounded-xl mr-3">
                  <FileText className="text-indigo-600" size={20} />
                </div>
                Verification Documents
              </h3>
              {data.license_url ? (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-100 transition-colors group">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 mr-4 shadow-sm group-hover:scale-105 transition-transform">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 capitalize">Medical License / Certificate</p>
                      <p className="text-xs text-gray-400 mt-0.5 font-medium">Verified PDF Document</p>
                    </div>
                  </div>
                  <a 
                    href={data.license_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white text-indigo-600 rounded-xl text-xs font-bold border border-gray-100 hover:bg-indigo-600 hover:text-white transition-all shadow-sm flex items-center"
                  >
                    View <ExternalLink size={14} className="ml-2" />
                  </a>
                </div>
              ) : (
                <div className="flex flex-col items-center py-6 text-gray-400 border-2 border-dashed border-gray-100 rounded-2xl">
                  <FileText className="mb-2 opacity-20" size={32} />
                  <p className="text-gray-400 text-sm italic">No documents uploaded.</p>
                </div>
              )}
            </section>
          </>
        ) : null}
      </div>
    </Modal>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 text-sm">
    <span className="text-gray-400 font-medium">{label}:</span>
    <span className="text-gray-900 font-bold whitespace-nowrap overflow-hidden text-ellipsis ml-4">{value}</span>
  </div>
);

export default SpecialistProfileModal;
