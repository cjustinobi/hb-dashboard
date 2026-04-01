import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import api from '../services/api';
import { NotificationResponse, NotificationCategory, NotificationListResponse } from '../types';
import { Search, Loader2, Bell, Heart, User, Calendar, Activity, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from '../utils/time';

type TabType = 'All' | 'Verifications' | 'Blood Requests' | 'Appointments' | 'System';

const TABS: TabType[] = ['All', 'Verifications', 'Blood Requests', 'Appointments', 'System'];

const CATEGORY_MAP: Record<TabType, NotificationCategory | null> = {
  'All': null,
  'Verifications': 'verification',
  'Blood Requests': 'blood_request',
  'Appointments': 'appointment',
  'System': 'system',
};

const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const category = CATEGORY_MAP[activeTab];
      if (category) params.set('category', category);
      if (debouncedSearch) params.set('search', debouncedSearch);

      const response = await api.get<{ data: NotificationListResponse }>('/notifications', { params });
      setNotifications(response.data.data.data || []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, debouncedSearch]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      fetchNotifications();
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleNotificationClick = async (notif: NotificationResponse) => {
    if (!notif.is_read) {
      try {
        await api.patch(`/notifications/${notif.id}/read`);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
        );
      } catch (err) {
        console.error('Failed to mark as read:', err);
      }
    }

    // Optional: Route to specific modules based on category
    if (notif.category === 'verification') {
      navigate('/verification');
    } else if (notif.category === 'blood_request') {
      navigate('/blood-requests');
    } else if (notif.category === 'appointment') {
      // You could navigate to care or donations depending on the metadata
      navigate('/care');
    }
  };

  const getIconForCategory = (category: NotificationCategory) => {
    switch (category) {
      case 'verification':
        return (
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-700">
            <User size={20} fill="currentColor" />
          </div>
        );
      case 'blood_request':
        return (
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-red-700">
            <Heart size={20} fill="currentColor" />
          </div>
        );
      case 'appointment':
        return (
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <Calendar size={20} />
          </div>
        );
      case 'system':
      default:
        return (
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Bell size={20} fill="currentColor" />
          </div>
        );
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col flex-1 flex flex-col pt-8">
<div className="px-10 max-w-8xl w-full mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex items-center justify-between pl-14 lg:pl-0">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Notifications</h1>
            <button
              onClick={handleMarkAllAsRead}
              className="px-6 py-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 rounded-xl font-semibold text-sm transition-colors shadow-sm"
            >
              Mark all as Read
            </button>
          </div>

          {/* Filters & Search */}
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center bg-white border border-gray-100 rounded-xl p-1.5 shadow-sm">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab);
                    setSearch('');
                  }}
                  className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-[#B21818] text-white shadow'
                      : 'text-gray-500 hover:text-gray-900 bg-transparent'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative w-[340px]">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notifications..."
                className="w-full pl-11 pr-4 py-3 bg-gray-100/70 border-none rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
              />
            </div>
          </div>

          {/* List */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4 text-gray-400">
                <Loader2 size={40} className="animate-spin text-[#B21818]" />
                <p className="text-sm font-medium">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-3 text-gray-400">
                <Bell size={48} className="opacity-30" />
                <p className="text-base font-semibold">No notifications found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50 flex flex-col">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`flex items-start gap-5 p-6 cursor-pointer transition-colors ${
                      notif.is_read ? 'bg-white hover:bg-gray-50' : 'bg-gray-50/50 hover:bg-gray-100/50'
                    }`}
                  >
                    <div className="flex-shrink-0 pt-0.5">
                      {getIconForCategory(notif.category)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-[15px] truncate ${notif.is_read ? 'font-medium text-gray-800' : 'font-bold text-gray-900'}`}>
                          {notif.title}
                        </h3>
                        {!notif.is_read && (
                          <span className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0"></span>
                        )}
                      </div>
                      
                      <p className={`text-sm mb-2 line-clamp-2 ${notif.is_read ? 'text-gray-500' : 'text-gray-600'}`}>
                        {notif.message}
                      </p>
                      
                      <p className="text-xs text-gray-400 font-medium">
                        {formatDistanceToNow(notif.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
            </div>
    </AdminLayout>
  );
};
export default Notifications;
