import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import Topbar from '../components/layout/Topbar';
import api from '../services/api';
import { AppointmentResponse } from '../types';
import { Search, Loader2, Calendar, Eye, CheckCircle, XCircle } from 'lucide-react';
import ActionMenu, { MenuItem } from '../components/common/ActionMenu';
import AppointmentDetailsModal from '../components/modals/AppointmentDetailsModal';
import ActionSuccessModal from '../components/modals/ActionSuccessModal';
import ConfirmModal from '../components/modals/ConfirmModal';
import { formatDate } from '../utils/time';

type StatusTab = 'Upcoming' | 'Completed' | 'Missed';

const STATUS_TABS: StatusTab[] = ['Upcoming', 'Completed', 'Missed'];

// Maps tab label → backend status query param
const STATUS_MAP: Record<StatusTab, string | null> = {
  Upcoming: 'Confirmed',
  Completed: 'Completed',
  Missed: 'Cancelled',
};

const statusBadge = (s: string) => {
  const l = (s || '').toLowerCase();
  if (l === 'completed') return { label: 'Completed', cls: 'bg-green-50 text-green-700' };
  if (l === 'cancelled' || l === 'missed') return { label: 'Missed', cls: 'bg-red-50 text-red-600' };
  if (l === 'confirmed') return { label: 'Scheduled', cls: 'bg-green-50 text-green-600' };
  if (l === 'created') return { label: 'Pending', cls: 'bg-amber-50 text-amber-600' };
  return { label: s, cls: 'bg-gray-50 text-gray-500' };
};

const Donations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StatusTab>('Upcoming');
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<AppointmentResponse | null>(null);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    id: '',
    action: '' as 'complete' | 'cancel' | '',
    title: '',
    message: '',
  });
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const status = STATUS_MAP[activeTab];
      if (status) params.set('status', status.toLowerCase());
      // Admin sees all — no extra filter needed

      const response = await api.get<{ data: AppointmentResponse[] }>(`/appointments?${params}`);
      setAppointments(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Client-side search filter
  const filtered = appointments.filter((a) => {
    if (!debouncedSearch) return true;
    const q = debouncedSearch.toLowerCase();
    const donor = `${a.user.first_name} ${a.user.last_name}`.toLowerCase();
    const hosp = a.hospital.name.toLowerCase();
    const email = a.user.email.toLowerCase();
    return donor.includes(q) || hosp.includes(q) || email.includes(q);
  });

  const handleMarkComplete = (id: string) => {
    setConfirmModal({
      isOpen: true,
      id,
      action: 'complete',
      title: 'Mark as Complete',
      message: 'Are you sure you want to mark this appointment as completed?',
    });
  };

  const handleMarkMissed = (id: string) => {
    setConfirmModal({
      isOpen: true,
      id,
      action: 'cancel',
      title: 'Mark as Missed',
      message: 'Are you sure you want to mark this appointment as missed/cancelled?',
    });
  };

  const executeAction = async () => {
    const { id, action } = confirmModal;
    try {
      if (action === 'complete') {
        await api.put(`/appointments/complete/${id}`);
        setSuccessModal({ isOpen: true, title: 'Appointment Completed', message: 'This appointment has been marked as completed.' });
      } else if (action === 'cancel') {
        await api.put(`/appointments/cancel/${id}`, { reason: 'Marked as missed by admin' });
        setSuccessModal({ isOpen: true, title: 'Marked as Missed', message: 'This appointment has been marked as missed.' });
      }
      fetchAppointments();
    } catch (err) {
      console.error('Action failed:', err);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col flex-1 flex flex-col">
<Topbar title="Donation Appointments" />

        <div className="flex-1 p-8">
          {/* Top controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setSearch(''); }}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-red-700 text-white shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient by name, email or phone"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4 text-gray-400">
                <Loader2 size={40} className="animate-spin text-red-600" />
                <p className="text-sm font-medium">Loading appointments...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-3 text-gray-400">
                <Calendar size={48} className="opacity-30" />
                <p className="text-base font-semibold">
                  {debouncedSearch ? `No results for "${debouncedSearch}"` : `No ${activeTab.toLowerCase()} appointments`}
                </p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-6 py-4 text-gray-500 font-semibold text-xs">Donor Name</th>
                    <th className="text-left px-6 py-4 text-gray-500 font-semibold text-xs">Hospital</th>
                    <th className="text-left px-6 py-4 text-gray-500 font-semibold text-xs">Appointment Time</th>
                    <th className="text-left px-6 py-4 text-gray-500 font-semibold text-xs">Status</th>
                    <th className="text-left px-6 py-4 text-gray-500 font-semibold text-xs">Units Donated</th>
                    <th className="text-left px-6 py-4 text-gray-500 font-semibold text-xs">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((item) => {
                    const { appointment: appt, user, hospital, blood_request: br } = item;
                    const badge = statusBadge(appt.status);
                    const isUpcoming = activeTab === 'Upcoming';

                    const menuItems: MenuItem[] = [
                      {
                        label: 'View Details',
                        icon: <Eye size={14} />,
                        onClick: () => { setSelectedAppt(item); setDetailsOpen(true); },
                      },
                    ];

                    if (isUpcoming) {
                      menuItems.push(
                        {
                          label: 'Mark Complete',
                          icon: <CheckCircle size={14} />,
                          onClick: () => handleMarkComplete(appt.id),
                        },
                        {
                          label: 'Mark Missed',
                          icon: <XCircle size={14} />,
                          variant: 'danger',
                          onClick: () => handleMarkMissed(appt.id),
                        }
                      );
                    }

                    return (
                      <tr key={appt.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </td>
                        <td className="px-6 py-4 text-gray-700">{hospital.name}</td>
                        <td className="px-6 py-4 text-gray-700">{formatDate(appt.scheduled_time)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${badge.cls}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {br.donated_at && br.units ? `${br.units * 450}ml` : '————'}
                        </td>
                        <td className="px-6 py-4">
                          <ActionMenu items={menuItems} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Appointment Details Modal */}
        <AppointmentDetailsModal
          isOpen={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          appointment={selectedAppt}
        />

        {/* Confirm action modal */}
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
          onConfirm={executeAction}
          title={confirmModal.title}
          message={confirmModal.message}
          confirmText={confirmModal.action === 'complete' ? 'Mark Complete' : 'Mark Missed'}
          isDestructive={confirmModal.action === 'cancel'}
        />

        {/* Success modal */}
        <ActionSuccessModal
          isOpen={successModal.isOpen}
          onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
          title={successModal.title}
          message={successModal.message}
        />
      </div>
    </AdminLayout>
  );
};

export default Donations;
