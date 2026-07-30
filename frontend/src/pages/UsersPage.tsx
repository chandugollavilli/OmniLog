import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { User, RoleName } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Modal } from '../components/common/Modal';
import { Users, Plus, Shield, UserCheck, Trash2 } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    role: 'SOC_ANALYST' as RoleName,
  });

  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/users');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (user: typeof formData) => {
      await api.post('/users', user);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">User Accounts & RBAC Matrix</h1>
          <p className="text-xs text-slate-400 mt-1">Manage SOC Analysts, Auditors, and System Administrators</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-lg shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create User Account</span>
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-850 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {users?.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold text-white">{u.username}</td>
                  <td className="py-3 px-4 text-slate-300 font-mono">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-emerald-400 font-semibold">Active</span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono">
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : 'Never'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => deleteMutation.mutate(u.id)}
                      className="p-1.5 rounded-md text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create System User Account">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate(formData);
          }}
          className="space-y-4 text-xs"
        >
          <div>
            <label className="block font-semibold text-slate-400 mb-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-400 mb-1">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-400 mb-1">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              placeholder="Min 8 chars, 1 uppercase, 1 special char"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-400 mb-1">Role Permission Level</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as RoleName })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
            >
              <option value="ADMINISTRATOR">Administrator (Full Access)</option>
              <option value="SOC_ANALYST">SOC Analyst (Alerts & Reports)</option>
              <option value="AUDITOR">Auditor (Compliance Read-Only)</option>
              <option value="VIEWER">Viewer (Dashboard Only)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 font-semibold text-white rounded-lg transition-colors mt-2"
          >
            Create User
          </button>
        </form>
      </Modal>
    </div>
  );
};
