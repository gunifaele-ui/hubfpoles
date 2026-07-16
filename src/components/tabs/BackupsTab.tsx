import React from 'react';
import { Plus, Trash2, Database } from 'lucide-react';
import { BackupRecord, Week } from '../../types';

interface BackupsTabProps {
  backupRecords: BackupRecord[];
  setBackupRecords: React.Dispatch<React.SetStateAction<BackupRecord[]>>;
  backupSelectedYear: number;
  setBackupSelectedYear: React.Dispatch<React.SetStateAction<number>>;
  backupSelectedWeekId: string;
  setBackupSelectedWeekId: React.Dispatch<React.SetStateAction<string>>;
  backupWeeks: Week[];
  triggerToast: (msg: string, type?: any) => void;
}

function formatDateToDMY(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
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

export default function BackupsTab({
  backupRecords,
  setBackupRecords,
  backupSelectedYear,
  setBackupSelectedYear,
  backupSelectedWeekId,
  setBackupSelectedWeekId,
  backupWeeks,
  triggerToast
}: BackupsTabProps) {
  const filteredBackupRecords = backupRecords.filter(rec => 
    rec.year === backupSelectedYear && rec.weekId === backupSelectedWeekId
  );

  const activeWeek = backupWeeks.find(w => w.id === backupSelectedWeekId) || backupWeeks[0];
  const activeWeekStartDateFormatted = activeWeek ? formatDateToDMY(activeWeek.startDate) : '';

  const handleAddBackupRecord = () => {
    const newRecord: BackupRecord = {
      id: 'b-' + Date.now().toString(36),
      year: backupSelectedYear,
      weekId: backupSelectedWeekId,
      project: 'Novo Projeto',
      fase: '05_Executivo',
      progress: 'Em Desenvolvimento',
      status: 'Não Realizado',
      tecnico: 'ANA',
      desc: 'Descrição do Evento',
      link: ''
    };
    setBackupRecords(prev => [...prev, newRecord]);
    triggerToast('Novo registro de backup adicionado!', 'success');
  };

  const handleDeleteBackupRecord = (id: string) => {
    setBackupRecords(prev => prev.filter(r => r.id !== id));
    triggerToast('Registro de backup removido!', 'info');
  };

  const handleUpdateRecord = (id: string, fields: Partial<BackupRecord>) => {
    setBackupRecords(prev => prev.map(r => r.id === id ? { ...r, ...fields } : r));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Controls Block */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-semibold text-sm text-slate-800">
              Registro de Backup
            </h2>
            <p className="text-xs text-slate-400 mt-1">Selecione o ano e a semana para verificar ou adicionar logs de backup.</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Ano:</span>
              <select
                value={backupSelectedYear}
                onChange={e => setBackupSelectedYear(parseInt(e.target.value, 10))}
                className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-semibold focus:outline-none hover:bg-slate-100 cursor-pointer text-slate-700"
              >
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Semana:</span>
              <select
                value={backupSelectedWeekId}
                onChange={e => setBackupSelectedWeekId(e.target.value)}
                className="bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-semibold focus:outline-none hover:bg-slate-100 cursor-pointer text-slate-700 max-w-[200px]"
              >
                {backupWeeks.map(w => (
                  <option key={w.id} value={w.id}>
                    {formatWeekLabel(w.startDate, w.endDate)}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleAddBackupRecord}
              className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Adicionar Registro
            </button>
          </div>
        </div>

        {/* Info header strip */}
        {activeWeek && (
          <div className="bg-[#ECA172]/10 border-l-4 border-[#ECA172] text-slate-800 font-semibold p-3 px-4 text-left rounded-r-xl text-xs flex items-center justify-between select-none">
            <span className="font-semibold uppercase tracking-wider text-[#D77436]">
              Semana de {activeWeekStartDateFormatted}
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {filteredBackupRecords.length} registros ativos
            </span>
          </div>
        )}

        {filteredBackupRecords.length === 0 ? (
          <div className="p-12 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
            Nenhum evento registrado para backup nesta semana. Clique em "Adicionar Registro" para começar.
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200/60 rounded-2xl shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 uppercase font-mono text-[9px] border-b border-slate-100">
                  <th className="p-2.5 px-3 border-r border-slate-100 font-semibold">Projeto / Origem</th>
                  <th className="p-2.5 px-3 border-r border-slate-100 font-semibold">Fase</th>
                  <th className="p-2.5 px-3 border-r border-slate-100 font-semibold">Progresso</th>
                  <th className="p-2.5 px-3 border-r border-slate-100 font-semibold">Backup</th>
                  <th className="p-2.5 px-3 border-r border-slate-100 font-semibold">Técnico</th>
                  <th className="p-2.5 px-3 border-r border-slate-100 font-semibold">Descrição do Evento & Link Workspace</th>
                  <th className="p-2.5 px-3 text-center font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px] text-slate-700">
                {filteredBackupRecords.map(rec => (
                  <tr 
                    key={rec.id} 
                    className="hover:bg-slate-50/40 transition-colors"
                  >
                    {/* Project */}
                    <td className="p-1 px-3 border-r border-slate-100 max-w-[180px]">
                      <input
                        type="text"
                        value={rec.project}
                        onChange={e => handleUpdateRecord(rec.id, { project: e.target.value })}
                        className="w-full bg-transparent border-none p-1 font-semibold text-slate-800 focus:bg-slate-50 focus:ring-0 text-[11px] rounded focus:outline-none"
                        placeholder="Nome do Projeto"
                      />
                    </td>

                    {/* Fase */}
                    <td className="p-1 px-3 border-r border-slate-100 w-[140px]">
                      <select
                        value={rec.fase}
                        onChange={e => handleUpdateRecord(rec.id, { fase: e.target.value })}
                        className="bg-transparent border-none p-1 text-slate-700 font-semibold focus:bg-slate-50 focus:ring-0 text-[11px] rounded cursor-pointer w-full focus:outline-none"
                      >
                        <option value="01_Levantamentos">01_Levantamentos</option>
                        <option value="02_Estudo Prévio">02_Estudo Prévio</option>
                        <option value="03_Licenciamento">03_Licenciamento</option>
                        <option value="04_Prefeitura">04_Prefeitura</option>
                        <option value="05_Executivo">05_Executivo</option>
                        <option value="06_Detalhamentos">06_Detalhamentos</option>
                        <option value="N/D">N/D</option>
                      </select>
                    </td>

                    {/* Progress */}
                    <td className="p-1 px-3 border-r border-slate-100 w-[140px]">
                      <select
                        value={rec.progress}
                        onChange={e => handleUpdateRecord(rec.id, { progress: e.target.value })}
                        className="bg-transparent border-none p-1 text-slate-700 font-semibold focus:bg-slate-50 focus:ring-0 text-[11px] rounded cursor-pointer w-full focus:outline-none"
                      >
                        <option value="Em Desenvolvimento">Em Desenvolvimento</option>
                        <option value="Não Iniciado">Não Iniciado</option>
                        <option value="Em Revisão">Em Revisão</option>
                        <option value="Concluído">Concluído</option>
                        <option value="Suspenso">Suspenso</option>
                      </select>
                    </td>

                    {/* Status */}
                    <td className="p-1 px-3 border-r border-slate-100 w-[120px]">
                      <select
                        value={rec.status}
                        onChange={e => {
                          const val = e.target.value as 'Realizado' | 'Não Realizado';
                          handleUpdateRecord(rec.id, { status: val });
                          triggerToast(`Backup de ${rec.project} marcado como ${val}!`, 'info');
                        }}
                        className={`p-1 px-2 rounded text-[10px] border focus:ring-0 cursor-pointer font-semibold w-full text-center focus:outline-none ${
                          rec.status === 'Realizado' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        <option value="Realizado">Realizado</option>
                        <option value="Não Realizado">Não Realizado</option>
                      </select>
                    </td>

                    {/* Técnico */}
                    <td className="p-1 px-3 border-r border-slate-100 w-[110px]">
                      <select
                        value={rec.tecnico}
                        onChange={e => handleUpdateRecord(rec.id, { tecnico: e.target.value })}
                        className="bg-transparent border-none p-1 text-slate-700 font-semibold focus:bg-slate-50 focus:ring-0 text-[11px] rounded cursor-pointer w-full uppercase focus:outline-none"
                      >
                        <option value="ANA">ANA</option>
                        <option value="ÉRIKA">ÉRIKA</option>
                        <option value="GUSTAVO">GUSTAVO</option>
                        <option value="PEDRO">PEDRO</option>
                        <option value="CLÁUDIA">CLÁUDIA</option>
                        <option value="SOFIA">SOFIA</option>
                        <option value="MIGUEL">MIGUEL</option>
                        <option value="JOÃO">JOÃO</option>
                        <option value="MARIA">MARIA</option>
                      </select>
                    </td>

                    {/* Desc & Link */}
                    <td className="p-1 px-3 border-r border-slate-100">
                      <div className="flex flex-col gap-1 w-full">
                        <input
                          type="text"
                          value={rec.desc}
                          onChange={e => handleUpdateRecord(rec.id, { desc: e.target.value })}
                          className="w-full bg-transparent border-none p-1 text-slate-800 focus:bg-slate-50 focus:ring-0 text-[11px] rounded font-semibold focus:outline-none"
                          placeholder="Descrição do Evento (ex: REVIT EXECUTIVO)"
                        />
                        <div className="flex items-center gap-1.5 px-1">
                          <input
                            type="text"
                            value={rec.link || ''}
                            onChange={e => handleUpdateRecord(rec.id, { link: e.target.value })}
                            className="flex-1 bg-transparent border-none p-0 text-slate-600 focus:bg-slate-50 focus:ring-0 text-[10px] rounded placeholder:text-slate-350 focus:outline-none placeholder:italic"
                            placeholder="Link Google Drive (opcional)"
                          />
                          {rec.link && (
                            <a 
                              href={rec.link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-[10px] text-slate-600 underline font-semibold hover:text-black whitespace-nowrap"
                            >
                              Abrir ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-1 px-3 text-center w-12">
                      <button
                        type="button"
                        onClick={() => handleDeleteBackupRecord(rec.id)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                        title="Remover Registro de Backup"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Elegant Info Banner */}
      <div className="p-5 bg-gradient-to-r from-orange-50/50 to-amber-50/50 border border-orange-100 rounded-2xl space-y-2 flex items-start gap-4">
        <div className="p-2 bg-orange-100/60 text-orange-700 rounded-xl shrink-0">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-semibold text-xs text-slate-800 uppercase tracking-wider font-sans">
            Integração de Sincronização Automática (Futuro Módulo)
          </h4>
          <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
            Esta tela representa o registro e mapeamento de backup. Numa futura atualização integrada à infraestrutura de Cloud, os arquivos dos projetos selecionados serão empacotados, validados contra os servidores de diretório e transmitidos automaticamente para o Google Drive institucional.
          </p>
        </div>
      </div>
    </div>
  );
}
