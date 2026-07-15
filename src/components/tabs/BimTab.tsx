import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import { RevitTemplateRequirement } from '../../types';
import { ARCHITECTS } from '../../constants';

interface BimTabProps {
  userRole: 'admin' | 'arquiteto' | 'estagiario';
  revitRequirements: RevitTemplateRequirement[];
  setRevitRequirements: React.Dispatch<React.SetStateAction<RevitTemplateRequirement[]>>;
  triggerToast: (msg: string, type?: any) => void;
}

export default function BimTab({
  userRole,
  revitRequirements,
  setRevitRequirements,
  triggerToast
}: BimTabProps) {
  // Revit Template States
  const [revitSearch, setRevitSearch] = useState('');
  const [revitSortBy, setRevitSortBy] = useState<'dateAdded' | 'priority' | 'status' | 'title' | 'architect'>('dateAdded');
  const [revitSortOrder, setRevitSortOrder] = useState<'asc' | 'desc'>('desc');
  const [revitStatusFilter, setRevitStatusFilter] = useState<'Todas' | 'Pendente' | 'Em Estudo' | 'Implementado'>('Todas');
  const [revitPriorityFilter, setRevitPriorityFilter] = useState<'Todas' | 'Alta' | 'Média' | 'Baixa'>('Todas');
  const [showAddRevitReq, setShowAddRevitReq] = useState(false);
  const [newRevitReqTitle, setNewRevitReqTitle] = useState('');
  const [newRevitReqPriority, setNewRevitReqPriority] = useState<'Alta' | 'Média' | 'Baixa'>('Alta');
  const [newRevitReqArchitectId, setNewRevitReqArchitectId] = useState('pedro');
  const [newRevitReqNotes, setNewRevitReqNotes] = useState('');

  // Revit list handling
  const filteredRequirements = (revitRequirements || []).filter(req => {
    const matchesSearch = 
      req.title.toLowerCase().includes(revitSearch.toLowerCase()) ||
      req.notes.toLowerCase().includes(revitSearch.toLowerCase());

    const matchesStatus = 
      revitStatusFilter === 'Todas' || 
      req.status === revitStatusFilter;

    const matchesPriority = 
      revitPriorityFilter === 'Todas' || 
      req.priority === revitPriorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const sortedRequirements = [...filteredRequirements].sort((a, b) => {
    let compareValue = 0;

    if (revitSortBy === 'dateAdded') {
      compareValue = a.dateAdded.localeCompare(b.dateAdded);
    } else if (revitSortBy === 'title') {
      compareValue = a.title.localeCompare(b.title);
    } else if (revitSortBy === 'architect') {
      const nameA = ARCHITECTS.find(arc => arc.id === a.architectId)?.name || a.architectId;
      const nameB = ARCHITECTS.find(arc => arc.id === b.architectId)?.name || b.architectId;
      compareValue = nameA.localeCompare(nameB);
    } else if (revitSortBy === 'priority') {
      const priorityWeights = { 'Alta': 3, 'Média': 2, 'Baixa': 1 };
      compareValue = priorityWeights[a.priority] - priorityWeights[b.priority];
    } else if (revitSortBy === 'status') {
      const statusWeights = { 'Pendente': 1, 'Em Estudo': 2, 'Implementado': 3 };
      compareValue = statusWeights[a.status] - statusWeights[b.status];
    }

    return revitSortOrder === 'asc' ? compareValue : -compareValue;
  });

  const handleAddRevitRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRevitReqTitle.trim()) {
      triggerToast('Por favor, informe o que adicionar no template!', 'warning');
      return;
    }

    const newReq: RevitTemplateRequirement = {
      id: 'req-' + Date.now().toString(36),
      title: newRevitReqTitle,
      priority: newRevitReqPriority,
      architectId: newRevitReqArchitectId,
      dateAdded: new Date().toISOString().split('T')[0],
      status: 'Pendente',
      notes: newRevitReqNotes
    };

    setRevitRequirements(prev => [newReq, ...prev]);
    setNewRevitReqTitle('');
    setNewRevitReqNotes('');
    setShowAddRevitReq(false);
    triggerToast('Requisito adicionado ao padrão Revit!', 'success');
  };

  const handleUpdateRevitReq = (id: string, fields: Partial<RevitTemplateRequirement>) => {
    setRevitRequirements(prev => prev.map(req => req.id === id ? { ...req, ...fields } : req));
  };

  const handleDeleteRevitReq = (id: string) => {
    setRevitRequirements(prev => prev.filter(req => req.id !== id));
    triggerToast('Requisito removido com sucesso!', 'info');
  };

  const handleToggleSort = (field: 'dateAdded' | 'priority' | 'status' | 'title' | 'architect') => {
    if (revitSortBy === field) {
      setRevitSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setRevitSortBy(field);
      setRevitSortOrder('desc');
    }
  };

  const totalCount = (revitRequirements || []).length;
  const pendingCount = (revitRequirements || []).filter(r => r.status === 'Pendente').length;
  const studyCount = (revitRequirements || []).filter(r => r.status === 'Em Estudo').length;
  const completedCount = (revitRequirements || []).filter(r => r.status === 'Implementado').length;

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Top Info Stat Widgets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 uppercase font-bold font-mono">Total de Requisitos</span>
          <span className="text-2xl font-bold text-slate-800">{totalCount}</span>
        </div>
        <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] text-red-600/80 uppercase font-bold font-mono">Pendente</span>
          <span className="text-2xl font-bold text-red-700">{pendingCount}</span>
        </div>
        <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] text-amber-700/80 uppercase font-bold font-mono">Em Estudo</span>
          <span className="text-2xl font-bold text-amber-800">{studyCount}</span>
        </div>
        <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] text-emerald-600/80 uppercase font-bold font-mono">Implementado</span>
          <span className="text-2xl font-bold text-emerald-700">{completedCount}</span>
        </div>
      </div>

      {/* Module Header and Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-sm text-slate-800">
              Melhorias para Padrão e Template Revit
            </h2>
            <p className="text-xs text-slate-400 mt-1">Sugira elementos, famílias ou padrões que precisam ser incorporados ou revisados no template oficial.</p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddRevitReq(!showAddRevitReq)}
            className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Sugerir Melhoria
          </button>
        </div>

        {/* Collapsible New Requirement Form */}
        {showAddRevitReq && (
          <form onSubmit={handleAddRevitRequirement} className="bg-slate-50 border border-slate-200/60 p-5 rounded-xl space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">Nova Sugestão de Padrão</h3>
              <button type="button" onClick={() => setShowAddRevitReq(false)} className="text-xs text-slate-400 hover:text-slate-600 font-semibold">Cancelar</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">O que adicionar / modificar no template *</label>
                <input
                  type="text"
                  required
                  value={newRevitReqTitle}
                  onChange={e => setNewRevitReqTitle(e.target.value)}
                  placeholder="Ex: Família de portas pivotantes com marcos dinâmicos..."
                  className="w-full bg-white border border-slate-200/60 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-800 font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Prioridade</label>
                <select
                  value={newRevitReqPriority}
                  onChange={e => setNewRevitReqPriority(e.target.value as any)}
                  className="w-full bg-white border border-slate-200/60 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer text-slate-700 font-sans"
                >
                  <option value="Alta">Alta</option>
                  <option value="Média">Média</option>
                  <option value="Baixa">Baixa</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Solicitante (Arquiteto)</label>
                <select
                  value={newRevitReqArchitectId}
                  onChange={e => setNewRevitReqArchitectId(e.target.value)}
                  className="w-full bg-white border border-slate-200/60 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer text-slate-700 font-sans"
                >
                  {ARCHITECTS.map(arc => (
                    <option key={arc.id} value={arc.id}>{arc.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Observações / Detalhes</label>
                <input
                  type="text"
                  value={newRevitReqNotes}
                  onChange={e => setNewRevitReqNotes(e.target.value)}
                  placeholder="Ex: Referência catálogo fabricante..."
                  className="w-full bg-white border border-slate-200/60 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-800 font-sans"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer shadow-md"
              >
                Salvar Sugestão
              </button>
            </div>
          </form>
        )}

        {/* Filter and Sorting strip */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pt-2">
          <div className="relative w-full lg:w-72">
            <input
              type="text"
              value={revitSearch}
              onChange={e => setRevitSearch(e.target.value)}
              placeholder="Pesquisar requisitos..."
              className="w-full bg-slate-50 border border-slate-200/60 p-2.5 pl-3 rounded-2xl text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white text-slate-800"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-sans">Estado:</span>
              <div className="flex gap-1">
                {['Todas', 'Pendente', 'Em Estudo', 'Implementado'].map(st => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setRevitStatusFilter(st as any)}
                    className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold uppercase cursor-pointer transition-all border ${
                      revitStatusFilter === st
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-sans">Prioridade:</span>
              <div className="flex gap-1">
                {['Todas', 'Alta', 'Média', 'Baixa'].map(pr => (
                  <button
                    key={pr}
                    type="button"
                    onClick={() => setRevitPriorityFilter(pr as any)}
                    className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold uppercase cursor-pointer transition-all border ${
                      revitPriorityFilter === pr
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {pr}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Revit improvements list table */}
        {sortedRequirements.length === 0 ? (
          <div className="p-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
            Nenhum requisito de template Revit encontrado correspondente aos filtros.
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200/60 rounded-2xl shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 uppercase font-mono text-[9px] border-b border-slate-100">
                  <th 
                    onClick={() => handleToggleSort('title')}
                    className="p-2.5 px-3 border-r border-slate-100 font-bold cursor-pointer hover:bg-slate-100 select-none transition-colors"
                  >
                    O que adicionar no Template Revit {revitSortBy === 'title' && (revitSortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    onClick={() => handleToggleSort('architect')}
                    className="p-2.5 px-3 border-r border-slate-100 font-bold cursor-pointer hover:bg-slate-100 select-none transition-colors w-[150px]"
                  >
                    Solicitante {revitSortBy === 'architect' && (revitSortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    onClick={() => handleToggleSort('dateAdded')}
                    className="p-2.5 px-3 border-r border-slate-100 font-bold cursor-pointer hover:bg-slate-100 select-none transition-colors w-[130px] text-center"
                  >
                    Data Adição {revitSortBy === 'dateAdded' && (revitSortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    onClick={() => handleToggleSort('priority')}
                    className="p-2.5 px-3 border-r border-slate-100 font-bold cursor-pointer hover:bg-slate-100 select-none transition-colors w-[120px] text-center"
                  >
                    Prioridade {revitSortBy === 'priority' && (revitSortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th 
                    onClick={() => handleToggleSort('status')}
                    className="p-2.5 px-3 border-r border-slate-100 font-bold cursor-pointer hover:bg-slate-100 select-none transition-colors w-[140px] text-center"
                  >
                    Estado {revitSortBy === 'status' && (revitSortOrder === 'asc' ? '↑' : '↓')}
                  </th>
                  <th className="p-2.5 px-3 border-r border-slate-100 font-bold">Observações / Detalhes Adicionais</th>
                  <th className="p-2.5 px-3 text-center font-bold w-12">Remover</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {sortedRequirements.map(req => {
                  return (
                    <tr key={req.id} className="hover:bg-slate-50/40 transition-colors text-slate-700">
                      {/* Title input field */}
                      <td className="p-1 px-3 border-r border-slate-100 font-semibold">
                        <input
                          type="text"
                          value={req.title}
                          onChange={e => handleUpdateRevitReq(req.id, { title: e.target.value })}
                          className="w-full bg-transparent border-none p-1 font-semibold text-slate-800 focus:bg-slate-50 focus:ring-0 text-[11px] rounded focus:outline-none"
                        />
                      </td>

                      {/* Architect dropdown */}
                      <td className="p-1 px-3 border-r border-slate-100">
                        <select
                          value={req.architectId}
                          onChange={e => handleUpdateRevitReq(req.id, { architectId: e.target.value })}
                          className="bg-transparent border-none p-1 text-slate-700 font-semibold focus:bg-slate-50 focus:ring-0 text-[11px] rounded cursor-pointer w-full focus:outline-none"
                        >
                          {ARCHITECTS.map(a => (
                            <option key={a.id} value={a.id}>{a.name}</option>
                          ))}
                        </select>
                      </td>

                      {/* Date added */}
                      <td className="p-1 px-3 border-r border-slate-100 font-mono text-[10px] text-center text-slate-400">
                        <input
                          type="text"
                          value={req.dateAdded}
                          onChange={e => handleUpdateRevitReq(req.id, { dateAdded: e.target.value })}
                          className="w-full bg-transparent border-none p-1 text-center font-mono text-[10px] focus:bg-slate-50 focus:ring-0 text-slate-500 rounded focus:outline-none"
                        />
                      </td>

                      {/* Priority dropdown */}
                      <td className="p-1 px-3 border-r border-slate-100 text-center">
                        <select
                          value={req.priority}
                          onChange={e => handleUpdateRevitReq(req.id, { priority: e.target.value as any })}
                          className={`p-1 px-2 rounded text-[10px] border focus:ring-0 cursor-pointer font-bold w-full text-center focus:outline-none ${
                            req.priority === 'Alta' 
                              ? 'bg-slate-900 text-white border-slate-900' 
                              : req.priority === 'Média'
                                ? 'bg-white text-slate-700 border-slate-200'
                                : 'bg-slate-100 text-slate-600 border-none'
                          }`}
                        >
                          <option value="Alta">Alta</option>
                          <option value="Média">Média</option>
                          <option value="Baixa">Baixa</option>
                        </select>
                      </td>

                      {/* Status dropdown */}
                      <td className="p-1 px-3 border-r border-slate-100 text-center">
                        <select
                          value={req.status}
                          onChange={e => handleUpdateRevitReq(req.id, { status: e.target.value as any })}
                          className={`p-1 px-2 rounded text-[10px] border focus:ring-0 cursor-pointer font-bold w-full text-center focus:outline-none ${
                            req.status === 'Implementado'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : req.status === 'Em Estudo'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          <option value="Pendente">⏳ Pendente</option>
                          <option value="Em Estudo">🔍 Em Estudo</option>
                          <option value="Implementado">✅ Implementado</option>
                        </select>
                      </td>

                      {/* Notes field */}
                      <td className="p-1 px-3 border-r border-slate-100">
                        <input
                          type="text"
                          value={req.notes}
                          onChange={e => handleUpdateRevitReq(req.id, { notes: e.target.value })}
                          className="w-full bg-transparent border-none p-1 text-slate-600 focus:bg-slate-50 focus:ring-0 text-[11px] rounded focus:outline-none"
                          placeholder="Adicione observações ou referências..."
                        />
                      </td>

                      {/* Delete action */}
                      <td className="p-1 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteRevitReq(req.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remover requisito"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
