import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import Topbar from '../components/layout/Topbar';
import api from '../services/api';
import { BloodRequestResponse } from '../types';
import { Search, Loader2, Droplets, ChevronDown } from 'lucide-react';
import BloodRequestDetailsModal from '../components/modals/BloodRequestDetailsModal';

type StatusTab = 'Active' | 'Completed' | 'Cancelled';

const STATUS_TABS: StatusTab[] = ['Active', 'Completed', 'Cancelled'];

const STATUS_MAP: Record<StatusTab, string> = {
  Active: 'confirmed',
  Completed: 'completed',
  Cancelled: 'cancelled',
};

const BLOOD_TYPES = ['All Types', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const URGENCY_LEVELS = ['All Levels', 'Urgent', 'Standard', 'Low'];

const bloodTypeStyle = 'bg-red-50 text-red-600';

const urgencyStyle = (u: string | null) => {
  if (!u) return 'bg-gray-50 text-gray-500';
  return u.toLowerCase() === 'urgent'
    ? 'bg-red-50 text-red-600'
    : 'bg-blue-50 text-blue-600';
};

const statusBadge = (s: string | null) => {
  if (!s) return 'bg-gray-50 text-gray-500';
  const l = s.toLowerCase();
  if (l === 'fulfilled' || l === 'completed') return 'bg-green-50 text-green-700';
  if (l === 'confirmed' || l === 'active') return 'bg-green-50 text-green-700';
  if (l === 'cancelled') return 'bg-red-50 text-red-700';
  return 'bg-amber-50 text-amber-700';
};

const BloodRequests: React.FC = () => {
  const [activeTab, setActiveTab] = useState<StatusTab>('Active');
  const [requests, setRequests] = useState<BloodRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [bloodType, setBloodType] = useState('All Types');
  const [urgency, setUrgency] = useState('All Levels');
  const [hospitalSearch, setHospitalSearch] = useState('');

  const [selectedRequest, setSelectedRequest] = useState<BloodRequestResponse | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      const status = STATUS_MAP[activeTab];
      if (status && status !== 'Active') {
        params.set('request_status', status.toLowerCase());
      }
      if (bloodType !== 'All Types') params.set('blood_type', bloodType.replace('+', '_plus').replace('-', '_minus'));
      if (urgency !== 'All Levels') params.set('urgency', urgency);

      const response = await api.get<{ data: BloodRequestResponse[] }>(`/hospitals/blood-request?${params}`);
      setRequests(response.data.data || []);
    } catch (err) {
      console.error('Failed to fetch blood requests:', err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, bloodType, urgency]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Client-side hospital name search
  const filteredRequests = requests.filter((r) => {
    if (!hospitalSearch) return true;
    const donor = r.donor;
    const patient = r.patient;
    const nameStr = [
      donor?.first_name, donor?.last_name,
      patient?.first_name, patient?.last_name,
    ].filter(Boolean).join(' ').toLowerCase();
    return nameStr.includes(hospitalSearch.toLowerCase());
  });

  const handleViewRequest = (req: BloodRequestResponse) => {
    setSelectedRequest(req);
    setDetailsOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex flex-col flex-1 flex flex-col">
<Topbar title="Blood Request" />

        <div className="flex-1 p-8">
          {/* Top controls: tabs + search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center bg-white border border-gray-100 rounded-xl p-1 shadow-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
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

            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search patient..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
              />
            </div>
          </div>

          {/* Filter panel */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 space-y-4">
            {/* Hospital search */}
            <div className="relative w-full md:w-72">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={hospitalSearch}
                onChange={(e) => setHospitalSearch(e.target.value)}
                placeholder="Search by hospital name..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400 transition-all"
              />
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Blood Type</label>
                <div className="relative">
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
                  >
                    {BLOOD_TYPES.map((bt) => <option key={bt}>{bt}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Urgency</label>
                <div className="relative">
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
                  >
                    {URGENCY_LEVELS.map((u) => <option key={u}>{u}</option>)}
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-4 text-gray-400">
                <Loader2 size={40} className="animate-spin text-red-600" />
                <p className="text-sm font-medium">Loading blood requests...</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 space-y-3 text-gray-400">
                <Droplets size={48} className="opacity-30" />
                <p className="text-base font-semibold">No blood requests found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-6 py-4 text-gray-500 font-semibold text-xs whitespace-nowrap uppercase tracking-wider">Request ID</th>
                      <th className="text-left px-6 py-4 text-gray-500 font-semibold text-xs whitespace-nowrap uppercase tracking-wider">Hospital Name</th>
                      <th className="text-left px-6 py-4 text-gray-500 font-semibold text-xs whitespace-nowrap uppercase tracking-wider">Blood Type</th>
                      <th className="text-left px-6 py-4 text-gray-500 font-semibold text-xs whitespace-nowrap uppercase tracking-wider">Units Needed</th>
                      <th className="text-left px-6 py-4 text-gray-500 font-semibold text-xs whitespace-nowrap uppercase tracking-wider">Urgency</th>
                      <th className="text-left px-6 py-4 text-gray-500 font-semibold text-xs whitespace-nowrap uppercase tracking-wider">Donors Matched</th>
                      <th className="text-left px-6 py-4 text-gray-500 font-semibold text-xs whitespace-nowrap uppercase tracking-wider">Status</th>
                      <th className="text-left px-6 py-4 text-gray-500 font-semibold text-xs whitespace-nowrap uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredRequests.map((req) => {
                      const br = req.blood_request;
                      const hospName = req.patient
                        ? `${req.patient.first_name} ${req.patient.last_name}`
                        : 'Unknown Hospital';

                      return (
                        <tr key={br.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs text-gray-500 whitespace-nowrap">
                            {br.ref_id ? `HB-${br.ref_id.slice(0, 8).toUpperCase()}` : '—'}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{hospName}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {br.blood_type ? (
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${bloodTypeStyle}`}>
                                {br.blood_type}
                              </span>
                            ) : '—'}
                          </td>
                          <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{br.units ? `${br.units} Units` : '—'}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {br.urgency ? (
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${urgencyStyle(br.urgency)}`}>
                                {br.urgency}
                              </span>
                            ) : '—'}
                          </td>
                          <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                            {req.donor ? `1 of ${br.units || 1}` : `0 of ${br.units || 1}`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${statusBadge(br.request_status)}`}>
                              {activeTab}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleViewRequest(req)}
                              className="text-red-600 text-sm font-semibold hover:text-red-700 transition-colors"
                            >
                              View Request
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <BloodRequestDetailsModal
          isOpen={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          request={selectedRequest}
          onFulfilled={fetchRequests}
        />
      </div>
    </AdminLayout>
  );
};

export default BloodRequests;
