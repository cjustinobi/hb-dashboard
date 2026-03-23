import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import UserTable from '../components/common/UserTable';
import api from '../services/api';
import { User } from '../types';

const Specialists: React.FC = () => {
  const [specialists, setSpecialists] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'patients', label: 'Patients', path: '/users/patients' },
    { id: 'specialists', label: 'Specialists', path: '/users/specialists' },
    { id: 'hospitals', label: 'Hospitals', path: '/users/hospitals' },
  ];

  const columns = [
    { key: 'name', label: 'Name', render: (row: User) => <span className="font-medium text-gray-900">{row.first_name} {row.last_name}</span> },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone', render: (row: User) => row.phone || '+234 812 999 0000' },
    { key: 'country', label: 'Country', render: () => 'Nigeria' },
    { key: 'is_verified', label: 'Status', render: (row: User) => row.is_verified ? <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md">Verified</span> : <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-md">Pending</span> },
    { key: 'actions', label: 'Actions', render: () => <button className="text-blue-600 hover:text-blue-800 font-medium">Review</button> },
  ];

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const response = await api.get('/admin/users?role=specialist');
        setSpecialists(response.data.data);
      } catch (err) {
        console.error('Failed to fetch specialists', err);
        setSpecialists([
          { id: '1', first_name: 'Dr. Sarah', last_name: 'Okonkwo', email: 'sarah.o@email.com', role: 'specialist', is_verified: true },
          { id: '2', first_name: 'Dr. Sarah', last_name: 'Okonkwo', email: 'sarah.o@email.com', role: 'specialist', is_verified: true },
          { id: '3', first_name: 'Dr. Sarah', last_name: 'Okonkwo', email: 'sarah.o@email.com', role: 'specialist', is_verified: true },
          { id: '4', first_name: 'Dr. Sarah', last_name: 'Okonkwo', email: 'sarah.o@email.com', role: 'specialist', is_verified: true },
          { id: '5', first_name: 'Dr. Sarah', last_name: 'Okonkwo', email: 'sarah.o@email.com', role: 'specialist', is_verified: true },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialists();
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
        />
      </main>
    </div>
  );
};

export default Specialists;
