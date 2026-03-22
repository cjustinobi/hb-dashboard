import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Stethoscope, 
  Hospital, 
  Heart, 
  ShieldAlert, 
  ClipboardList, 
  CheckCircle2, 
  AlertCircle,
  PlusCircle,
  Stethoscope as StethoscopeIcon,
  Hospital as HospitalIcon,
  Search,
  Droplets
} from 'lucide-react';
import api from '../services/api';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';

const StatCard = ({ icon: Icon, label, value, trend, color, subValue, subLabel }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${color.bg}`}>
      <Icon className={color.text} size={24} />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <h3 className="text-3xl font-bold text-gray-900 mt-1">{value}</h3>
      {trend && (
        <p className={`text-sm mt-2 font-medium ${trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
          {trend} this month
        </p>
      )}
      {subValue && (
        <div className="mt-2">
           <p className="text-lg font-bold text-gray-900">{subValue}</p>
           <p className="text-xs text-gray-500">{subLabel}</p>
        </div>
      )}
    </div>
  </div>
);

const ActivityItem = ({ title, time, type }) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return <div className="bg-green-100 p-2 rounded-lg text-green-600"><CheckCircle2 size={20} /></div>;
      case 'warning': return <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><AlertCircle size={20} /></div>;
      default: return <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><ClipboardList size={20} /></div>;
    }
  };

  return (
    <div className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0">
      {getIcon()}
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5">{time}</p>
      </div>
    </div>
  );
};

const QuickActionButton = ({ icon: Icon, label, color, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all shadow-sm font-semibold text-white ${color} hover:opacity-90 active:scale-[0.98] mb-3`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setData(response.data.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      
      <main className="flex-1 ml-64 flex flex-col">
        <Topbar title="Admin Dashboard" />
        
        <div className="p-8 space-y-8 overflow-y-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              icon={Users} 
              label="Total Users" 
              value="24,567" 
              trend="+12%" 
              color={{ bg: 'bg-blue-50', text: 'text-blue-600' }} 
            />
            <StatCard 
              icon={Stethoscope} 
              label="Total Specialists" 
              value="1,234" 
              trend="+8%" 
              color={{ bg: 'bg-green-50', text: 'text-green-600' }} 
            />
            <StatCard 
              icon={Hospital} 
              label="Total Hospitals" 
              value="456" 
              trend="+8%" 
              color={{ bg: 'bg-indigo-50', text: 'text-indigo-600' }} 
            />
            <StatCard 
              icon={Heart} 
              label="Active Blood Requests" 
              value="78" 
              subValue="23 urgent" 
              color={{ bg: 'bg-red-50', text: 'text-red-600' }} 
            />
            <StatCard 
              icon={ShieldAlert} 
              label="Pending Verifications" 
              value="15" 
              subValue="Requires action" 
              color={{ bg: 'bg-yellow-50', text: 'text-yellow-600' }} 
            />
             <StatCard 
              icon={Droplets} 
              label="Total Donation Count" 
              value="750 Units" 
              subLabel="From 200 Donors" 
              color={{ bg: 'bg-red-50', text: 'text-red-600' }} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activities */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-900">Recent Activities</h3>
              </div>
              <div className="p-2">
                <ActivityItem title="New specialist applied for verification" time="2 hours ago" type="success" />
                <ActivityItem title="Hospital made a new blood request" time="2 hours ago" type="success" />
                <ActivityItem title="Donation appointment updated" time="2 hours ago" type="success" />
                <ActivityItem title="Patient booked specialist appointment" time="2 hours ago" type="success" />
                <ActivityItem title="New hospital registered in the system" time="2 hours ago" type="warning" />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 font-sans">Quick Actions</h3>
              <QuickActionButton icon={Users} label="Approve Specialist" color="bg-red-700" />
              <QuickActionButton icon={HospitalIcon} label="Approve Hospitals" color="bg-green-700" />
              <QuickActionButton icon={PlusCircle} label="View Blood Requests" color="bg-indigo-600" />
              <QuickActionButton icon={Search} label="View Appointment" color="bg-blue-600" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
