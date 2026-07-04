import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, useFieldArray } from 'react-hook-form';
import { api } from '../services/api';
import {
  Plus,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  Users,
  UserPlus,
  X,
  UserX,
  Target,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { RefreshButton } from '../components/RefreshButton';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface ClassSchedule {
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

interface Student {
  id: string;
  name: string;
  status: string;
}

interface Enrollment {
  id: string;
  studentId: string;
  classId: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  student: {
    id: string;
    name: string;
    status: string;
  };
}

interface ClassEntity {
  id: string;
  name: string;
  description: string | null;
  martialArtId: string;
  teacherId: string;
  createdAt: string;
  schedules: ClassSchedule[];
  martialArt?: {
    name: string;
  };
  teacher?: {
    name: string;
  };
  enrollments?: Enrollment[];
  _count?: {
    enrollments: number;
  };
}

interface MartialArt {
  id: string;
  name: string;
}

interface Teacher {
  id: string;
  name: string;
}

interface ClassFormInput {
  name: string;
  description: string;
  martialArtId: string;
  teacherId: string;
  schedules: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }[];
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
];

const DAYS_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// ─── Componente Principal ────────────────────────────────────────────────────

export const ClassesManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  // Estados dos Modais
  const [showClassModal, setShowClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassEntity | null>(null);
  const [selectedClassForEnrollment, setSelectedClassForEnrollment] = useState<ClassEntity | null>(null);

  // Erros e Mensagens
  const [classFormError, setClassFormError] = useState<string | null>(null);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Estado para matricular aluno
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');

  const isAdmin = currentUser?.role === 'ADMIN';

  // ─── Queries ─────────────────────────────────────────────────────────────

  const { data: classes, isLoading, isError } = useQuery<ClassEntity[]>({
    queryKey: ['classes'],
    queryFn: async () => (await api.get('/classes')).data,
  });

  const { data: martialArts } = useQuery<MartialArt[]>({
    queryKey: ['martial-arts'],
    queryFn: async () => (await api.get('/martial-arts')).data,
  });

  const { data: teachers } = useQuery<Teacher[]>({
    queryKey: ['teachers'],
    queryFn: async () => (await api.get('/teachers')).data,
  });

  const { data: students } = useQuery<Student[]>({
    queryKey: ['students'],
    queryFn: async () => (await api.get('/students')).data,
  });

  // Turma atualmente aberta para matrículas com dados recém-sincronizados
  const currentClassDetails = useQuery<ClassEntity>({
    queryKey: ['class-details', selectedClassForEnrollment?.id],
    queryFn: async () => {
      if (!selectedClassForEnrollment?.id) throw new Error();
      return (await api.get(`/classes/${selectedClassForEnrollment.id}`)).data;
    },
    enabled: !!selectedClassForEnrollment?.id,
  });

  // ─── Mutations Turmas ─────────────────────────────────────────────────────

  const createClassMutation = useMutation({
    mutationFn: (data: ClassFormInput) => api.post('/classes', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      showFeedback('Turma cadastrada com sucesso!');
      closeClassModal();
    },
    onError: (err: any) => setClassFormError(err.response?.data?.message || 'Erro ao cadastrar.'),
  });

  const updateClassMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ClassFormInput }) =>
      api.put(`/classes/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      showFeedback('Turma atualizada com sucesso!');
      closeClassModal();
    },
    onError: (err: any) => setClassFormError(err.response?.data?.message || 'Erro ao atualizar.'),
  });

  const deleteClassMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/classes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      showFeedback('Turma excluída com sucesso!');
    },
    onError: (err: any) => alert(err.response?.data?.message || 'Erro ao excluir.'),
  });

  // ─── Mutations Matrículas ─────────────────────────────────────────────────

  const enrollStudentMutation = useMutation({
    mutationFn: (data: { studentId: string; classId: string }) => api.post('/enrollments', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-details', selectedClassForEnrollment?.id] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      showFeedback('Aluno matriculado com sucesso!');
      setSelectedStudentId('');
      setEnrollmentError(null);
    },
    onError: (err: any) => setEnrollmentError(err.response?.data?.message || 'Erro ao matricular.'),
  });

  const updateEnrollmentStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'ACTIVE' | 'INACTIVE' }) =>
      api.put(`/enrollments/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-details', selectedClassForEnrollment?.id] });
    },
    onError: (err: any) => alert(err.response?.data?.message || 'Erro ao alterar status.'),
  });

  const deleteEnrollmentMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/enrollments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-details', selectedClassForEnrollment?.id] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      showFeedback('Matrícula removida com sucesso!');
    },
    onError: (err: any) => alert(err.response?.data?.message || 'Erro ao desvincular aluno.'),
  });

  // ─── Forms ────────────────────────────────────────────────────────────────

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ClassFormInput>({
    defaultValues: {
      name: '',
      description: '',
      martialArtId: '',
      teacherId: '',
      schedules: [{ dayOfWeek: 1, startTime: '19:00', endTime: '20:30' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'schedules',
  });

  const openCreateClassModal = () => {
    setEditingClass(null);
    setClassFormError(null);
    reset({
      name: '',
      description: '',
      martialArtId: martialArts?.[0]?.id || '',
      teacherId: teachers?.[0]?.id || '',
      schedules: [{ dayOfWeek: 1, startTime: '19:00', endTime: '20:30' }],
    });
    setShowClassModal(true);
  };

  const openEditClassModal = (cls: ClassEntity) => {
    setEditingClass(cls);
    setClassFormError(null);
    setValue('name', cls.name);
    setValue('description', cls.description || '');
    setValue('martialArtId', cls.martialArtId);
    setValue('teacherId', cls.teacherId);
    
    // Mapeia horários
    setValue(
      'schedules',
      cls.schedules.map((s) => ({
        dayOfWeek: s.dayOfWeek,
        startTime: s.startTime,
        endTime: s.endTime,
      }))
    );
    setShowClassModal(true);
  };

  const closeClassModal = () => {
    setShowClassModal(false);
    setEditingClass(null);
    setClassFormError(null);
  };

  const onSubmit = (data: ClassFormInput) => {
    if (!data.name.trim()) return;

    if (editingClass) {
      updateClassMutation.mutate({ id: editingClass.id, data });
    } else {
      createClassMutation.mutate(data);
    }
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const showFeedback = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4500);
  };

  const handleDeleteClass = (cls: ClassEntity) => {
    if (confirm(`Excluir a turma "${cls.name}"? As matrículas ativas serão desativadas.`)) {
      deleteClassMutation.mutate(cls.id);
    }
  };


  const handleEnrollStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassForEnrollment || !selectedStudentId) return;
    enrollStudentMutation.mutate({
      studentId: selectedStudentId,
      classId: selectedClassForEnrollment.id,
    });
  };

  // Filtra estudantes ativos que já não estejam matriculados nesta turma
  const availableStudents = students?.filter((st) => {
    if (st.status !== 'ACTIVE') return false;
    const isEnrolled = currentClassDetails.data?.enrollments?.some(
      (en) => en.studentId === st.id
    );
    return !isEnrolled;
  });

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Calendar className="h-6 w-6 text-violet-500" />
            Turmas & Matrículas
          </h2>
          <p className="text-zinc-400 text-sm">
            Gerencie os horários de treino das turmas e associe os alunos matriculados.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <RefreshButton />
          {isAdmin && (
            <button
              onClick={openCreateClassModal}
              className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-violet-700 active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              Nova Turma
            </button>
          )}
        </div>
      </div>

      {/* Feedback de Sucesso */}
      {successMsg && (
        <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400 animate-fade-in">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Listagem */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
        </div>
      ) : isError ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 text-sm text-red-400">
          <AlertCircle className="h-8 w-8" />
          <p>Erro ao carregar turmas.</p>
        </div>
      ) : !classes || classes.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-zinc-800 border-dashed bg-zinc-900/5 text-center p-8">
          <Calendar className="h-10 w-10 text-zinc-600" />
          <h3 className="text-sm font-semibold text-zinc-300">Nenhuma turma cadastrada</h3>
          <p className="text-zinc-500 text-xs max-w-xs">
            Crie turmas para definir horários de treinos e matricular seus alunos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="group flex flex-col justify-between rounded-xl border border-zinc-800 bg-zinc-900/20 p-5 hover:border-zinc-700 hover:bg-zinc-900/40 transition-all duration-200"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white text-lg group-hover:text-violet-400 transition-colors">
                      {cls.name}
                    </h3>
                    <p className="text-zinc-500 text-xs mt-0.5 line-clamp-2">
                      {cls.description || 'Sem descrição.'}
                    </p>
                  </div>
                  
                  {isAdmin && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditClassModal(cls)}
                        className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                        title="Editar Turma"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClass(cls)}
                        className="p-1.5 rounded-lg border border-zinc-800 bg-zinc-900/50 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        title="Excluir Turma"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Badges Modalidade e Professor */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="flex items-center gap-1 rounded-md bg-zinc-800/80 px-2 py-1 text-zinc-300 border border-zinc-700/50">
                    <Target className="h-3.5 w-3.5 text-violet-400" />
                    {cls.martialArt?.name}
                  </span>
                  <span className="flex items-center gap-1 rounded-md bg-zinc-800/80 px-2 py-1 text-zinc-300 border border-zinc-700/50">
                    <GraduationCap className="h-3.5 w-3.5 text-fuchsia-400" />
                    Prof: {cls.teacher?.name}
                  </span>
                </div>

                {/* Horários */}
                <div className="space-y-1.5 pt-2 border-t border-zinc-800/60">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-550 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Horários de Treino
                  </span>
                  <div className="text-xs text-zinc-400 space-y-1">
                    {cls.schedules?.length > 0 ? (
                      cls.schedules.map((s, idx) => (
                        <p key={idx} className="flex items-center gap-1.5 bg-zinc-900/40 px-2 py-1 rounded border border-zinc-800/40">
                          <span className="font-semibold text-violet-400">{DAYS_SHORT[s.dayOfWeek]}</span>
                          <span className="text-zinc-500">·</span>
                          <span>{s.startTime} às {s.endTime}</span>
                        </p>
                      ))
                    ) : (
                      <p className="text-zinc-650 italic">Nenhum horário definido</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Ações de Alunos / Matrículas */}
              <div className="mt-5 pt-4 border-t border-zinc-800/60 flex items-center justify-between">
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Users className="h-4 w-4 text-violet-400" />
                  <strong>{cls._count?.enrollments ?? 0}</strong> aluno(s) ativo(s)
                </span>
                
                <button
                  onClick={() => setSelectedClassForEnrollment(cls)}
                  className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/50 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors"
                >
                  <UserPlus className="h-3.5 w-3.5 text-violet-400" />
                  Matrículas
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Modal de Turma (Criar/Editar) ─── */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl my-8">
            <div className="mb-5 flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-violet-500" />
                {editingClass ? 'Editar Turma' : 'Nova Turma'}
              </h3>
              <button onClick={closeClassModal} className="text-zinc-500 hover:text-zinc-250">
                <X className="h-5 w-5" />
              </button>
            </div>

            {classFormError && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{classFormError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wide">
                  Nome da Turma *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Jiu-Jitsu Iniciantes"
                  {...register('name', { required: 'Nome é obrigatório.' })}
                  className={`w-full rounded-lg border bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all ${
                    errors.name ? 'border-red-500/50' : 'border-zinc-800 focus:border-violet-500/80'
                  }`}
                />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wide">
                  Descrição
                </label>
                <textarea
                  placeholder="Ex: Turma focada em conceitos básicos de defesa..."
                  rows={2}
                  {...register('description')}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:border-violet-500/80 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wide">
                    Modalidade / Arte Marcial *
                  </label>
                  <select
                    {...register('martialArtId', { required: 'Selecione uma modalidade.' })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-150 outline-none focus:border-violet-500/80"
                  >
                    {!martialArts || martialArts.length === 0 ? (
                      <option value="">Nenhuma cadastrada</option>
                    ) : (
                      martialArts.map((ma) => (
                        <option key={ma.id} value={ma.id}>
                          {ma.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wide">
                    Professor Responsável *
                  </label>
                  <select
                    {...register('teacherId', { required: 'Selecione um professor.' })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-155 outline-none focus:border-violet-500/80"
                  >
                    {!teachers || teachers.length === 0 ? (
                      <option value="">Nenhum cadastrado</option>
                    ) : (
                      teachers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* Seção de Horários Dinâmicos */}
              <div className="space-y-3 pt-3 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-350">
                    Horários de Aula
                  </span>
                  <button
                    type="button"
                    onClick={() => append({ dayOfWeek: 1, startTime: '19:00', endTime: '20:30' })}
                    className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 font-semibold"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Adicionar Horário
                  </button>
                </div>

                {fields.length === 0 && (
                  <p className="text-xs text-zinc-550 italic">Adicione pelo menos um horário de aula.</p>
                )}

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-center bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-800/85">
                      <select
                        {...register(`schedules.${index}.dayOfWeek` as const, { valueAsNumber: true })}
                        className="flex-1 rounded border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-200 outline-none"
                      >
                        {DAYS_OF_WEEK.map((d) => (
                          <option key={d.value} value={d.value}>
                            {d.label}
                          </option>
                        ))}
                      </select>

                      <input
                        type="time"
                        {...register(`schedules.${index}.startTime` as const, { required: true })}
                        className="w-20 rounded border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-200 text-center outline-none"
                      />

                      <span className="text-zinc-600 text-xs">às</span>

                      <input
                        type="time"
                        {...register(`schedules.${index}.endTime` as const, { required: true })}
                        className="w-20 rounded border border-zinc-800 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-200 text-center outline-none"
                      />

                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="p-1 rounded text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4 mt-6">
                <button
                  type="button"
                  onClick={closeClassModal}
                  className="rounded-lg border border-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createClassMutation.isPending || updateClassMutation.isPending}
                  className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50 transition-colors"
                >
                  {createClassMutation.isPending || updateClassMutation.isPending ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Gaveta / Modal de Alunos Matriculados ─── */}
      {selectedClassForEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
          <div className="h-full w-full max-w-md border-l border-zinc-800 bg-zinc-900 p-6 shadow-2xl flex flex-col justify-between animate-slide-in">
            <div>
              {/* Header do Drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-5">
                <div>
                  <h3 className="font-bold text-white text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-violet-400" />
                    Alunos: {selectedClassForEnrollment.name}
                  </h3>
                  <p className="text-zinc-500 text-xs mt-0.5">
                    Matricule novos alunos e controle a frequência e status.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedClassForEnrollment(null)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Matricular Novo Aluno */}
              {isAdmin && (
                <div className="bg-zinc-950/40 p-4 rounded-xl border border-zinc-800/80 mb-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-1">
                    <UserPlus className="h-4 w-4 text-violet-400" />
                    Matricular Aluno
                  </h4>

                  {enrollmentError && (
                    <div className="mb-3 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-2.5 text-xs text-red-400">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{enrollmentError}</span>
                    </div>
                  )}

                  <form onSubmit={handleEnrollStudent} className="flex gap-2">
                    <select
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-violet-500/80"
                    >
                      <option value="">Selecione um aluno ativo...</option>
                      {!availableStudents || availableStudents.length === 0 ? (
                        <option value="" disabled>
                          Nenhum aluno ativo restante
                        </option>
                      ) : (
                        availableStudents.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.name}
                          </option>
                        ))
                      )}
                    </select>
                    <button
                      type="submit"
                      disabled={!selectedStudentId || enrollStudentMutation.isPending}
                      className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-40 transition-colors"
                    >
                      Matricular
                    </button>
                  </form>
                </div>
              )}

              {/* Listagem de Alunos Matriculados */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-450">
                  Alunos Vinculados
                </span>

                {currentClassDetails.isLoading ? (
                  <div className="flex justify-center py-10">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
                  </div>
                ) : !currentClassDetails.data?.enrollments ||
                  currentClassDetails.data.enrollments.length === 0 ? (
                  <div className="text-center py-10 border border-zinc-800 border-dashed rounded-lg bg-zinc-950/20">
                    <Users className="h-8 w-8 text-zinc-700 mx-auto mb-2" />
                    <p className="text-xs text-zinc-550">Nenhum aluno matriculado nesta turma.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[calc(100vh-340px)] overflow-y-auto pr-1">
                    {currentClassDetails.data.enrollments.map((en) => (
                      <div
                        key={en.id}
                        className="flex items-center justify-between gap-3 rounded-lg border border-zinc-800 bg-zinc-950/30 px-3.5 py-2.5 hover:bg-zinc-855/50 transition-all"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-zinc-100 truncate">
                            {en.student?.name}
                          </p>
                          <p className="text-[10px] text-zinc-500 mt-0.5">
                            Matriculado em: {new Date(en.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-2.5">
                          {/* Toggle Status Ativo/Inativo */}
                          <button
                            onClick={() =>
                              updateEnrollmentStatusMutation.mutate({
                                id: en.id,
                                status: en.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE',
                              })
                            }
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold border transition-colors ${
                              en.status === 'ACTIVE'
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                                : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700'
                            }`}
                          >
                            {en.status === 'ACTIVE' ? 'Ativa' : 'Inativa'}
                          </button>

                          {/* Botão Remover Matrícula */}
                          {isAdmin && (
                            <button
                              onClick={() => {
                                if (confirm(`Remover matrícula de ${en.student?.name}?`)) {
                                  deleteEnrollmentMutation.mutate(en.id);
                                }
                              }}
                              className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                              title="Remover Matrícula"
                            >
                              <UserX className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Rodapé Drawer */}
            <div className="pt-4 border-t border-zinc-800 text-center">
              <button
                onClick={() => setSelectedClassForEnrollment(null)}
                className="w-full rounded-lg border border-zinc-800 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
