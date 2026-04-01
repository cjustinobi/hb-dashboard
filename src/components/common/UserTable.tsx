import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationMeta } from '../../types';

interface Tab {
  id: string;
  label: string;
  path: string;
}

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface UserTableProps<T> {
  tabs: Tab[];
  activeTab: string;
  columns: Column<T>[];
  data: T[];
  loading: boolean;
  pagination?: PaginationMeta;
  onPageChange?: (page: number) => void;
  onSearch?: (query: string) => void;
}

const UserTable = <T extends Record<string, any>>({
  tabs,
  activeTab,
  columns,
  data,
  loading,
  pagination,
  onPageChange,
  onSearch,
}: UserTableProps<T>) => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');

  const handleTabChange = (path: string) => navigate(path);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);
    onSearch?.(val);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg overflow-x-auto whitespace-nowrap scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.path)}
              className={`px-4 py-2 rounded-md transition-all font-medium text-sm ${
                activeTab === tab.id
                  ? 'bg-red-700 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            value={searchInput}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-none focus:ring-2 focus:ring-red-500 outline-none text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {columns.map((col) => (
                  <th key={col.key} className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-700"></div>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400 text-sm">
                    No records found.
                  </td>
                </tr>
              ) : (
                data.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing {data.length === 0 ? 0 : (pagination.page - 1) * pagination.page_size + 1}–
              {Math.min(pagination.page * pagination.page_size, pagination.total_items)} of{' '}
              {pagination.total_items} records
            </p>
            <div className="flex items-center space-x-1">
              <button
                disabled={pagination.page <= 1}
                onClick={() => onPageChange?.(pagination.page - 1)}
                className="p-2 rounded-md hover:bg-gray-100 text-gray-400 disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: Math.min(pagination.total_pages, 5) }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => onPageChange?.(i + 1)}
                  className={`w-8 h-8 rounded-md text-sm font-semibold ${
                    pagination.page === i + 1
                      ? 'bg-red-50 text-red-700'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={pagination.page >= pagination.total_pages}
                onClick={() => onPageChange?.(pagination.page + 1)}
                className="p-2 rounded-md hover:bg-gray-100 text-gray-400 disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTable;
