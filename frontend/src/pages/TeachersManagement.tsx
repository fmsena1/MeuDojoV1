import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { api } from '../services/api';
import {
  Plus,
  Award,
  Search,
  Filter,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  MapPin,
  User,
  Key,
  Phone,
  Calendar,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { RefreshButton } from '../components/RefreshButton';

interface TeacherFormInput {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  rg: string;
  cpf: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  bio: string;
  specialties: string;
  graduation: string;
  status: string;
  createUserAccess: boolean;
  password: string;
}

interface Teacher {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  gender?: string;
  rg?: string;
  cpf?: string;
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  bio?: string;
  specialties?: string;
  graduation?: string;
  status: string;
  userId?: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
  createdAt: string;
}

export const TeachersManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'address' | 'access'>('personal');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const canEdit = currentUser?.role === 'ADMIN' || currentUser?.role === 'RECEPTIONIST';

  // Fetch de Professores
  const { data: teachers, isLoading, isError } = useQuery<Teacher[]>({
    queryKey: ['teachers'],
    queryFn: async () => {
      const response = await api.get('/teachers');
      return response.data;
    },
  });

  // Mutation para Criar Professor
  const createTeacherMutation = useMutation({
    mutationFn: async (newTeacher: any) => {
      const response = await api.post('/teachers', newTeacher);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      showSuccessFeedback('Professor cadastrado com sucesso!');
      closeAndReset();
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.message || 'Erro ao cadastrar professor.');
    },
  });

  // Mutation para Editar Professor
  const updateTeacherMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await api.put(`/teachers/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      showSuccessFeedback('Professor atualizado com sucesso!');
      closeAndReset();
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.message || 'Erro ao atualizar dados do professor.');
    },
  });

  // Mutation para Deletar Professor (Soft Delete)
  const deleteTeacherMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/teachers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      showSuccessFeedback('Professor excluído com sucesso!');
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Erro ao excluir professor.');
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<TeacherFormInput>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      birthDate: '',
      gender: '',
      rg: '',
      cpf: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      bio: '',
      specialties: '',
      graduation: '',
      status: 'ACTIVE',
      createUserAccess: false,
      password: '',
    },
  });

  const createUserAccessVal = watch('createUserAccess');

  const showSuccessFeedback = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const closeAndReset = () => {
    setShowModal(false);
    setEditingTeacher(null);
    setFormError(null);
    setActiveTab('personal');
    reset({
      name: '',
      email: '',
      phone: '',
      birthDate: '',
      gender: '',
      rg: '',
      cpf: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
      bio: '',
      specialties: '',
      graduation: '',
      status: 'ACTIVE',
      createUserAccess: false,
      password: '',
    });
  };

  const handleEditClick = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormError(null);
    setActiveTab('personal');
    
    setValue('name', teacher.name);
    setValue('email', teacher.email || '');
    setValue('phone', teacher.phone || '');
    setValue('birthDate', teacher.birthDate ? teacher.birthDate.split('T')[0] : '');
    setValue('gender', teacher.gender || '');
    setValue('rg', teacher.rg || '');
    setValue('cpf', teacher.cpf || '');
    setValue('street', teacher.street || '');
    setValue('number', teacher.number || '');
    setValue('complement', teacher.complement || '');
    setValue('neighborhood', teacher.neighborhood || '');
    setValue('city', teacher.city || '');
    setValue('state', teacher.state || '');
    setValue('zipCode', teacher.zipCode || '');
    setValue('bio', teacher.bio || '');
    setValue('specialties', teacher.specialties || '');
    setValue('graduation', teacher.graduation || '');
    setValue('status', teacher.status);
    setValue('createUserAccess', !!teacher.userId);
    setValue('password', '');

    setShowModal(true);
  };

  const handleDeleteClick = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este professor? Esta operação desativará também o acesso se houver.')) {
      deleteTeacherMutation.mutate(id);
    }
  };

  const handleCepLookup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setValue('street', data.logradouro);
          setValue('neighborhood', data.bairro);
          setValue('city', data.localidade);
          setValue('state', data.uf);
        }
      } catch (err) {
        console.error('Erro na consulta do CEP:', err);
      }
    }
  };

  const onSubmit = (data: TeacherFormInput) => {
    setFormError(null);

    // Validação manual de acesso
    if (data.createUserAccess) {
      if (!data.email) {
        setFormError('E-mail é obrigatório para liberar acesso ao sistema.');
        setActiveTab('access');
        return;
      }
      if (!editingTeacher && (!data.password || data.password.length < 6)) {
        setFormError('Senha provisória de no mínimo 6 caracteres é obrigatória.');
        setActiveTab('access');
        return;
      }
      if (editingTeacher && data.password && data.password.length < 6) {
        setFormError('A nova senha deve ter pelo menos 6 caracteres.');
        setActiveTab('access');
        return;
      }
    }

    const payload = {
      name: data.name,
      email: data.email || null,
      phone: data.phone || null,
      birthDate: data.birthDate ? new Date(data.birthDate).toISOString() : null,
      gender: data.gender || null,
      rg: data.rg || null,
      cpf: data.cpf || null,
      street: data.street || null,
      number: data.number || null,
      complement: data.complement || null,
      neighborhood: data.neighborhood || null,
      city: data.city || null,
      state: data.state || null,
      zipCode: data.zipCode || null,
      bio: data.bio || null,
      specialties: data.specialties || null,
      graduation: data.graduation || null,
      status: data.status,
      createUserAccess: data.createUserAccess,
      password: data.password || null,
    };

    if (editingTeacher) {
      updateTeacherMutation.mutate({ id: editingTeacher.id, data: payload });
    } else {
      createTeacherMutation.mutate(payload);
    }
  };

  const filteredTeachers = teachers?.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (teacher.email && teacher.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (teacher.specialties && teacher.specialties.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (teacher.graduation && teacher.graduation.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus =
      statusFilter === 'ALL' || teacher.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Award className="h-6 w-6 text-violet-500" />
            Gestão de Professores / Sanseis
          </h2>
          <p className="text-zinc-400 text-sm">
            Cadastre professores, gerencie suas graduações, especialidades de ensino e credenciais de acesso.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <RefreshButton />
          {canEdit && (
            <button
              onClick={() => {
                closeAndReset();
                setShowModal(true);
              }}
              className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-violet-700 active:scale-[0.98] cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Novo Professor
            </button>
          )}
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Busca e Filtros */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por nome, faixa, especialidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/20 py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-500 outline-none transition-all focus:border-violet-500/80"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-zinc-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-zinc-800 bg-zinc-900/30 px-3 py-2 text-sm text-zinc-300 outline-none transition-all focus:border-violet-500/80"
          >
            <option value="ALL">Todos os Status</option>
            <option value="ACTIVE">Ativo</option>
            <option value="INACTIVE">Inativo</option>
          </select>
        </div>
      </div>

      {/* Tabela de Professores */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-850 bg-zinc-900/10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
        </div>
      ) : isError ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 text-center text-sm text-red-400">
          <AlertCircle className="h-8 w-8 shrink-0" />
          <p>Erro ao carregar a lista de professores.</p>
        </div>
      ) : !filteredTeachers || filteredTeachers.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-zinc-800 border-dashed bg-zinc-900/5 text-center p-8">
          <Award className="h-10 w-10 text-zinc-600" />
          <h3 className="text-sm font-semibold text-zinc-300">Nenhum professor encontrado</h3>
          <p className="text-zinc-550 text-xs max-w-sm">
            {searchTerm || statusFilter !== 'ALL'
              ? 'Tente ajustar sua busca ou filtros.'
              : 'Clique em "Novo Professor" para cadastrar o primeiro professor/sansei.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/20 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-zinc-900/40 text-zinc-400 font-semibold uppercase tracking-wider text-xs border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Nome</th>
                  <th className="px-6 py-4">Faixa / Graduação</th>
                  <th className="px-6 py-4 hidden sm:table-cell">Modalidades / Especialidades</th>
                  <th className="px-6 py-4 hidden md:table-cell">Contato</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 hidden lg:table-cell">Acesso Portal</th>
                  {canEdit && <th className="px-6 py-4 text-right">Ações</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filteredTeachers.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-900/45 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">
                      <span>{item.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      {item.graduation ? (
                        <span className="text-zinc-200 font-medium">{item.graduation}</span>
                      ) : (
                        <span className="text-zinc-650 italic">Não informada</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-zinc-300 hidden sm:table-cell">
                      {item.specialties || <span className="text-zinc-650 italic">Geral</span>}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex flex-col gap-0.5 text-zinc-300 text-xs">
                        {item.email && <span>{item.email}</span>}
                        {item.phone && <span className="text-zinc-400">{item.phone}</span>}
                        {!item.email && !item.phone && <span className="text-zinc-550 italic">Sem contato</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium uppercase ${
                          item.status === 'ACTIVE'
                            ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'
                            : 'text-red-400 bg-red-500/10 border-red-500/25'
                        }`}
                      >
                        {item.status === 'ACTIVE' ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      {item.userId ? (
                        <span className="inline-flex items-center gap-1 text-xs text-violet-400 font-medium">
                          <CheckCircle className="h-3.5 w-3.5 text-violet-500" />
                          Liberado
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-500 italic">Sem acesso</span>
                      )}
                    </td>
                    {canEdit && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(item)}
                            title="Editar Professor"
                            className="p-1.5 rounded-lg border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item.id)}
                            title="Excluir Professor"
                            className="p-1.5 rounded-lg border border-zinc-800 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
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
        </div>
      )}

      {/* Modal Cadastro/Edição */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl my-8">
            <div className="mb-6 flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-violet-500" />
                {editingTeacher ? 'Editar Dados do Professor' : 'Cadastrar Novo Professor'}
              </h3>
              <button onClick={closeAndReset} className="text-zinc-450 hover:text-zinc-200 cursor-pointer">
                ✕
              </button>
            </div>

            {formError && (
              <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Abas */}
            <div className="flex border-b border-zinc-800 mb-6 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('personal')}
                className={`flex items-center gap-2 pb-3 px-1 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'personal'
                    ? 'border-violet-500 text-violet-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <User className="h-4 w-4" />
                Dados Profissionais
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('address')}
                className={`flex items-center gap-2 pb-3 px-1 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'address'
                    ? 'border-violet-500 text-violet-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <MapPin className="h-4 w-4" />
                Endereço
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('access')}
                className={`flex items-center gap-2 pb-3 px-1 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'access'
                    ? 'border-violet-500 text-violet-400'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Key className="h-4 w-4" />
                Acesso ao Sistema
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* ABA 1: Dados Profissionais */}
              {activeTab === 'personal' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-450 mb-1.5 uppercase tracking-wide">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      placeholder="Nome do professor"
                      {...register('name', { required: 'Nome é obrigatório.' })}
                      className={`w-full rounded-lg border bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-700 outline-none transition-all ${
                        errors.name ? 'border-red-500/50' : 'border-zinc-800 focus:border-violet-500/80'
                      }`}
                    />
                    {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-455 mb-1.5 uppercase tracking-wide">
                      Graduação / Faixa
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Faixa Preta 3º Dan"
                      {...register('graduation')}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-700 outline-none transition-all focus:border-violet-500/80"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-455 mb-1.5 uppercase tracking-wide">
                      Modalidades / Especialidades
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Jiu-Jitsu, Muay Thai"
                      {...register('specialties')}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-700 outline-none transition-all focus:border-violet-500/80"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-455 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" /> Telefone / Celular
                    </label>
                    <input
                      type="text"
                      placeholder="(00) 00000-0000"
                      {...register('phone')}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-700 outline-none transition-all focus:border-violet-500/80"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-455 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Data de Nascimento
                    </label>
                    <input
                      type="date"
                      {...register('birthDate')}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-150 outline-none transition-all focus:border-violet-500/80"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-455 mb-1.5 uppercase tracking-wide">
                      CPF
                    </label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      {...register('cpf')}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-700 outline-none transition-all focus:border-violet-500/80"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-455 mb-1.5 uppercase tracking-wide">
                      Status
                    </label>
                    <select
                      {...register('status')}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-300 outline-none transition-all focus:border-violet-500/80"
                    >
                      <option value="ACTIVE">Ativo</option>
                      <option value="INACTIVE">Inativo</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-455 mb-1.5 uppercase tracking-wide flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" /> Biografia / Observações
                    </label>
                    <textarea
                      placeholder="Breve currículo ou observações sobre o professor..."
                      rows={3}
                      {...register('bio')}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-700 outline-none transition-all focus:border-violet-500/80 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* ABA 2: Endereço */}
              {activeTab === 'address' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-455 mb-1.5 uppercase tracking-wide">
                      CEP (Buscar Automático)
                    </label>
                    <input
                      type="text"
                      placeholder="00000-000"
                      {...register('zipCode')}
                      onChange={handleCepLookup}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-700 outline-none transition-all focus:border-violet-500/80"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-455 mb-1.5 uppercase tracking-wide">
                      Logradouro / Rua
                    </label>
                    <input
                      type="text"
                      placeholder="Rua, avenida..."
                      {...register('street')}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-700 outline-none transition-all focus:border-violet-500/80"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-455 mb-1.5 uppercase tracking-wide">
                      Número
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 123"
                      {...register('number')}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-700 outline-none transition-all focus:border-violet-500/80"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-455 mb-1.5 uppercase tracking-wide">
                      Complemento
                    </label>
                    <input
                      type="text"
                      placeholder="Apto, Sala, etc."
                      {...register('complement')}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-700 outline-none transition-all focus:border-violet-500/80"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-455 mb-1.5 uppercase tracking-wide">
                      Bairro
                    </label>
                    <input
                      type="text"
                      placeholder="Bairro"
                      {...register('neighborhood')}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-700 outline-none transition-all focus:border-violet-500/80"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-455 mb-1.5 uppercase tracking-wide">
                      Cidade
                    </label>
                    <input
                      type="text"
                      placeholder="Cidade"
                      {...register('city')}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-700 outline-none transition-all focus:border-violet-500/80"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-455 mb-1.5 uppercase tracking-wide">
                      Estado (UF)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: SP"
                      maxLength={2}
                      {...register('state')}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-700 outline-none transition-all focus:border-violet-500/80"
                    />
                  </div>
                </div>
              )}

              {/* ABA 3: Acesso ao Sistema */}
              {activeTab === 'access' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 p-4">
                    <input
                      type="checkbox"
                      id="createUserAccess"
                      {...register('createUserAccess')}
                      disabled={!!editingTeacher?.userId}
                      className="h-4.5 w-4.5 rounded border-zinc-800 bg-zinc-900 accent-violet-600"
                    />
                    <label htmlFor="createUserAccess" className="text-sm font-medium text-zinc-200 cursor-pointer">
                      Habilitar login do Professor no portal
                    </label>
                  </div>

                  {createUserAccessVal && (
                    <div className="space-y-4 pt-2">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-455 mb-1.5 uppercase tracking-wide">
                          E-mail de Login *
                        </label>
                        <input
                          type="email"
                          placeholder="professor@email.com"
                          {...register('email')}
                          className={`w-full rounded-lg border bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-700 outline-none transition-all ${
                            errors.email ? 'border-red-500/50' : 'border-zinc-800 focus:border-violet-500/80'
                          }`}
                        />
                        {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-zinc-455 mb-1.5 uppercase tracking-wide">
                          {editingTeacher?.userId ? 'Atualizar Senha (Deixe em branco para não alterar)' : 'Senha Provisória *'}
                        </label>
                        <input
                          type="password"
                          placeholder="Mínimo 6 caracteres"
                          {...register('password')}
                          className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-700 outline-none transition-all focus:border-violet-500/80"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Botões de Ação */}
              <div className="flex justify-between items-center border-t border-zinc-800 pt-4 mt-6">
                <div>
                  {activeTab !== 'personal' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab(activeTab === 'access' ? 'address' : 'personal')}
                      className="rounded-lg border border-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 cursor-pointer"
                    >
                      Anterior
                    </button>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={closeAndReset}
                    className="rounded-lg border border-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 cursor-pointer"
                  >
                    Cancelar
                  </button>

                  {activeTab !== 'access' ? (
                    <button
                      type="button"
                      onClick={() => setActiveTab(activeTab === 'personal' ? 'address' : 'access')}
                      className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-750 cursor-pointer"
                    >
                      Próximo
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={createTeacherMutation.isPending || updateTeacherMutation.isPending}
                      className="flex items-center justify-center rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-750 disabled:opacity-50 cursor-pointer"
                    >
                      {createTeacherMutation.isPending || updateTeacherMutation.isPending
                        ? 'Salvando...'
                        : editingTeacher
                        ? 'Salvar Alterações'
                        : 'Cadastrar'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
