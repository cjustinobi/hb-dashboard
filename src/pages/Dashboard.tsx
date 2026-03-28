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
import { AdminDashboardResponse, StatCard as StatCardType, AdminActivity } from '../types';
import { formatDistanceToNow } from '../utils/time';

// Map stat labels to icons
const STAT_ICONS: Record<string, React.ReactNode> = {
  'Total Users': <Users size={24} />,
  'Total Specialists': <Stethoscope size={24} />,
  'Total Hospitals': <Building2 size={24} />,
  'Active Blood Requests': <FileText size={24} />,
  'Pending Verifications': <CheckCircle2 size={24} />,
  'Total Donation Count': <HandHeart size={24} />,
};

const STAT_COLORS: Record<string, string> = {
  'Total Users': 'bg-blue',
  'Total Specialists': 'bg-purple',
  'Total Hospitals': 'bg-indigo',
  'Active Blood Requests': 'bg-red',
  'Pending Verifications': 'bg-amber',
  'Total Donation Count': 'bg-emerald',
};

interface StatCardProps {
  stat: StatCardType;
}

const StatCardUI: React.FC<StatCardProps> = ({ stat }) => {
  const icon = STAT_ICONS[stat.label] ?? <Users size={24} />;
  const colorBase = STAT_COLORS[stat.label] ?? 'bg-gray';
  const colorClass = `${colorBase}-100`;
  const textClass = `text-${colorBase}-600`;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 group">
      <div className="flex items-start justify-between">
        <div className={`p-4 rounded-2xl ${colorClass} transition-transform group-hover:scale-110 duration-300`}>
          <span className={textClass}>{icon}</span>
        </div>
        <div className="flex items-center space-x-1 text-green-500 bg-green-50 px-2 py-1 rounded-full text-xs font-bold">
          <TrendingUp size={12} />
          <span>{stat.sub_label}</span>
        </div>
      </div>
      <div className="mt-5">
        <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
        <h3 className="text-3xl font-extrabold text-gray-900 mt-1 tracking-tight">
          {stat.value.toLocaleString()}
        </h3>
        {stat.sub_value && (
          <p className="text-xs text-gray-400 mt-1">{stat.sub_value} {stat.label.toLowerCase().includes('donation') ? 'donors' : ''}</p>
        )}
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get<{ data: AdminDashboardResponse }>('/admin/dashboard');
        setDashboardData(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load dashboard data.');
        console.error('Dashboard fetch error:', err);
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
          <div className="flex items-center justify-center h-60">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        )}

        {error && !loading && (
          <div className="m-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {!loading && dashboardData && (
          <div className="p-8 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardData.stats.map((stat) => (
                <StatCardUI key={stat.label} stat={stat} />
              ))}
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activities */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Recent Activities</h3>
                  <button className="text-primary text-sm font-bold hover:underline flex items-center space-x-1">
                    <span>View All</span>
                    <ArrowUpRight size={14} />
                  </button>
                </div>
                <div className="space-y-6">
                  {dashboardData.recent_activities.length === 0 && (
                    <p className="text-gray-400 text-sm">No recent activity.</p>
                  )}
                  {dashboardData.recent_activities.map((activity: AdminActivity, i: number) => (
                    <div key={i} className="flex items-start space-x-4">
                      <div className="mt-1 flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
                          <Clock size={16} className="text-gray-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-400 mt-1 font-medium">
                          {formatDistanceToNow(activity.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
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
                {dashboardData.stats.find(s => s.label === 'Pending Verifications')?.value && (
                  <div className="mt-8 p-6 bg-red-50 rounded-2xl border border-red-100">
                    <h4 className="text-red-900 font-bold text-sm mb-2">Notice</h4>
                    <p className="text-red-700 text-xs leading-relaxed">
                      There are {dashboardData.stats.find(s => s.label === 'Pending Verifications')?.value} specialists awaiting verification. Please review them.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
