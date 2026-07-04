import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import {
  ClipboardCheck,
  User,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { RefreshButton } from '../components/RefreshButton';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface Student {
  id: string;
  name: string;
  email: string | null;
}

interface ClassEntity {
  id: string;
  name: string;
}

interface AttendanceStudentRow {
  studentId: string;
  name: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'JUSTIFIED' | null;
  notes: string | null;
}

interface AttendanceHistoryItem {
  id: string;
  classId: string;
  className: string;
  date: string; // AAAA-MM-DD
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'JUSTIFIED';
  notes: string | null;
}

interface StudentHistoryResponse {
  student: {
    id: string;
    name: string;
  };
  stats: {
    total: number;
    present: number;
    absent: number;
    late: number;
    justified: number;
    attendanceRate: number;
  };
  history: AttendanceHistoryItem[];
}

const STATUS_OPTIONS = [
  { value: 'PRESENT', label: 'Presente', colorClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20', icon: CheckCircle },
  { value: 'ABSENT', label: 'Falta', colorClass: 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20', icon: XCircle },
  { value: 'LATE', label: 'Atrasado', colorClass: 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20', icon: Clock },
  { value: 'JUSTIFIED', label: 'Justificado', colorClass: 'bg-purple-500/10 border-purple-500/30 text-purple-400 hover:bg-purple-500/20', icon: HelpCircle },
];

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// ─── Componente Principal ────────────────────────────────────────────────────

export const AttendanceManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const isStudent = currentUser?.role === 'STUDENT';
  const canManage = ['ADMIN', 'TEACHER', 'RECEPTIONIST'].includes(currentUser?.role || '');

  // Abas
  const [activeTab, setActiveTab] = useState<'chamada' | 'historico'>(
    isStudent ? 'historico' : 'chamada'
  );

  // Filtros da Chamada
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Filtros do Histórico
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

  // Estados locais para notas temporárias da chamada
  const [attendanceState, setAttendanceState] = useState<{
    [studentId: string]: {
      status: 'PRESENT' | 'ABSENT' | 'LATE' | 'JUSTIFIED';
      notes: string;
    };
  }>({});

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // ─── Queries Gerais ────────────────────────────────────────────────────────

  const { data: classes } = useQuery<ClassEntity[]>({
    queryKey: ['classes-list-attendance'],
    queryFn: async () => (await api.get('/classes')).data,
    enabled: canManage,
  });

  const { data: students } = useQuery<Student[]>({
    queryKey: ['students-list-attendance'],
    queryFn: async () => (await api.get('/students')).data,
  });

  // Auto-selecionar o estudante logado se a role for STUDENT
  useEffect(() => {
    if (isStudent && students && currentUser) {
      const loggedStudent = students.find((s) => s.email === currentUser.email);
      if (loggedStudent) {
        setSelectedStudentId(loggedStudent.id);
      }
    }
  }, [isStudent, students, currentUser]);

  // Define a turma padrão ao carregar a lista de turmas
  useEffect(() => {
    if (classes && classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  // ─── Query de Lista de Presença da Turma (Fazer Chamada) ────────────────────

  const { data: attendanceList, isLoading: loadingAttendance } = useQuery<AttendanceStudentRow[]>({
    queryKey: ['attendance-class-list', selectedClassId, attendanceDate],
    queryFn: async () => {
      if (!selectedClassId || !attendanceDate) return [];
      return (await api.get(`/attendances/class/${selectedClassId}?date=${attendanceDate}`)).data;
    },
    enabled: canManage && !!selectedClassId && !!attendanceDate,
  });

  // Atualiza o estado da chamada local sempre que novos dados do servidor chegarem
  useEffect(() => {
    if (attendanceList) {
      const initialState: typeof attendanceState = {};
      attendanceList.forEach((row) => {
        initialState[row.studentId] = {
          status: row.status || 'PRESENT', // Padrão é Presente
          notes: row.notes || '',
        };
      });
      setAttendanceState(initialState);
    }
  }, [attendanceList]);

  // ─── Query de Histórico de Presença do Aluno ───────────────────────────────

  const { data: studentHistory, isLoading: loadingHistory } = useQuery<StudentHistoryResponse>({
    queryKey: ['student-attendance-history', selectedStudentId],
    queryFn: async () => {
      if (!selectedStudentId) throw new Error();
      return (await api.get(`/attendances/student/${selectedStudentId}`)).data;
    },
    enabled: !!selectedStudentId,
  });

  // ─── Mutation para Salvar Chamada ──────────────────────────────────────────

  const saveAttendanceMutation = useMutation({
    mutationFn: (data: {
      classId: string;
      date: string;
      records: { studentId: string; status: string; notes: string | null }[];
    }) => api.post('/attendances/bulk', data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['attendance-class-list', selectedClassId, attendanceDate],
      });
      showFeedback('Chamada salva com sucesso!');
    },
    onError: (err: any) => alert(err.response?.data?.message || 'Erro ao salvar chamada.'),
  });

  // ─── Handlers Chamada ─────────────────────────────────────────────────────

  const handleStatusChange = (
    studentId: string,
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'JUSTIFIED'
  ) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setAttendanceState((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        notes,
      },
    }));
  };

  const submitAttendance = () => {
    if (!selectedClassId || !attendanceDate) return;

    const records = Object.keys(attendanceState).map((studentId) => ({
      studentId,
      status: attendanceState[studentId].status,
      notes: attendanceState[studentId].notes.trim() || null,
    }));

    saveAttendanceMutation.mutate({
      classId: selectedClassId,
      date: attendanceDate,
      records,
    });
  };

  // ─── Helpers Calendário ────────────────────────────────────────────────────

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay(); // 0 = Domingo, 1 = Segunda...
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  // Prepara matriz do calendário
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayIndex = getFirstDayOfMonth(currentMonth, currentYear);

  const prevMonthIndex = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const daysInPrevMonth = getDaysInMonth(prevMonthIndex, prevMonthYear);

  const calendarCells: { day: number; isCurrentMonth: boolean; dateStr?: string }[] = [];

  // Dias excedentes do mês anterior (cinzas)
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarCells.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
    });
  }

  // Dias do mês atual
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarCells.push({
      day: d,
      isCurrentMonth: true,
      dateStr,
    });
  }

  // Dias excedentes do próximo mês para completar a última linha da grade (múltiplo de 7)
  const totalCells = calendarCells.length;
  const nextMonthDaysNeeded = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let i = 1; i <= nextMonthDaysNeeded; i++) {
    calendarCells.push({
      day: i,
      isCurrentMonth: false,
    });
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6 text-violet-500" />
            Frequência & Presença
          </h2>
          <p className="text-zinc-400 text-sm">
            {isStudent
              ? 'Consulte o seu histórico de aulas e frequências registradas.'
              : 'Realize chamadas diárias por turma e acompanhe o histórico detalhado dos alunos.'}
          </p>
        </div>
        <RefreshButton />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800">
        {canManage && (
          <button
            onClick={() => setActiveTab('chamada')}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'chamada'
                ? 'border-violet-500 text-violet-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Fazer Chamada
          </button>
        )}
        <button
          onClick={() => setActiveTab('historico')}
          className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'historico'
              ? 'border-violet-500 text-violet-400'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Histórico por Aluno
        </button>
      </div>

      {/* Mensagem de Feedback */}
      {feedbackMsg && (
        <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* ─── ABA: FAZER CHAMADA ─── */}
      {activeTab === 'chamada' && canManage && (
        <div className="space-y-6">
          {/* Barra de Filtros */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center bg-zinc-900/20 border border-zinc-800 p-4 rounded-xl">
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                Selecione a Turma
              </label>
              <select
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-150 outline-none focus:border-violet-500/80"
              >
                {!classes || classes.length === 0 ? (
                  <option value="">Nenhuma turma disponível</option>
                ) : (
                  classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                Data da Aula
              </label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="w-full sm:w-48 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-150 outline-none focus:border-violet-500/80"
              />
            </div>
          </div>

          {/* Listagem de Alunos para Chamada */}
          {loadingAttendance ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
            </div>
          ) : !attendanceList || attendanceList.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-zinc-800 border-dashed bg-zinc-900/5 text-center p-8">
              <Users className="h-10 w-10 text-zinc-600" />
              <h3 className="text-sm font-semibold text-zinc-300">Nenhum aluno matriculado</h3>
              <p className="text-zinc-500 text-xs max-w-xs">
                Certifique-se de que a turma possui alunos matriculados ativos para fazer a chamada.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/10 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 bg-zinc-950/40 text-xs font-bold uppercase tracking-wider text-zinc-400">
                      <th className="px-6 py-4">Aluno</th>
                      <th className="px-6 py-4 text-center">Status de Presença</th>
                      <th className="px-6 py-4">Observações / Justificativas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {attendanceList.map((row) => {
                      const localRecord = attendanceState[row.studentId] || {
                        status: 'PRESENT',
                        notes: '',
                      };
                      return (
                        <tr key={row.studentId} className="hover:bg-zinc-900/10 transition-colors">
                          <td className="px-6 py-4">
                            <span className="font-semibold text-zinc-150 text-sm block">
                              {row.name}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-1.5">
                              {STATUS_OPTIONS.map((opt) => {
                                const Icon = opt.icon;
                                const isSelected = localRecord.status === opt.value;
                                return (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => handleStatusChange(row.studentId, opt.value as any)}
                                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                                      isSelected
                                        ? opt.colorClass + ' scale-105 border-violet-500/50 shadow-sm shadow-violet-500/10'
                                        : 'border-zinc-800 bg-zinc-950 text-zinc-450 hover:text-zinc-200 hover:border-zinc-700'
                                    }`}
                                  >
                                    <Icon className="h-3.5 w-3.5" />
                                    {opt.label}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={localRecord.notes}
                              onChange={(e) => handleNotesChange(row.studentId, e.target.value)}
                              placeholder="Adicionar observação..."
                              className="w-full rounded-lg border border-zinc-850 bg-zinc-950/60 px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-650 outline-none focus:border-violet-500/80"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Botão de Submissão */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={submitAttendance}
                  disabled={saveAttendanceMutation.isPending}
                  className="rounded-lg bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50 transition-colors shadow-md shadow-violet-500/10 active:scale-[0.98]"
                >
                  {saveAttendanceMutation.isPending ? 'Salvando Chamada...' : 'Salvar Chamada'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── ABA: HISTÓRICO POR ALUNO ─── */}
      {activeTab === 'historico' && (
        <div className="space-y-6">
          {/* Seletor do Aluno */}
          <div className="bg-zinc-900/20 border border-zinc-800 p-4 rounded-xl max-w-md">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
              Selecione o Aluno
            </label>
            {isStudent ? (
              <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-2 rounded-lg text-sm text-zinc-300">
                <User className="h-4 w-4 text-violet-400" />
                <span className="font-medium">
                  {students?.find((s) => s.id === selectedStudentId)?.name || currentUser?.name}
                </span>
              </div>
            ) : (
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-150 outline-none focus:border-violet-500/80"
              >
                <option value="">Escolha um aluno...</option>
                {students?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Histórico e Calendário */}
          {!selectedStudentId ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-zinc-800 border-dashed bg-zinc-900/5 text-center p-8">
              <User className="h-10 w-10 text-zinc-600" />
              <h3 className="text-sm font-semibold text-zinc-300">Nenhum aluno selecionado</h3>
              <p className="text-zinc-550 text-xs">
                Selecione um aluno para visualizar o índice de presença e calendário.
              </p>
            </div>
          ) : loadingHistory ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
            </div>
          ) : !studentHistory ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2 text-sm text-zinc-400">
              <AlertCircle className="h-8 w-8 text-zinc-600" />
              <p>Erro ao carregar dados do aluno.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Estatísticas */}
              <div className="lg:col-span-1 space-y-4">
                <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-5 space-y-4">
                  <h3 className="font-bold text-white text-base">Estatísticas</h3>

                  {/* Taxa de Frequência */}
                  <div className="flex flex-col items-center justify-center py-4 border-b border-zinc-800">
                    <div className="relative flex items-center justify-center">
                      <div className="h-28 w-28 rounded-full border-4 border-zinc-800 flex flex-col items-center justify-center bg-zinc-950/40">
                        <span className="text-2xl font-bold text-white">
                          {studentHistory.stats.attendanceRate}%
                        </span>
                        <span className="text-[10px] text-zinc-500 font-semibold uppercase">Frequência</span>
                      </div>
                    </div>
                  </div>

                  {/* Detalhes numéricos */}
                  <div 
                    className="grid grid-cols-2 gap-3 pt-2"
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}
                  >
                    <div className="bg-zinc-950/40 border border-zinc-805/50 rounded-lg p-3 text-center">
                      <p className="text-[10px] text-zinc-500 font-semibold uppercase">Presenças</p>
                      <p className="text-xl font-bold text-emerald-400 mt-1">
                        {studentHistory.stats.present + studentHistory.stats.late}
                      </p>
                    </div>
                    <div className="bg-zinc-950/40 border border-zinc-805/50 rounded-lg p-3 text-center">
                      <p className="text-[10px] text-zinc-500 font-semibold uppercase">Atrasos</p>
                      <p className="text-xl font-bold text-amber-400 mt-1">
                        {studentHistory.stats.late}
                      </p>
                    </div>
                    <div className="bg-zinc-950/40 border border-zinc-805/50 rounded-lg p-3 text-center">
                      <p className="text-[10px] text-zinc-500 font-semibold uppercase">Faltas</p>
                      <p className="text-xl font-bold text-rose-400 mt-1">
                        {studentHistory.stats.absent}
                      </p>
                    </div>
                    <div className="bg-zinc-950/40 border border-zinc-805/50 rounded-lg p-3 text-center">
                      <p className="text-[10px] text-zinc-500 font-semibold uppercase">Justificadas</p>
                      <p className="text-xl font-bold text-purple-400 mt-1">
                        {studentHistory.stats.justified}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 text-center text-xs text-zinc-500">
                    Calculado com base em <strong>{studentHistory.stats.total}</strong> aula(s) registrada(s).
                  </div>
                </div>
              </div>

              {/* Calendário Interativo */}
              <div className="lg:col-span-2 space-y-4">
                <div className="rounded-xl border border-zinc-800 bg-[#0f0f12] p-6 w-full font-sans">
                  {/* Cabeçalho Calendário */}
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold tracking-wide text-white">
                      Calendário de Aulas
                    </h3>

                    <div className="flex items-center gap-2 bg-[#16161a] p-1 rounded-lg border border-zinc-800">
                      <button
                        onClick={prevMonth}
                        className="p-1.5 hover:bg-[#222227] text-zinc-400 hover:text-white rounded transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="text-sm font-medium px-2 text-zinc-300 min-w-[120px] text-center">
                        {MONTHS[currentMonth]} de {currentYear}
                      </span>
                      <button
                        onClick={nextMonth}
                        className="p-1.5 hover:bg-[#222227] text-zinc-400 hover:text-white rounded transition-colors"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Dias da semana */}
                  <div 
                    className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-purple-400 uppercase tracking-wider mb-2"
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}
                  >
                    <div>Dom</div>
                    <div>Seg</div>
                    <div>Ter</div>
                    <div>Qua</div>
                    <div>Qui</div>
                    <div>Sex</div>
                    <div>Sáb</div>
                  </div>

                  {/* Grade do Calendário */}
                  <div 
                    className="grid grid-cols-7 gap-2 text-center text-sm"
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}
                  >
                    {calendarCells.map((cell, idx) => {
                      if (!cell.isCurrentMonth) {
                        return (
                          <div 
                            key={`prev-next-${idx}`} 
                            className="p-2 text-zinc-600 select-none text-center text-sm font-normal"
                          >
                            {cell.day}
                          </div>
                        );
                      }

                      const day = cell.day;
                      const dayStr = cell.dateStr!;
                      const dayAttendances = studentHistory.history.filter((h) => h.date === dayStr);

                      let bgClass = 'bg-[#16161a] text-gray-400 border border-gray-800/60 hover:bg-[#222227]';
                      let statusText = '';
                      let hasNotes = false;

                      if (dayAttendances.length > 0) {
                        const status = dayAttendances[0].status;
                        hasNotes = dayAttendances.some((a) => !!a.notes);
                        
                        if (status === 'PRESENT') {
                          bgClass = 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 hover:bg-emerald-900/50';
                          statusText = 'Presente';
                        } else if (status === 'ABSENT') {
                          bgClass = 'bg-rose-950/40 text-rose-400 border border-rose-800/60 hover:bg-rose-900/50';
                          statusText = 'Falta';
                        } else if (status === 'LATE') {
                          bgClass = 'bg-amber-950/40 text-amber-400 border border-amber-800/60 hover:bg-amber-900/50';
                          statusText = 'Atrasado';
                        } else if (status === 'JUSTIFIED') {
                          bgClass = 'bg-purple-950/30 text-purple-300 border border-purple-800/40 hover:bg-purple-900/40';
                          statusText = 'Justificado';
                        }
                      }

                      return (
                        <button
                          key={`day-${day}`}
                          type="button"
                          className={`group relative p-2 rounded-lg font-medium transition-all text-sm text-center flex flex-col items-center justify-center h-10 ${bgClass}`}
                        >
                          <span>{day}</span>
                          
                          {/* Bolinha indicadora de notas */}
                          {hasNotes && (
                            <span className="absolute bottom-1 h-1 w-1 rounded-full bg-current" />
                          )}

                          {/* Tooltip Hover */}
                          {dayAttendances.length > 0 && (
                            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-300 p-2.5 rounded-lg shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10 space-y-1">
                              {dayAttendances.map((att, attIdx) => (
                                <div key={attIdx} className={attIdx > 0 ? 'border-t border-zinc-800 pt-1.5 mt-1.5' : ''}>
                                  <p className="font-bold text-white truncate">{att.className}</p>
                                  <p className="mt-0.5 flex items-center gap-1">
                                    <span className="font-semibold">{statusText}</span>
                                  </p>
                                  {att.notes && (
                                    <p className="mt-1 flex items-start gap-1 text-zinc-450 italic bg-zinc-900/50 p-1 rounded">
                                      <MessageSquare className="h-3 w-3 shrink-0 mt-0.5" />
                                      <span className="break-words">{att.notes}</span>
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Legenda */}
                  <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-4 border-t border-zinc-800 text-xs text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Presença
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Falta
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Atraso
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Justificado
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
