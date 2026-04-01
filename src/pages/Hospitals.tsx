import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import UserTable from '../components/common/UserTable';
import api from '../services/api';
import { AdminUser, UserListResponse, PaginationMeta } from '../types';
import { formatDate } from '../utils/time';
import { MANAGEMENT_TABS } from '../constants/navigation';
import ActionMenu, { MenuItem } from '../components/common/ActionMenu';
import { User as UserIcon, CheckCircle, Ban } from 'lucide-react';
import HospitalProfileModal from '../components/modals/HospitalProfileModal';
import ConfirmModal from '../components/modals/ConfirmModal';
import PromptModal from '../components/modals/PromptModal';
import ActionSuccessModal from '../components/modals/ActionSuccessModal';

const Hospitals: React.FC = () => {
  const [hospitals, setHospitals] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);

  // Modal states for actions
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: '', action: '' });
  const [promptModal, setPromptModal] = useState({ isOpen: false, id: '', action: '' });
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });

  const handleOpenProfile = (id: string) => {
    setSelectedHospitalId(id);
    setIsModalOpen(true);
  };

  const handleApprove = async (id: string) => {
    setConfirmModal({ isOpen: true, id, action: 'approve' });
  };

  const executeApprove = async () => {
    try {
      await api.patch(`/admin/hospitals/${confirmModal.id}/status`, { license_status: true });
      fetchHospitals();
      setSuccessModal({
        isOpen: true,
        title: 'Approved Successfully',
        message: 'This hospital has been approved and is now active on the platform.',
      });
    } catch (err) {
      console.error('Failed to approve hospital', err);
    }
  };

  const handleRevoke = async (id: string) => {
    setPromptModal({ isOpen: true, id, action: 'revoke' });
  };

  const executeRevoke = async (reason: string) => {
    try {
      await api.patch(`/admin/hospitals/${promptModal.id}/status`, { license_status: false, reason });
      fetchHospitals();
      setSuccessModal({
        isOpen: true,
        title: 'License Revoked',
        message: 'This hospital license has been revoked successfully.',
      });
    } catch (err) {
      console.error('Failed to revoke hospital license', err);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Hospital Name',
      render: (row: AdminUser) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs flex-shrink-0">
            {row.first_name[0]}{row.last_name[0]}
          </div>
          <span className="font-medium text-gray-900">{row.first_name} {row.last_name}</span>
        </div>
      ),
    },
    { key: 'email', label: 'Email' },
    {
      key: 'verification',
      label: 'Verification',
      render: (row: AdminUser) =>
        row.license_status ? (
          <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md">Verified</span>
        ) : (
          <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs font-bold rounded-md">Unverified</span>
        ),
    },
    { key: 'phone', label: 'Phone', render: (row: AdminUser) => row.phone || '—' },
    { key: 'country', label: 'Country', render: (row: AdminUser) => row.country || 'Nigeria' },
    { key: 'created_at', label: 'Registered', render: (row: AdminUser) => formatDate(row.created_at) },
    {
      key: 'status',
      label: 'Status',
      render: (row: AdminUser) =>
        row.status === 'Active' ? (
          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md">Active</span>
        ) : (
          <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-md">Pending</span>
        ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: AdminUser) => {
        const menuItems: MenuItem[] = [
          { 
            label: 'View Profile', 
            onClick: () => handleOpenProfile(row.id), 
            icon: <UserIcon size={14} /> 
          },
        ];

        // license_status is true, or null but status is Active (approved)
        const isApproved = row.license_status === true || (row.license_status == null && row.status === 'Active');

        if (isApproved) {
          menuItems.push({ 
            label: 'Revoke License', 
            onClick: () => handleRevoke(row.id),
            icon: <Ban size={14} />,
            variant: 'danger'
          });
        } else {
          menuItems.push({ 
            label: 'Approve', 
            onClick: () => handleApprove(row.id),
            icon: <CheckCircle size={14} />
          });
        }

        return <ActionMenu items={menuItems} />;
      },
    },
  ];

  const fetchHospitals = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ role: 'hospital', page: String(page), page_size: '10' });
      if (search) params.set('search', search);
      const response = await api.get<{ data: UserListResponse }>(`/admin/users?${params}`);
      setHospitals(response.data.data.data);
      setPagination(response.data.data.pagination);
    } catch (err) {
      console.error('Failed to fetch hospitals', err);
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchHospitals();
  }, [fetchHospitals]);

  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    setPage(1);
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col">
        <Topbar title="Hospital Management" />
        <UserTable
          tabs={MANAGEMENT_TABS}
          activeTab="hospitals"
          columns={columns}
          data={hospitals}
          loading={loading}
          pagination={pagination ?? undefined}
          onPageChange={setPage}
          onSearch={handleSearch}
        />

        <HospitalProfileModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          hospitalId={selectedHospitalId} 
        />

        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          onConfirm={executeApprove}
          title="Approve Hospital"
          message="Are you sure you want to approve this hospital and grant them an active practicing license on the platform?"
          confirmText="Approve"
          isDestructive={false}
        />

        <PromptModal
          isOpen={promptModal.isOpen}
          onClose={() => setPromptModal({ ...promptModal, isOpen: false })}
          onSubmit={executeRevoke}
          title="Revoke Hospital License"
          message="Please provide a clear reason for revoking this hospital's license."
          placeholder="Reason for revocation..."
          submitText="Revoke License"
          isDestructive={true}
        />

        <ActionSuccessModal
          isOpen={successModal.isOpen}
          onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
          title={successModal.title}
          message={successModal.message}
        />
      </main>
    </div>
  );
};

export default Hospitals;
