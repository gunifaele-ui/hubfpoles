import React from 'react';
import { 
  FileCode, Lock, Smartphone, ArrowRight, LayoutDashboard, Calendar, Users, 
  Briefcase, Database, Box, Truck, BarChart3
} from 'lucide-react';
import { Task, Project, Complementar, Tablet, Placa, Clash, PrefeituraCredential, SoftwareLicense } from '../../types';

interface DashboardTabProps {
  userRole: 'admin' | 'arquiteto' | 'estagiario';
  setActiveTab: (tab: string) => void;
  complementares: Complementar[];
  licenses: SoftwareLicense[];
  projects: Project[];
}

export default function DashboardTab({
  userRole,
  setActiveTab,
  complementares,
  licenses,
  projects
}: DashboardTabProps) {
  const pendingComplementaresCount = complementares.filter(
    c => c.status === 'Pendente' || c.status === 'Sob Revisão'
  ).length;

  const expiringLicensesCount = licenses.filter(
    lic => lic.revitData && lic.revitData !== '-'
  ).length;

  const deliveredTabletsCount = projects.filter(
    p => p.tabletStatus === 'Entregue'
  ).length;

  const SHORTCUT_ICONS: { [key: string]: React.ComponentType<any> } = {
    cronograma: Calendar,
    responsaveis: Users,
    projetos: Briefcase,
    complementares: FileCode,
    bim: Box,
    senhas: Lock,
    backups: Database,
    logistica: Truck,
    executive: BarChart3,
  };

  const shortcuts = [
    { tab: 'cronograma', label: 'Cronograma', desc: 'Planejamento semanal de atividades por arquiteto.' },
    { tab: 'responsaveis', label: 'Responsáveis por Projeto', desc: 'Atribuição de equipe e gestão de responsáveis.' },
    ...(userRole !== 'estagiario' ? [{ tab: 'executive', label: 'Painel Executivo', desc: 'Indicadores estratégicos de produtividade, SLAs e BIM para os sócios.' }] : []),
    { tab: 'complementares', label: 'Projetos Complementares', desc: 'Modelos e arquivos de estruturas, hidráulica e incêndio.' },
    { tab: 'backups', label: 'Backup Semanal', desc: 'Auditoria de backups das fases dos projetos.' },
    { tab: 'senhas', label: 'Senhas', desc: 'Cofre de credenciais de portais governamentais e e-mails.' },
    { tab: 'bim', label: 'Gestão BIM', desc: 'Simulador e detecção de colisões espaciais 3D.' },
    { tab: 'logistica', label: 'Tablets e Placas', desc: 'Rastreabilidade de equipamentos e placas físicas de obra.' },
    ...(userRole === 'admin' ? [{ tab: 'projetos', label: 'Projetos (ADM)', desc: 'Criação e edição administrativa de projetos.' }] : [])
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Complementares */}
        <button
          onClick={() => setActiveTab('complementares')}
          className="bg-white border border-slate-200/60 rounded-2xl p-5 text-left flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all duration-200 group cursor-pointer w-full relative overflow-hidden"
        >
          <div className="space-y-3 w-full">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-sans">Engenharias</span>
                <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-tight group-hover:text-slate-900 transition-colors">Aguardando Retorno</h3>
              </div>
              <div className="p-3 bg-slate-950 text-white rounded-xl shrink-0 group-hover:bg-slate-900 transition-colors">
                <FileCode className="w-5 h-5" />
              </div>
            </div>
            
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-semibold text-slate-900 font-sans tracking-tight">
                {pendingComplementaresCount}
              </div>
              <span className="text-[10px] font-sans text-slate-400">ficheiros pendentes</span>
            </div>
            
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Verificar pendências</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </button>

        {/* Card 2: Licenças */}
        <button
          onClick={() => setActiveTab('licencas')}
          className="bg-white border border-slate-200/60 rounded-2xl p-5 text-left flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all duration-200 group cursor-pointer w-full relative overflow-hidden"
        >
          <div className="space-y-3 w-full">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-sans">Ativos de TI</span>
                <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-tight group-hover:text-slate-900 transition-colors">Renovação de Software</h3>
              </div>
              <div className="p-3 bg-slate-950 text-white rounded-xl shrink-0 group-hover:bg-slate-900 transition-colors">
                <Lock className="w-5 h-5" />
              </div>
            </div>
            
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-semibold text-slate-900 font-sans tracking-tight">
                {expiringLicensesCount}
              </div>
              <span className="text-[10px] font-sans text-slate-400">licenças ativas</span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Gerenciar licenças</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </button>

        {/* Card 3: Tablets */}
        <button
          onClick={() => setActiveTab('logistica')}
          className="bg-white border border-slate-200/60 rounded-2xl p-5 text-left flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all duration-200 group cursor-pointer w-full relative overflow-hidden"
        >
          <div className="space-y-3 w-full">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-sans">Logística</span>
                <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-tight group-hover:text-slate-900 transition-colors">Tablets Entregues</h3>
              </div>
              <div className="p-3 bg-slate-950 text-white rounded-xl shrink-0 group-hover:bg-slate-900 transition-colors">
                <Smartphone className="w-5 h-5" />
              </div>
            </div>
            
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-semibold text-slate-900 font-sans tracking-tight">
                {deliveredTabletsCount}
              </div>
              <span className="text-[10px] font-sans text-slate-400">ativos em obras</span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Ver controle de logística</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        </button>
      </div>

      {/* Main Dense Workspace Area - Shortcuts */}
      <div className="space-y-4 pt-2">
        <div className="border-b border-slate-100 pb-2">
          <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider font-sans">Acesso Rápido aos Módulos</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shortcuts.map((sc, idx) => {
            const Icon = SHORTCUT_ICONS[sc.tab] || ArrowRight;
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(sc.tab)}
                className="bg-white border border-slate-200/50 hover:border-slate-300 rounded-2xl p-5 text-left flex flex-col justify-between hover:shadow-md transition-all duration-200 group cursor-pointer min-h-[140px]"
              >
                <div className="space-y-3 w-full">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 bg-slate-100 text-slate-800 rounded-xl group-hover:bg-slate-950 group-hover:text-white transition-colors duration-200">
                      <Icon className="w-4 h-4" />
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-700 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-slate-800 text-xs group-hover:text-slate-900 transition-colors uppercase tracking-tight">
                      {sc.label}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-sans leading-normal">{sc.desc}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
