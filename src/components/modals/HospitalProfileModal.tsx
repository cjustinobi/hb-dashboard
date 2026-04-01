import React, { useState, useEffect, useCallback } from 'react';
import Modal from '../common/Modal';
import api from '../../services/api';
import { AdminHospitalProfileResponse } from '../../types';
import { Loader2, AlertCircle, Building2, User, Activity } from 'lucide-react';

interface HospitalProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitalId: string | null;
}

const HospitalProfileModal: React.FC<HospitalProfileModalProps> = ({ isOpen, onClose, hospitalId }) => {
  const [data, setData] = useState<AdminHospitalProfileResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProfile = useCallback(async () => {
    if (!hospitalId) return;
    setLoading(true);
    setError('');
    try {
      const response = await api.get<{ data: any }>(`/admin/users/${hospitalId}`);
      const payload = response.data.data;

      let extractedRole = '';
      let hospitalData: any = null;

      // Handle the different possible payload shapes from backend
      if (Array.isArray(payload?.data) && payload.data.length > 0) {
        // List/Paginated array format
        const user = payload.data[0];
        extractedRole = user.role;
        hospitalData = {
          id: user.id || hospitalId,
          name: user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : 'Unknown Hospital',
          hospital_type: 'General Hospital',
          address: user.address || 'Address not provided',
          city: '',
          state: '',
          country: user.country || 'Nigeria',
          primary_phone: user.phone || 'N/A',
          email: user.email || '',
          license_status: user.verified || false,
          contact_person: user,
          has_blood_bank: false,
          blood_inventory: [],
          total_requests: 0
        };
      } else if (payload?.role === 'hospital') {
        // Properly formatted nested structure { role: 'hospital', data: {...} }
        extractedRole = payload.role;
        hospitalData = payload.data;
      } else if (payload?.profile?.role === 'hospital') {
        // Old wrapper format
        extractedRole = payload.profile.role;
        hospitalData = payload;
      } else if (payload?.id && payload?.role === 'hospital') {
        // Flat user object directly returned
        extractedRole = payload.role;
        hospitalData = {
          id: payload.id || hospitalId,
          name: payload.first_name ? `${payload.first_name} ${payload.last_name || ''}`.trim() : 'Unknown Hospital',
          hospital_type: 'General Hospital',
          address: payload.address || 'Address not provided',
          city: '',
          state: '',
          country: payload.country || 'Nigeria',
          primary_phone: payload.phone || 'N/A',
          email: payload.email || '',
          license_status: payload.verified || false,
          contact_person: payload,
          has_blood_bank: false,
          blood_inventory: [],
          total_requests: 0
        };
      }

      if (extractedRole === 'hospital') {
        // Verify hospitalData structure for rendering
        if (hospitalData && !hospitalData.contact_person && (hospitalData.id || hospitalData.first_name)) {
          hospitalData = {
            id: hospitalData.id || hospitalId,
            name: hospitalData.first_name ? `${hospitalData.first_name} ${hospitalData.last_name || ''}`.trim() : 'Unknown Hospital',
            hospital_type: 'General Hospital',
            address: hospitalData.address || 'Address not provided',
            city: '',
            state: '',
            country: hospitalData.country || 'Nigeria',
            primary_phone: hospitalData.phone || 'N/A',
            email: hospitalData.email || '',
            license_status: hospitalData.verified || false,
            contact_person: hospitalData,
            has_blood_bank: false,
            blood_inventory: [],
            total_requests: 0
          };
        }
        setData(hospitalData);
      } else {
        setError('Selected user is not a hospital');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch hospital profile');
      console.error('Fetch profile error:', err);
    } finally {
      setLoading(false);
    }
  }, [hospitalId]);

  useEffect(() => {
    if (isOpen && hospitalId) {
      fetchProfile();
    } else {
      setData(null);
      setError('');
    }
  }, [isOpen, hospitalId, fetchProfile]);

  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Hospital Profile" 
      width="max-w-3xl"
    >
      <div className="p-8 bg-gray-50/50 space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-gray-500 font-medium">Fetching hospital profile...</p>
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
            {/* Hospital Information */}
            <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <div className="p-2 bg-indigo-50 rounded-xl mr-3">
                  <Building2 className="text-indigo-600" size={20} />
                </div>
                Hospital Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                <InfoRow label="Hospital Name" value={data.name} />
                <InfoRow label="Type" value={data.hospital_type || 'General Hospital'} />
                <InfoRow label="Address" value={data.address} />
                <InfoRow label="Country" value={data.country || 'Nigeria'} />
                <InfoRow label="Primary Contact" value={data.primary_phone} />
                <InfoRow label="Email" value={data.email || '—'} />
                <div className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 md:col-span-2">
                  <span className="text-gray-400 font-medium">Registration Status:</span>
                  <span className={`px-4 py-1 rounded-lg text-xs font-bold ${
                    data.license_status 
                      ? 'bg-green-50 text-green-700' 
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {data.license_status ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
            </section>

            {/* Contact Person */}
            <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <div className="p-2 bg-indigo-50 rounded-xl mr-3">
                  <User className="text-indigo-600" size={20} />
                </div>
                Contact Person
              </h3>
              <div className="space-y-4">
                <InfoRow label="Name" value={`${data.contact_person?.first_name || 'Admin'} ${data.contact_person?.last_name || ''}`.trim()} />
                <InfoRow label="Role" value="Hospital Administrator" />
                <InfoRow label="Email" value={data.contact_person?.email || data.email || 'N/A'} />
              </div>
            </section>

            {/* Blood Services */}
            <section className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                <div className="p-2 bg-red-50 rounded-xl mr-3">
                  <Activity className="text-red-600" size={20} />
                </div>
                Blood Services
              </h3>
              <div className="space-y-4">
                <InfoRow label="Blood Bank" value={data.has_blood_bank ? 'Active' : 'Not Available'} />
                <InfoRow 
                  label="Available Types" 
                  value={data.blood_inventory?.length > 0 
                    ? data.blood_inventory.map(i => i.blood_type).join(', ') 
                    : 'N/A'
                  } 
                />
                <InfoRow label="Total Requests" value={String(data.total_requests || 0)} />
              </div>
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

export default HospitalProfileModal;
