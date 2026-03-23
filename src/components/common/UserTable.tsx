import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

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
}

const UserTable = <T extends Record<string, any>>({ 
  tabs, 
  activeTab, 
  columns, 
  data, 
  loading 
}: UserTableProps<T>) => {
  const navigate = useNavigate();
  
  const handleTabChange = (path: string) => {
    navigate(path);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
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
        
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full border-none focus:ring-2 focus:ring-red-500 outline-none text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                  Loading data...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500">
                   No data found.
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-sm text-gray-700">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500">Showing {data.length > 0 ? '1-10' : '0'} of {data.length} items</p>
          <div className="flex items-center space-x-1">
            <button className="p-2 rounded-md hover:bg-gray-100 text-gray-400"><ChevronLeft size={16} /></button>
            <button className="w-8 h-8 rounded-md bg-red-50 text-red-700 font-bold text-sm">1</button>
            <button className="p-2 rounded-md hover:bg-gray-100 text-gray-400"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
