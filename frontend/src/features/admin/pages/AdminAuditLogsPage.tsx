import React, { useState, useEffect } from 'react';
import { apiClient } from '../../../shared/lib/apiClient';
import { getAdminAuthHeader } from '../auth/AdminAuthContext';
import { Badge } from '../../../shared/components/ui/Badge';
import { Skeleton } from '../../../shared/components/ui/Skeleton';
import { ErrorState } from '../../../shared/components/ui/ErrorState';
import { History } from 'lucide-react';

interface AuditLogItem {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  beforeState?: any;
  afterState?: any;
  ipAddress?: string;
  createdAt: string;
  adminUser?: { fullName: string; email: string; role: string };
}

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get<AuditLogItem[]>(
        '/admin/audit-logs',
        getAdminAuthHeader()
      );
      setLogs(res);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load audit trail');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <History className="w-6 h-6 text-emerald-400" />
          <span>Administrative Audit Logs</span>
        </h1>
        <p className="text-xs text-slate-400">Read-only immutable record of all administrative system mutations</p>
      </div>

      {/* Audit Log Table */}
      {isLoading ? (
        <Skeleton className="h-64 w-full bg-slate-800" />
      ) : errorMsg ? (
        <ErrorState title="Failed to Load Audit Trail" message={errorMsg} onRetry={fetchLogs} />
      ) : (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Admin User</th>
                <th className="p-4">Action</th>
                <th className="p-4">Entity Type</th>
                <th className="p-4">Target ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/50">
                  <td className="p-4 text-slate-400 text-xs font-mono">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-white block">{log.adminUser?.fullName || 'System'}</span>
                    <span className="text-slate-500 text-xs">{log.adminUser?.email || 'N/A'}</span>
                  </td>
                  <td className="p-4">
                    <Badge variant="promotional">{log.action}</Badge>
                  </td>
                  <td className="p-4 font-semibold text-slate-200">{log.entityType}</td>
                  <td className="p-4 font-mono text-xs text-slate-400">{log.entityId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
