import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { 
  Users, 
  Stethoscope, 
  Building2, 
  FileText, 
  CheckCircle2, 
  HandHeart,
  TrendingUp,
  ArrowUpRight,
  Clock
} from 'lucide-react';
import api from '../services/api';
import { DashboardStats, ActivityItem } from '../types';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, trend, color }) => (
  <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 group">
    <div className="flex items-start justify-between">
      <div className={`p-4 rounded-2xl ${color} bg-opacity-10 transition-transform group-hover:scale-110 duration-300`}>
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: `text-${color.split('-')[1]}-600` })}
      </div>
      <div className="flex items-center space-x-1 text-green-500 bg-green-50 px-2 py-1 rounded-full text-xs font-bold">
        <TrendingUp size={12} />
        <span>{trend}</span>
      </div>
    </div>
    <div className="mt-5">
      <p className="text-gray-500 text-sm font-medium">{label}</p>
      <h3 className="text-3xl font-extrabold text-gray-900 mt-1 tracking-tight">{value}</h3>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data.data);
        
        // Mock activities for now
        setActivities([
          { id: '1', user: 'Dr. Sarah Okonkwo', action: 'Verified new hospital "Lagos City Clinic"', time: '2 mins ago' },
          { id: '2', user: 'System', action: 'Weekly statistics report generated', time: '1 hour ago' },
          { id: '3', user: 'Admin', action: 'Suspended user "John Doe" (Account Violation)', time: '3 hours ago' },
          { id: '4', user: 'Dr. Fatima Yusuf', action: 'Updated profile information', time: '5 hours ago' },
        ]);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
        // Fallback mock stats
        setStats({
          total_users: 12543,
          total_specialists: 842,
          total_hospitals: 156,
          total_blood_requests: 45,
          total_pending_verifications: 12,
          total_donations: 890
        });
        setActivities([
          { id: '1', user: 'Dr. Sarah Okonkwo', action: 'Verified new hospital "Lagos City Clinic"', time: '2 mins ago' },
          { id: '2', user: 'System', action: 'Weekly statistics report generated', time: '1 hour ago' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col">
        <Topbar title="Dashboard Overview" />
        
        {loading && (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        <div className={`p-8 space-y-8 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard 
              icon={<Users size={24} />} 
              label="Total Users" 
              value={stats?.total_users.toLocaleString() || '0'} 
              trend="+12%" 
              color="bg-blue-500" 
            />
            <StatCard 
              icon={<Stethoscope size={24} />} 
              label="Specialists" 
              value={stats?.total_specialists.toLocaleString() || '0'} 
              trend="+5%" 
              color="bg-purple-500" 
            />
            <StatCard 
              icon={<Building2 size={24} />} 
              label="Hospitals" 
              value={stats?.total_hospitals.toLocaleString() || '0'} 
              trend="+2%" 
              color="bg-indigo-500" 
            />
            <StatCard 
              icon={<FileText size={24} />} 
              label="Blood Requests" 
              value={stats?.total_blood_requests || '0'} 
              trend="+18%" 
              color="bg-red-500" 
            />
             <StatCard 
              icon={<CheckCircle2 size={24} />} 
              label="Pending Verifications" 
              value={stats?.total_pending_verifications || '0'} 
              trend="-4%" 
              color="bg-amber-500" 
            />
            <StatCard 
              icon={<HandHeart size={24} />} 
              label="Donation Count" 
              value={stats?.total_donations.toLocaleString() || '0'} 
              trend="+24%" 
              color="bg-emerald-500" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Recent Activities</h3>
                <button className="text-primary text-sm font-bold hover:underline flex items-center space-x-1">
                  <span>View All</span>
                  <ArrowUpRight size={14} />
                </button>
              </div>
              <div className="space-y-6">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <div className="mt-1 flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                        <Clock size={16} className="text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">{activity.user}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{activity.action}</p>
                      <p className="text-xs text-gray-400 mt-1 font-medium">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Verify Specialist', color: 'bg-amber-500' },
                  { label: 'Verify Hospital', color: 'bg-indigo-500' },
                  { label: 'System Logs', color: 'bg-gray-800' },
                  { label: 'Support Tickets', color: 'bg-primary' },
                ].map((action, i) => (
                  <button 
                    key={i}
                    className={`${action.color} text-white p-4 rounded-2xl text-sm font-bold transition-transform active:scale-[0.98] shadow-lg shadow-gray-200 hover:opacity-90`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
              <div className="mt-8 p-6 bg-red-50 rounded-2xl border border-red-100">
                <h4 className="text-red-900 font-bold text-sm mb-2">Notice</h4>
                <p className="text-red-700 text-xs leading-relaxed">
                  There are 12 specialists waiting for verification. Please review them at your earliest convenience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
