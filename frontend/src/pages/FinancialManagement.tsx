import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import {
  DollarSign,
  Calendar,
  AlertTriangle,
  Trash2,
  Check,
  Plus,
  Search,
  Mail,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  PlusCircle,
  Users,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { RefreshButton } from '../components/RefreshButton';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface Student {
  id: string;
  name: string;
  status: string;
  email?: string | null;
}

interface MembershipFee {
  id: string;
  studentId: string;
  student: {
    name: string;
    email: string | null;
  };
  amount: number;
  dueDate: string; // AAAA-MM-DD
  paidAt: string | null;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  notes: string | null;
  transactionId?: string | null;
}

interface OverdueStudent {
  studentId: string;
  name: string;
  phone: string | null;
  email: string | null;
  overdueCount: number;
  totalOverdueAmount: number;
  oldestDueDate: string;
}

interface FinancialDashboardResponse {
  monthlyRevenue: number;
  monthlyExpense: number;
  netProfit: number;
  pendingCurrentMonthAmount: number;
  totalOverdueAmount: number;
  studentsOverdue: OverdueStudent[];
}

interface Transaction {
  id: string;
  type: 'REVENUE' | 'EXPENSE';
  category: string;
  amount: number;
  date: string;
  description: string;
}

const CATEGORIES = {
  REVENUE: ['MEMBERSHIP', 'EQUIPMENT', 'SEMINAR', 'EVENT', 'OTHER'],
  EXPENSE: ['RENT', 'SALARY', 'UTILITIES', 'MAINTENANCE', 'OTHER'],
};

const MONTHS_LIST = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' },
];

