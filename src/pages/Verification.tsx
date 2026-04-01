import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import VerificationCard from '../components/verification/VerificationCard';
import api from '../services/api';
import { AdminUser, UserListResponse } from '../types';
import { Search, Loader2, ClipboardCheck } from 'lucide-react';

type Tab = 'specialists' | 'hospitals';

const TABS: { key: Tab; label: string }[] = [
  { key: 'specialists', label: 'Specialists' },
  { key: 'hospitals', label: 'Hospitals' },
];

// Helper: Build document list from a single user record
const buildDocuments = (user: AdminUser, type: Tab) => {
  const docs = [];
  if (type === 'specialists') {
    // Specialists may carry license_url inside extra data — we use image_url as a proxy if present
    // Render standard expected document slots so the card always shows a consistent layout
    docs.push({ name: 'Medical License / Certificate', url: null });
  } else {
    docs.push({ name: 'Certificate of Registration', url: null });
    docs.push({ name: 'Operating License', url: null });
  }
  return docs;
};

const Verification: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('specialists');
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const role = activeTab === 'specialists' ? 'specialist' : 'hospital';
      const params = new URLSearchParams({ role, page: '1', page_size: '50' });
      if (debouncedSearch) params.set('search', debouncedSearch);
      const response = await api.get<{ data: UserListResponse }>(`/admin/users?${params}`);
      const all: AdminUser[] = response.data.data.data;

      // Filter to only those pending verification
      const pending = all.filter((u) =>
        activeTab === 'specialists'
          ? u.verified !== true
          : u.license_status !== true
      );
      setItems(pending);
    } catch (err) {
      console.error('Failed to fetch verification items', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, debouncedSearch]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col">
        <Topbar title="Verification Center" />

        <div className="flex-1 p-8">
          {/* Tab bar + Search */}
          <div className="flex items-center justify-between mb-6">
            {/* Tabs */}
            <div className="flex items-center bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setSearch('');
                  }}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'bg-red-700 text-white shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-80">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${activeTab} by name, email or phone`}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
              />
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4 text-gray-400">
              <Loader2 size={40} className="animate-spin text-red-600" />
              <p className="text-sm font-medium">Loading pending verifications...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-3 text-gray-400">
              <ClipboardCheck size={48} className="opacity-30" />
              <p className="text-base font-semibold">
                {debouncedSearch
                  ? `No results for "${debouncedSearch}"`
                  : `No pending ${activeTab} verifications`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {items.map((user) => (
                <VerificationCard
                  key={user.id}
                  user={user}
                  type={activeTab === 'specialists' ? 'specialist' : 'hospital'}
                  documents={buildDocuments(user, activeTab)}
                  onActionComplete={fetchItems}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Verification;
