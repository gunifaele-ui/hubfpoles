import React, { useState } from 'react';
import { 
  ChevronDown, Search, Copy, Clipboard, Highlighter, ArrowRight 
} from 'lucide-react';
import { Task, Week } from '../../types';
import { ARCHITECTS, PORTUGUESE_DAYS } from '../../constants';

interface CronogramaTabProps {
  selectedArchitectId: string;
  setSelectedArchitectId: (id: string) => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  weeks: Week[];
  weekHojeId: string;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  handleInlineTitleChange: (id: string, v: string) => void;
  handleInlineProjectChange: (id: string, v: string) => void;
  handleInlineStatusToggle: (id: string) => void;
  handleInlineYellowToggle: (id: string) => void;
  copyTaskToBuffer: (t: Task) => void;
  pasteTaskFromBuffer: (date: string, archId: string, id: string) => void;
  triggerToast: (msg: string, type?: any) => void;
}

function formatWeekLabel(startDateStr: string, endDateStr: string): string {
  const startParts = startDateStr.split('-');
  const endParts = endDateStr.split('-');
  
  if (startParts.length !== 3 || endParts.length !== 3) {
    return 'Semana';
  }
  
  const startDay = parseInt(startParts[2], 10);
  const endDay = parseInt(endParts[2], 10);
  const startMonth = parseInt(startParts[1], 10);
  const endMonth = parseInt(endParts[1], 10);
  const year = startParts[0];
  
  const monthNames = [
    '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  if (startMonth === endMonth) {
    return `Semana do dia ${startDay} a ${endDay} de ${monthNames[startMonth]} de ${year}`;
  } else {
    return `Semana do dia ${startDay} de ${monthNames[startMonth]} a ${endDay} de ${monthNames[endMonth]} de ${year}`;
  }
}

