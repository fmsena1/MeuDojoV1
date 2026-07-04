import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, Calendar, BookOpen, Users } from 'lucide-react';
import { RefreshButton } from '../components/RefreshButton';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  pendingFees: number;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => (await api.get('/dashboard/stats')).data,
  });

  const cards = [
    { label: 'Total de Alunos', value: isLoading ? '...' : String(stats?.totalStudents ?? 0), description: 'Alunos ativos', icon: Users, color: 'text-emerald-400 bg-emerald-500/10' },
    { label: 'Turmas Ativas', value: isLoading ? '...' : String(stats?.totalClasses ?? 0), description: 'Horários diários', icon: BookOpen, color: 'text-violet-400 bg-violet-500/10' },
    { label: 'Professores', value: isLoading ? '...' : String(stats?.totalTeachers ?? 0), description: 'Sanseis cadastrados', icon: Sparkles, color: 'text-amber-400 bg-amber-500/10' },
    { label: 'Mensalidades Pendentes', value: isLoading ? '...' : String(stats?.pendingFees ?? 0), description: 'Controle de caixa', icon: Calendar, color: 'text-rose-400 bg-rose-500/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Dashboard</h2>
          <p className="text-zinc-400 text-sm">Resumo operacional e de presenças da sua academia.</p>
        </div>
        <RefreshButton />
      </div>

      {/* Welcome Banner */}
      <div className="relative rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900/60 to-zinc-950 p-8 overflow-hidden">
        <div className="absolute right-0 top-0 h-[250px] w-[250px] rounded-full bg-violet-600/5 blur-[50px] pointer-events-none"></div>
        
        <div className="relative z-10 space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Olá, {user?.name}! 👋
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl">
            Bem-vindo ao painel da academia <strong className="text-violet-400">{user?.tenant?.name}</strong>. 
            Aqui você gerencia seus alunos, professores, graduações e a saúde financeira do seu dojo.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-6 shadow-sm hover:border-zinc-700/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-400">{stat.label}</span>
                <span className={`p-2.5 rounded-lg ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-white tracking-tight">{stat.value}</span>
                <p className="mt-1 text-xs text-zinc-500">{stat.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Info Section */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-8">
        <h3 className="text-lg font-semibold text-white mb-4">Próximos Passos (Fase 1)</h3>
        <p className="text-zinc-400 text-sm leading-relaxed mb-6">
          Com a infraestrutura de Multiempresa e Autenticação pronta, você pode gerenciar a sua equipe local cadastrando novos professores e alunos diretamente na aba de <strong className="text-violet-400">Gestão de Membros</strong> do menu lateral.
        </p>
      </div>
    </div>
  );
};
