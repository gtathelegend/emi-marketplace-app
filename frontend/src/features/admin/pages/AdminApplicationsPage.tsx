import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../shared/lib/apiClient';
import { getAdminAuthHeader } from '../auth/AdminAuthContext';
import { Button } from '../../../shared/components/ui/Button';
import { Badge } from '../../../shared/components/ui/Badge';
import { Skeleton } from '../../../shared/components/ui/Skeleton';
import { ErrorState } from '../../../shared/components/ui/ErrorState';
import { CheckCircle, XCircle } from 'lucide-react';

interface AdminApplication {
  id: string;
  applicationNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  productNameSnapshot: string;
  providerNameSnapshot: string;
  tenureMonthsSnapshot: number;
  monthlyAmountSnapshot: number;
  totalPayableSnapshot: number;
  appliedAt: string;
}

export const AdminApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchApplications = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<AdminApplication[]>(
        '/admin/applications',
        getAdminAuthHeader()
      );
      setApplications(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load customer applications');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await apiClient.patch(
        `/admin/applications/${id}/status`,
        { status: newStatus },
        getAdminAuthHeader()
      );
      fetchApplications();
    } catch (err: any) {
      alert(err.message || 'Failed to transition application status');
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
      <div>
        <h1 className="text-2xl font-bold text-white">Customer EMI Applications</h1>
        <p className="text-xs text-slate-400">Review submitted financing requests and process approval statuses</p>
      </div>

      {/* Applications Table */}
      {isLoading ? (
        <Skeleton className="h-64 w-full bg-slate-800" />
      ) : errorMsg ? (
        <ErrorState title="Failed to Load Applications" message={errorMsg} onRetry={fetchApplications} />
      ) : (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">App Reference</th>
                <th className="p-4">Applicant</th>
                <th className="p-4">Product & Bank</th>
                <th className="p-4">Monthly EMI</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Process Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-900/50">
                  <td className="p-4 font-mono font-bold text-emerald-400">{app.applicationNumber}</td>
                  <td className="p-4">
                    <span className="font-bold text-white block">{app.customerName}</span>
                    <span className="text-slate-500 text-xs">{app.customerEmail} | {app.customerPhone}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold text-slate-200 block">{app.productNameSnapshot}</span>
                    <span className="text-slate-500 text-xs">{app.providerNameSnapshot} ({app.tenureMonthsSnapshot}m)</span>
                  </td>
                  <td className="p-4 font-bold text-white">
                    {formatINR(app.monthlyAmountSnapshot)}/mo
                  </td>
                  <td className="p-4">
                    <Badge variant={app.status === 'APPROVED' ? 'success' : app.status === 'REJECTED' ? 'neutral' : 'info'}>
                      {app.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {app.status === 'PENDING' && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                            onClick={() => handleStatusChange(app.id, 'APPROVED')}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            leftIcon={<XCircle className="w-3.5 h-3.5" />}
                            onClick={() => handleStatusChange(app.id, 'REJECTED')}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {app.status !== 'PENDING' && (
                        <span className="text-xs text-slate-500 font-semibold">Processed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
