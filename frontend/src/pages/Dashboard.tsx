import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Sparkles, Calendar, BookOpen, Users, DollarSign, AlertTriangle, TrendingUp, ChevronRight, RefreshCw } from 'lucide-react';
import { RefreshButton } from '../components/RefreshButton';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';

interface OverdueFeeItem {
  id: string;
  studentName: string;
  amount: number;
  dueDate: string;
}

interface FinanceHistoryItem {
  month: string;
  receitas: number;
  despesas: number;
}

interface AttendanceHistoryItem {
  date: string;
  presentes: number;
}

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  pendingFees: number;
  monthlyRevenue: number;
  overdueFeesList: OverdueFeeItem[];
  financeHistory: FinanceHistoryItem[];
  attendanceHistory: AttendanceHistoryItem[];
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => (await api.get('/dashboard/stats')).data,
  });

  const cards = [
    { label: 'Total de Alunos', value: isLoading ? '...' : String(stats?.totalStudents ?? 0), description: 'Alunos ativos', icon: Users, color: 'text-emerald-400 bg-emerald-500/10' },
    { label: 'Turmas Ativas', value: isLoading ? '...' : String(stats?.totalClasses ?? 0), description: 'Horários cadastrados', icon: BookOpen, color: 'text-violet-400 bg-violet-500/10' },
    { label: 'Professores', value: isLoading ? '...' : String(stats?.totalTeachers ?? 0), description: 'Sanseis ativos', icon: Sparkles, color: 'text-amber-400 bg-amber-500/10' },
    { label: 'Mensalidades Pendentes', value: isLoading ? '...' : String(stats?.pendingFees ?? 0), description: 'Cobranças abertas', icon: Calendar, color: 'text-rose-400 bg-rose-500/10' },
    { 
      label: 'Receita do Mês', 
      value: isLoading 
        ? '...' 
        : `R$ ${(stats?.monthlyRevenue ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 
      description: 'Recebido no mês', 
      icon: DollarSign, 
      color: 'text-emerald-400 bg-emerald-500/10' 
    },
  ];

  // ─── Renderizadores de Gráficos SVG ──────────────────────────────────────────
  
  // 1. Gráfico de Fluxo de Caixa (Últimos 6 meses)
  const renderFinanceChart = () => {
    const history = stats?.financeHistory || [];
    if (history.length === 0) return <div className="text-zinc-500 text-xs text-center py-12">Sem dados financeiros suficientes</div>;

    const maxVal = Math.max(...history.map(d => Math.max(d.receitas, d.despesas)), 1000);
    const height = 140;
    const width = 450;
    const paddingLeft = 40;
    const paddingBottom = 25;
    const chartHeight = height - paddingBottom;
    
    const barWidth = 14;
    const gap = 35; // espaço entre grupos

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full text-zinc-400">
        {/* Linhas de Grade de Fundo */}
        {[0, 0.5, 1].map((ratio, i) => {
          const y = chartHeight * (1 - ratio) + 5;
          const labelVal = maxVal * ratio;
          return (
            <g key={i} className="opacity-20">
              <line x1={paddingLeft} y1={y} x2={width} y2={y} stroke="var(--color-zinc-600)" strokeWidth="1" strokeDasharray="3 3" />
              <text x={10} y={y + 4} fontSize="8" fill="currentColor">
                {labelVal >= 1000 ? `${(labelVal / 1000).toFixed(0)}k` : labelVal.toFixed(0)}
              </text>
            </g>
          );
        })}

        {/* Barras e Eixos */}
        {history.map((d, index) => {
          const xGroup = paddingLeft + 15 + index * (barWidth * 2 + gap);
          
          const revHeight = (d.receitas / maxVal) * (chartHeight - 10);
          const expHeight = (d.despesas / maxVal) * (chartHeight - 10);
          
          const yRev = chartHeight - revHeight + 5;
          const yExp = chartHeight - expHeight + 5;

          return (
            <g key={index}>
              {/* Barra de Receitas (Vermelho) */}
              <rect
                x={xGroup}
                y={yRev}
                width={barWidth}
                height={Math.max(revHeight, 2)}
                rx="2"
                fill="var(--color-brand-red-light)"
                className="transition-all duration-300 hover:opacity-85 cursor-pointer"
              />
              {/* Barra de Despesas (Cinza) */}
              <rect
                x={xGroup + barWidth + 3}
                y={yExp}
                width={barWidth}
                height={Math.max(expHeight, 2)}
                rx="2"
                fill="var(--color-zinc-500)"
                className="transition-all duration-300 hover:opacity-85 cursor-pointer"
              />
              {/* Nome do Mês */}
              <text x={xGroup + barWidth} y={height - 8} fontSize="9" textAnchor="middle" fill="var(--color-zinc-400)">
                {d.month}
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  // 2. Gráfico de Assiduidade (Últimos 7 dias letivos)
  const renderAttendanceChart = () => {
    const history = stats?.attendanceHistory || [];
    if (history.length === 0) {
      return (
        <div className="text-zinc-500 text-xs text-center py-12 flex flex-col items-center justify-center gap-2">
          <span>Sem histórico de presença nos últimos dias</span>
          <span className="text-[10px] text-zinc-650">Realize a chamada nas turmas para plotar os dados.</span>
        </div>
      );
    }

    const maxPres = Math.max(...history.map(d => d.presentes), 5);
    const height = 140;
    const width = 450;
    const paddingLeft = 30;
    const paddingBottom = 25;
    
    const chartHeight = height - paddingBottom;
    const chartWidth = width - paddingLeft;
    
    const points = history.map((d, index) => {
      const x = paddingLeft + 15 + index * (chartWidth / (history.length - 1 || 1) - 6);
      const y = chartHeight - (d.presentes / maxPres) * (chartHeight - 15) + 5;
      return { x, y, data: d };
    });

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    
    const areaPath = points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`
      : '';

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full text-zinc-400">
        <defs>
          <linearGradient id="attendanceAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand-red-light)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--color-brand-red-light)" stopOpacity="0.00" />
          </linearGradient>
        </defs>

        {/* Linhas de Grade Horizontal */}
        {[0, 0.5, 1].map((ratio, i) => {
          const y = chartHeight * (1 - ratio) + 5;
          const labelVal = Math.round(maxPres * ratio);
          return (
            <g key={i} className="opacity-20">
              <line x1={paddingLeft} y1={y} x2={width} y2={y} stroke="var(--color-zinc-600)" strokeWidth="1" strokeDasharray="3 3" />
              <text x={10} y={y + 3} fontSize="8" fill="currentColor">
                {labelVal}
              </text>
            </g>
          );
        })}

        {/* Área Sombreada */}
        {areaPath && <path d={areaPath} fill="url(#attendanceAreaGrad)" />}

        {/* Linha do Gráfico */}
        {linePath && <path d={linePath} fill="none" stroke="var(--color-brand-red-light)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />}

        {/* Pontos Marcadores e Texto */}
        {points.map((p, index) => (
          <g key={index}>
            <circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#FFFFFF"
              stroke="var(--color-brand-red-light)"
              strokeWidth="2"
              className="cursor-pointer transition-transform duration-200 hover:scale-125"
            />
            <text x={p.x} y={p.y - 8} fontSize="8" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">
              {p.data.presentes}
            </text>
            <text x={p.x} y={height - 8} fontSize="9" textAnchor="middle" fill="var(--color-zinc-400)">
              {p.data.date}
            </text>
          </g>
        ))}
      </svg>
    );
  };

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
        <div className="absolute right-0 top-0 h-[250px] w-[250px] rounded-full bg-red-600/5 blur-[50px] pointer-events-none"></div>
        
        <div className="relative z-10 space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Olá, {user?.name}! 👋
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl">
            Bem-vindo ao painel da academia <strong className="text-red-500">{user?.tenant?.name}</strong>. 
            Aqui você gerencia seus alunos, professores, graduações e a saúde operacional do seu dojo.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-5 shadow-sm hover:border-zinc-700/50 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{stat.label}</span>
                <span className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-bold text-white tracking-tight">{stat.value}</span>
                <p className="mt-1 text-[10px] text-zinc-500 uppercase tracking-wide font-medium">{stat.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráficos Operacionais */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Fluxo de Caixa */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-red-500" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Fluxo de Caixa (6 Meses)</h3>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-red-500"></span> Receitas</span>
              <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded bg-zinc-500"></span> Despesas</span>
            </div>
          </div>
          <div className="h-44 w-full flex items-center justify-center">
            {isLoading ? (
              <RefreshCw className="h-6 w-6 text-red-500 animate-spin" />
            ) : (
              renderFinanceChart()
            )}
          </div>
        </div>

        {/* Frequência de Aula */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/10 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-red-500" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Frequência Recente (Alunos Presentes)</h3>
          </div>
          <div className="h-44 w-full flex items-center justify-center">
            {isLoading ? (
              <RefreshCw className="h-6 w-6 text-red-500 animate-spin" />
            ) : (
              renderAttendanceChart()
            )}
          </div>
        </div>
      </div>

      {/* Tabela de Mensalidades Atrasadas */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/10 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
          <div className="flex items-center gap-2 text-rose-500">
            <AlertTriangle className="h-5 w-5" />
            <h3 className="text-base font-bold text-white">Alertas Operacionais: Faturas Vencidas</h3>
          </div>
          <span className="text-[10px] bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
            Atrasadas
          </span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <RefreshCw className="h-6 w-6 text-red-500 animate-spin" />
          </div>
        ) : !stats?.overdueFeesList || stats.overdueFeesList.length === 0 ? (
          <div className="text-zinc-500 text-xs text-center py-6">
            🎉 Nenhuma mensalidade vencida encontrada no sistema! Excelente saúde financeira.
          </div>
        ) : (
          <div className="border border-zinc-850 rounded-lg overflow-hidden bg-zinc-950/20">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-850 bg-zinc-950/60 text-zinc-400 uppercase tracking-wider font-bold">
                  <th className="px-5 py-3">Aluno</th>
                  <th className="px-5 py-3">Data de Vencimento</th>
                  <th className="px-5 py-3">Valor da Mensalidade</th>
                  <th className="px-5 py-3 text-center">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850/40">
                {stats.overdueFeesList.map((fee) => (
                  <tr key={fee.id} className="hover:bg-zinc-900/5 transition-colors">
                    <td className="px-5 py-3">
                      <span className="font-semibold text-zinc-200 block">{fee.studentName}</span>
                    </td>
                    <td className="px-5 py-3 text-rose-400 font-medium">
                      {new Date(`${fee.dueDate}T00:00:00.000Z`).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-5 py-3 text-zinc-300 font-bold">
                      R$ {fee.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <a
                        href="/financeiro"
                        className="inline-flex items-center gap-0.5 text-red-400 hover:text-red-300 font-bold transition-colors"
                      >
                        Cobrar <ChevronRight className="h-3.5 w-3.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
