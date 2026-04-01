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
import SpecialistProfileModal from '../components/modals/SpecialistProfileModal';
import ConfirmModal from '../components/modals/ConfirmModal';
import PromptModal from '../components/modals/PromptModal';
import ActionSuccessModal from '../components/modals/ActionSuccessModal';

const Specialists: React.FC = () => {
  const [specialists, setSpecialists] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpecialistId, setSelectedSpecialistId] = useState<string | null>(null);

  // Modal states for actions
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, id: '', action: '' });
  const [promptModal, setPromptModal] = useState({ isOpen: false, id: '', action: '' });
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });

  const handleOpenProfile = (id: string) => {
    setSelectedSpecialistId(id);
    setIsModalOpen(true);
  };

  const handleVerify = async (id: string) => {
    setConfirmModal({ isOpen: true, id, action: 'verify' });
  };

  const executeVerify = async () => {
    try {
      await api.patch(`/admin/specialists/${confirmModal.id}/status`, { verified: true });
      fetchSpecialists();
      setSuccessModal({
        isOpen: true,
        title: 'Approved Successfully',
        message: 'This specialist has been approved and is now active on the platform.',
      });
    } catch (err) {
      console.error('Failed to verify specialist', err);
    }
  };

  const handleSuspend = async (id: string) => {
    setPromptModal({ isOpen: true, id, action: 'suspend' });
  };

  const executeSuspend = async (reason: string) => {
    try {
      await api.patch(`/admin/specialists/${promptModal.id}/status`, { suspended: true, reason });
      fetchSpecialists();
      setSuccessModal({
        isOpen: true,
        title: 'Account Suspended',
        message: 'This account has been suspended successfully.',
      });
    } catch (err) {
      console.error('Failed to suspend specialist', err);
    }
  };

  const handleUnsuspend = async (id: string) => {
    setConfirmModal({ isOpen: true, id, action: 'unsuspend' });
  };

  const executeUnsuspend = async () => {
    try {
      await api.patch(`/admin/specialists/${confirmModal.id}/status`, { suspended: false });
      fetchSpecialists();
      setSuccessModal({
        isOpen: true,
        title: 'Suspension Lifted',
        message: 'This specialist account is no longer suspended.',
      });
    } catch (err) {
      console.error('Failed to unsuspend specialist', err);
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (row: AdminUser) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs flex-shrink-0">
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
        row.verified ? (
          <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md">Verified</span>
        ) : (
          <span className="px-2 py-1 bg-gray-50 text-gray-700 text-xs font-bold rounded-md">Unverified</span>
        ),
    },
    { key: 'phone', label: 'Phone', render: (row: AdminUser) => row.phone || '—' },
    { key: 'created_at', label: 'Joined', render: (row: AdminUser) => formatDate(row.created_at) },
    {
      key: 'status',
      label: 'Status',
      render: (row: AdminUser) => {
        if (row.suspended) {
          return <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-md">Suspended</span>;
        }
        return row.status === 'Active' ? (
          <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md">Active</span>
        ) : (
          <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-md">Pending</span>
        );
      }
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

        // verified is true, or null but status is Active (verified, not suspended)
        const isVerified = row.verified === true || (row.verified == null && row.status === 'Active');
        const isSuspended = row.suspended === true;

        if (isVerified && !isSuspended) {
          menuItems.push({ 
            label: 'Suspend', 
            onClick: () => handleSuspend(row.id),
            icon: <Ban size={14} />,
            variant: 'danger'
          });
        } else if (isSuspended) {
          menuItems.push({ 
            label: 'Unsuspend', 
            onClick: () => handleUnsuspend(row.id),
            icon: <Ban size={14} />,
            variant: 'default'
          });
        } else {
          menuItems.push({ 
            label: 'Verify', 
            onClick: () => handleVerify(row.id),
            icon: <CheckCircle size={14} />
          });
        }

        return <ActionMenu items={menuItems} />;
      },
    },
  ];

  const fetchSpecialists = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ role: 'specialist', page: String(page), page_size: '10' });
      if (search) params.set('search', search);
      const response = await api.get<{ data: UserListResponse }>(`/admin/users?${params}`);
      setSpecialists(response.data.data.data);
      setPagination(response.data.data.pagination);
    } catch (err) {
      console.error('Failed to fetch specialists', err);
      setSpecialists([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchSpecialists();
  }, [fetchSpecialists]);

  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    setPage(1);
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col">
        <Topbar title="Specialist Management" />
        <UserTable
          tabs={MANAGEMENT_TABS}
          activeTab="specialists"
          columns={columns}
          data={specialists}
          loading={loading}
          pagination={pagination ?? undefined}
          onPageChange={setPage}
          onSearch={handleSearch}
        />

        <SpecialistProfileModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          specialistId={selectedSpecialistId} 
        />

        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          onConfirm={confirmModal.action === 'verify' ? executeVerify : executeUnsuspend}
          title={confirmModal.action === 'verify' ? 'Verify Specialist' : 'Lift Suspension'}
          message={confirmModal.action === 'verify' 
            ? 'Are you sure you want to approve this specialist to practice on the platform?'
            : 'Are you sure you want to lift the suspension for this specialist?'}
          confirmText={confirmModal.action === 'verify' ? 'Approve' : 'Unsuspend'}
          isDestructive={false}
        />

        <PromptModal
          isOpen={promptModal.isOpen}
          onClose={() => setPromptModal({ ...promptModal, isOpen: false })}
          onSubmit={executeSuspend}
          title="Suspend Specialist"
          message="Please provide a clear reason for suspending this specialist account."
          placeholder="Reason for suspension..."
          submitText="Suspend Account"
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

export default Specialists;
