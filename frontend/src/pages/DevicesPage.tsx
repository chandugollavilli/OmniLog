import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { Device } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Modal } from '../components/common/Modal';
import { Shield, Plus, Server, Cpu, MapPin, CheckCircle, Trash2, Edit } from 'lucide-react';

export const DevicesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: 'HQ-FortiGate-60F',
    serialNumber: 'FGT60FTK20001234',
    ipAddress: '192.168.1.1',
    model: 'FortiGate 60F',
    firmwareVersion: 'v7.4.2',
    vdom: 'root',
    location: 'Headquarters Data Center',
  });

  const queryClient = useQueryClient();

  const { data: devices, isLoading } = useQuery<Device[]>({
    queryKey: ['devices'],
    queryFn: async () => {
      const res = await api.get('/devices');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newDevice: typeof formData) => {
      await api.post('/devices', newDevice);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      setIsModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/devices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">FortiGate Firewall Devices</h1>
          <p className="text-xs text-slate-400 mt-1">Managed FortiGate inventory and Syslog forwarding nodes</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs rounded-lg shadow-md transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add FortiGate Device</span>
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner size="lg" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices?.length === 0 ? (
            <div className="col-span-full p-8 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-xl">
              No FortiGate firewalls registered yet. Click "Add FortiGate Device" above.
            </div>
          ) : (
            devices?.map((dev) => (
              <div key={dev.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 hover:border-slate-700 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-lg">
                      <Server className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{dev.name}</h3>
                      <p className="text-xs text-slate-400 font-mono">{dev.ipAddress}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle className="w-3 h-3" /> ONLINE
                  </span>
                </div>

                <div className="text-xs space-y-1.5 pt-2 border-t border-slate-800 text-slate-300">
                  <p className="flex justify-between"><span className="text-slate-500">Model:</span> <span className="font-semibold">{dev.model}</span></p>
                  <p className="flex justify-between"><span className="text-slate-500">Serial:</span> <span className="font-mono">{dev.serialNumber}</span></p>
                  <p className="flex justify-between"><span className="text-slate-500">Firmware:</span> <span className="text-brand-400 font-mono">{dev.firmwareVersion}</span></p>
                  <p className="flex justify-between"><span className="text-slate-500">Location:</span> <span>{dev.location || 'N/A'}</span></p>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-800">
                  <button
                    onClick={() => deleteMutation.mutate(dev.id)}
                    className="p-1.5 rounded-md text-red-400 hover:bg-red-500/10 transition-colors text-xs flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Device Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register FortiGate Firewall">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createMutation.mutate(formData);
          }}
          className="space-y-4 text-xs"
        >
          <div>
            <label className="block font-semibold text-slate-400 mb-1">Device Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-400 mb-1">Serial Number</label>
              <input
                type="text"
                value={formData.serialNumber}
                onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-400 mb-1">IP Address</label>
              <input
                type="text"
                value={formData.ipAddress}
                onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-400 mb-1">Model</label>
              <input
                type="text"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-400 mb-1">Firmware Version</label>
              <input
                type="text"
                value={formData.firmwareVersion}
                onChange={(e) => setFormData({ ...formData, firmwareVersion: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-400 mb-1">Location / Data Center</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-brand-600 hover:bg-brand-500 font-semibold text-white rounded-lg transition-colors mt-2"
          >
            Save Firewall Device
          </button>
        </form>
      </Modal>
    </div>
  );
};