export default function CronogramaTab({
  selectedArchitectId,
  setSelectedArchitectId,
  selectedYear,
  setSelectedYear,
  weeks,
  weekHojeId,
  tasks,
  setTasks,
  handleInlineTitleChange,
  handleInlineProjectChange,
  handleInlineStatusToggle,
  handleInlineYellowToggle,
  copyTaskToBuffer,
  pasteTaskFromBuffer,
  triggerToast
}: CronogramaTabProps) {
  const [archDropdownOpen, setArchDropdownOpen] = useState(false);
  const [archQuery, setArchQuery] = useState('');
  const [showPreviousWeeks, setShowPreviousWeeks] = useState(false);
  const [lastTargetOffset, setLastTargetOffset] = useState<number | null>(null);

  const filteredArchitects = [...ARCHITECTS]
    .filter(arch => arch.name.toLowerCase().includes(archQuery.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Synchronized scroll adjustment after previous weeks render
  React.useEffect(() => {
    if (showPreviousWeeks && lastTargetOffset !== null) {
      const desktopContainer = document.getElementById('desktop-scroll-container');
      const target = document.getElementById(`week-block-${weekHojeId}`);
      if (target && desktopContainer) {
        const newOffset = target.offsetTop;
        const diff = newOffset - lastTargetOffset;
        desktopContainer.scrollTop += diff;
        setLastTargetOffset(null);
      }
    }
  }, [showPreviousWeeks, lastTargetOffset, weekHojeId]);

  const handleUnlockPreviousWeeks = () => {
    const target = document.getElementById(`week-block-${weekHojeId}`);
    if (target) {
      setLastTargetOffset(target.offsetTop);
    }
    setShowPreviousWeeks(true);
  };

  const handleScrollToToday = () => {
    const target = document.getElementById(`week-block-${weekHojeId}`);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      triggerToast('Focado na semana atual!', 'info');
    }
  };

  return (
    <div className="space-y-4 animate-fade-in relative">
      {/* Quick Filters */}
      <div className="sticky -top-4 md:-top-8 -mx-4 md:-mx-8 px-4 md:px-8 pt-1 md:pt-2 pb-2 z-20 bg-[#F8F9FB]">
        <div className="bg-white border border-slate-200/60 p-3 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto relative">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Arquiteto Responsável:</span>
            <div className="relative inline-block text-left w-full sm:w-64">
              <button
                type="button"
                onClick={() => {
                  setArchDropdownOpen(!archDropdownOpen);
                  setArchQuery('');
                }}
                className="flex items-center justify-between w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer hover:bg-slate-50 transition-all shadow-sm focus:outline-none"
              >
                <span className="truncate flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                  {ARCHITECTS.find(a => a.id === selectedArchitectId)?.name || 'Selecionar Arquiteto'}
                </span>
                <ChevronDown className={`w-4 h-4 ml-2 text-slate-500 transition-transform duration-200 ${archDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {archDropdownOpen && (
                <div 
                  className="fixed inset-0 z-30 cursor-default" 
                  onClick={() => setArchDropdownOpen(false)}
                />
              )}

              {archDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-40 max-h-64 overflow-y-auto divide-y divide-slate-100 animate-fade-in">
                  <div className="p-2 sticky top-0 bg-white z-10">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Pesquisar arquiteto..."
                        value={archQuery}
                        onChange={(e) => setArchQuery(e.target.value)}
                        className="w-full pl-7 pr-2 py-1.5 bg-slate-50 border border-slate-200/60 rounded-lg text-xs font-sans text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
                        autoFocus
                      />
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                    </div>
                  </div>
                  
                  <div className="py-1 max-h-48 overflow-y-auto">
                    {filteredArchitects.map(arch => (
                      <button
                        key={arch.id}
                        type="button"
                        onClick={() => {
                          setSelectedArchitectId(arch.id);
                          triggerToast(`Filtro: ${arch.name}`, 'info');
                          setArchDropdownOpen(false);
                        }}
                        className={`flex items-center justify-between w-full px-4 py-2.5 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer text-left ${
                          selectedArchitectId === arch.id 
                            ? 'bg-slate-100 text-slate-900' 
                            : 'text-slate-600'
                        }`}
                      >
                        <span>{arch.name}</span>
                        {selectedArchitectId === arch.id && (
                          <span className="text-[9px] bg-slate-900 text-white px-1.5 py-0.5 rounded font-mono uppercase">Ativo</span>
                        )}
                      </button>
                    ))}
                    {filteredArchitects.length === 0 && (
                      <div className="p-3 text-xs text-slate-400 text-center font-sans">Nenhum arquiteto encontrado</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end border-t md:border-t-0 pt-2.5 md:pt-0 border-slate-100">
            <span className="text-xs font-semibold uppercase text-slate-500 tracking-wider">Ano:</span>
            <select
              value={selectedYear}
              onChange={(e) => {
                const yr = parseInt(e.target.value, 10);
                setSelectedYear(yr);
                triggerToast(`Ano alterado para ${yr}`, 'info');
              }}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none hover:bg-slate-50 transition-colors shadow-sm"
            >
              <option value={2026}>2026</option>
              <option value={2027}>2027</option>
              <option value={2028}>2028</option>
            </select>
          </div>
        </div>
      </div>

      {/* Continuous blocks of weeks */}
      <div className="space-y-4">
        {showPreviousWeeks ? (
          <div className="flex justify-center py-2 animate-fade-in">
            <button
              type="button"
              onClick={handleScrollToToday}
              className="px-6 py-2.5 bg-black hover:bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer transition-all shadow-sm flex items-center gap-2"
            >
              📍 Ir para Hoje
            </button>
          </div>
        ) : (
          <div className="flex justify-center py-2 animate-fade-in">
            <button
              type="button"
              onClick={handleUnlockPreviousWeeks}
              className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold cursor-pointer transition-all shadow-sm flex items-center gap-2"
            >
              📅 Ver Semanas Anteriores
            </button>
          </div>
        )}

        {weeks.map((week, idx) => {
          const hojeIdx = weeks.findIndex(w => w.id === weekHojeId);
          if (idx < hojeIdx && !showPreviousWeeks) {
            return null;
          }
          const isCurrentWeek = week.id === weekHojeId;
          return (
            <div 
              key={week.id}
              id={`week-block-${week.id}`}
              className={`bg-white rounded-2xl border overflow-hidden transition-all scroll-mt-[160px] md:scroll-mt-[180px] ${
                isCurrentWeek ? 'border-slate-800 ring-1 ring-slate-800 shadow-md' : 'border-slate-200/60 shadow-sm'
              }`}
            >
              {/* Week Title Header */}
              <div className={`p-3 px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
                isCurrentWeek ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-800 border-b border-slate-200/60'
              }`}>
                <div className="flex items-center gap-2">
                  {isCurrentWeek && (
                    <span className="text-[8px] font-semibold tracking-widest px-2 py-0.5 rounded-full bg-white text-slate-950">
                      SEMANA ATUAL
                    </span>
                  )}
                  <h3 className="font-semibold text-xs tracking-wide uppercase">{formatWeekLabel(week.startDate, week.endDate)}</h3>
                </div>
                <span className="text-[10px] font-mono opacity-60">Intervalo: {week.startDate} a {week.endDate}</span>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-400 uppercase font-mono text-[9px] border-b border-slate-100">
                      <th className="p-2.5 px-3 border-r border-slate-100 w-28 whitespace-nowrap">Dia</th>
                      <th className="p-2.5 px-3 border-r border-slate-100 w-24 whitespace-nowrap">Data</th>
                      <th className="p-2.5 px-3 border-r border-slate-100 w-[38%] min-w-[200px]">Tarefa Principal</th>
                      <th className="p-2.5 px-3 border-r border-slate-100 w-[38%] min-w-[200px]">Tarefa Secundária</th>
                      <th className="p-2.5 px-3 border-r border-slate-100 w-24 text-center whitespace-nowrap">Status</th>
                      <th className="p-2.5 px-3 w-28 text-center whitespace-nowrap">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {week.days.slice(0, 5).map((dayStr, dayIdx) => {
                      const task = tasks.find(t => t.archId === selectedArchitectId && t.date === dayStr) || {
                        id: `empty-${selectedArchitectId}-${dayStr}`,
                        archId: selectedArchitectId,
                        date: dayStr,
                        title: '',
                        project: '',
                        status: 'Pendente' as const,
                        priority: 'Média' as const
                      };

                      const isTaskEmpty = task.title === '' && task.project === '';

                      const handleTitleChangeLocal = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        const val = e.target.value;
                        if (task.id.startsWith('empty-')) {
                          const newTask: Task = {
                            id: 't-' + Date.now() + Math.random().toString(36).substr(2, 4),
                            archId: selectedArchitectId,
                            date: dayStr,
                            title: val,
                            project: task.project,
                            status: task.status,
                            priority: task.priority
                          };
                          setTasks(prev => [...prev, newTask]);
                        } else {
                          handleInlineTitleChange(task.id, val);
                        }
                      };

                      const handleProjChangeLocal = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
                        const val = e.target.value;
                        if (task.id.startsWith('empty-')) {
                          const newTask: Task = {
                            id: 't-' + Date.now() + Math.random().toString(36).substr(2, 4),
                            archId: selectedArchitectId,
                            date: dayStr,
                            title: '',
                            project: val,
                            status: 'Pendente',
                            priority: 'Média'
                          };
                          setTasks(prev => [...prev, newTask]);
                        } else {
                          handleInlineProjectChange(task.id, val);
                        }
                      };

                      const handleCheckboxLocal = () => {
                        if (task.id.startsWith('empty-')) {
                          const newTask: Task = {
                            id: 't-' + Date.now() + Math.random().toString(36).substr(2, 4),
                            archId: selectedArchitectId,
                            date: dayStr,
                            title: '',
                            project: task.project,
                            status: 'Realizado',
                            priority: 'Média'
                          };
                          setTasks(prev => [...prev, newTask]);
                          triggerToast('Estado da tarefa atualizado!', 'info');
                        } else {
                          handleInlineStatusToggle(task.id);
                        }
                      };

                      const handleYellowLocal = () => {
                        if (task.id.startsWith('empty-')) {
                          const newTask: Task = {
                            id: 't-' + Date.now() + Math.random().toString(36).substr(2, 4),
                            archId: selectedArchitectId,
                            date: dayStr,
                            title: '',
                            project: '',
                            status: 'Pendente',
                            priority: 'Média',
                            isYellow: true
                          };
                          setTasks(prev => [...prev, newTask]);
                          triggerToast('Dia destacado (férias/feriado)!', 'info');
                        } else {
                          handleInlineYellowToggle(task.id);
                        }
                      };

                      return (
                        <tr 
                          key={dayStr} 
                          className={`transition-colors text-[11px] hover:bg-slate-50/40 ${
                            task.isYellow 
                              ? 'bg-amber-50 hover:bg-amber-100/80 text-amber-900 font-semibold' 
                              : isTaskEmpty 
                                ? 'text-slate-400' 
                                : 'text-slate-800 font-medium'
                          }`}
                        >
                          <td className="p-1 px-3 border-r border-slate-100 bg-slate-50/10 whitespace-nowrap font-medium text-slate-500">
                            {PORTUGUESE_DAYS[dayIdx]}
                          </td>
                          <td className="p-1 px-3 border-r border-slate-100 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                            {dayStr}
                          </td>
                          <td className="p-1 px-3 border-r border-slate-100">
                            <textarea
                              rows={1}
                              value={task.project}
                              onChange={handleProjChangeLocal}
                              ref={(el) => {
                                if (el) {
                                  el.style.height = 'auto';
                                  el.style.height = `${el.scrollHeight}px`;
                                }
                              }}
                              placeholder="Escreva o projeto principal..."
                              className="w-full bg-transparent border-none focus:bg-slate-50 px-2 py-1 text-[11px] rounded-md placeholder-slate-300 resize-none overflow-hidden block align-bottom focus:outline-none focus:ring-1 focus:ring-slate-200"
                            />
                          </td>
                          <td className="p-1 px-3 border-r border-slate-100">
                            <textarea
                              rows={1}
                              value={task.title}
                              onChange={handleTitleChangeLocal}
                              ref={(el) => {
                                if (el) {
                                  el.style.height = 'auto';
                                  el.style.height = `${el.scrollHeight}px`;
                                }
                              }}
                              placeholder="Escreva a atividade técnica..."
                              className="w-full bg-transparent border-none focus:bg-slate-50 px-2 py-1 text-[11px] rounded-md placeholder-slate-300 resize-none overflow-hidden block align-bottom focus:outline-none focus:ring-1 focus:ring-slate-200"
                            />
                          </td>
                          <td className="p-1 px-3 border-r border-slate-100 text-center whitespace-nowrap select-none">
                            <label className="inline-flex items-center justify-center cursor-pointer gap-1.5">
                              <input
                                type="checkbox"
                                checked={task.status === 'Realizado'}
                                onChange={handleCheckboxLocal}
                                className="w-3.5 h-3.5 border-slate-300 rounded focus:ring-emerald-500 accent-emerald-600 cursor-pointer"
                              />
                              <span className={`text-[9px] font-semibold tracking-wider ${
                                task.status === 'Realizado' ? 'text-emerald-600' : 'text-slate-400'
                              }`}>
                                {task.status.toUpperCase()}
                              </span>
                            </label>
                          </td>
                          <td className="p-1 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => copyTaskToBuffer(task as Task)}
                                title="Copiar Atividade"
                                className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => pasteTaskFromBuffer(dayStr, selectedArchitectId, task.id)}
                                title="Colar Atividade"
                                className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                              >
                                <Clipboard className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={handleYellowLocal}
                                title={task.isYellow ? "Remover Destaque de Folga" : "Marcar Feriado / Férias / Folga"}
                                className={`p-1 rounded-md transition-colors cursor-pointer ${
                                  task.isYellow 
                                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                                    : 'hover:bg-slate-100 text-slate-400 hover:text-slate-700'
                                }`}
                              >
                                <Highlighter className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
