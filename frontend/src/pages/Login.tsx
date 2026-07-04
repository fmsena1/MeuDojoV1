import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const loginFormSchema = z.object({
  email: z.string().email('Insira um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setApiError(null);
      await login(data);
      navigate('/', { replace: true });
    } catch (err: any) {
      console.error(err);
      setApiError(
        err.response?.data?.message || 
        'Erro ao tentar fazer login. Verifique suas credenciais.'
      );
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-zinc-100 text-center mb-6">Acesse sua conta</h2>

      {apiError && (
        <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-400">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wide">
            E-mail
          </label>
          <input
            type="email"
            placeholder="seuemail@exemplo.com"
            {...register('email')}
            className={`w-full rounded-lg border bg-zinc-950 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all duration-200 focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/30 ${
              errors.email ? 'border-red-500/50' : 'border-zinc-800'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wide">
            Senha
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password')}
              className={`w-full rounded-lg border bg-zinc-950 px-3.5 py-2.5 pr-10 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition-all duration-200 focus:border-violet-500/80 focus:ring-1 focus:ring-violet-500/30 ${
                errors.password ? 'border-red-500/50' : 'border-zinc-800'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-3 text-zinc-500 hover:text-zinc-300"
            >
              {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-600 py-3 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          {isSubmitting ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : (
            'Entrar'
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-zinc-400">
        Não tem uma conta cadastrada?{' '}
        <Link to="/cadastro-academia" className="font-semibold text-violet-400 hover:text-violet-300">
          Cadastre sua academia
        </Link>
      </div>
    </div>
  );
};
