import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import UserTable from '../components/common/UserTable';
import api from '../services/api';
import { AdminUser, UserListResponse, PaginationMeta } from '../types';
import { formatDate } from '../utils/time';
import PatientProfileModal from '../components/modals/PatientProfileModal';
import { MANAGEMENT_TABS } from '../constants/navigation';

const Patients: React.FC = () => {
  const [patients, setPatients] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const handleOpenProfile = (id: string) => {
    setSelectedPatientId(id);
    setIsModalOpen(true);
  };


  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (row: AdminUser) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold text-xs flex-shrink-0">
            {row.first_name[0]}{row.last_name[0]}
          </div>
          <span className="font-medium text-gray-900">{row.first_name} {row.last_name}</span>
        </div>
      ),
    },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone', render: (row: AdminUser) => row.phone || '—' },
    { key: 'created_at', label: 'Joined', render: (row: AdminUser) => formatDate(row.created_at) },
    {
      key: 'status',
      label: 'Status',
      render: (row: AdminUser) =>
        row.status === 'Active' ? (
          <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md">Active</span>
        ) : (
          <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-md">Pending</span>
        ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row: AdminUser) => (
        <button 
          onClick={() => handleOpenProfile(row.id)}
          className="text-blue-600 hover:text-blue-800 font-bold text-xs"
        >
          View Profile
        </button>
      ),
    },
  ];

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ role: 'patient', page: String(page), page_size: '10' });
      if (search) params.set('search', search);
      const response = await api.get<{ data: UserListResponse }>(`/admin/users?${params}`);
      setPatients(response.data.data.data);
      setPagination(response.data.data.pagination);
    } catch (err) {
      console.error('Failed to fetch patients', err);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  // Debounced search: reset to page 1 when search changes
  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    setPage(1);
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col">
        <Topbar title="Patient Management" />
        <UserTable
          tabs={MANAGEMENT_TABS}
          activeTab="patients"
          columns={columns}
          data={patients}
          loading={loading}
          pagination={pagination ?? undefined}
          onPageChange={setPage}
          onSearch={handleSearch}
        />

        <PatientProfileModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          patientId={selectedPatientId} 
        />
      </main>
    </div>
  );
};

export default Patients;
