import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../../shared/lib/apiClient';
import { getAdminAuthHeader } from '../auth/AdminAuthContext';
import { Badge } from '../../../shared/components/ui/Badge';
import { Skeleton } from '../../../shared/components/ui/Skeleton';
import { ErrorState } from '../../../shared/components/ui/ErrorState';
import { Package, CreditCard, FileText, History, ArrowUpRight } from 'lucide-react';

interface DashboardSummary {
  publishedProducts: number;
  activeVariants: number;
  activeEmiPlans: number;
  pendingApplications: number;
  recentAuditLogs: Array<{
    id: string;
    action: string;
    entityType: string;
    entityId: string;
    createdAt: string;
    adminUser?: { fullName: string; email: string };
  }>;
}

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await apiClient.get<DashboardSummary>(
          '/admin/dashboard/summary',
          getAdminAuthHeader()
        );
        setData(res);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to load admin metrics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 bg-slate-800" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-28 bg-slate-800 rounded-2xl" />
          <Skeleton className="h-28 bg-slate-800 rounded-2xl" />
          <Skeleton className="h-28 bg-slate-800 rounded-2xl" />
          <Skeleton className="h-28 bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (errorMsg || !data) {
    return (
      <ErrorState
        title="Failed to Load Dashboard"
        message={errorMsg || 'Could not fetch summary data.'}
      />
    );
  }

  const statCards = [
    {
      title: 'Published Products',
      value: data.publishedProducts,
      icon: <Package className="w-5 h-5 text-emerald-400" />,
      link: '/admin/products',
    },
    {
      title: 'Active Variants',
      value: data.activeVariants,
      icon: <Package className="w-5 h-5 text-teal-400" />,
      link: '/admin/products',
    },
    {
      title: 'Active EMI Plans',
      value: data.activeEmiPlans,
      icon: <CreditCard className="w-5 h-5 text-indigo-400" />,
      link: '/admin/emi',
    },
    {
      title: 'Pending Applications',
      value: data.pendingApplications,
      icon: <FileText className="w-5 h-5 text-amber-400" />,
      link: '/admin/applications',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">System Overview</h1>
        <p className="text-xs text-slate-400">Live marketplace statistics</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link
            key={card.title}
            to={card.link}
            className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                {card.icon}
              </span>
              <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors" />
            </div>
            <span className="text-3xl font-extrabold text-white">{card.value}</span>
            <span className="text-xs font-semibold text-slate-400 block mt-1">{card.title}</span>
          </Link>
        ))}
      </div>

      {/* Recent Activity Stream */}
      <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-emerald-400" />
            <span>Recent Activity Log</span>
          </h3>
          <Link to="/admin/audit-logs" className="text-xs text-emerald-400 hover:underline">
            View All Audit Logs
          </Link>
        </div>

        {data.recentAuditLogs.length === 0 ? (
          <p className="text-xs text-slate-500">No administrative changes recorded yet.</p>
        ) : (
          <div className="divide-y divide-slate-800">
            {data.recentAuditLogs.map((log) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="promotional" size="sm">
                      {log.action}
                    </Badge>
                    <span className="font-semibold text-slate-300">
                      {log.entityType} ({log.entityId})
                    </span>
                  </div>
                  <span className="text-slate-500 block">
                    By: {log.adminUser?.fullName || 'System'} ({log.adminUser?.email || 'N/A'})
                  </span>
                </div>
                <span className="text-slate-500">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
