import React from 'react';
import { RefreshCw, Plus } from 'lucide-react';
import { Tablet, Placa, Project } from '../../types';

interface LogisticaTabProps {
  tablets: Tablet[];
  setTablets: React.Dispatch<React.SetStateAction<Tablet[]>>;
  placas: Placa[];
  setPlacas: React.Dispatch<React.SetStateAction<Placa[]>>;
  projects: Project[];
  triggerToast: (msg: string, type?: any) => void;
}

export default function LogisticaTab({
  tablets,
  setTablets,
  placas,
  setPlacas,
  projects,
  triggerToast
}: LogisticaTabProps) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-sm font-bold uppercase tracking-wider font-sans">Logística de Canteiro, Tablets de Obra e Placas Técnicas</h2>
          <p className="text-xs text-slate-300">Acompanhamento e distribuição de hardware corporativo e licenças físicas nos terrenos industriais ativos.</p>
        </div>
        <button
          onClick={() => triggerToast('Sincronizando logs de rede com os tablets ativos...', 'info')}
          className="px-5 py-2.5 bg-white text-slate-950 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-2 cursor-pointer shadow whitespace-nowrap"
        >
          <RefreshCw className="w-4 h-4" /> Sincronizar Tudo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tablets */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              📱 Inventário de Tablets Corporativos em Canteiro
            </h3>
            <span className="text-[10px] font-mono bg-slate-900 text-white px-2.5 py-0.5 rounded-full font-bold">QTD: {tablets.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[400px] border border-slate-200/60">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 uppercase font-mono text-[9px] border-b border-slate-100">
                  <th className="p-2.5 px-3 border-r border-slate-200/60">ID Tablet</th>
                  <th className="p-2.5 px-3 border-r border-slate-200/60">Responsável</th>
                  <th className="p-2.5 px-3 border-r border-slate-200/60">Obra Associada</th>
                  <th className="p-2.5 px-3 border-r border-slate-200/60 text-center">Estado</th>
                  <th className="p-2.5 px-3 text-right">Sincronização</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px] text-slate-750">
                {tablets.map(tab => (
                  <tr key={tab.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-1 px-3 border-r border-slate-200/60 font-mono font-bold text-slate-800">{tab.id}</td>
                    <td className="p-1 px-3 border-r border-slate-200/60">
                      <input
                        type="text"
                        value={tab.tecnico}
                        onChange={(e) => {
                          const updated = tablets.map(t => t.id === tab.id ? { ...t, tecnico: e.target.value } : t);
                          setTablets(updated);
                        }}
                        className="bg-transparent border-none focus:bg-slate-50 p-1 rounded font-semibold w-full text-[11px] focus:outline-none text-slate-800"
                      />
                    </td>
                    <td className="p-1 px-3 border-r border-slate-200/60">
                      <select
                        value={tab.project}
                        onChange={(e) => {
                          const updated = tablets.map(t => t.id === tab.id ? { ...t, project: e.target.value } : t);
                          setTablets(updated);
                          triggerToast(`Dispositivo associado ao projeto: ${e.target.value}`, 'info');
                        }}
                        className="bg-transparent border-none p-1 rounded cursor-pointer w-full text-[11px] font-semibold focus:ring-0 focus:bg-slate-50 focus:outline-none text-slate-700"
                      >
                        <option value="Nenhum">Nenhum</option>
                        {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                      </select>
                    </td>
                    <td className="p-1 px-3 border-r border-slate-200/60 text-center">
                      <select
                        value={tab.status}
                        onChange={(e) => {
                          const updated = tablets.map(t => t.id === tab.id ? { ...t, status: e.target.value as any } : t);
                          setTablets(updated);
                          triggerToast('Dispositivo modificado!', 'info');
                        }}
                        className={`p-1 rounded font-bold text-[9px] cursor-pointer border text-center bg-transparent focus:outline-none ${
                          tab.status === 'Em Obra'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : tab.status === 'Em Stock'
                              ? 'bg-slate-100 text-slate-600 border-slate-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="Em Obra">🏗️ Em Obra</option>
                        <option value="Em Stock">📦 Em Stock</option>
                        <option value="Manutenção">🔧 Manutenção</option>
                      </select>
                    </td>
                    <td className="p-1 px-3 text-right font-mono text-[10px] text-slate-400">{tab.lastSync}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Placas */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
              🗺️ Placas de Identificação Física de Obra
            </h3>
            <button
              onClick={() => {
                const newPlaca: Placa = {
                  id: 'PLC-' + (placas.length + 1).toString().padStart(3, '0'),
                  client: 'Novo Promotor',
                  local: 'Endereço da Obra',
                  carrier: 'Estúdio Frota',
                  status: 'Pendente',
                  updated: '2026-07-13'
                };
                setPlacas(prev => [...prev, newPlaca]);
                triggerToast('Nova guia de expedição de placa criada!', 'success');
              }}
              className="px-3 py-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors text-[10px] font-bold uppercase flex items-center gap-1.5 text-slate-600"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar Placa
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[400px] border border-slate-200/60">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 uppercase font-mono text-[9px] border-b border-slate-100">
                  <th className="p-2.5 px-3 border-r border-slate-200/60">ID Placa</th>
                  <th className="p-2.5 px-3 border-r border-slate-200/60">Cliente Promotor</th>
                  <th className="p-2.5 px-3 border-r border-slate-200/60">Localização</th>
                  <th className="p-2.5 px-3 border-r border-slate-200/60 font-mono">Expedição</th>
                  <th className="p-2.5 px-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px] text-slate-750">
                {placas.map(plk => (
                  <tr key={plk.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="p-1 px-3 border-r border-slate-200/60 font-mono font-bold text-slate-800">{plk.id}</td>
                    <td className="p-1 px-3 border-r border-slate-200/60">
                      <input
                        type="text"
                        value={plk.client}
                        onChange={(e) => {
                          const updated = placas.map(p => p.id === plk.id ? { ...p, client: e.target.value } : p);
                          setPlacas(updated);
                        }}
                        className="bg-transparent border-none focus:bg-slate-50 p-1 rounded font-semibold w-full text-[11px] focus:outline-none text-slate-800"
                      />
                    </td>
                    <td className="p-1 px-3 border-r border-slate-200/60">
                      <input
                        type="text"
                        value={plk.local}
                        onChange={(e) => {
                          const updated = placas.map(p => p.id === plk.id ? { ...p, local: e.target.value } : p);
                          setPlacas(updated);
                        }}
                        className="bg-transparent border-none focus:bg-slate-50 p-1 rounded w-full text-[11px] text-slate-650 focus:outline-none"
                      />
                    </td>
                    <td className="p-1 px-3 border-r border-slate-200/60 font-mono text-[10px] text-slate-400">{plk.carrier}</td>
                    <td className="p-1 px-3 text-center">
                      <select
                        value={plk.status}
                        onChange={(e) => {
                          const updated = placas.map(p => p.id === plk.id ? { ...p, status: e.target.value as any } : p);
                          setPlacas(updated);
                          triggerToast('Guia de expedição de placa atualizada!', 'success');
                        }}
                        className={`p-1 rounded font-bold text-[9px] cursor-pointer border text-center bg-transparent focus:outline-none ${
                          plk.status === 'Instalada'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : plk.status === 'Em Transporte'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        <option value="Instalada">✅ Instalada</option>
                        <option value="Em Transporte">🚚 Em Transporte</option>
                        <option value="Pendente">⏳ Pendente</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
