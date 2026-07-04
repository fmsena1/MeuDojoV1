import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicRoute, ProtectedRoute } from '../components/routes/RouteGuard';
import { AuthLayout } from '../components/layouts/AuthLayout';
import { DashboardLayout } from '../components/layouts/DashboardLayout';
import { Login } from '../pages/Login';
import { RegisterTenant } from '../pages/RegisterTenant';
import { Dashboard } from '../pages/Dashboard';
import { UsersManagement } from '../pages/UsersManagement';
import { StudentsManagement } from '../pages/StudentsManagement';
import { TeachersManagement } from '../pages/TeachersManagement';
import { MartialArtsManagement } from '../pages/MartialArtsManagement';
import { ClassesManagement } from '../pages/ClassesManagement';
import { AttendanceManagement } from '../pages/AttendanceManagement';
import { FinancialManagement } from '../pages/FinancialManagement';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro-academia" element={<RegisterTenant />} />
        </Route>
      </Route>

      {/* Rotas Privadas (Área Logada) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/alunos" element={<StudentsManagement />} />
          <Route path="/professores" element={<TeachersManagement />} />
          <Route path="/modalidades" element={<MartialArtsManagement />} />
          <Route path="/turmas" element={<ClassesManagement />} />
          <Route path="/presenca" element={<AttendanceManagement />} />
          <Route path="/financeiro" element={<FinancialManagement />} />
          <Route path="/usuarios" element={<UsersManagement />} />
        </Route>
      </Route>

      {/* Redirecionamento Padrão */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
