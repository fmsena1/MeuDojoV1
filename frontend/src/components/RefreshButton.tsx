import React from 'react';
import { useQueryClient, useIsFetching } from '@tanstack/react-query';
import { RotateCw } from 'lucide-react';

export const RefreshButton: React.FC = () => {
  const queryClient = useQueryClient();
  const isFetching = useIsFetching();

  const handleRefresh = () => {
    queryClient.invalidateQueries();
  };

  return (
    <button
      type="button"
      onClick={handleRefresh}
      disabled={isFetching > 0}
      className="flex items-center justify-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950/40 px-3.5 py-2.5 text-xs font-semibold text-zinc-400 hover:text-white hover:border-zinc-700 transition-all active:scale-[0.97] cursor-pointer disabled:opacity-60 shrink-0"
      title="Atualizar dados do servidor"
    >
      <RotateCw className={`h-3.5 w-3.5 ${isFetching > 0 ? 'animate-spin text-violet-400' : ''}`} />
      <span>{isFetching > 0 ? 'Atualizando...' : 'Atualizar'}</span>
    </button>
  );
};