export const FinancialManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const isManagement = ['ADMIN', 'RECEPTIONIST'].includes(currentUser?.role || '');

  // Abas
  const [activeTab, setActiveTab] = useState<'dashboard' | 'mensalidades' | 'movimentacoes' | 'faturamento-rapido'>('dashboard');

  // Faturamento Rápido
  const [quickMonth, setQuickMonth] = useState<number>(new Date().getMonth() + 1);
  const [quickYear, setQuickYear] = useState<number>(new Date().getFullYear());
  const [quickAmount, setQuickAmount] = useState<number>(150);
  const [processingStudentId, setProcessingStudentId] = useState<string | null>(null);

  // Filtros Mensalidades
  const [feeStatusFilter, setFeeStatusFilter] = useState<string>('ALL');
  const [feeSearchTerm, setFeeSearchTerm] = useState<string>('');

  // Filtros Caixa
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [cashFlowType, setCashFlowType] = useState<string>('ALL');

  // Modais
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);

  // Seleções para Modais
  const [selectedFeeId, setSelectedFeeId] = useState<string | null>(null);

  // Estados dos Formulários
  const [feeForm, setFeeForm] = useState({ studentId: '', amount: 150, dueDate: new Date().toISOString().split('T')[0], notes: '' });
  const [bulkForm, setBulkForm] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear(), amount: 150, dueDate: new Date().toISOString().split('T')[0] });
  const [payForm, setPayForm] = useState({ paidAt: new Date().toISOString().split('T')[0] });
  const [txForm, setTxForm] = useState({ type: 'EXPENSE' as 'REVENUE' | 'EXPENSE', category: 'RENT', amount: 100, date: new Date().toISOString().split('T')[0], description: '' });

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // ─── Queries ───────────────────────────────────────────────────────────────

  const { data: dashboardData } = useQuery<FinancialDashboardResponse>({
    queryKey: ['financial-dashboard'],
    queryFn: async () => (await api.get('/transactions/dashboard')).data,
    enabled: isManagement,
  });

  const { data: membershipFees } = useQuery<MembershipFee[]>({
    queryKey: ['membership-fees', feeStatusFilter],
    queryFn: async () => {
      const statusParam = feeStatusFilter !== 'ALL' ? `?status=${feeStatusFilter}` : '';
      return (await api.get(`/membership-fees${statusParam}`)).data;
    },
  });

  const { data: transactions } = useQuery<Transaction[]>({
    queryKey: ['transactions', currentMonth, currentYear, cashFlowType],
    queryFn: async () => {
      const typeParam = cashFlowType !== 'ALL' ? `&type=${cashFlowType}` : '';
      return (await api.get(`/transactions?month=${currentMonth}&year=${currentYear}${typeParam}`)).data;
    },
    enabled: isManagement,
  });

  const { data: students } = useQuery<Student[]>({
    queryKey: ['students-list-finance'],
    queryFn: async () => (await api.get('/students')).data,
    enabled: isManagement,
  });

  // ─── Mutations ─────────────────────────────────────────────────────────────

  const createFeeMutation = useMutation({
    mutationFn: (data: typeof feeForm) => api.post('/membership-fees', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership-fees'] });
      queryClient.invalidateQueries({ queryKey: ['financial-dashboard'] });
      showFeedback('Mensalidade cadastrada com sucesso!');
      setShowFeeModal(false);
    },
    onError: (err: any) => setFormError(err.response?.data?.message || 'Erro ao criar mensalidade.'),
  });

  const bulkFeeMutation = useMutation({
    mutationFn: (data: typeof bulkForm) => api.post('/membership-fees/bulk', data),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ['membership-fees'] });
      queryClient.invalidateQueries({ queryKey: ['financial-dashboard'] });
      showFeedback(`Cobranças geradas! ${res.data.count} nova(s) mensalidade(s) criada(s).`);
      setShowBulkModal(false);
    },
    onError: (err: any) => setFormError(err.response?.data?.message || 'Erro ao gerar em lote.'),
  });

  const payFeeMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof payForm }) => api.post(`/membership-fees/${id}/pay`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership-fees'] });
      queryClient.invalidateQueries({ queryKey: ['financial-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      showFeedback('Pagamento registrado com sucesso!');
      setShowPayModal(false);
    },
    onError: (err: any) => setFormError(err.response?.data?.message || 'Erro ao registrar pagamento.'),
  });

  const deleteFeeMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/membership-fees/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membership-fees'] });
      queryClient.invalidateQueries({ queryKey: ['financial-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      showFeedback('Mensalidade excluída e caixa estornado se necessário.');
    },
    onError: (err: any) => alert(err.response?.data?.message || 'Erro ao excluir mensalidade.'),
  });

  const createTxMutation = useMutation({
    mutationFn: (data: typeof txForm) => api.post('/transactions', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['financial-dashboard'] });
      showFeedback('Movimentação de caixa registrada!');
      setShowTxModal(false);
    },
    onError: (err: any) => setFormError(err.response?.data?.message || 'Erro ao registrar transação.'),
  });

  const deleteTxMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/transactions/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['financial-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['membership-fees'] });
      showFeedback('Movimentação estornada com sucesso!');
    },
    onError: (err: any) => alert(err.response?.data?.message || 'Erro ao estornar transação.'),
  });

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handlePayClick = (id: string) => {
    setSelectedFeeId(id);
    setPayForm({ paidAt: new Date().toISOString().split('T')[0] });
    setFormError(null);
    setShowPayModal(true);
  };

  const handleDeleteFee = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta cobrança? Se ela já estiver paga, a respectiva receita também será estornada do caixa.')) {
      deleteFeeMutation.mutate(id);
    }
  };

  const handleDeleteTx = (id: string) => {
    if (confirm('Tem certeza que deseja estornar esta movimentação do caixa? Se ela for referente a um pagamento de mensalidade, o status da mensalidade retornará para Pendente.')) {
      deleteTxMutation.mutate(id);
    }
  };

  const handleTxTypeChange = (type: 'REVENUE' | 'EXPENSE') => {
    setTxForm((prev) => ({
      ...prev,
      type,
      category: CATEGORIES[type][0],
    }));
  };

  const toggleQuickPayment = async (studentId: string, isPaid: boolean, feeId?: string, transactionId?: string | null) => {
    if (processingStudentId) return;
    setProcessingStudentId(studentId);
    setFormError(null);

    try {
      if (isPaid) {
        if (!feeId) {
          const formattedDueDate = `${quickYear}-${String(quickMonth).padStart(2, '0')}-10`;
          const createRes = await createFeeMutation.mutateAsync({
            studentId,
            amount: quickAmount,
            dueDate: formattedDueDate,
            notes: `Gerada via faturamento rápido - ${quickMonth}/${quickYear}`,
          });

          const newFeeId = createRes.data.id;
          await payFeeMutation.mutateAsync({
            id: newFeeId,
            data: {
              paidAt: new Date().toISOString().split('T')[0],
            },
          });
        } else {
          await payFeeMutation.mutateAsync({
            id: feeId,
            data: {
              paidAt: new Date().toISOString().split('T')[0],
            },
          });
        }
        showFeedback('Pagamento registrado com sucesso!');
      } else {
        if (feeId && transactionId) {
          await deleteTxMutation.mutateAsync(transactionId);
          showFeedback('Pagamento estornado e mensalidade revertida para Pendente.');
        } else {
          showFeedback('Erro: transação correspondente não encontrada para estorno.');
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Erro ao processar faturamento rápido.');
    } finally {
      setProcessingStudentId(null);
    }
  };

  // ─── Computados ────────────────────────────────────────────────────────────

  const filteredFees = membershipFees?.filter((fee) => {
    const matchesSearch =
      fee.student.name.toLowerCase().includes(feeSearchTerm.toLowerCase()) ||
      (fee.student.email && fee.student.email.toLowerCase().includes(feeSearchTerm.toLowerCase()));
    return matchesSearch;
  });

  // Mapeia alunos ativos e cruza com a mensalidade do mês/ano selecionado
  const activeStudents = students?.filter((s) => s.status === 'ACTIVE') || [];
  const quickBillingData = activeStudents.map((student) => {
    const fee = membershipFees?.find((f) => {
      if (f.studentId !== student.id) return false;
      const dueDate = new Date(f.dueDate);
      const feeMonth = dueDate.getUTCMonth() + 1;
      const feeYear = dueDate.getUTCFullYear();
      return feeMonth === quickMonth && feeYear === quickYear;
    });

    return {
      student,
      fee,
    };
  });

  // Se for aluno, esconde aba dashboard e aba movimentações
  useEffect(() => {
    if (currentUser?.role === 'STUDENT') {
      setActiveTab('mensalidades');
    }
  }, [currentUser]);

  // Calcula balanço do fluxo de caixa atual listado
  const listedRevenues = transactions?.filter((t) => t.type === 'REVENUE').reduce((acc, t) => acc + t.amount, 0) || 0;
  const listedExpenses = transactions?.filter((t) => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-violet-500" />
            Gestão Financeira
          </h2>
          <p className="text-zinc-400 text-sm">
            {currentUser?.role === 'STUDENT'
              ? 'Consulte o seu histórico de cobranças e faturas.'
              : 'Monitore o caixa, gerencie faturamento de mensalidades, despesas operacionais e inadimplência.'}
          </p>
        </div>
        <RefreshButton />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800">
        {isManagement && (
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'dashboard'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Painel Financeiro
          </button>
        )}
        <button
          onClick={() => setActiveTab('mensalidades')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'mensalidades'
              ? 'border-violet-500 text-violet-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Mensalidades
        </button>
        {isManagement && (
          <button
            onClick={() => setActiveTab('faturamento-rapido')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'faturamento-rapido'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Faturamento Rápido
          </button>
        )}
        {isManagement && (
          <button
            onClick={() => setActiveTab('movimentacoes')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'movimentacoes'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Fluxo de Caixa
          </button>
        )}
      </div>

      {/* Feedback Alert */}
      {feedbackMsg && (
        <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
          <Check className="h-5 w-5 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* ─── ABA: DASHBOARD FINANCEIRO ─── */}
      {activeTab === 'dashboard' && isManagement && dashboardData && (
        <div className="space-y-6">
          {/* Grid de Estatísticas */}
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}
          >
            {/* Total Recebido */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-5">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Recebido (Mês)</span>
                <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-bold text-white">
                  R$ {dashboardData.monthlyRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Total Despesas */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-5">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Despesas (Mês)</span>
                <span className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                  <ArrowDownRight className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-bold text-white">
                  R$ {dashboardData.monthlyExpense.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Saldo Líquido */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-5">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Resultado Caixa</span>
                <span className={`p-2 rounded-lg ${dashboardData.netProfit >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  <DollarSign className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-4">
                <span className={`text-2xl font-bold ${dashboardData.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  R$ {dashboardData.netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* A Receber no Mês */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-5">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-semibold uppercase tracking-wider">A Receber (Mês)</span>
                <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Calendar className="h-4 w-4" />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-bold text-white">
                  R$ {dashboardData.pendingCurrentMonthAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Inadimplência Vencida */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-5">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Vencido (Total)</span>
                <span className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                  <AlertTriangle className="h-4 w-4 animate-pulse" />
                </span>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-bold text-rose-400">
                  R$ {dashboardData.totalOverdueAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          {/* Seção Inadimplência */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/10 p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="text-base font-bold text-white">Alunos Inadimplentes (Mensalidades Vencidas)</h3>
            </div>
            <p className="text-zinc-400 text-xs">
              Abaixo estão os alunos com cobranças expiradas. Você pode gerenciar os recebimentos ou lembrá-los diretamente.
            </p>

            {dashboardData.studentsOverdue.length === 0 ? (
              <div className="text-zinc-500 text-xs py-4 text-center">
                🎉 Nenhum aluno inadimplente encontrado! Excelente adimplência de caixa.
              </div>
            ) : (
              <div className="border border-zinc-800 rounded-lg bg-zinc-950/40 overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-950/70 text-zinc-400 uppercase tracking-wider font-bold">
                      <th className="px-4 py-3">Aluno</th>
                      <th className="px-4 py-3">Parcelas Vencidas</th>
                      <th className="px-4 py-3">Vencimento Mais Antigo</th>
                      <th className="px-4 py-3">Montante Vencido</th>
                      <th className="px-4 py-3 text-center">Ações Rápidas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40">
                    {dashboardData.studentsOverdue.map((item) => (
                      <tr key={item.studentId} className="hover:bg-zinc-900/10">
                        <td className="px-4 py-3">
                          <span className="font-semibold text-zinc-200 block">{item.name}</span>
                          <span className="text-zinc-500 text-[10px] block">{item.email}</span>
                        </td>
                        <td className="px-4 py-3 text-zinc-300">
                          {item.overdueCount} parcela(s)
                        </td>
                        <td className="px-4 py-3 text-rose-400 font-medium">
                          {new Date(`${item.oldestDueDate}T00:00:00.000Z`).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-4 py-3 text-rose-400 font-bold">
                          R$ {item.totalOverdueAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-center gap-2">
                            {item.email && (
                              <a
                                href={`mailto:${item.email}?subject=Aviso de Mensalidade Vencida - MeuDojo&body=Olá ${item.name}, identificamos mensalidades em aberto no sistema. Por favor, regularize na recepção.`}
                                className="p-1 rounded bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 hover:text-white text-zinc-400 transition-colors"
                                title="Enviar E-mail de cobrança"
                              >
                                <Mail className="h-3.5 w-3.5" />
                              </a>
                            )}
                            <button
                              onClick={() => {
                                // Encontra a fatura vencida deste aluno para pagar
                                const studentFees = membershipFees?.filter((f) => f.studentId === item.studentId && f.status !== 'PAID');
                                if (studentFees && studentFees.length > 0) {
                                  handlePayClick(studentFees[0].id);
                                } else {
                                  alert('Por favor, registre o pagamento pela aba Mensalidades.');
                                }
                              }}
                              className="px-2 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-800/40 text-[10px] font-bold transition-all"
                            >
                              Receber
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── ABA: MENSALIDADES ─── */}
      {activeTab === 'mensalidades' && (
        <div className="space-y-6">
          {/* Barra de Filtros e Ações */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-zinc-900/20 border border-zinc-800 p-4 rounded-xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
              {/* Filtro Status */}
              <div className="w-full sm:w-48">
                <select
                  value={feeStatusFilter}
                  onChange={(e) => setFeeStatusFilter(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-150 outline-none focus:border-violet-500/80"
                >
                  <option value="ALL">Todos os Status</option>
                  <option value="PENDING">Pendentes</option>
                  <option value="PAID">Pagas</option>
                  <option value="OVERDUE">Atrasadas</option>
                </select>
              </div>

              {/* Busca de Aluno */}
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Buscar aluno..."
                  value={feeSearchTerm}
                  onChange={(e) => setFeeSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-zinc-850 bg-zinc-950/60 pl-9 pr-3 py-2 text-sm text-zinc-150 placeholder-zinc-500 outline-none focus:border-violet-500/80"
                />
              </div>
            </div>

            {/* Ações Gerenciais */}
            {isManagement && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setFormError(null);
                    setBulkForm({
                      month: new Date().getMonth() + 1,
                      year: new Date().getFullYear(),
                      amount: 150,
                      dueDate: new Date().toISOString().split('T')[0],
                    });
                    setShowBulkModal(true);
                  }}
                  className="flex items-center justify-center gap-2 rounded-lg bg-zinc-950 border border-zinc-800 px-4 py-2.5 text-xs font-bold text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Gerar em Lote
                </button>

                <button
                  onClick={() => {
                    setFormError(null);
                    setFeeForm({
                      studentId: students && students.length > 0 ? students[0].id : '',
                      amount: 150,
                      dueDate: new Date().toISOString().split('T')[0],
                      notes: '',
                    });
                    setShowFeeModal(true);
                  }}
                  className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-violet-700 transition-colors active:scale-[0.98]"
                >
                  <Plus className="h-4 w-4" />
                  Nova Cobrança
                </button>
              </div>
            )}
          </div>

          {/* Listagem de Mensalidades */}
          {!filteredFees || filteredFees.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-zinc-800 border-dashed bg-zinc-900/5 text-center p-8">
              <FileText className="h-10 w-10 text-zinc-600" />
              <h3 className="text-sm font-semibold text-zinc-300">Nenhuma cobrança encontrada</h3>
              <p className="text-zinc-550 text-xs">
                Nenhuma mensalidade registrada atende a estes critérios de busca.
              </p>
            </div>
          ) : (
            <div className="border border-zinc-800 rounded-xl bg-zinc-900/10 overflow-hidden">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/40 text-xs font-bold uppercase tracking-wider text-zinc-400">
                    <th className="px-6 py-4">Aluno</th>
                    <th className="px-6 py-4">Valor</th>
                    <th className="px-6 py-4">Data Vencimento</th>
                    <th className="px-6 py-4">Data Pagamento</th>
                    <th className="px-6 py-4">Status</th>
                    {isManagement && <th className="px-6 py-4 text-center">Ações</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredFees.map((fee) => (
                    <tr key={fee.id} className="hover:bg-zinc-900/5 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-zinc-150 text-sm block">{fee.student.name}</span>
                        {fee.notes && (
                          <span className="text-zinc-500 italic text-[11px] block mt-0.5">
                            Obs: {fee.notes}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-bold text-white">
                        R$ {fee.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-zinc-300">
                        {new Date(`${fee.dueDate}T00:00:00.000Z`).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 text-zinc-400">
                        {fee.paidAt
                          ? new Date(`${fee.paidAt}T00:00:00.000Z`).toLocaleDateString('pt-BR')
                          : '—'}
                      </td>
                      <td className="px-6 py-4">
                        {fee.status === 'PAID' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                            Paga
                          </span>
                        )}
                        {fee.status === 'PENDING' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                            Pendente
                          </span>
                        )}
                        {fee.status === 'OVERDUE' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 text-xs font-medium text-rose-400">
                            Atrasada
                          </span>
                        )}
                      </td>
                      {isManagement && (
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-3">
                            {fee.status !== 'PAID' && (
                              <button
                                onClick={() => handlePayClick(fee.id)}
                                className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors active:scale-95"
                              >
                                <Check className="h-3 w-3" />
                                Pagar
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteFee(fee.id)}
                              className="p-2 hover:bg-zinc-800 hover:text-rose-400 text-zinc-500 rounded-lg transition-colors"
                              title="Excluir cobrança"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ─── ABA: FATURAMENTO RÁPIDO ─── */}
      {activeTab === 'faturamento-rapido' && isManagement && (
        <div className="space-y-6">
          {/* Barra de Filtros e Valor Padrão */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-zinc-900/20 border border-zinc-800 p-4 rounded-xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Filtro Mês */}
              <div className="w-full sm:w-36">
                <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Mês de Referência</label>
                <select
                  value={quickMonth}
                  onChange={(e) => setQuickMonth(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-150 outline-none focus:border-violet-500/80"
                >
                  {MONTHS_LIST.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro Ano */}
              <div className="w-full sm:w-28">
                <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Ano de Referência</label>
                <select
                  value={quickYear}
                  onChange={(e) => setQuickYear(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-150 outline-none focus:border-violet-500/80"
                >
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                  <option value={2028}>2028</option>
                </select>
              </div>

              {/* Valor Padrão */}
              <div className="w-full sm:w-36">
                <label className="block text-[10px] uppercase font-bold text-zinc-500 mb-1">Valor da Mensalidade</label>
                <input
                  type="number"
                  value={quickAmount}
                  onChange={(e) => setQuickAmount(Number(e.target.value))}
                  min={1}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-150 outline-none focus:border-violet-500/80"
                />
              </div>
            </div>

            <div className="text-right sm:text-left">
              <span className="text-xs text-zinc-400 block sm:inline">
                Total de alunos ativos: <strong className="text-white">{quickBillingData.length}</strong>
              </span>
            </div>
          </div>

          {/* Tabela de Alunos com Checkbox de Pagamento */}
          {quickBillingData.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-zinc-800 border-dashed bg-zinc-900/5 text-center p-8">
              <Users className="h-10 w-10 text-zinc-600 shrink-0" />
              <h3 className="text-sm font-semibold text-zinc-300">Nenhum aluno ativo encontrado</h3>
              <p className="text-zinc-550 text-xs">
                Cadastre alunos ativos no menu de membros para realizar o faturamento.
              </p>
            </div>
          ) : (
            <div className="border border-zinc-800 rounded-xl bg-zinc-900/10 overflow-hidden">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/40 text-xs font-bold uppercase tracking-wider text-zinc-400">
                    <th className="px-6 py-4">Aluno</th>
                    <th className="px-6 py-4">Valor Faturado</th>
                    <th className="px-6 py-4">Status da Mensalidade</th>
                    <th className="px-6 py-4 text-center">Marcar como Paga</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {quickBillingData.map((item) => {
                    const isPaid = item.fee?.status === 'PAID';
                    const isProcessing = processingStudentId === item.student.id;
                    
                    let statusLabel = 'Não Gerada';
                    let statusClass = 'bg-zinc-500/10 border-zinc-500/30 text-zinc-400';
                    
                    if (item.fee) {
                      if (item.fee.status === 'PAID') {
                        statusLabel = 'Paga';
                        statusClass = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
                      } else if (item.fee.status === 'OVERDUE') {
                        statusLabel = 'Atrasada';
                        statusClass = 'bg-rose-500/10 border-rose-500/30 text-rose-400';
                      } else {
                        statusLabel = 'Pendente';
                        statusClass = 'bg-amber-500/10 border-amber-500/30 text-amber-400';
                      }
                    }

                    return (
                      <tr key={item.student.id} className="hover:bg-zinc-900/5 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-zinc-150 text-sm block">{item.student.name}</span>
                          <span className="text-zinc-500 text-[10px] block">{item.student.email || 'Sem e-mail cadastrado'}</span>
                        </td>
                        <td className="px-6 py-4 font-bold text-white">
                          R$ {(item.fee?.amount ?? quickAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusClass}`}>
                            {statusLabel}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            {isProcessing && (
                              <RefreshCw className="h-4 w-4 text-violet-500 animate-spin shrink-0" />
                            )}
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() => toggleQuickPayment(item.student.id, !isPaid, item.fee?.id, item.fee?.transactionId)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-950 ${
                                isPaid ? 'bg-emerald-500' : 'bg-zinc-700'
                              } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  isPaid ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ─── ABA: FLUXO DE CAIXA (MOVIMENTAÇÕES) ─── */}
      {activeTab === 'movimentacoes' && isManagement && (
        <div className="space-y-6">
          {/* Extrato Caixa Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-zinc-900/20 border border-zinc-800 p-4 rounded-xl">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Filtro Mês */}
              <div className="w-full sm:w-36">
                <select
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-150 outline-none focus:border-violet-500/80"
                >
                  {MONTHS_LIST.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro Ano */}
              <div className="w-full sm:w-28">
                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-150 outline-none focus:border-violet-500/80"
                >
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                  <option value={2028}>2028</option>
                </select>
              </div>

              {/* Filtro Tipo */}
              <div className="w-full sm:w-40">
                <select
                  value={cashFlowType}
                  onChange={(e) => setCashFlowType(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-150 outline-none focus:border-violet-500/80"
                >
                  <option value="ALL">Reais Entradas / Saídas</option>
                  <option value="REVENUE">Apenas Receitas</option>
                  <option value="EXPENSE">Apenas Despesas</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                setFormError(null);
                setTxForm({
                  type: 'EXPENSE',
                  category: 'RENT',
                  amount: 100,
                  date: new Date().toISOString().split('T')[0],
                  description: '',
                });
                setShowTxModal(true);
              }}
              className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-violet-700 transition-colors active:scale-[0.98]"
            >
              <PlusCircle className="h-4 w-4" />
              Lançar Caixa
            </button>
          </div>

          {/* Cards do Extrato */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/10 p-4">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Entradas no Mês</p>
              <p className="text-xl font-bold text-emerald-400 mt-1">
                + R$ {listedRevenues.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/10 p-4">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Saídas no Mês</p>
              <p className="text-xl font-bold text-rose-400 mt-1">
                - R$ {listedExpenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/10 p-4">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Balanço do Período</p>
              <p className={`text-xl font-bold mt-1 ${listedRevenues - listedExpenses >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                R$ {(listedRevenues - listedExpenses).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Tabela do Caixa */}
          {!transactions || transactions.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-zinc-800 border-dashed bg-zinc-900/5 text-center p-8">
              <DollarSign className="h-10 w-10 text-zinc-600" />
              <h3 className="text-sm font-semibold text-zinc-300">Sem lançamentos para este mês</h3>
              <p className="text-zinc-550 text-xs">
                Registre uma movimentação de caixa manual ou confirme o pagamento de uma mensalidade.
              </p>
            </div>
          ) : (
            <div className="border border-zinc-800 rounded-xl bg-zinc-900/10 overflow-hidden">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-950/40 text-xs font-bold uppercase tracking-wider text-zinc-400">
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4">Descrição</th>
                    <th className="px-6 py-4">Categoria</th>
                    <th className="px-6 py-4">Tipo</th>
                    <th className="px-6 py-4 text-right">Valor</th>
                    <th className="px-6 py-4 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-zinc-900/5 transition-colors">
                      <td className="px-6 py-4 text-zinc-300">
                        {new Date(`${tx.date}T00:00:00.000Z`).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-zinc-150 text-sm block">{tx.description}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block rounded bg-zinc-950 border border-zinc-850 px-2 py-0.5 text-xs text-zinc-450 uppercase">
                          {tx.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {tx.type === 'REVENUE' ? (
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 text-emerald-400 text-xs px-2 py-0.5 font-bold">
                            Entrada
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-rose-500/10 text-rose-400 text-xs px-2 py-0.5 font-bold">
                            Saída
                          </span>
                        )}
                      </td>
                      <td className={`px-6 py-4 text-right font-bold ${tx.type === 'REVENUE' ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {tx.type === 'REVENUE' ? '+' : '-'} R$ {tx.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDeleteTx(tx.id)}
                          className="p-1.5 hover:bg-zinc-800 hover:text-rose-400 text-zinc-500 rounded transition-colors"
                          title="Estornar movimentação"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ─── MODAIS ─── */}

      {/* 1. Modal: Criar Cobrança Individual */}
      {showFeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Criar Nova Cobrança</h3>
            {formError && <p className="text-xs text-rose-400 bg-rose-500/5 p-2.5 rounded border border-rose-500/20">{formError}</p>}

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Selecionar Aluno</label>
                <select
                  value={feeForm.studentId}
                  onChange={(e) => setFeeForm((prev) => ({ ...prev, studentId: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-150 outline-none focus:border-violet-500/80"
                >
                  <option value="">Escolha um aluno...</option>
                  {students?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Valor da Mensalidade (R$)</label>
                <input
                  type="number"
                  value={feeForm.amount}
                  onChange={(e) => setFeeForm((prev) => ({ ...prev, amount: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-150 outline-none focus:border-violet-500/80"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Data de Vencimento</label>
                <input
                  type="date"
                  value={feeForm.dueDate}
                  onChange={(e) => setFeeForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-150 outline-none focus:border-violet-500/80"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Observação (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Referente a kimono..."
                  value={feeForm.notes}
                  onChange={(e) => setFeeForm((prev) => ({ ...prev, notes: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-150 outline-none focus:border-violet-500/80"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowFeeModal(false)}
                className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => createFeeMutation.mutate(feeForm)}
                disabled={createFeeMutation.isPending || !feeForm.studentId}
                className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {createFeeMutation.isPending ? 'Salvando...' : 'Criar Mensalidade'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal: Gerar em Lote */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Geração de Cobranças em Lote</h3>
            <p className="text-zinc-400 text-xs">
              Gera automaticamente mensalidades pendentes para **todos os alunos com status Ativo** que ainda não possuam faturas para o período.
            </p>
            {formError && <p className="text-xs text-rose-400 bg-rose-500/5 p-2.5 rounded border border-rose-500/20">{formError}</p>}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Mês de Referência</label>
                <select
                  value={bulkForm.month}
                  onChange={(e) => setBulkForm((prev) => ({ ...prev, month: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-150 outline-none focus:border-violet-500/80"
                >
                  {MONTHS_LIST.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Ano</label>
                <select
                  value={bulkForm.year}
                  onChange={(e) => setBulkForm((prev) => ({ ...prev, year: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-150 outline-none focus:border-violet-500/80"
                >
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                  <option value={2028}>2028</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Valor Padrão da Mensalidade (R$)</label>
                <input
                  type="number"
                  value={bulkForm.amount}
                  onChange={(e) => setBulkForm((prev) => ({ ...prev, amount: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-150 outline-none focus:border-violet-500/80"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Data de Vencimento</label>
                <input
                  type="date"
                  value={bulkForm.dueDate}
                  onChange={(e) => setBulkForm((prev) => ({ ...prev, dueDate: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-150 outline-none focus:border-violet-500/80"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => bulkFeeMutation.mutate(bulkForm)}
                disabled={bulkFeeMutation.isPending}
                className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {bulkFeeMutation.isPending ? 'Gerando...' : 'Confirmar Geração'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal: Registrar Pagamento */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Check className="h-5 w-5 text-emerald-400" />
              Confirmar Recebimento
            </h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Marcar esta mensalidade como paga registrará automaticamente uma entrada de caixa correspondente no caixa da academia.
            </p>
            {formError && <p className="text-xs text-rose-400 bg-rose-500/5 p-2.5 rounded border border-rose-500/20">{formError}</p>}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Data do Recebimento</label>
              <input
                type="date"
                value={payForm.paidAt}
                onChange={(e) => setPayForm((prev) => ({ ...prev, paidAt: e.target.value }))}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-150 outline-none focus:border-violet-500/80"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPayModal(false)}
                className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedFeeId) {
                    payFeeMutation.mutate({ id: selectedFeeId, data: payForm });
                  }
                }}
                disabled={payFeeMutation.isPending}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {payFeeMutation.isPending ? 'Confirmando...' : 'Registrar Pagamento'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal: Nova Movimentação de Caixa */}
      {showTxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-950 p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Lançar no Caixa</h3>
            {formError && <p className="text-xs text-rose-400 bg-rose-500/5 p-2.5 rounded border border-rose-500/20">{formError}</p>}

            <div className="space-y-3">
              {/* Tipo */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Tipo de Lançamento</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleTxTypeChange('REVENUE')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                      txForm.type === 'REVENUE'
                        ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Receita (Entrada)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTxTypeChange('EXPENSE')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                      txForm.type === 'EXPENSE'
                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-400'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Despesa (Saída)
                  </button>
                </div>
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Descrição do Lançamento</label>
                <input
                  type="text"
                  placeholder="Ex: Pagamento do aluguel ou venda de kimono..."
                  value={txForm.description}
                  onChange={(e) => setTxForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-150 outline-none focus:border-violet-500/80"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Valor */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Valor (R$)</label>
                  <input
                    type="number"
                    value={txForm.amount}
                    onChange={(e) => setTxForm((prev) => ({ ...prev, amount: Number(e.target.value) }))}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-150 outline-none focus:border-violet-500/80"
                  />
                </div>

                {/* Data */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Data</label>
                  <input
                    type="date"
                    value={txForm.date}
                    onChange={(e) => setTxForm((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-150 outline-none focus:border-violet-500/80"
                  />
                </div>
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">Categoria</label>
                <select
                  value={txForm.category}
                  onChange={(e) => setTxForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-150 outline-none focus:border-violet-500/80"
                >
                  {CATEGORIES[txForm.type].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowTxModal(false)}
                className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => createTxMutation.mutate(txForm)}
                disabled={createTxMutation.isPending || !txForm.description.trim()}
                className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-700 disabled:opacity-50"
              >
                {createTxMutation.isPending ? 'Salvando...' : 'Confirmar Lançamento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
