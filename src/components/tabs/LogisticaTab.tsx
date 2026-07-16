import React from 'react';
import { Truck, Smartphone, Calendar, MapPin } from 'lucide-react';
import { Project } from '../../types';

interface LogisticaTabProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  triggerToast: (msg: string, type?: any) => void;
}

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  'Não Definido'
];

export default function LogisticaTab({
  projects,
  setProjects,
  triggerToast
}: LogisticaTabProps) {

  const handleTabletStatusChange = (projectId: string, status: any) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, tabletStatus: status } : p));
    triggerToast('Status do tablet atualizado!', 'info');
  };

  const handleTabletMonthChange = (projectId: string, month: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, tabletMonth: month } : p));
    triggerToast('Mês de encomenda do tablet atualizado!', 'info');
  };

  const handlePlacaStatusChange = (projectId: string, status: any) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, placaStatus: status } : p));
    triggerToast('Status da placa física atualizado!', 'info');
  };

  const handlePlacaMonthChange = (projectId: string, month: string) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, placaMonth: month } : p));
    triggerToast('Mês de encomenda da placa atualizado!', 'info');
  };

  // Group projects by tablet and plaque order month
  const logisticsSchedule = MONTHS.reduce((acc, month) => {
    const list: { type: 'tablet' | 'placa'; project: Project }[] = [];
    
    projects.forEach(p => {
      const tMonth = p.tabletMonth || 'Não Definido';
      const pMonth = p.placaMonth || 'Não Definido';

      if (tMonth === month && p.tabletStatus && p.tabletStatus !== 'Não Necessita') {
        list.push({ type: 'tablet', project: p });
      }
      if (pMonth === month && p.placaStatus && p.placaStatus !== 'Não Necessita') {
        list.push({ type: 'placa', project: p });
      }
    });

    if (list.length > 0 || month === 'Não Definido') {
      acc.push({ month, list });
    }
    return acc;
  }, [] as { month: string; list: { type: 'tablet' | 'placa'; project: Project }[] }[]);

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans">
      {/* Title block */}
      <div>
        <h2 className="text-base font-semibold uppercase tracking-tight text-slate-900 flex items-center gap-2">
          <Truck className="w-5 h-5 text-slate-800" />
          <span>Logística por Empreendimento (Tablets e Placas)</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Acompanhamento de hardware e identificação física vinculados aos projetos do escritório.
        </p>
      </div>

      {/* Main Table: Projects list */}
      <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-slate-500" />
            <span>Distribuição de Tablets e Placas de Obras</span>
          </h3>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-semibold">
            {projects.length} {projects.length === 1 ? 'Projeto' : 'Projetos'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 uppercase font-mono text-[9px] border-b border-slate-100">
                <th className="p-2.5 px-3 border-r border-slate-100 w-24 text-center">Código</th>
                <th className="p-2.5 px-3 border-r border-slate-100 min-w-[200px]">Empreendimento</th>
                <th className="p-2.5 px-3 border-r border-slate-100 w-36 text-center">Status do Tablet</th>
                <th className="p-2.5 px-3 border-r border-slate-100 w-36 text-center">Mês Tablet</th>
                <th className="p-2.5 px-3 border-r border-slate-100 w-36 text-center">Status da Placa</th>
                <th className="p-2.5 px-3 text-center w-36">Mês Placa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px] text-slate-750 font-medium">
              {projects.map(proj => {
                const tabStatus = proj.tabletStatus || 'Não Necessita';
                const plcStatus = proj.placaStatus || 'Não Necessita';
                const tabMonth = proj.tabletMonth || 'Não Definido';
                const plcMonth = proj.placaMonth || 'Não Definido';

                return (
                  <tr key={proj.id} className="hover:bg-slate-50/40 transition-colors">
                    {/* Code */}
                    <td className="p-1 px-3 border-r border-slate-100 text-center font-mono font-semibold text-slate-500">
                      {proj.code || proj.id}
                    </td>
                    
                    {/* Name */}
                    <td className="p-1 px-3 border-r border-slate-100 font-semibold text-slate-800">
                      {proj.name}
                    </td>

                    {/* Tablet Status */}
                    <td className="p-1 px-3 border-r border-slate-100 text-center">
                      <select
                        value={tabStatus}
                        onChange={(e) => handleTabletStatusChange(proj.id, e.target.value as any)}
                        className={`p-1 rounded font-semibold text-[9px] cursor-pointer border text-center bg-transparent focus:outline-none w-full ${
                          tabStatus === 'Entregue'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-250'
                            : tabStatus === 'Encomendado'
                              ? 'bg-amber-50 text-amber-700 border-amber-250'
                              : tabStatus === 'Planejado'
                                ? 'bg-slate-100 text-slate-600 border-slate-200'
                                : 'bg-slate-50/50 text-slate-400 border-slate-150'
                        }`}
                      >
                        <option value="Não Necessita">❌ Não Necessita</option>
                        <option value="Planejado">⏳ Planejado</option>
                        <option value="Encomendado">📦 Encomendado</option>
                        <option value="Entregue">✅ Entregue</option>
                      </select>
                    </td>

                    {/* Tablet Order Month */}
                    <td className="p-1 px-3 border-r border-slate-100 text-center">
                      <select
                        value={tabMonth}
                        disabled={tabStatus === 'Não Necessita'}
                        onChange={(e) => handleTabletMonthChange(proj.id, e.target.value)}
                        className="bg-transparent border-none p-1 rounded cursor-pointer w-full text-[11px] font-semibold focus:outline-none text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {MONTHS.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </td>

                    {/* Plaque Status */}
                    <td className="p-1 px-3 border-r border-slate-100 text-center">
                      <select
                        value={plcStatus}
                        onChange={(e) => handlePlacaStatusChange(proj.id, e.target.value as any)}
                        className={`p-1 rounded font-semibold text-[9px] cursor-pointer border text-center bg-transparent focus:outline-none w-full ${
                          plcStatus === 'Entregue'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-250'
                            : plcStatus === 'Encomendado'
                              ? 'bg-amber-50 text-amber-700 border-amber-250'
                              : plcStatus === 'Planejado'
                                ? 'bg-slate-100 text-slate-600 border-slate-200'
                                : 'bg-slate-50/50 text-slate-400 border-slate-150'
                        }`}
                      >
                        <option value="Não Necessita">❌ Não Necessita</option>
                        <option value="Planejado">⏳ Planejado</option>
                        <option value="Encomendado">📦 Encomendado</option>
                        <option value="Entregue">✅ Entregue</option>
                      </select>
                    </td>

                    {/* Plaque Order Month */}
                    <td className="p-1 px-3 text-center">
                      <select
                        value={plcMonth}
                        disabled={plcStatus === 'Não Necessita'}
                        onChange={(e) => handlePlacaMonthChange(proj.id, e.target.value)}
                        className="bg-transparent border-none p-1 rounded cursor-pointer w-full text-[11px] font-semibold focus:outline-none text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {MONTHS.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly Timeline / Schedule Section */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
        <div>
          <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-600" />
            <span>Cronograma de Encomendas (Tablets e Placas)</span>
          </h3>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Organização mensal planejada para compra de tablets e confecção de placas técnicas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {logisticsSchedule.map(({ month, list }) => {
            const isNoDef = month === 'Não Definido';
            return (
              <div 
                key={month} 
                className={`p-4 rounded-xl border flex flex-col justify-between min-h-[140px] ${
                  isNoDef 
                    ? 'border-slate-150 bg-slate-50/50' 
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-2">
                    <span className="text-xs font-semibold text-slate-800">{month}</span>
                    <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-semibold">
                      {list.length} {list.length === 1 ? 'item' : 'itens'}
                    </span>
                  </div>

                  <div className="space-y-2 max-h-[120px] overflow-y-auto pr-1">
                    {list.length === 0 ? (
                      <span className="text-[10px] text-slate-400 italic block py-2">Sem encomendas</span>
                    ) : (
                      list.map(({ type, project }) => {
                        const isTablet = type === 'tablet';
                        const status = isTablet ? (project.tabletStatus || 'Planejado') : (project.placaStatus || 'Planejado');
                        return (
                          <div key={`${project.id}-${type}`} className="flex justify-between items-start gap-2 text-[10px] border-b border-slate-50 pb-1.5">
                            <span className="text-slate-700 font-semibold flex items-start gap-1">
                              {isTablet 
                                ? <Smartphone className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" /> 
                                : <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              }
                              <span className="break-words">{isTablet ? 'Tablet' : 'Placa'}: {project.name}</span>
                            </span>
                            <span className={`text-[8px] font-semibold px-1 rounded shrink-0 ml-1 ${
                              status === 'Entregue' 
                                ? 'bg-emerald-50 text-emerald-700' 
                                : status === 'Encomendado'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-slate-100 text-slate-600'
                            }`}>
                              {status}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
