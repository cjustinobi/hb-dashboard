import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import UserTable from '../components/common/UserTable';
import api from '../services/api';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'patients', label: 'Patients', path: '/users/patients' },
    { id: 'specialists', label: 'Specialists', path: '/users/specialists' },
    { id: 'hospitals', label: 'Hospitals', path: '/users/hospitals' },
  ];

  const columns = [
    { key: 'name', label: 'Name', render: (row) => <span className="font-medium text-gray-900">{row.first_name} {row.last_name}</span> },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone', render: (row) => row.phone || '+234 803 456 7890' },
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
        // Mock data for display if API fails
        setPatients([
          { first_name: 'Adaobi', last_name: 'Nkemdilim', email: 'adaobi.n@email.com' },
          { first_name: 'Adaobi', last_name: 'Nkemdilim', email: 'adaobi.n@email.com' },
          { first_name: 'Adaobi', last_name: 'Nkemdilim', email: 'adaobi.n@email.com' },
          { first_name: 'Adaobi', last_name: 'Nkemdilim', email: 'adaobi.n@email.com' },
          { first_name: 'Adaobi', last_name: 'Nkemdilim', email: 'adaobi.n@email.com' },
          { first_name: 'Adaobi', last_name: 'Nkemdilim', email: 'adaobi.n@email.com' },
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
