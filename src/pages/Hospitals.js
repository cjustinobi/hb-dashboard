import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import UserTable from '../components/common/UserTable';
import api from '../services/api';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'patients', label: 'Patients', path: '/users/patients' },
    { id: 'specialists', label: 'Specialists', path: '/users/specialists' },
    { id: 'hospitals', label: 'Hospitals', path: '/users/hospitals' },
  ];

  const columns = [
    { key: 'name', label: 'Hospital Name', render: (row) => <span className="font-medium text-gray-900">{row.hospital_name || 'Dr. Sarah Okonkwo'}</span> },
    { key: 'country', label: 'Country', render: () => 'Nigeria' },
    { key: 'status', label: 'Registration Status', render: (row) => (
      <span className={`px-2 py-1 text-xs font-bold rounded-md ${row.status === 'verified' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
        {row.status || 'Verified'}
      </span>
    )},
    { key: 'requests', label: 'Total Requests', render: () => '44' },
    { key: 'actions', label: 'Actions', render: () => (
      <div className="space-x-3">
        <button className="text-blue-600 hover:text-blue-800 font-medium text-xs">View</button>
        <button className="text-red-600 hover:text-red-800 font-medium text-xs">Suspend</button>
      </div>
    )},
  ];

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await api.get('/admin/users?role=hospital');
        setHospitals(response.data.data);
      } catch (err) {
        console.error('Failed to fetch hospitals', err);
        setHospitals([
          { hospital_name: 'Dr. Sarah Okonkwo', status: 'verified' },
          { hospital_name: 'Dr. Fatima Yusuf', status: 'pending' },
          { hospital_name: 'Dr. Sarah Okonkwo', status: 'verified' },
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
        <Topbar title="User Management" />
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
