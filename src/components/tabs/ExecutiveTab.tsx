import React from 'react';
import { 
  TrendingUp, Award, Users, FileCode, CheckCircle, Clock, 
  AlertTriangle, ShieldAlert, BarChart3, Star, Smartphone, Activity 
} from 'lucide-react';
import { 
  Task, Project, EngineeringProject, Clash, SoftwareLicense 
} from '../../types';
import { ARCHITECTS } from '../../constants';

interface ExecutiveTabProps {
  userRole: 'admin' | 'arquiteto' | 'estagiario';
  tasks: Task[];
  projects: Project[];
  complementaresProjects: EngineeringProject[];
  clashes: Clash[];
  licenses: SoftwareLicense[];
  weekHojeId: string;
  weeks: any[];
}

export default function ExecutiveTab({
  userRole,
  tasks,
  projects,
  complementaresProjects,
  clashes,
  licenses,
  weekHojeId,
  weeks
}: ExecutiveTabProps) {

  // 1. Operational KPIs (Tasks)
  const currentWeek = weeks.find(w => w.id === weekHojeId);
  const currentWeekTasks = currentWeek 
    ? tasks.filter(t => t.date >= currentWeek.startDate && t.date <= currentWeek.endDate)
    : [];

  // 2. Resource Allocation KPIs (Projects & Team Capacity)
  const PROFESSIONALS = [
    ...ARCHITECTS.map(a => a.name),
    "Eng. Ricardo Gomes",
    "Eng. Ana Martins",
    "Eng. Carlos Costa",
    "Eng. José Lemos",
    "Eng. Ricardo Pereira"
  ];

  const teamCapacity = PROFESSIONALS.map(name => {
    const activeProjects = projects.filter(p => 
      (p.responsavel === name || p.secundario === name) && 
      p.status.toLowerCase() === 'ativo'
    ).length;
    
    const maxCapacity = 4;
    const capacityPercentage = Math.min(100, (activeProjects / maxCapacity) * 100);
    return { name, activeProjects, capacityPercentage, isOverloaded: activeProjects > maxCapacity };
  }).filter(t => t.activeProjects > 0).sort((a, b) => b.activeProjects - a.activeProjects);

  // 3. Engineering KPIs (Complementares)
  let totalRevisions = 0;
  let disciplineCount = 0;
  let delayedDisciplines = 0;
  let totalSlaDays = 0;
  let completedRevisionsCount = 0;
  const todayStr = new Date().toISOString().split('T')[0];

  complementaresProjects.forEach(ep => {
    Object.values(ep.disciplinas).forEach(d => {
      if (d.status === 'Não se aplica') return;
      disciplineCount++;
      totalRevisions += d.historico.length;

      d.historico.forEach(h => {
        if (!h.devolucao && h.limite < todayStr) {
          delayedDisciplines++;
        }
        
        if (h.devolucao && h.recebimento) {
          const diffTime = Math.abs(new Date(h.devolucao).getTime() - new Date(h.recebimento).getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          totalSlaDays += diffDays;
          completedRevisionsCount++;
        }
      });
    });
  });

  const avgSlaDays = completedRevisionsCount > 0 ? (totalSlaDays / completedRevisionsCount) : 0;

  // 4. Logistics & Assets
  const totalTablets = projects.filter(p => p.tabletStatus && p.tabletStatus !== 'Não Necessita').length;
  const tabletsInObra = projects.filter(p => p.tabletStatus === 'Entregue').length;
  const tabletUtilization = totalTablets > 0 ? (tabletsInObra / totalTablets) * 100 : 0;

  // Licenses expiring soon (within next 60 days)
  const expiringLicenses = licenses.filter(l => {
    if (!l.revitData || l.revitData === '-') return false;
    try {
      const parts = l.revitData.split('/');
      let date: Date;
      if (parts.length === 3) {
        date = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
      } else {
        date = new Date(l.revitData);
      }
      const diff = date.getTime() - new Date().getTime();
      const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return diffDays > 0 && diffDays <= 60;
    } catch (e) {
      return false;
    }
  });

  if (userRole === 'estagiario') {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-slate-500 font-semibold">
        <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        Acesso Restrito: Apenas Administradores e Arquitetos podem visualizar o Painel Executivo.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12 font-sans">
      {/* Title block */}
      <div>
        <h2 className="text-base font-semibold uppercase tracking-tight text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-slate-800" />
          <span>Painel Executivo de Gestão</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">Visão analítica cruzada de performance, recursos e integridade dos projetos do escritório.</p>
      </div>

      {/* Row 1: High Level KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tarefas da Semana */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm min-h-[160px]">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Cronograma</span>
                <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-tight">Tarefas da Semana</h3>
              </div>
              <div className="p-2.5 bg-slate-900 text-white rounded-xl">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Tarefas e respectivos arquitetos alocados na semana corrente.</p>
            
            <div className="max-h-[90px] overflow-y-auto space-y-1.5 pr-1 mt-3">
              {currentWeekTasks.length === 0 ? (
                <span className="text-[10px] text-slate-400 italic block py-2">Nenhuma tarefa no cronograma esta semana.</span>
              ) : (
                currentWeekTasks.map(t => {
                  const archName = ARCHITECTS.find(a => a.id === t.archId)?.name || t.archId;
                  return (
                    <div key={t.id} className="flex justify-between items-center text-[10.5px] border-b border-slate-100 pb-1">
                      <span className="text-slate-700 font-semibold truncate max-w-[220px]">{t.title}</span>
                      <span className="text-slate-500 font-medium shrink-0 ml-2">{archName}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* SLA Médio de Devolução */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between shadow-sm min-h-[160px]">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Engenharia Complementar</span>
                <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-tight">SLA Médio de Ciclo de Revisão</h3>
              </div>
              <div className="p-2.5 bg-slate-100 text-slate-800 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 pt-2">
              <span className="text-3xl font-semibold text-slate-900">{avgSlaDays.toFixed(1)} dias</span>
              <span className="text-[10px] font-semibold text-slate-500">projetistas complementares</span>
            </div>
            <p className="text-[10px] text-slate-400">Tempo de resposta médio calculado entre recebimento e devolução dos arquivos.</p>
          </div>
        </div>
      </div>

      {/* Row 2: Split Columns for Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1: Capacity Planning (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
          <div>
            <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-600" />
              <span>Carga de Trabalho da Equipe</span>
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Indicador de alocação de profissionais em projetos ativos.</p>
          </div>

          <div className="space-y-3">
            {teamCapacity.map((c, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">{c.name}</span>
                  <span className={`font-mono font-semibold px-1.5 py-0.5 rounded text-[9px] ${
                    c.isOverloaded 
                      ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                      : 'bg-slate-50 text-slate-600 border border-slate-200'
                  }`}>
                    {c.activeProjects} {c.activeProjects === 1 ? 'projeto ativo' : 'projetos ativos'}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      c.isOverloaded ? 'bg-rose-500' : 'bg-slate-900'
                    }`}
                    style={{ width: `${c.capacityPercentage}%` }}
                  />
                </div>
                {c.isOverloaded && (
                  <span className="text-[9px] text-rose-500 font-semibold block">
                    ⚠️ Sobrecarga recomendada (Capacidade acima de 100%)
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: SLAs, Clashes & Infrastructure (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Engineering Delays Table */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <div>
              <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-slate-600" />
                <span>Alertas de Atraso em Engenharias Secundárias</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Disciplinas com data de retorno expirada sem devolução registrada.</p>
            </div>

            {delayedDisciplines === 0 ? (
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 text-center text-xs text-slate-500 font-medium">
                ✅ Tudo em dia! Nenhuma entrega técnica de engenharia complementar está atrasada.
              </div>
            ) : (
              <div className="border border-slate-100 rounded-xl overflow-hidden text-[11px] shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-mono text-[9px] uppercase border-b border-slate-100">
                      <th className="p-2 px-3">Projeto</th>
                      <th className="p-2 px-3">Engenheiro</th>
                      <th className="p-2 px-3">Prazo Limite</th>
                      <th className="p-2 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {complementaresProjects.map(ep => 
                      Object.entries(ep.disciplinas).map(([key, d]) => {
                        return d.historico.map((h, hIdx) => {
                          if (!h.devolucao && h.limite < todayStr) {
                            return (
                              <tr key={`${ep.id}-${key}-${hIdx}`} className="hover:bg-slate-50/50 text-slate-700 font-medium">
                                <td className="p-2 px-3 font-semibold font-sans">
                                  {ep.nome} - {key.charAt(0).toUpperCase() + key.slice(1)}
                                </td>
                                <td className="p-2 px-3 text-slate-600">{d.engenheiro || 'Não informado'}</td>
                                <td className="p-2 px-3 font-mono text-rose-600 font-semibold">
                                  {h.limite.split('-').reverse().join('/')}
                                </td>
                                <td className="p-2 px-3 text-center">
                                  <span className="bg-rose-50 text-rose-700 border border-rose-100 px-1 py-0.5 rounded text-[9px] font-semibold">
                                    Atrasado
                                  </span>
                                </td>
                              </tr>
                            );
                          }
                          return null;
                        });
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Assets & Licenses */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <div>
              <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-slate-600" />
                <span>Infraestrutura e TI</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Indicadores de licenciamento de software e logística.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Logística de Obras</span>
                <div className="flex justify-between items-center bg-slate-50 border border-slate-150 rounded-xl p-3">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Tablets Ativos:</span>
                  </span>
                  <span className="font-semibold text-slate-850 font-mono">
                    {tabletUtilization.toFixed(0)}% ({tabletsInObra}/{totalTablets})
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Licenças Expirando (60 dias)</span>
                <div className="flex justify-between items-center bg-slate-50 border border-slate-150 rounded-xl p-3">
                  <span className="text-slate-650">Ações Necessárias:</span>
                  <span className={`font-semibold px-2 py-0.5 rounded text-[9px] ${
                    expiringLicenses.length > 0 
                      ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  }`}>
                    {expiringLicenses.length} {expiringLicenses.length === 1 ? 'pendência' : 'pendências'}
                  </span>
                </div>
              </div>
            </div>

            {expiringLicenses.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[9px] text-slate-400 font-semibold block uppercase tracking-wider mb-2">Lista Detalhada de Licenças</span>
                <div className="max-h-[80px] overflow-y-auto space-y-1.5 pr-1">
                  {expiringLicenses.map(l => (
                    <div key={l.id} className="text-[10.5px] text-slate-600 flex justify-between border-b border-slate-50 pb-1 font-medium">
                      <span className="truncate max-w-[200px]">{l.usuario} - {l.software}</span>
                      <span className="font-mono text-rose-500 font-semibold">{l.revitData}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
