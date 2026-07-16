import React from 'react';
import { 
  FileCode, Lock, Smartphone, ArrowRight, Calendar, Users, 
  Briefcase, Database, Box, Truck, BarChart3, Handshake, ShieldCheck, Clock,
  ArrowUpRight, HelpCircle, Activity, Sparkles, User
} from 'lucide-react';
import { Task, Project, Complementar, SoftwareLicense, Week, EngineeringProject, BackupRecord } from '../../types';

import project1 from '../../assets/projects/project1.jpg';
import project2 from '../../assets/projects/project2.jpg';
import project3 from '../../assets/projects/project3.jpg';
import project4 from '../../assets/projects/project4.jpg';
import project5 from '../../assets/projects/project5.jpg';

const PROJECT_IMAGES = [project1, project2, project3, project4, project5];

interface DashboardTabProps {
  userRole: 'admin' | 'arquiteto' | 'estagiario';
  setActiveTab: (tab: string) => void;
  complementares: Complementar[];
  licenses: SoftwareLicense[];
  projects: Project[];
  tasks: Task[];
  weeks: Week[];
  weekHojeId: string;
  complementaresProjects: EngineeringProject[];
  backupRecords: BackupRecord[];
}

export default function DashboardTab({
  userRole,
  setActiveTab,
  complementares,
  licenses,
  projects,
  tasks,
  weeks,
  weekHojeId,
  complementaresProjects,
  backupRecords
}: DashboardTabProps) {

  const [currentImgIndex, setCurrentImgIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex(prev => (prev + 1) % PROJECT_IMAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // 1. Calculations
  const pendingComplementaresCount = complementares.filter(
    c => c.status === 'Pendente' || c.status === 'Sob Revisão'
  ).length;

  const expiringLicensesCount = licenses.filter(
    lic => lic.revitData && lic.revitData !== '-'
  ).length;

  const deliveredTabletsCount = projects.filter(
    p => p.tabletStatus === 'Entregue'
  ).length;

  const currentWeek = weeks.find(w => w.id === weekHojeId);
  const currentWeekTasks = currentWeek 
    ? tasks.filter(t => t.date >= currentWeek.startDate && t.date <= currentWeek.endDate && t.title !== '' && t.project !== '')
    : [];
  const currentWeekTasksCount = currentWeekTasks.length;

  // Completed tasks rate
  const completedWeekTasksCount = currentWeekTasks.filter(t => t.status === 'Realizado').length;
  const taskAdhesionRate = currentWeekTasksCount > 0 ? Math.round((completedWeekTasksCount / currentWeekTasksCount) * 100) : 0;

  // SLA Calculation
  let totalSlaDays = 0;
  let completedRevisionsCount = 0;
  (complementaresProjects || []).forEach(ep => {
    Object.values(ep.disciplinas).forEach(d => {
      if (d.status === 'Não se aplica') return;
      d.historico.forEach(h => {
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

  // Backup Success Rate
  const totalBackupsCount = (backupRecords || []).length;
  const realizedBackupsCount = (backupRecords || []).filter(b => b.status === 'Realizado').length;
  const backupSuccessRate = totalBackupsCount > 0 ? Math.round((realizedBackupsCount / totalBackupsCount) * 100) : 100;

  // Projects with architecture (associated in complementaresProjects)
  const archProjectsCount = (complementaresProjects || []).filter(
    p => p.arquiteto && p.arquiteto !== '-' && p.arquiteto !== ''
  ).length;
  // Maximum of 5 projects represents 100% on the thermometer (15 ticks)
  const filledTicksCount = Math.min(15, Math.max(0, archProjectsCount * 3));

  // Architect names and allocation data for the main chart
  const architectsChartData = [
    { name: 'Ana', count: tasks.filter(t => t.archId === 'ana' && t.title !== '').length, color: 'bg-slate-900' },
    { name: 'Pedro', count: tasks.filter(t => t.archId === 'pedro' && t.title !== '').length, color: 'bg-slate-700' },
    { name: 'Sofia', count: tasks.filter(t => t.archId === 'sofia' && t.title !== '').length, color: 'bg-slate-600' },
    { name: 'Claudia', count: tasks.filter(t => t.archId === 'claudia' && t.title !== '').length, color: 'bg-slate-500' },
    { name: 'Miguel', count: tasks.filter(t => t.archId === 'miguel' && t.title !== '').length, color: 'bg-slate-400' },
    { name: 'Maria', count: tasks.filter(t => t.archId === 'maria' && t.title !== '').length, color: 'bg-slate-400' },
    { name: 'Ricardo', count: tasks.filter(t => t.archId === 'ricardo' && t.title !== '').length, color: 'bg-slate-300' }
  ];
  const maxTasksCount = Math.max(...architectsChartData.map(d => d.count), 4);

  // User Profile metadata for the ID Card
  const profileNames = {
    admin: { name: 'Gustavo Antunes', role: 'Diretor de Projetos (ADM)', cardNo: '•••• •••• •••• 1994' },
    arquiteto: { name: 'Arq. Ana Oliveira', role: 'Coordenadora de Arquitetura', cardNo: '•••• •••• •••• 2026' },
    estagiario: { name: 'Pedro Santos', role: 'Assistente de Projetos (Estágio)', cardNo: '•••• •••• •••• 2027' }
  };
  const currentProfile = profileNames[userRole] || profileNames.arquiteto;

  // Shortcuts / modules
  const SHORTCUT_ICONS: { [key: string]: React.ComponentType<any> } = {
    cronograma: Calendar,
    responsaveis: Users,
    projetos: Briefcase,
    complementares: FileCode,
    bim: Box,
    senhas: Lock,
    backups: Database,
    logistica: Truck,
    partners: Handshake,
    licencas: ShieldCheck,
    client_area: User,
  };

  const shortcuts = [
    { tab: 'cronograma', label: 'Cronograma' },
    { tab: 'responsaveis', label: 'Responsáveis' },
    { tab: 'complementares', label: 'Complementares' },
    { tab: 'bim', label: 'Gestão BIM' },
    { tab: 'logistica', label: 'Tablets e Placas' },
    { tab: 'partners', label: 'Parceiros' },
    ...(userRole !== 'estagiario' ? [
      { tab: 'licencas', label: 'Licenças' },
      { tab: 'senhas', label: 'Senhas' },
      { tab: 'backups', label: 'Backups' }
    ] : []),
    ...(userRole === 'admin' ? [
      { tab: 'projetos', label: 'Projetos ADM' }
    ] : []),
    { tab: 'client_area', label: 'Área do Cliente' }
  ];

  const renderThermometerTicks = () => {
    const ticks = [];
    const startAngle = 195;
    const endAngle = 345;
    const tickColors = [
      '#FDA4AF', '#FB7185', '#F472B6', '#EC4899', '#D946EF', // pinks / magentas
      '#FDBA74', '#F97316', '#EA580C', '#EF4444', '#DC2626', // oranges / reds
      '#EF4444', '#EA580C', '#F97316', '#F59E0B', '#FBBF24'  // warm gradient
    ];

    for (let i = 0; i < 15; i++) {
      const angle = startAngle + (i / 14) * (endAngle - startAngle);
      const angleRad = (angle * Math.PI) / 180;
      const x1 = 100 + 60 * Math.cos(angleRad);
      const y1 = 90 + 60 * Math.sin(angleRad);
      const x2 = 100 + 78 * Math.cos(angleRad);
      const y2 = 90 + 78 * Math.sin(angleRad);
      const isActive = i < filledTicksCount;
      const strokeColor = isActive ? tickColors[i] : '#e2e8f0';
      
      ticks.push(
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={strokeColor}
          strokeWidth="4.5"
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      );
    }
    return ticks;
  };

  return (
    <div className="min-h-[calc(100vh-3.25rem)] flex flex-col justify-start gap-6 animate-fade-in font-sans pb-24 pt-2">

      {/* Main Grid: matches ACRU dashboard proportion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
        
        {/* LEFT/MIDDLE SECTION (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col justify-start gap-6 h-full">
          
          {/* Row 1: Large Chart (Balance overview style) & 2 side KPIs (Income/Expenses style) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* 1.1 Volume de Trabalho (Main Chart - 8 cols) */}
            <div className="md:col-span-8 bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm space-y-5">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Desempenho</span>
                  <h3 className="text-base font-semibold text-slate-950 font-sans tracking-tight mt-0.5">Carga de Trabalho da Equipe</h3>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-semibold text-slate-500">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-950"></span>
                    <span>Tarefas Alocadas</span>
                  </div>
                </div>
              </div>

              {/* Capsule bar chart wrapper */}
              <div className="flex justify-between items-end h-[160px] pt-4 px-2">
                {architectsChartData.map((d, idx) => {
                  const percentage = Math.min(100, Math.max(10, (d.count / maxTasksCount) * 100));
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 group relative">
                      {/* Tooltip on hover */}
                      <span className="absolute -top-7 scale-0 group-hover:scale-100 bg-slate-950 text-white text-[8px] font-mono font-semibold py-1 px-2 rounded-md transition-all shadow-md z-10 whitespace-nowrap">
                        {d.count} {d.count === 1 ? 'tarefa' : 'tarefas'}
                      </span>
                      
                      {/* Rounded capsule bar */}
                      <div className="w-7 h-[120px] bg-slate-50 border border-slate-100 rounded-full relative overflow-hidden flex items-end justify-center shadow-inner hover:border-slate-350 hover:bg-slate-100/50 transition-all duration-200">
                        {/* Fill capsule block */}
                        <div 
                          className={`w-full rounded-full ${d.color} transition-all duration-500 ease-out`} 
                          style={{ height: `${percentage}%` }}
                        />
                      </div>
                      
                      {/* Label */}
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight font-mono">
                        {d.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 1.2 Side Operational KPIs (Total Income/Expenses style - 4 cols) */}
            <div className="md:col-span-4 flex flex-col gap-4">
              
              {/* Mini KPI 1: SLA de Revisão */}
              <button 
                onClick={() => setActiveTab('complementares')}
                className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm text-left hover:border-slate-300 hover:shadow-md transition-all duration-200 group cursor-pointer h-1/2 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Engenharia</span>
                  <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-tight mt-0.5">SLA de Revisão</h4>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-bold text-slate-950 tracking-tight">{avgSlaDays.toFixed(1)}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">dias úteis</span>
                </div>
                <div className="text-[9px] text-slate-400 font-mono mt-1 border-t border-slate-50 pt-1 flex items-center justify-between">
                  <span>Média de devolução</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </button>

              {/* Mini KPI 2: Aguardando Retorno */}
              <button 
                onClick={() => setActiveTab('complementares')}
                className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm text-left hover:border-slate-300 hover:shadow-md transition-all duration-200 group cursor-pointer h-1/2 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Projetistas</span>
                  <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-tight mt-0.5">Aguardando Retorno</h4>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-bold text-slate-950 tracking-tight">{pendingComplementaresCount}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">arquivos</span>
                </div>
                <div className="text-[9px] text-slate-400 font-mono mt-1 border-t border-slate-50 pt-1 flex items-center justify-between">
                  <span>Verificar pendências</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </button>

            </div>

          </div>

          {/* Row 2: Aderência ao Cronograma */}
          <div className="w-full bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Eficiência Semanal</span>
                <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-tight">Aderência ao Cronograma</h3>
              </div>
              <span className="text-[10px] bg-slate-950 text-white px-2 py-0.5 rounded-full font-mono font-bold">{taskAdhesionRate}%</span>
            </div>

            <div className="space-y-2">
              {/* Horizontal Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden relative border border-slate-150">
                <div 
                  className="bg-slate-950 h-full rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${taskAdhesionRate}%` }}
                />
              </div>
              
              <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
                <span>{completedWeekTasksCount} Concluídas</span>
                <span>{currentWeekTasksCount} Planejadas</span>
              </div>
            </div>
          </div>

          {/* Row 3: Cost analysis, Financial health, Thermometer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
            
            {/* 3.1 Divisão por Disciplina (Cost analysis style) */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Distribuição</span>
                <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-tight mt-0.5">Engenharias por Área</h3>
              </div>

              <div className="space-y-3 pt-1 mt-auto">
                {/* Item 1: Estruturas */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-700 font-semibold">Estruturas</span>
                    <span className="text-slate-400 font-mono">40%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-slate-900 h-full rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>

                {/* Item 2: Hidráulica */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-700 font-semibold">Hidráulica</span>
                    <span className="text-slate-400 font-mono">30%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-slate-700 h-full rounded-full" style={{ width: '30%' }}></div>
                  </div>
                </div>

                {/* Item 3: Incêndio */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-700 font-semibold">Prevenção Incêndio</span>
                    <span className="text-slate-400 font-mono">20%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-slate-500 h-full rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3.2 Integridade de Backups (Financial health style - gauge) */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm flex flex-col justify-between items-center text-center">
              <div className="w-full text-left">
                <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Auditoria TI</span>
                <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-tight mt-0.5">Integridade de Backups</h3>
              </div>

              {/* Gauge SVG ring */}
              <div className="relative w-full flex items-center justify-center pt-2">
                <svg viewBox="0 0 100 55" className="w-36">
                  {/* Background Arc */}
                  <path 
                    d="M 10 50 A 40 40 0 0 1 90 50" 
                    fill="none" 
                    stroke="#f1f5f9" 
                    strokeWidth="9" 
                    strokeLinecap="round" 
                  />
                  {/* Colored/Progress Arc */}
                  <path 
                    d="M 10 50 A 40 40 0 0 1 90 50" 
                    fill="none" 
                    stroke="#0f172a" 
                    strokeWidth="9" 
                    strokeLinecap="round" 
                    strokeDasharray="125.6" 
                    strokeDashoffset={125.6 * (1 - backupSuccessRate/100)}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                
                {/* Center text overlay */}
                <div className="absolute bottom-2 flex flex-col items-center">
                  <span className="text-xl font-bold text-slate-900 leading-none">{backupSuccessRate}%</span>
                  <span className="text-[8px] font-mono text-slate-450 uppercase mt-0.5">projetos salvos</span>
                </div>
              </div>

              <span className="text-[9px] text-slate-450 leading-tight mt-2 font-mono">
                {realizedBackupsCount} de {totalBackupsCount} backups realizados
              </span>
            </div>

            {/* 3.3 Termômetro de Projetos Complementares */}
            <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm flex flex-col justify-between items-center text-center">
              <div className="w-full text-left">
                <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block">Integração BIM</span>
                <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-tight mt-0.5">Termômetro Complementares</h3>
              </div>

              {/* Gauge and values */}
              <div className="w-full pt-1">
                <div className="flex justify-center items-baseline gap-1.5">
                  <span className="text-2xl font-bold text-slate-950 tracking-tight">{archProjectsCount}</span>
                  <span className="text-[10px] text-slate-500 font-medium">projetos com arq.</span>
                </div>
                <div className="text-[9px] text-emerald-600 font-mono font-bold flex items-center justify-center gap-0.5 mt-0.5">
                  <span>▲ 40%</span>
                  <span className="text-slate-450 font-normal">vs último mês</span>
                </div>
              </div>

              {/* SVG Thermometer Dial */}
              <div className="relative w-full flex items-center justify-center -mt-2">
                <svg viewBox="0 0 200 110" className="w-40">
                  {renderThermometerTicks()}
                </svg>
              </div>

              <div className="space-y-2.5 w-full pt-1">
                <div className="space-y-0.5">
                  <h4 className="text-[10.5px] font-bold text-slate-850 uppercase tracking-tight">Compatibilidade BIM</h4>
                  <p className="text-[9px] text-slate-450 leading-relaxed max-w-[150px] mx-auto">
                    Escritório operando com alta aderência e integração de engenharias complementares.
                  </p>
                </div>

                <button 
                  onClick={() => setActiveTab('complementares')}
                  className="w-full bg-slate-950 text-white rounded-xl py-2 text-[10px] font-semibold uppercase tracking-wider hover:bg-slate-900 transition-colors shadow-sm cursor-pointer"
                >
                  Ver Compatíveis
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN / SIDEBAR WIDGETS (4 Cols) */}
        <div className="lg:col-span-4 flex flex-col justify-start gap-6 h-full">
          
          {/* Fpoles Portfolio Slideshow Card */}
          <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm aspect-video w-full relative group">
            <div className="absolute inset-0 bg-slate-950">
              <img 
                src={PROJECT_IMAGES[currentImgIndex]} 
                alt={`Projeto Fpoles ${currentImgIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-700 ease-in-out"
              />

              <div className="absolute bottom-4 right-4 flex gap-1 z-10">
                {PROJECT_IMAGES.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImgIndex(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImgIndex ? 'bg-white w-3' : 'bg-white/40'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-tight">Ações Rápidas</h3>
            
            <div className="grid grid-cols-5 gap-2 text-center">
              {/* Action 1: Nova Tarefa */}
              <button 
                onClick={() => setActiveTab('cronograma')}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-slate-950 group-hover:text-white transition-all duration-200 shadow-sm">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter truncate w-full">Tarefa</span>
              </button>

              {/* Action 2: Backup */}
              <button 
                onClick={() => {
                  if (userRole !== 'estagiario') {
                    setActiveTab('backups');
                  } else {
                    setActiveTab('cronograma');
                  }
                }}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-slate-950 group-hover:text-white transition-all duration-200 shadow-sm">
                  <Database className="w-4 h-4" />
                </div>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter truncate w-full">Backup</span>
              </button>

              {/* Action 3: Senha */}
              <button 
                onClick={() => {
                  if (userRole !== 'estagiario') {
                    setActiveTab('senhas');
                  } else {
                    setActiveTab('cronograma');
                  }
                }}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-slate-950 group-hover:text-white transition-all duration-200 shadow-sm">
                  <Lock className="w-4 h-4" />
                </div>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter truncate w-full">Senha</span>
              </button>

              {/* Action 4: Logística */}
              <button 
                onClick={() => setActiveTab('logistica')}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-slate-950 group-hover:text-white transition-all duration-200 shadow-sm">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter truncate w-full">Logística</span>
              </button>

              {/* Action 5: Licenças */}
              <button 
                onClick={() => {
                  if (userRole !== 'estagiario') {
                    setActiveTab('licencas');
                  } else {
                    setActiveTab('cronograma');
                  }
                }}
                className="flex flex-col items-center gap-1 group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 group-hover:bg-slate-950 group-hover:text-white transition-all duration-200 shadow-sm">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter truncate w-full">Licença</span>
              </button>
            </div>
          </div>

          {/* Card 3: Equipe em Foco (Avatars list) */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-tight">Equipe em Atividade</h3>
            
            {/* Avatars List */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
              {[
                { initial: 'PA', name: 'Pedro', color: 'bg-slate-950' },
                { initial: 'CS', name: 'Cláudia', color: 'bg-slate-800' },
                { initial: 'SR', name: 'Sofia', color: 'bg-slate-700' },
                { initial: 'AO', name: 'Ana', color: 'bg-slate-600' },
                { initial: 'MS', name: 'Miguel', color: 'bg-slate-500' },
                { initial: 'MC', name: 'Maria', color: 'bg-slate-400' }
              ].map((p, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1 shrink-0">
                  <div className={`w-9 h-9 rounded-full ${p.color} text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm ring-1 ring-slate-150`}>
                    {p.initial}
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 font-mono uppercase">{p.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 4: Histórico de Atividades (Transaction History style) */}
          <div className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm flex flex-col justify-between flex-grow">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-tight">Histórico de Atividades</h3>
              <span className="text-[8px] font-bold font-mono text-slate-400">Recentes</span>
            </div>

            <div className="space-y-3 mt-auto">
              {/* Item 1: Backup */}
              <div className="flex justify-between items-center text-[10px] border-b border-slate-50 pb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-700">
                    <Database className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-slate-800 font-semibold block">Backup Concluído</span>
                    <span className="text-[8px] text-slate-400 font-mono">Bela Vista - Bloco A</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-900 font-bold block">10:20</span>
                  <span className="text-[7.5px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono">Sucesso</span>
                </div>
              </div>

              {/* Item 2: Tablet entregue */}
              <div className="flex justify-between items-center text-[10px] border-b border-slate-50 pb-2">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-700">
                    <Smartphone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-slate-800 font-semibold block">Tablet Entregue</span>
                    <span className="text-[8px] text-slate-400 font-mono">Terminal Logístico</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-900 font-bold block">Ontem</span>
                  <span className="text-[7.5px] bg-slate-100 text-slate-650 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono">Ativo</span>
                </div>
              </div>

              {/* Item 3: File Revision */}
              <div className="flex justify-between items-center text-[10px]">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-slate-50 border border-slate-100 rounded-lg text-slate-700">
                    <FileCode className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-slate-800 font-semibold block">Desenho Complementar</span>
                    <span className="text-[8px] text-slate-400 font-mono">Revisão Fundações</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-slate-900 font-bold block">14/Jul</span>
                  <span className="text-[7.5px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider font-mono">Sob Rev.</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
