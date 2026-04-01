import React, { useState } from 'react';
import Modal from '../common/Modal';
import { BloodRequestResponse } from '../../types';
import { formatDate } from '../../utils/time';
import api from '../../services/api';
import ActionSuccessModal from './ActionSuccessModal';
import { CheckCircle, Clock, Users } from 'lucide-react';

interface BloodRequestDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: BloodRequestResponse | null;
  onFulfilled: () => void;
}

const statusColor = (s: string | null) => {
  if (!s) return 'bg-gray-50 text-gray-500';
  const l = s.toLowerCase();
  if (l.includes('completed') || l.includes('fulfilled') || l.includes('donated')) return 'bg-green-50 text-green-700';
  if (l.includes('confirmed') || l.includes('active')) return 'bg-blue-50 text-blue-700';
  if (l.includes('cancelled')) return 'bg-red-50 text-red-700';
  return 'bg-amber-50 text-amber-700';
};

const urgencyColor = (u: string | null) => {
  if (!u) return 'bg-gray-50 text-gray-500';
  return u.toLowerCase() === 'urgent' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-600';
};

// Build a simple timeline from the request state
const buildTimeline = (req: BloodRequestResponse['blood_request']) => {
  const events: { label: string; date: string; done: boolean }[] = [];
  events.push({ label: 'Request submitted', date: req.created_at, done: true });
  if (req.donor_id) {
    events.push({ label: 'Donor matched', date: req.created_at, done: true });
  }
  if (req.donated_at) {
    events.push({ label: 'Donation completed', date: req.donated_at, done: true });
  }
  if (req.administered_at) {
    events.push({ label: 'Blood administered', date: req.administered_at, done: true });
  }
  return events;
};

const BloodRequestDetailsModal: React.FC<BloodRequestDetailsModalProps> = ({
  isOpen,
  onClose,
  request,
  onFulfilled,
}) => {
  const [fulfilling, setFulfilling] = useState(false);
  const [successModal, setSuccessModal] = useState(false);

  if (!isOpen || !request) return null;

  const { blood_request: br, donor, patient } = request;
  const isFulfilled = br.request_status?.toLowerCase() === 'fulfilled' ||
    br.request_status?.toLowerCase() === 'completed';

  const handleMarkFulfilled = async () => {
    setFulfilling(true);
    try {
      await api.put(`/hospitals/blood-request/${br.id}`, {
        request_status: 'completed',
        timeline_status: 'request_fulfilled',
      });
      onFulfilled();
      setSuccessModal(true);
    } catch (err) {
      console.error('Failed to mark as fulfilled:', err);
    } finally {
      setFulfilling(false);
    }
  };

  const timeline = buildTimeline(br);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Blood Request Details" width="max-w-lg">
        <div className="px-6 pb-6 space-y-5 text-sm">

          {/* Hospital info */}
          <section>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Hospital Information</p>
            <div className="space-y-2">
              <InfoRow label="Hospital Name:" value={patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Hospital'} />
              <InfoRow label="Location:" value={patient?.address || patient?.country || 'N/A'} />
              <InfoRow label="Contact:" value={patient?.phone || 'N/A'} />
            </div>
          </section>

          <hr className="border-gray-100" />

          {/* Request details */}
          <section>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Request Details</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Blood Type:</span>
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${urgencyColor(br.blood_type)}`}>
                  {br.blood_type || 'N/A'}
                </span>
              </div>
              <InfoRow label="Units Needed:" value={br.units ? `${br.units} units` : 'N/A'} />
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Urgency:</span>
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${urgencyColor(br.urgency)}`}>
                  {br.urgency || 'N/A'}
                </span>
              </div>
              <InfoRow label="Reason:" value={br.request_reason || 'N/A'} />
              <InfoRow label="Request Time:" value={formatDate(br.created_at)} />
              <InfoRow label="Reference ID:" value={br.ref_id} />
            </div>
          </section>

          {/* Donor */}
          {donor && (
            <>
              <hr className="border-gray-100" />
              <section>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Users size={14} /> Donor List (1 matched)
                </p>
                <div className="rounded-xl border border-gray-100 overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50 text-gray-400">
                      <tr>
                        <th className="text-left px-3 py-2 font-medium">Donor Name</th>
                        <th className="text-left px-3 py-2 font-medium">Status</th>
                        <th className="text-left px-3 py-2 font-medium">Units</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-gray-50">
                        <td className="px-3 py-3 font-medium text-gray-900">{donor.first_name} {donor.last_name}</td>
                        <td className="px-3 py-3">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-xs ${statusColor(br.request_status)}`}>
                            {br.request_status || 'Confirmed'}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-gray-700">{br.units ?? '—'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}

          {/* Timeline */}
          <section>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Clock size={14} /> Request Timeline
            </p>
            <div className="space-y-0">
              {timeline.map((e, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${e.done ? 'bg-green-600' : 'bg-gray-200'}`}>
                      <CheckCircle size={14} className="text-white" />
                    </div>
                    {i < timeline.length - 1 && <div className="w-px h-6 bg-gray-200 mt-1" />}
                  </div>
                  <div className="pb-4">
                    <p className="font-semibold text-gray-900">{e.label}</p>
                    <p className="text-xs text-gray-400">{formatDate(e.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer actions */}
        <div className="flex gap-3 px-6 pb-6 pt-2 border-t border-gray-100">
          <button
            onClick={handleMarkFulfilled}
            disabled={fulfilling || isFulfilled}
            className="flex-1 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFulfilled ? 'Already Fulfilled' : fulfilling ? 'Updating...' : 'Mark As Fulfilled'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-gray-50 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
      </Modal>

      <ActionSuccessModal
        isOpen={successModal}
        onClose={() => { setSuccessModal(false); onClose(); }}
        title="Request Fulfilled"
        message="This blood request has been marked as fulfilled."
      />
    </>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-400">{label}</span>
    <span className="text-gray-900 font-medium text-right max-w-[64%]">{value}</span>
  </div>
);

export default BloodRequestDetailsModal;
