import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Topbar from '../../components/layout/Topbar';
import consultationService from '../../services/consultationService';
import { ConsultationType, ConsultationBenefit } from '../../types';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import ConsultationTypeModal from '../../components/modals/ConsultationTypeModal';
import ConsultationBenefitModal from '../../components/modals/ConsultationBenefitModal';
import ConfirmModal from '../../components/modals/ConfirmModal';

type ActiveTab = 'types' | 'benefits';

const Consultations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('types');
  const [types, setTypes] = useState<ConsultationType[]>([]);
  const [benefits, setBenefits] = useState<ConsultationBenefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal states
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [isBenefitModalOpen, setIsBenefitModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ConsultationType | null>(null);
  const [selectedBenefit, setSelectedBenefit] = useState<ConsultationBenefit | null>(null);
  
  // Delete confirm states
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: ActiveTab } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'types') {
        const response = await consultationService.listTypes();
        setTypes(response.data || []);
      } else {
        const response = await consultationService.listBenefits();
        setBenefits(response.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveType = async (data: Partial<ConsultationType>) => {
    setActionLoading(true);
    try {
      if (selectedType) {
        await consultationService.updateType(selectedType.id, data);
      } else {
        await consultationService.createType(data);
      }
      setIsTypeModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Failed to save type:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveBenefit = async (data: Partial<ConsultationBenefit>) => {
    setActionLoading(true);
    try {
      if (selectedBenefit) {
        await consultationService.updateBenefit(selectedBenefit.id, data);
      } else {
        await consultationService.createBenefit(data);
      }
      setIsBenefitModalOpen(false);
      fetchData();
    } catch (err) {
      console.error('Failed to save benefit:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setActionLoading(true);
    try {
      if (itemToDelete.type === 'types') {
        await consultationService.deleteType(itemToDelete.id);
      } else {
        await consultationService.deleteBenefit(itemToDelete.id);
      }
      setIsConfirmOpen(false);
      fetchData();
    } catch (err) {
      console.error('Failed to delete item:', err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col flex-1">
        <Topbar title="Consultation Management" />
        
        <div className="p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Tabs */}
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('types')}
                className={`px-6 py-2.5 rounded-lg transition-all font-semibold text-sm ${
                  activeTab === 'types'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Consultation Types
              </button>
              <button
                onClick={() => setActiveTab('benefits')}
                className={`px-6 py-2.5 rounded-lg transition-all font-semibold text-sm ${
                  activeTab === 'benefits'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Consultation Benefits
              </button>
            </div>

            {/* Action Button */}
            <button
              onClick={() => {
                if (activeTab === 'types') {
                  setSelectedType(null);
                  setIsTypeModalOpen(true);
                } else {
                  setSelectedBenefit(null);
                  setIsBenefitModalOpen(true);
                }
              }}
              className="flex items-center space-x-2 px-6 py-2.5 bg-gray-900 text-white rounded-xl font-semibold shadow-lg hover:bg-black transition-all"
            >
              <Plus size={18} />
              <span>Add {activeTab === 'types' ? 'Type' : 'Benefit'}</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {activeTab === 'types' ? (
                      <>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Duration</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Base Price</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                      </>
                    ) : (
                      <>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Benefit Title</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Description</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      </td>
                    </tr>
                  ) : activeTab === 'types' ? (
                    types.length === 0 ? (
                      <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">No types configured yet.</td></tr>
                    ) : (
                      types.map((type) => (
                        <tr key={type.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-gray-900">{type.name}</div>
                            <div className="text-xs text-gray-500 truncate max-w-xs">{type.description}</div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-700">{type.duration_minutes} min</td>
                          <td className="px-6 py-4 text-sm font-bold text-primary">₦ {parseFloat(type.base_price).toLocaleString()}</td>
                          <td className="px-6 py-4">
                            {type.is_active ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-green-50 text-green-700">
                                <CheckCircle2 size={12} className="mr-1" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-500">
                                <XCircle size={12} className="mr-1" /> Inactive
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <button 
                                onClick={() => { setSelectedType(type); setIsTypeModalOpen(true); }}
                                className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => { setItemToDelete({ id: type.id, type: 'types' }); setIsConfirmOpen(true); }}
                                className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )
                  ) : (
                    benefits.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-medium">No benefits configured yet.</td></tr>
                    ) : (
                      benefits.map((benefit) => (
                        <tr key={benefit.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-gray-900">{benefit.title}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-sm truncate">{benefit.description}</td>
                          <td className="px-6 py-4">
                            {benefit.is_active ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-green-50 text-green-700">
                                <CheckCircle2 size={12} className="mr-1" /> Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-500">
                                <XCircle size={12} className="mr-1" /> Inactive
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <button 
                                onClick={() => { setSelectedBenefit(benefit); setIsBenefitModalOpen(true); }}
                                className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => { setItemToDelete({ id: benefit.id, type: 'benefits' }); setIsConfirmOpen(true); }}
                                className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modals */}
        <ConsultationTypeModal
          isOpen={isTypeModalOpen}
          onClose={() => setIsTypeModalOpen(false)}
          onSave={handleSaveType}
          initialData={selectedType}
          loading={actionLoading}
        />

        <ConsultationBenefitModal
          isOpen={isBenefitModalOpen}
          onClose={() => setIsBenefitModalOpen(false)}
          onSave={handleSaveBenefit}
          initialData={selectedBenefit}
          loading={actionLoading}
        />

        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleDelete}
          title="Delete Confirmation"
          message={`Are you sure you want to delete this consultation ${itemToDelete?.type === 'types' ? 'type' : 'benefit'}? This action cannot be undone.`}
          confirmText="Delete"
          isDestructive={true}
        />
      </div>
    </AdminLayout>
  );
};

export default Consultations;
