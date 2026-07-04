import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { api } from '../services/api';
import { Plus, Users, UserPlus, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { RefreshButton } from '../components/RefreshButton';

// Schema para criação de usuário interno
const userFormSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Insira um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['ADMIN', 'TEACHER', 'RECEPTIONIST', 'STUDENT'], {
    message: 'Selecione um cargo válido',
  }),
});

type UserFormData = z.infer<typeof userFormSchema>;

interface InternalUser {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export const UsersManagement: React.FC = () => {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Fetch dos usuários do Tenant
  const { data: users, isLoading, isError } = useQuery<InternalUser[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/users');
      return response.data;
    },
  });

  // Mutation para registrar novo usuário
  const createUserMutation = useMutation({
    mutationFn: async (newUser: UserFormData) => {
      const response = await api.post('/users', newUser);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setSuccessMsg('Membro cadastrado com sucesso!');
      setTimeout(() => setSuccessMsg(null), 3000);
      setShowModal(false);
      reset();
    },
    onError: (err: any) => {
      setFormError(
        err.response?.data?.message || 
        'Ocorreu um erro ao criar o usuário. Tente novamente.'
      );
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      role: 'STUDENT',
    },
  });

  const onSubmit = (data: UserFormData) => {
    setFormError(null);
    createUserMutation.mutate(data);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'text-violet-400 bg-violet-500/10 border-violet-500/25';
      case 'TEACHER':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25';
      case 'RECEPTIONIST':
        return 'text-sky-400 bg-sky-500/10 border-sky-500/25';
      default:
        return 'text-zinc-400 bg-zinc-800/60 border-zinc-700/50';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrador';
      case 'TEACHER':
        return 'Professor / Sansei';
      case 'RECEPTIONIST':
        return 'Recepcionista';
      case 'STUDENT':
        return 'Aluno';
      default:
        return role;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-violet-500" />
            Gestão de Membros
          </h2>
          <p className="text-zinc-400 text-sm">
            Adicione e gerencie os administradores, professores, recepcionistas e alunos de sua academia.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <RefreshButton />
          <button
            onClick={() => {
              setFormError(null);
              setShowModal(true);
            }}
            className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Novo Membro
          </button>
        </div>
      </div>

      {/* Alerts */}
      {successMsg && (
        <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Users List / Table */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-850 bg-zinc-900/10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent"></div>
        </div>
      ) : isError ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 text-center text-sm text-red-400">
          <AlertCircle className="h-8 w-8 shrink-0" />
          <p>Erro ao carregar a lista de membros.</p>
        </div>
      ) : !users || users.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-zinc-800 border-dashed bg-zinc-900/5 text-center p-8">
          <UserPlus className="h-10 w-10 text-zinc-600" />
          <h3 className="text-sm font-semibold text-zinc-300">Nenhum membro cadastrado</h3>
          <p className="text-zinc-500 text-xs max-w-sm">
            Clique no botão "Novo Membro" acima para registrar o primeiro professor ou aluno da sua academia.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/20 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-zinc-900/40 text-zinc-400 font-semibold uppercase tracking-wider text-xs border-b border-zinc-800">
                <tr>
                  <th className="px-6 py-4">Nome</th>
                  <th className="px-6 py-4">E-mail</th>
                  <th className="px-6 py-4">Cargo</th>
                  <th className="px-6 py-4">Cadastrado em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {users.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-900/45 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                    <td className="px-6 py-4 text-zinc-300">{item.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${getRoleBadgeColor(item.role)}`}>
                        {getRoleLabel(item.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-zinc-400">
                      {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Cadastro de Usuário */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white">Adicionar Novo Membro</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wide">
                  Nome Completo
                </label>
                <input
                  type="text"
                  placeholder="Ex: João da Silva"
                  {...register('name')}
                  className={`w-full rounded-lg border bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-650 outline-none transition-all duration-200 focus:border-violet-500/80 ${
                    errors.name ? 'border-red-500/50' : 'border-zinc-800'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wide">
                  E-mail
                </label>
                <input
                  type="email"
                  placeholder="membro@exemplo.com"
                  {...register('email')}
                  className={`w-full rounded-lg border bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-650 outline-none transition-all duration-200 focus:border-violet-500/80 ${
                    errors.email ? 'border-red-500/50' : 'border-zinc-800'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wide">
                  Senha Provisória
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 6 caracteres"
                    {...register('password')}
                    className={`w-full rounded-lg border bg-zinc-950 px-3.5 py-2 pr-10 text-sm text-zinc-100 placeholder-zinc-655 outline-none transition-all duration-200 focus:border-violet-500/80 ${
                      errors.password ? 'border-red-500/50' : 'border-zinc-800'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-zinc-500 hover:text-zinc-300"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wide">
                  Cargo / Perfil
                </label>
                <select
                  {...register('role')}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-300 outline-none transition-all duration-200 focus:border-violet-500/80"
                >
                  <option value="STUDENT">Aluno</option>
                  <option value="TEACHER">Professor / Sansei</option>
                  <option value="RECEPTIONIST">Recepcionista</option>
                  <option value="ADMIN">Administrador</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-xs text-red-400">{errors.role.message}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-zinc-850 px-4 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:bg-zinc-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createUserMutation.isPending}
                  className="flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
                >
                  {createUserMutation.isPending ? 'Salvando...' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
