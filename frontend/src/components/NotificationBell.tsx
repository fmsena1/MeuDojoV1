import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Bell, Check, Info, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  content: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  isRead: boolean;
  createdAt: string;
}

export const NotificationBell: React.FC = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown ao clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Query para buscar notificações
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => (await api.get('/notifications')).data,
    refetchInterval: 30000, // Atualiza a cada 30 segundos
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Mutation para marcar uma como lida
  const readMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  // Mutation para marcar todas como lidas
  const readAllMutation = useMutation({
    mutationFn: () => api.patch('/notifications/read-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const handleNotificationClick = (id: string, isRead: boolean) => {
    if (!isRead) {
      readMutation.mutate(id);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ALERT':
        return <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />;
      case 'WARNING':
        return <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />;
      case 'SUCCESS':
        return <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />;
      default:
        return <Info className="h-4 w-4 text-sky-400 shrink-0" />;
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Botão do Sino */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-all duration-200 cursor-pointer"
        aria-label="Notificações"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-zinc-950">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown de Notificações */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-xl border border-zinc-800 bg-zinc-900/95 backdrop-blur-md p-1 shadow-2xl ring-1 ring-black/5 z-50">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
            <span className="text-sm font-bold text-white">Notificações</span>
            {unreadCount > 0 && (
              <button
                onClick={() => readAllMutation.mutate()}
                className="flex items-center gap-1 text-[11px] font-bold text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
                Marcar todas como lidas
              </button>
            )}
          </div>

          {/* Body List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-zinc-800/40">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <Bell className="h-8 w-8 text-zinc-650 mb-2 shrink-0" />
                <span className="text-xs font-semibold text-zinc-400">Nenhuma notificação por aqui</span>
                <span className="text-[10px] text-zinc-550 mt-0.5">Tudo limpo no momento!</span>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id, notification.isRead)}
                  className={`flex gap-3 p-4 transition-all duration-150 cursor-pointer ${
                    notification.isRead 
                      ? 'hover:bg-zinc-800/20' 
                      : 'bg-violet-500/5 hover:bg-violet-500/10 border-l-2 border-violet-500'
                  }`}
                >
                  {/* Icon */}
                  <div className="mt-0.5">
                    {getTypeIcon(notification.type)}
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className={`text-xs font-semibold truncate ${notification.isRead ? 'text-zinc-300' : 'text-white'}`}>
                        {notification.title}
                      </span>
                      <span className="text-[9px] text-zinc-500 whitespace-nowrap">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-relaxed mt-1 break-words ${notification.isRead ? 'text-zinc-500' : 'text-zinc-300'}`}>
                      {notification.content}
                    </p>
                  </div>

                  {/* Unread circle */}
                  {!notification.isRead && (
                    <span className="h-2 w-2 rounded-full bg-violet-500 shrink-0 self-center" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
