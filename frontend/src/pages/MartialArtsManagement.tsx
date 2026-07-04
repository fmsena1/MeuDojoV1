import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { api } from '../services/api';
import {
  Plus,
  Target,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Award,
  X,
  GripVertical,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { RefreshButton } from '../components/RefreshButton';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface Graduation {
  id: string;
  martialArtId: string;
  name: string;
  order: number;
  color: string | null;
  createdAt: string;
}

interface MartialArt {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  graduations: Graduation[];
}

interface MartialArtFormInput {
  name: string;
  description?: string | null;
}

interface GraduationFormInput {
  name: string;
  order: number;
  color?: string | null;
}

// ─── Componente Principal ────────────────────────────────────────────────────

export const MartialArtsManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  // Modalidade selecionada para gerenciar faixas (gaveta lateral)
  const [selectedMartialArt, setSelectedMartialArt] = useState<MartialArt | null>(null);

  // States de modais e erros
  const [showMaModal, setShowMaModal] = useState(false);
  const [editingMa, setEditingMa] = useState<MartialArt | null>(null);
  const [showGradModal, setShowGradModal] = useState(false);
  const [editingGrad, setEditingGrad] = useState<Graduation | null>(null);
  const [maFormError, setMaFormError] = useState<string | null>(null);
  const [gradFormError, setGradFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const isAdmin = currentUser?.role === 'ADMIN';

  // ─── Queries ─────────────────────────────────────────────────────────────

  const { data: martialArts, isLoading, isError } = useQuery<MartialArt[]>({
    queryKey: ['martial-arts'],
    queryFn: async () => (await api.get('/martial-arts')).data,
  });

  // Sincroniza a selected martial art com os dados mais atuais do cache
  const currentMa = selectedMartialArt
    ? martialArts?.find((ma) => ma.id === selectedMartialArt.id) ?? null
    : null;

  // ─── Mutations Modalidades ────────────────────────────────────────────────

  const createMaMutation = useMutation({
    mutationFn: (data: MartialArtFormInput) => api.post('/martial-arts', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['martial-arts'] });
      showFeedback('Modalidade cadastrada com sucesso!');
      closeMaModal();
    },
    onError: (err: any) => setMaFormError(err.response?.data?.message || 'Erro ao cadastrar.'),
  });

  const updateMaMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: MartialArtFormInput }) =>
      api.put(`/martial-arts/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['martial-arts'] });
      showFeedback('Modalidade atualizada com sucesso!');
      closeMaModal();
    },
    onError: (err: any) => setMaFormError(err.response?.data?.message || 'Erro ao atualizar.'),
  });

  const deleteMaMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/martial-arts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['martial-arts'] });
      setSelectedMartialArt(null);
      showFeedback('Modalidade excluída com sucesso!');
    },
    onError: (err: any) => alert(err.response?.data?.message || 'Erro ao excluir.'),
  });

  // ─── Mutations Graduações ─────────────────────────────────────────────────

  const createGradMutation = useMutation({
    mutationFn: (data: GraduationFormInput & { martialArtId: string }) =>
      api.post('/graduations', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['martial-arts'] });
      showFeedback('Faixa cadastrada com sucesso!');
      closeGradModal();
    },
    onError: (err: any) => setGradFormError(err.response?.data?.message || 'Erro ao cadastrar.'),
  });

  const updateGradMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: GraduationFormInput }) =>
      api.put(`/graduations/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['martial-arts'] });
      showFeedback('Faixa atualizada com sucesso!');
      closeGradModal();
    },
    onError: (err: any) => setGradFormError(err.response?.data?.message || 'Erro ao atualizar.'),
  });

  const deleteGradMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/graduations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['martial-arts'] });
      showFeedback('Faixa excluída com sucesso!');
    },
    onError: (err: any) => alert(err.response?.data?.message || 'Erro ao excluir.'),
  });

  // ─── Forms Modalidades ────────────────────────────────────────────────────

  const {
    register: regMa,
    handleSubmit: handleMa,
    reset: resetMa,
    setValue: setMaValue,
    formState: { errors: maErrors },
  } = useForm<MartialArtFormInput>({
    defaultValues: { name: '', description: '' },
  });

  const openCreateMaModal = () => {
    setEditingMa(null);
    setMaFormError(null);
    resetMa({ name: '', description: '' });
    setShowMaModal(true);
  };

  const openEditMaModal = (ma: MartialArt) => {
    setEditingMa(ma);
    setMaFormError(null);
    setMaValue('name', ma.name);
    setMaValue('description', ma.description || '');
    setShowMaModal(true);
  };

  const closeMaModal = () => {
    setShowMaModal(false);
    setEditingMa(null);
    setMaFormError(null);
  };

  const onMaSubmit = (data: MartialArtFormInput) => {
    if (!data.name.trim()) return;
    const payload = { name: data.name.trim(), description: data.description?.trim() || null };
    if (editingMa) {
      updateMaMutation.mutate({ id: editingMa.id, data: payload });
    } else {
      createMaMutation.mutate(payload);
    }
  };

  // ─── Forms Graduações ─────────────────────────────────────────────────────

  const {
    register: regGrad,
    handleSubmit: handleGrad,
    reset: resetGrad,
    setValue: setGradValue,
    formState: { errors: gradErrors },
  } = useForm<GraduationFormInput>({
    defaultValues: { name: '', order: 0, color: '#FFFFFF' },
  });

  const openCreateGradModal = () => {
    setEditingGrad(null);
    setGradFormError(null);
    const nextOrder = (currentMa?.graduations?.length ?? 0);
    resetGrad({ name: '', order: nextOrder, color: '#FFFFFF' });
    setShowGradModal(true);
  };

  const openEditGradModal = (grad: Graduation) => {
    setEditingGrad(grad);
    setGradFormError(null);
    setGradValue('name', grad.name);
    setGradValue('order', grad.order);
    setGradValue('color', grad.color || '#FFFFFF');
    setShowGradModal(true);
  };

  const closeGradModal = () => {
    setShowGradModal(false);
    setEditingGrad(null);
    setGradFormError(null);
  };

  const onGradSubmit = (data: GraduationFormInput) => {
    if (!currentMa) return;
    const payload = {
      name: data.name.trim(),
      order: Number(data.order),
      color: data.color || null,
    };
    if (editingGrad) {
      updateGradMutation.mutate({ id: editingGrad.id, data: payload });
    } else {
      createGradMutation.mutate({ ...payload, martialArtId: currentMa.id });
    }
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const showFeedback = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleDeleteMa = (ma: MartialArt) => {
    const gradCount = ma.graduations?.length ?? 0;
    const extra = gradCount > 0 ? ` Esta ação também excluirá as ${gradCount} faixa(s) associadas.` : '';
    if (confirm(`Excluir a modalidade "${ma.name}"?${extra}`)) {
      deleteMaMutation.mutate(ma.id);
    }
  };

  const handleDeleteGrad = (grad: Graduation) => {
    if (confirm(`Excluir a faixa "${grad.name}"?`)) {
      deleteGradMutation.mutate(grad.id);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Target className="h-6 w-6 text-violet-500" />
            Modalidades & Faixas
          </h2>
          <p className="text-zinc-400 text-sm">
            Cadastre as artes marciais praticadas na academia e defina as faixas e graduações de cada modalidade.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <RefreshButton />
          {isAdmin && (
            <button
              onClick={openCreateMaModal}
              className="flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-violet-700 active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              Nova Modalidade
            </button>
          )}
        </div>
      </div>

      {/* Feedback de Sucesso */}
      {successMsg && (
        <div className="flex items-center gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Layout Principal: Lista + Drawer */}
      <div className="flex gap-6">
        {/* ─── Seção de Modalidades ─── */}
        <div className={`flex-1 transition-all duration-300 ${currentMa ? 'max-w-sm' : 'w-full'}`}>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/10">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
            </div>
          ) : isError ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 text-sm text-red-400">
              <AlertCircle className="h-8 w-8" />
              <p>Erro ao carregar modalidades.</p>
            </div>
          ) : !martialArts || martialArts.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-zinc-800 border-dashed bg-zinc-900/5 text-center p-8">
              <Target className="h-10 w-10 text-zinc-600" />
              <h3 className="text-sm font-semibold text-zinc-300">Nenhuma modalidade cadastrada</h3>
              <p className="text-zinc-550 text-xs max-w-xs">
                Cadastre as artes marciais praticadas na sua academia para começar.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {martialArts.map((ma) => {
                const isSelected = currentMa?.id === ma.id;
                return (
                  <div
                    key={ma.id}
                    onClick={() => setSelectedMartialArt(isSelected ? null : ma)}
                    className={`group flex items-center justify-between gap-4 rounded-xl border p-4 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-violet-500/50 bg-violet-600/10 shadow-md shadow-violet-500/10'
                        : 'border-zinc-800 bg-zinc-900/20 hover:border-zinc-700 hover:bg-zinc-900/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isSelected ? 'bg-violet-600/20' : 'bg-zinc-800'}`}>
                        <Target className={`h-5 w-5 ${isSelected ? 'text-violet-400' : 'text-zinc-400'}`} />
                      </div>
                      <div className="min-w-0">
                        <p className={`font-semibold truncate ${isSelected ? 'text-violet-300' : 'text-zinc-100'}`}>
                          {ma.name}
                        </p>
                        {ma.description && (
                          <p className="text-xs text-zinc-500 truncate">{ma.description}</p>
                        )}
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {ma.graduations?.length ?? 0} faixa(s) cadastrada(s)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {/* Botões de ação visíveis no hover */}
                      {isAdmin && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => { e.stopPropagation(); openEditMaModal(ma); }}
                            className="p-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteMa(ma); }}
                            className="p-1.5 rounded-lg border border-zinc-700 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                      <ChevronRight
                        className={`h-4 w-4 transition-transform ${isSelected ? 'rotate-90 text-violet-400' : 'text-zinc-600'}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── Drawer de Graduações ─── */}
        {currentMa && (
          <div className="flex-1 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 animate-fade-in">
            {/* Header do Drawer */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-zinc-800">
              <div>
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-violet-400" />
                  Faixas: {currentMa.name}
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Defina a ordem de progressão e a cor de cada faixa.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    onClick={openCreateGradModal}
                    className="flex items-center gap-1.5 rounded-lg bg-violet-600/15 border border-violet-500/30 px-3 py-1.5 text-xs font-semibold text-violet-400 hover:bg-violet-600/25 transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Nova Faixa
                  </button>
                )}
                <button
                  onClick={() => setSelectedMartialArt(null)}
                  className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Lista de Faixas */}
            {!currentMa.graduations || currentMa.graduations.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
                <Award className="h-8 w-8 text-zinc-600" />
                <p className="text-xs text-zinc-500">
                  Nenhuma faixa cadastrada ainda. Clique em "Nova Faixa" para começar.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {currentMa.graduations.map((grad) => (
                  <div
                    key={grad.id}
                    className="group flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/50 px-4 py-3 hover:bg-zinc-800/40 transition-colors"
                  >
                    <GripVertical className="h-4 w-4 text-zinc-700" />

                    {/* Bolinha de cor */}
                    <div
                      className="h-5 w-5 rounded-full border-2 border-zinc-700 shrink-0"
                      style={{ backgroundColor: grad.color || '#6b7280' }}
                      title={grad.color || 'Sem cor'}
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-100 truncate">{grad.name}</p>
                      <p className="text-xs text-zinc-500">Ordem: {grad.order}</p>
                    </div>

                    {isAdmin && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditGradModal(grad)}
                          className="p-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteGrad(grad)}
                          className="p-1.5 rounded-lg border border-zinc-700 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Modal de Modalidade ─── */}
      {showMaModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 pt-8">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-violet-500" />
                {editingMa ? 'Editar Modalidade' : 'Nova Modalidade'}
              </h3>
              <button onClick={closeMaModal} className="text-zinc-500 hover:text-zinc-200">✕</button>
            </div>

            {maFormError && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{maFormError}</span>
              </div>
            )}

            <form onSubmit={handleMa(onMaSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-450 mb-1.5 uppercase tracking-wide">
                  Nome da Modalidade *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Jiu-Jitsu Brasileiro"
                  {...regMa('name', { required: 'Nome é obrigatório.' })}
                  className={`w-full rounded-lg border bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all ${
                    maErrors.name ? 'border-red-500/50' : 'border-zinc-800 focus:border-violet-500/80'
                  }`}
                />
                {maErrors.name && <p className="mt-1 text-xs text-red-400">{maErrors.name.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-450 mb-1.5 uppercase tracking-wide">
                  Descrição
                </label>
                <textarea
                  placeholder="Uma breve descrição da modalidade..."
                  rows={3}
                  {...regMa('description')}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:border-violet-500/80 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4">
                <button
                  type="button"
                  onClick={closeMaModal}
                  className="rounded-lg border border-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createMaMutation.isPending || updateMaMutation.isPending}
                  className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50 transition-colors"
                >
                  {createMaMutation.isPending || updateMaMutation.isPending ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Modal de Graduação ─── */}
      {showGradModal && currentMa && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm p-4 pt-8">
          <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Award className="h-5 w-5 text-violet-500" />
                {editingGrad ? 'Editar Faixa' : 'Nova Faixa'}
              </h3>
              <button onClick={closeGradModal} className="text-zinc-500 hover:text-zinc-200">✕</button>
            </div>

            <p className="text-xs text-zinc-500 mb-4">
              Modalidade: <span className="text-violet-400 font-semibold">{currentMa.name}</span>
            </p>

            {gradFormError && (
              <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{gradFormError}</span>
              </div>
            )}

            <form onSubmit={handleGrad(onGradSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-450 mb-1.5 uppercase tracking-wide">
                  Nome da Faixa *
                </label>
                <input
                  type="text"
                  placeholder="Ex: Faixa Branca"
                  {...regGrad('name', { required: 'Nome da faixa é obrigatório.' })}
                  className={`w-full rounded-lg border bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all ${
                    gradErrors.name ? 'border-red-500/50' : 'border-zinc-800 focus:border-violet-500/80'
                  }`}
                />
                {gradErrors.name && <p className="mt-1 text-xs text-red-400">{gradErrors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-450 mb-1.5 uppercase tracking-wide">
                    Ordem de Progressão
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    {...regGrad('order', { valueAsNumber: true })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:border-violet-500/80"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-450 mb-1.5 uppercase tracking-wide">
                    Cor da Faixa
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      {...regGrad('color')}
                      className="h-9 w-14 rounded-lg border border-zinc-800 bg-zinc-950 cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder="#FFFFFF"
                      {...regGrad('color')}
                      className="flex-1 rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:border-violet-500/80"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4">
                <button
                  type="button"
                  onClick={closeGradModal}
                  className="rounded-lg border border-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300 hover:bg-zinc-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createGradMutation.isPending || updateGradMutation.isPending}
                  className="rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50 transition-colors"
                >
                  {createGradMutation.isPending || updateGradMutation.isPending ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
