import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../shared/lib/apiClient';
import { getAdminAuthHeader } from '../auth/AdminAuthContext';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { Modal } from '../../../shared/components/ui/Modal';
import { Skeleton } from '../../../shared/components/ui/Skeleton';
import { ErrorState } from '../../../shared/components/ui/ErrorState';
import { Plus, CreditCard } from 'lucide-react';

export const AdminEmiPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'providers' | 'plans'>('providers');
  const [providers, setProviders] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // New Provider State
  const [isProviderModalOpen, setIsProviderModalOpen] = useState(false);
  const [provName, setProvName] = useState('');
  const [provCode, setProvCode] = useState('');

  // New Plan State
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [planVariantId, setPlanVariantId] = useState('');
  const [planProviderId, setPlanProviderId] = useState('');
  const [planTenure, setPlanTenure] = useState<number>(6);
  const [planInterest, setPlanInterest] = useState<number>(0);
  const [planCashback, setPlanCashback] = useState<number>(2000);
  const [planFee, setPlanFee] = useState<number>(199);
  const [planZeroCost, setPlanZeroCost] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [provRes, planRes] = await Promise.all([
        apiClient.get<any[]>('/admin/emi/providers', getAdminAuthHeader()),
        apiClient.get<any[]>('/admin/emi/plans', getAdminAuthHeader()),
      ]);
      setProviders(provRes);
      setPlans(planRes);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load EMI configuration');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProvider = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post(
        '/admin/emi/providers',
        { name: provName, code: provCode.toUpperCase() },
        getAdminAuthHeader()
      );
      setIsProviderModalOpen(false);
      setProvName('');
      setProvCode('');
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to create EMI Provider');
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.post(
        '/admin/emi/plans',
        {
          variantId: planVariantId,
          providerId: planProviderId || providers[0]?.id,
          tenureMonths: Number(planTenure),
          interestRate: Number(planInterest),
          cashbackAmount: Number(planCashback),
          processingFee: Number(planFee),
          isZeroCost: planZeroCost,
        },
        getAdminAuthHeader()
      );
      setIsPlanModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to create EMI Plan');
    }
  };

  const toggleProviderActive = async (id: string, currentStatus: boolean) => {
    try {
      await apiClient.patch(
        `/admin/emi/providers/${id}`,
        { isActive: !currentStatus },
        getAdminAuthHeader()
      );
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to update provider status');
    }
  };

  const togglePlanActive = async (id: string, currentStatus: boolean) => {
    try {
      await apiClient.patch(
        `/admin/emi/plans/${id}`,
        { isActive: !currentStatus },
        getAdminAuthHeader()
      );
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Failed to update plan status');
    }
  };

  const formatINR = (val: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">EMI & Financing Management</h1>
          <p className="text-xs text-slate-400">Configure bank partners, interest rates, and promotional cashback</p>
        </div>

        <div className="flex gap-2">
          {activeTab === 'providers' ? (
            <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsProviderModalOpen(true)}>
              Add Bank Partner
            </Button>
          ) : (
            <Button variant="primary" size="md" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsPlanModalOpen(true)}>
              Create EMI Plan
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('providers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'providers' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Bank Partners ({providers.length})
        </button>
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'plans' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          Financing Plans ({plans.length})
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <Skeleton className="h-64 w-full bg-slate-800" />
      ) : errorMsg ? (
        <ErrorState title="Failed to Load EMI Settings" message={errorMsg} onRetry={fetchData} />
      ) : activeTab === 'providers' ? (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Partner Name</th>
                <th className="p-4">Provider Code</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {providers.map((p) => (
                <tr key={p.id} className="hover:bg-slate-900/50">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span>{p.name}</span>
                  </td>
                  <td className="p-4 font-mono text-xs">{p.code}</td>
                  <td className="p-4">
                    {p.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="neutral">Inactive</Badge>}
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="outline" size="sm" onClick={() => toggleProviderActive(p.id, p.isActive)}>
                      {p.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Provider</th>
                <th className="p-4">Product Variant</th>
                <th className="p-4">Tenure</th>
                <th className="p-4">Interest</th>
                <th className="p-4">Cashback</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {plans.map((pl) => (
                <tr key={pl.id} className="hover:bg-slate-900/50">
                  <td className="p-4 font-bold text-white">{pl.provider?.name}</td>
                  <td className="p-4 text-xs">
                    <span className="font-semibold block text-slate-200">{pl.variant?.product?.title}</span>
                    <span className="text-slate-500">{pl.variant?.title}</span>
                  </td>
                  <td className="p-4 font-bold">{pl.tenureMonths} Months</td>
                  <td className="p-4 font-semibold">{pl.isZeroCost ? '0% (Zero Cost)' : `${pl.interestRate}%`}</td>
                  <td className="p-4 text-emerald-400 font-bold">{formatINR(pl.cashbackAmount)}</td>
                  <td className="p-4">
                    {pl.isActive ? <Badge variant="success">Active</Badge> : <Badge variant="neutral">Inactive</Badge>}
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="outline" size="sm" onClick={() => togglePlanActive(pl.id, pl.isActive)}>
                      {pl.isActive ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Provider Modal */}
      <Modal isOpen={isProviderModalOpen} onClose={() => setIsProviderModalOpen(false)} title="Add EMI Bank Partner" size="sm">
        <form onSubmit={handleCreateProvider} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Axis Bank"
              value={provName}
              onChange={(e) => {
                setProvName(e.target.value);
                setProvCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_]+/g, '_'));
              }}
              className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Provider Code</label>
            <input
              type="text"
              required
              value={provCode}
              onChange={(e) => setProvCode(e.target.value)}
              className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={() => setIsProviderModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Create Provider</Button>
          </div>
        </form>
      </Modal>

      {/* Plan Modal */}
      <Modal isOpen={isPlanModalOpen} onClose={() => setIsPlanModalOpen(false)} title="Create EMI Plan" size="md">
        <form onSubmit={handleCreatePlan} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Bank Provider</label>
            <select
              value={planProviderId}
              onChange={(e) => setPlanProviderId(e.target.value)}
              className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900"
            >
              {providers.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Variant ID</label>
            <input
              type="text"
              required
              placeholder="Paste Product Variant UUID"
              value={planVariantId}
              onChange={(e) => setPlanVariantId(e.target.value)}
              className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tenure (Months)</label>
              <input
                type="number"
                min={1}
                value={planTenure}
                onChange={(e) => setPlanTenure(Number(e.target.value))}
                className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Interest Rate (%)</label>
              <input
                type="number"
                min={0}
                value={planInterest}
                onChange={(e) => setPlanInterest(Number(e.target.value))}
                className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Cashback Amount (INR)</label>
              <input
                type="number"
                min={0}
                value={planCashback}
                onChange={(e) => setPlanCashback(Number(e.target.value))}
                className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Processing Fee (INR)</label>
              <input
                type="number"
                min={0}
                value={planFee}
                onChange={(e) => setPlanFee(Number(e.target.value))}
                className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-slate-900"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="planZeroCost"
              checked={planZeroCost}
              onChange={(e) => setPlanZeroCost(e.target.checked)}
              className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
            />
            <label htmlFor="planZeroCost" className="text-xs font-semibold text-slate-800">
              Mark as Zero Cost EMI
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" type="button" onClick={() => setIsPlanModalOpen(false)}>Cancel</Button>
            <Button variant="primary" type="submit">Create EMI Plan</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
