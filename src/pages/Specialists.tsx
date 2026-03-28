import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import UserTable from '../components/common/UserTable';
import api from '../services/api';
import { AdminUser, UserListResponse, PaginationMeta } from '../types';
import { formatDate } from '../utils/time';

const Specialists: React.FC = () => {
  const [specialists, setSpecialists] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const tabs = [
    { id: 'patients', label: 'Patients', path: '/users/patients' },
    { id: 'specialists', label: 'Specialists', path: '/users/specialists' },
    { id: 'hospitals', label: 'Hospitals', path: '/users/hospitals' },
  ];

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
    { key: 'phone', label: 'Phone', render: (row: AdminUser) => row.phone || '—' },
    { key: 'created_at', label: 'Joined', render: (row: AdminUser) => formatDate(row.created_at) },
    {
      key: 'status',
      label: 'Status',
      render: (row: AdminUser) =>
        row.status === 'Active' ? (
          <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md">Verified</span>
        ) : (
          <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-md">Pending</span>
        ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_row: AdminUser) => (
        <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">Review</button>
      ),
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
          tabs={tabs}
          activeTab="specialists"
          columns={columns}
          data={specialists}
          loading={loading}
          pagination={pagination ?? undefined}
          onPageChange={setPage}
          onSearch={handleSearch}
        />
      </main>
    </div>
  );
};

export default Specialists;
