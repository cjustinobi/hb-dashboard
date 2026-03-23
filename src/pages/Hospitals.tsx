import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import UserTable from '../components/common/UserTable';
import api from '../services/api';
import { User } from '../types';

const Hospitals: React.FC = () => {
  const [hospitals, setHospitals] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'patients', label: 'Patients', path: '/users/patients' },
    { id: 'specialists', label: 'Specialists', path: '/users/specialists' },
    { id: 'hospitals', label: 'Hospitals', path: '/users/hospitals' },
  ];

  const columns = [
    { key: 'name', label: 'Hospital Name', render: (row: User) => <span className="font-medium text-gray-900">{row.first_name} {row.last_name}</span> },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone', render: (row: User) => row.phone || '+234 1 234 5678' },
    { key: 'location', label: 'Location', render: () => 'Lagos, Nigeria' },
    { key: 'is_verified', label: 'Status', render: (row: User) => row.is_verified ? <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-md">Verified</span> : <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-md">Pending</span> },
    { key: 'actions', label: 'Actions', render: () => <button className="text-blue-600 hover:text-blue-800 font-medium">Manage</button> },
  ];

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await api.get('/admin/users?role=hospital');
        setHospitals(response.data.data);
      } catch (err) {
        console.error('Failed to fetch hospitals', err);
        setHospitals([
          { id: '1', first_name: 'Lagos City', last_name: 'Clinic', email: 'info@lagoscity.com', role: 'hospital', is_verified: true },
          { id: '2', first_name: 'Lagos City', last_name: 'Clinic', email: 'info@lagoscity.com', role: 'hospital', is_verified: true },
          { id: '3', first_name: 'Lagos City', last_name: 'Clinic', email: 'info@lagoscity.com', role: 'hospital', is_verified: true },
          { id: '4', first_name: 'Lagos City', last_name: 'Clinic', email: 'info@lagoscity.com', role: 'hospital', is_verified: true },
          { id: '5', first_name: 'Lagos City', last_name: 'Clinic', email: 'info@lagoscity.com', role: 'hospital', is_verified: true },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
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
        />
      </main>
    </div>
  );
};

export default Hospitals;
