import React, { useState } from 'react';
import { Search, Trash2, Users } from 'lucide-react';
import { Project, Task } from '../../types';
import { ARCHITECTS } from '../../constants';

interface ResponsaveisTabProps {
  userRole: 'admin' | 'arquiteto' | 'estagiario';
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  triggerToast: (msg: string, type?: any) => void;
}

export default function ResponsaveisTab({
  userRole,
  projects,
  setProjects,
  triggerToast
}: ResponsaveisTabProps) {
  const [projSearch, setProjSearch] = useState('');
  const [respFilter, setRespFilter] = useState('todos');
  const [projStatusFilter, setProjStatusFilter] = useState('todos');

  const PROFESSIONALS = [
    ...ARCHITECTS.map(a => a.name),
    "Eng. Ricardo Gomes",
    "Eng. Ana Martins",
    "Eng. Carlos Costa",
    "Eng. José Lemos",
    "Eng. Ricardo Pereira"
  ];

  // Calculate Statistics
  const stats = PROFESSIONALS.map(prof => {
    const associatedProjects = projects.filter(p => 
      p.responsavel === prof || 
      p.secundario === prof
    );
    const activeCount = associatedProjects.filter(p => p.status.toLowerCase() === 'ativo').length;
    const standbyCount = associatedProjects.filter(p => p.status.toLowerCase() === 'standby').length;
    const pendingCount = associatedProjects.filter(p => p.status.toLowerCase() === 'pendente').length;
    const total = associatedProjects.length;

    return { prof, activeCount, standbyCount, pendingCount, total };
  }).filter(s => s.total > 0).sort((a, b) => b.total - a.total);

  // Filtered projects
  const filteredProjects = projects.filter(p => {
    const nameMatch = p.name.toLowerCase().includes(projSearch.toLowerCase());
    const codeMatch = (p.code || p.id).toLowerCase().includes(projSearch.toLowerCase());
    const searchMatch = nameMatch || codeMatch;

    const respMatch = respFilter === 'todos' || 
      p.responsavel === respFilter || 
      p.secundario === respFilter;

    const statusMatch = projStatusFilter === 'todos' || 
      p.status.toLowerCase() === projStatusFilter.toLowerCase();

    return searchMatch && respMatch && statusMatch;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans">
      {/* Title block */}
      <div>
        <h2 className="text-base font-semibold uppercase tracking-tight text-slate-900 flex items-center gap-2 font-sans">
          <Users className="w-5 h-5 text-slate-800" />
          <span>Projetos por Responsáveis</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">Atribuição de equipe e gestão de responsáveis técnicos primários e secundários.</p>
      </div>

      {/* Dynamic Statistics Block: Premium ACRU-style capsule chart */}
      <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Métricas de Alocação</span>
            <h3 className="text-sm font-semibold text-slate-950 font-sans tracking-tight mt-0.5">Volume de Projetos por Profissional</h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Clique em um profissional para filtrar a tabela de projetos.</p>
          </div>
          {respFilter !== 'todos' && (
            <button
              onClick={() => setRespFilter('todos')}
              className="text-[9px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded-full font-semibold transition-colors cursor-pointer"
            >
              Limpar Filtro
            </button>
          )}
        </div>

        {/* Capsule bar chart wrapper */}
        <div className="flex justify-around items-end h-[160px] pt-4 px-2 overflow-x-auto scrollbar-none">
          {stats.map((s, idx) => {
            const isSelected = respFilter === s.prof;
            const maxProjectsCount = Math.max(...stats.map(item => item.total), 4);
            const percentage = Math.min(100, Math.max(10, (s.total / maxProjectsCount) * 100));
            
            // Shorten name for display
            const shortName = s.prof.replace('Arq. ', '').replace('Eng. ', '');

            // Color scheme depending on state
            const barColor = isSelected 
              ? 'bg-slate-950 ring-2 ring-slate-950 ring-offset-2' 
              : 'bg-slate-800 hover:bg-slate-900';

            return (
              <button
                key={s.prof}
                type="button"
                onClick={() => {
                  setRespFilter(isSelected ? 'todos' : s.prof);
                  triggerToast(isSelected ? 'Filtro limpo' : `Filtrado por: ${s.prof}`, 'info');
                }}
                className="flex flex-col items-center gap-2 group relative cursor-pointer focus:outline-none shrink-0"
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-12 scale-0 group-hover:scale-100 bg-slate-950 text-white text-[8px] font-mono font-semibold p-2 rounded-xl transition-all shadow-md z-15 whitespace-nowrap text-center space-y-0.5">
                  <p className="font-bold text-[9px] border-b border-white/10 pb-0.5 mb-0.5">{s.prof}</p>
                  <p>{s.total} Projetos no total</p>
                  <p className="text-slate-350">{s.activeCount} Ativos • {s.standbyCount} Standby</p>
                </div>
                
                {/* Rounded capsule bar */}
                <div className={`w-7 h-[110px] bg-slate-50 border ${isSelected ? 'border-slate-950' : 'border-slate-100'} rounded-full relative overflow-hidden flex items-end justify-center shadow-inner transition-all duration-200`}>
                  {/* Fill capsule block */}
                  <div 
                    className={`w-full rounded-full ${barColor} transition-all duration-500 ease-out`} 
                    style={{ height: `${percentage}%` }}
                  />
                </div>
                
                {/* Label */}
                <span className={`text-[9.5px] font-bold uppercase tracking-tight font-sans transition-colors ${isSelected ? 'text-slate-900 font-extrabold' : 'text-slate-400 group-hover:text-slate-650'}`}>
                  {shortName}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters Block */}
      <div className="bg-white border border-slate-200/60 p-3 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
          {/* Search input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Pesquisar por código ou nome do projeto..."
              value={projSearch}
              onChange={(e) => setProjSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-xs font-sans text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
            />
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          </div>

          {/* Responsible filter dropdown */}
          <div className="flex items-center gap-1">
            <select
              value={respFilter}
              onChange={(e) => setRespFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none hover:bg-slate-50 transition-colors"
            >
              <option value="todos">👥 Todos os Responsáveis</option>
              {PROFESSIONALS.map(prof => (
                <option key={prof} value={prof}>{prof}</option>
              ))}
            </select>
          </div>

          {/* Status filter dropdown */}
          <div className="flex items-center gap-1">
            <select
              value={projStatusFilter}
              onChange={(e) => setProjStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none hover:bg-slate-50 transition-colors"
            >
              <option value="todos">🔍 Todos os Estados</option>
              <option value="ativo">Ativo</option>
              <option value="standby">Standby (Suspenso)</option>
              <option value="pendente">Pendente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 uppercase font-mono text-[9px] border-b border-slate-100">
                <th className="p-2.5 px-3 border-r border-slate-100 w-32 text-center whitespace-nowrap">Código</th>
                <th className="p-2.5 px-3 border-r border-slate-100 min-w-[200px]">Nome do Projeto</th>
                <th className="p-2.5 px-3 border-r border-slate-100 w-64 whitespace-nowrap">Responsável pelo Projeto</th>
                <th className="p-2.5 px-3 border-r border-slate-100 w-64 whitespace-nowrap">Responsabilidade Secundária</th>
                <th className="p-2.5 px-3 border-r border-slate-100 w-28 text-center whitespace-nowrap">Estado</th>
                <th className="p-2.5 px-3 w-32 text-center whitespace-nowrap">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProjects.map((proj) => {
                const isStandby = proj.status.toLowerCase() === 'standby';
                return (
                  <tr
                    key={proj.id}
                    className={`transition-colors text-[11px] hover:bg-slate-50/40 ${
                      isStandby
                        ? 'bg-amber-50 text-amber-900 font-medium'
                        : 'text-slate-800 font-medium'
                    }`}
                  >
                    {/* Project Code */}
                    <td className="p-1 px-3 border-r border-slate-100 text-center font-mono font-semibold text-xs text-slate-500">
                      {proj.code || proj.id}
                    </td>

                    {/* Project Name */}
                    <td className="p-1 px-3 border-r border-slate-100 font-semibold font-sans text-xs text-slate-800">
                      {proj.name}
                    </td>

                    {/* Responsável */}
                    <td className="p-1 px-3 border-r border-slate-100">
                      <select
                        value={proj.responsavel}
                        onChange={(e) => {
                          const updated = projects.map(p => p.id === proj.id ? { ...p, responsavel: e.target.value } : p);
                          setProjects(updated);
                          triggerToast('Responsável principal updated!', 'info');
                        }}
                        className="bg-transparent border-none p-1 pr-6 rounded cursor-pointer w-full font-semibold focus:outline-none focus:bg-slate-50 text-[11px] text-slate-700"
                      >
                        {PROFESSIONALS.map(prof => (
                          <option key={prof} value={prof}>{prof}</option>
                        ))}
                      </select>
                    </td>

                    {/* Secundário */}
                    <td className="p-1 px-3 border-r border-slate-100">
                      <select
                        value={proj.secundario}
                        onChange={(e) => {
                          const updated = projects.map(p => p.id === proj.id ? { ...p, secundario: e.target.value } : p);
                          setProjects(updated);
                          triggerToast('Responsabilidade secundária atualizada!', 'info');
                        }}
                        className="bg-transparent border-none p-1 pr-6 rounded cursor-pointer w-full font-semibold focus:outline-none focus:bg-slate-50 text-[11px] text-slate-700"
                      >
                        {PROFESSIONALS.map(prof => (
                          <option key={prof} value={prof}>{prof}</option>
                        ))}
                      </select>
                    </td>

                    {/* Status */}
                    <td className="p-1 px-3 border-r border-slate-100 text-center">
                      <select
                        value={proj.status}
                        onChange={(e) => {
                          const updated = projects.map(p => p.id === proj.id ? { ...p, status: e.target.value } : p);
                          setProjects(updated);
                          triggerToast(`Projeto "${proj.name}" definido como ${e.target.value}!`, 'info');
                        }}
                        className={`p-1 pl-2 pr-6 rounded font-semibold text-[9px] uppercase cursor-pointer border text-left ${
                          isStandby 
                            ? 'bg-amber-50 text-amber-700 border-amber-200' 
                            : proj.status === 'Pendente' 
                              ? 'bg-slate-100 text-slate-600 border-slate-200' 
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        <option value="Ativo">Ativo</option>
                        <option value="Standby">Standby</option>
                        <option value="Pendente">Pendente</option>
                      </select>
                    </td>

                    {/* Ações */}
                    <td className="p-1 px-3 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const nextStatus = isStandby ? 'Ativo' : 'Standby';
                            const updated = projects.map(p => p.id === proj.id ? { ...p, status: nextStatus } : p);
                            setProjects(updated);
                            triggerToast(isStandby ? `Projeto "${proj.name}" Ativado!` : `Projeto "${proj.name}" em Standby!`, 'warning');
                          }}
                          className={`px-2 py-1 rounded-lg border font-semibold text-[10px] uppercase transition-all cursor-pointer flex items-center gap-1 ${
                            isStandby
                              ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                          title={isStandby ? 'Ativar projeto' : 'Pôr em standby'}
                        >
                          🚧 {isStandby ? 'Ativar' : 'Standby'}
                        </button>
                        {userRole === 'admin' && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Deseja realmente remover o projeto "${proj.name}"?`)) {
                                const updated = projects.filter(p => p.id !== proj.id);
                                setProjects(updated);
                                triggerToast('Projeto removido com sucesso!', 'info');
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-slate-50 cursor-pointer transition-colors"
                            title="Remover projeto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredProjects.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-slate-400 font-sans">
                    Nenhum projeto encontrado correspondendo aos filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
