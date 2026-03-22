import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import UserTable from '../components/common/UserTable';
import api from '../services/api';

const Specialists = () => {
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'patients', label: 'Patients', path: '/users/patients' },
    { id: 'specialists', label: 'Specialists', path: '/users/specialists' },
    { id: 'hospitals', label: 'Hospitals', path: '/users/hospitals' },
  ];

  const columns = [
    { key: 'name', label: 'Name', render: (row) => <span className="font-medium text-gray-900">Dr. {row.first_name} {row.last_name}</span> },
    { key: 'speciality', label: 'Speciality', render: () => 'Cardiology' },
    { key: 'status', label: 'Verification Status', render: (row) => (
      <span className={`px-2 py-1 text-xs font-bold rounded-md ${row.is_verified ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
        {row.is_verified ? 'Verified' : 'Pending'}
      </span>
    )},
    { key: 'country', label: 'Country', render: () => 'Nigeria' },
    { key: 'consultation_types', label: 'Consultation Types', render: () => 'Video, Voice' },
    { key: 'actions', label: 'Actions', render: () => (
      <div className="space-x-3">
        <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">View Profile</button>
        <button className="text-red-600 hover:text-red-800 font-medium text-xs">Suspend</button>
      </div>
    )},
  ];

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const response = await api.get('/admin/users?role=specialist');
        setSpecialists(response.data.data);
      } catch (err) {
        console.error('Failed to fetch specialists', err);
        // Mock data for display if API fails
        setSpecialists([
          { first_name: 'Sarah', last_name: 'Okonkwo', is_verified: true },
          { first_name: 'Fatima', last_name: 'Yusuf', is_verified: false },
          { first_name: 'Sarah', last_name: 'Okonkwo', is_verified: true },
          { first_name: 'Fatima', last_name: 'Yusuf', is_verified: false },
          { first_name: 'Sarah', last_name: 'Okonkwo', is_verified: true },
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
        <Topbar title="User Management" />
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
