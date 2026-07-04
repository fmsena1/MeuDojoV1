import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Users, LogOut, ShieldAlert, GraduationCap, Award, Target, Calendar, ClipboardCheck, DollarSign } from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'TEACHER', 'RECEPTIONIST', 'STUDENT'] },
    { path: '/alunos', label: 'Alunos', icon: GraduationCap, roles: ['ADMIN', 'RECEPTIONIST', 'TEACHER'] },
    { path: '/professores', label: 'Professores', icon: Award, roles: ['ADMIN', 'RECEPTIONIST'] },
    { path: '/modalidades', label: 'Modalidades & Faixas', icon: Target, roles: ['ADMIN', 'TEACHER', 'RECEPTIONIST'] },
    { path: '/turmas', label: 'Turmas & Matrículas', icon: Calendar, roles: ['ADMIN', 'TEACHER', 'RECEPTIONIST'] },
    { path: '/presenca', label: 'Frequência', icon: ClipboardCheck, roles: ['ADMIN', 'TEACHER', 'RECEPTIONIST', 'STUDENT'] },
    { path: '/financeiro', label: 'Financeiro', icon: DollarSign, roles: ['ADMIN', 'RECEPTIONIST', 'STUDENT'] },
    { path: '/usuarios', label: 'Gestão de Membros', icon: Users, roles: ['ADMIN'] },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-zinc-800 bg-zinc-900/40 backdrop-blur-md">
        {/* Brand */}
        <div className="flex h-16 items-center gap-3 border-b border-zinc-800 px-6">
          <svg width="32" height="32" viewBox="15 15 90 90" className="shrink-0">
            <defs>
              <linearGradient id="logoDojoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#E53935"/>
                <stop offset="100%" stop-color="#B71C1C"/>
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="42" fill="none" stroke="url(#logoDojoGradient)" stroke-width="6"/>
            <rect x="35" y="35" width="50" height="6" rx="3" fill="#FFFFFF"/>
            <rect x="40" y="43" width="40" height="5" rx="2" fill="#E53935"/>
            <rect x="42" y="48" width="6" height="28" fill="#FFFFFF"/>
            <rect x="72" y="48" width="6" height="28" fill="#FFFFFF"/>
            <path d="M60 62 C52 66 50 73 60 82 C70 73 68 66 60 62Z" fill="#E53935"/>
          </svg>
          <span className="text-lg font-bold tracking-tight text-white">
            Meu<span className="text-violet-500">Dojo</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 px-4 py-6">
          {navItems
            .filter((item) => item.roles.includes(user?.role || ''))
            .map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-violet-600/15 text-violet-400 border-l-2 border-violet-500 pl-3'
                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
        </nav>

        {/* Footer Tenant Info */}
        <div className="border-t border-zinc-800 p-4 bg-zinc-950/20">
          <div className="mb-3 flex flex-col">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Academia</span>
            <span className="truncate text-sm font-medium text-zinc-200">{user?.tenant?.name}</span>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col pl-64">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-zinc-800 bg-zinc-950/70 px-8 backdrop-blur-md">
          <div>
            <h1 className="text-lg font-semibold text-zinc-100 hidden sm:block">
              Painel Administrativo
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col text-right">
              <span className="text-sm font-medium text-zinc-200">{user?.name}</span>
              <span className="text-xs text-zinc-500 flex items-center justify-end gap-1">
                {user?.role === 'ADMIN' && <ShieldAlert className="h-3 w-3 text-violet-400" />}
                {user?.role}
              </span>
            </div>
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-violet-600 to-violet-800 flex items-center justify-center font-bold text-white shadow-inner">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
