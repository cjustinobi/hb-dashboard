import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import UserTable from '../components/common/UserTable';
import api from '../services/api';
import { User } from '../types';

const Patients: React.FC = () => {
  const [patients, setPatients] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'patients', label: 'Patients', path: '/users/patients' },
    { id: 'specialists', label: 'Specialists', path: '/users/specialists' },
    { id: 'hospitals', label: 'Hospitals', path: '/users/hospitals' },
  ];

  const columns = [
    { key: 'name', label: 'Name', render: (row: User) => <span className="font-medium text-gray-900">{row.first_name} {row.last_name}</span> },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone', render: (row: User) => row.phone || '+234 803 456 7890' },
    { key: 'country', label: 'Country', render: () => 'Nigeria' },
    { key: 'status', label: 'Status', render: () => <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md">Active</span> },
    { key: 'actions', label: 'Actions', render: () => <button className="text-blue-600 hover:text-blue-800 font-medium">View Profile</button> },
  ];

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get('/admin/users?role=patient');
        setPatients(response.data.data);
      } catch (err) {
        console.error('Failed to fetch patients', err);
        setPatients([
          { id: '1', first_name: 'Adaobi', last_name: 'Nkemdilim', email: 'adaobi.n@email.com', role: 'patient' },
          { id: '2', first_name: 'Adaobi', last_name: 'Nkemdilim', email: 'adaobi.n@email.com', role: 'patient' },
          { id: '3', first_name: 'Adaobi', last_name: 'Nkemdilim', email: 'adaobi.n@email.com', role: 'patient' },
          { id: '4', first_name: 'Adaobi', last_name: 'Nkemdilim', email: 'adaobi.n@email.com', role: 'patient' },
          { id: '5', first_name: 'Adaobi', last_name: 'Nkemdilim', email: 'adaobi.n@email.com', role: 'patient' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col">
        <Topbar title="User Management" />
        <UserTable 
          tabs={tabs} 
          activeTab="patients" 
          columns={columns} 
          data={patients} 
          loading={loading} 
        />
      </main>
    </div>
  );
};

export default Patients;
