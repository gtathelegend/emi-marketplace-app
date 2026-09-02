import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../auth/AdminAuthContext';
import { Badge } from '../../../shared/components/ui/Badge';
import { Button } from '../../../shared/components/ui/Button';
import {
  LayoutDashboard,
  Package,
  CreditCard,
  FileText,
  History,
  LogOut,
  ShieldCheck,
  Menu,
  X,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { admin, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: 'Products', path: '/admin/products', icon: <Package className="w-4 h-4" /> },
    { label: 'EMI Management', path: '/admin/emi', icon: <CreditCard className="w-4 h-4" /> },
    { label: 'Applications', path: '/admin/applications', icon: <FileText className="w-4 h-4" /> },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: <History className="w-4 h-4" /> },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-800 bg-slate-950 p-4 space-y-6">
        <div className="flex items-center gap-3 px-2 py-3 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">FinEmi Admin</h2>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
              Management Portal
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const isActive =
              item.path === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Admin User Info */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="px-2">
            <p className="text-xs font-bold text-white truncate">{admin?.fullName}</p>
            <p className="text-[11px] text-slate-400 truncate">{admin?.email}</p>
            <Badge variant="promotional" size="sm" className="mt-1">
              {admin?.role}
            </Badge>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-red-400 border-slate-800 hover:bg-red-500/10 hover:text-red-300"
            leftIcon={<LogOut className="w-4 h-4" />}
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-500" />
          <span className="font-bold text-white text-base">FinEmi Admin</span>
        </div>

        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileOpen && (
        <div className="md:hidden bg-slate-950 p-4 border-b border-slate-800 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center gap-3 p-2 text-sm font-semibold text-slate-300 hover:text-white"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
          <Button
            variant="outline"
            size="sm"
            className="w-full text-red-400 border-slate-800"
            onClick={handleLogout}
          >
            Sign Out
          </Button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
