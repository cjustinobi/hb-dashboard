import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import UserTable from '../components/common/UserTable';
import api from '../services/api';
import { AdminUser, UserListResponse, PaginationMeta } from '../types';
import { formatDate } from '../utils/time';

const Hospitals: React.FC = () => {
  const [hospitals, setHospitals] = useState<AdminUser[]>([]);
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
    { key: 'phone', label: 'Phone', render: (row: AdminUser) => row.phone || '—' },
    { key: 'country', label: 'Country', render: (row: AdminUser) => row.country || 'Nigeria' },
    { key: 'created_at', label: 'Registered', render: (row: AdminUser) => formatDate(row.created_at) },
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
        <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">Manage</button>
      ),
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
          tabs={tabs}
          activeTab="hospitals"
          columns={columns}
          data={hospitals}
          loading={loading}
          pagination={pagination ?? undefined}
          onPageChange={setPage}
          onSearch={handleSearch}
        />
      </main>
    </div>
  );
};

export default Hospitals;
