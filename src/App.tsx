import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  LayoutDashboard, Calendar, Users, FileCode, Box, Lock, Database, Truck,
  ChevronLeft, ChevronRight, Menu, X, Plus, Copy, Clipboard, 
  CheckCircle2, AlertTriangle, Eye, EyeOff, Play, RefreshCw, Trash2, ShieldCheck, ArrowRight,
  Highlighter, ChevronDown, Search, Mail, Settings, Shield, User, Briefcase, Smartphone,
  Handshake, LogOut
} from 'lucide-react';
import { 
  Architect, Task, Project, Complementar, Tablet, Placa, Clash, 
  PrefeituraCredential, SoftwareLicense, Toast, Week, BackupRecord, RevitTemplateRequirement,
  EngineeringProject 
} from './types';
import { 
  ARCHITECTS, INITIAL_PROJECTS, INITIAL_TASKS, INITIAL_COMPLEMENTARES, 
  INITIAL_TABLETS, INITIAL_PLACAS, INITIAL_CLASHES, INITIAL_CREDENTIALS, 
  INITIAL_LICENSES, WEEKS, WEEK_HOJE_ID, PORTUGUESE_DAYS, INITIAL_BACKUP_RECORDS, INITIAL_REVIT_TEMPLATE_REQUIREMENTS,
  INITIAL_ENGINEERING_PROJECTS
} from './constants';
import ComplementaresModule from './components/ComplementaresModule';
import { GeminiAssistant } from './components/GeminiAssistant';

// Tab Submodules
import DashboardTab from './components/tabs/DashboardTab';
import CronogramaTab from './components/tabs/CronogramaTab';
import ResponsaveisTab from './components/tabs/ResponsaveisTab';
import ProjetosTab from './components/tabs/ProjetosTab';
import BimTab from './components/tabs/BimTab';
import LicencasTab from './components/tabs/LicencasTab';
import SenhasTab from './components/tabs/SenhasTab';
import BackupsTab from './components/tabs/BackupsTab';
import LogisticaTab from './components/tabs/LogisticaTab';

// Logo
import fpolesLogo from './assets/fpoles_logo.png';

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

function formatDateToDMY(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function generateWeeksForYear(year: number): Week[] {
  const weeks: Week[] = [];
  let current = new Date(year, 0, 1);
  let dayOfWeek = current.getDay();
  let diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  current.setDate(current.getDate() + diffToMonday);

  let weekIndex = 1;
  while (current.getFullYear() <= year || (current.getFullYear() === year + 1 && weeks.length < 52)) {
    const days: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(current);
      d.setDate(current.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      days.push(`${yyyy}-${mm}-${dd}`);
    }

    const label = `Semana ${weekIndex} (${days[0].split('-')[2]}/${days[0].split('-')[1]} a ${days[6].split('-')[2]}/${days[6].split('-')[1]})`;

    weeks.push({
      id: `${year}-w${weekIndex}`,
      label,
      startDate: days[0],
      endDate: days[6],
      days
    });

    current.setDate(current.getDate() + 7);
    weekIndex++;
  }
  return weeks;
}

function getTodayWeekId(year: number, weeks: Week[]): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const found = weeks.find(w => todayStr >= w.startDate && todayStr <= w.endDate);
  if (found) return found.id;
  return `${year}-w4`; // fallback to week 4
}

export default function App() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // --- PREMIUM LOGIN AUTHENTICATION STATES ---
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('fpoles_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const handleLoginSubmit = () => {
    if (passwordInput === '246810') {
      setIsUnlocking(true);
      setTimeout(() => {
        sessionStorage.setItem('fpoles_auth', 'true');
        setIsAuthenticated(true);
      }, 700); // matches the transition duration
    } else {
      setLoginError(true);
      triggerToast('Senha de acesso incorreta!', 'warning');
    }
  };
  
  // Year & Weeks
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const weeks = generateWeeksForYear(selectedYear);
  const weekHojeId = getTodayWeekId(selectedYear, weeks);
  const [selectedWeekId, setSelectedWeekId] = useState<string>(weekHojeId);

  // States with LocalStorage loading
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('fpoles_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('fpoles_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  // GestaEng: New Engineering Projects State
  const [complementaresProjects, setComplementaresProjects] = useState<EngineeringProject[]>(() => {
    const saved = localStorage.getItem('gestaeng_projects_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return INITIAL_ENGINEERING_PROJECTS;
  });

  // Save new complementaresProjects to localStorage
  useEffect(() => {
    localStorage.setItem('gestaeng_projects_v2', JSON.stringify(complementaresProjects));
  }, [complementaresProjects]);

  // Derived complementares list for other modules (Dashboard, Backups)
  const complementares = useMemo<Complementar[]>(() => {
    const list: Complementar[] = [];
    complementaresProjects.forEach(ep => {
      Object.entries(ep.disciplinas).forEach(([discKey, d]) => {
        if (d.status === 'Não se aplica') return;
        
        let discName: 'Estruturas' | 'Hidráulica' | 'Especialidades' | 'Incêndio' | 'Electricidade' = 'Especialidades';
        if (discKey === 'estrutural') discName = 'Estruturas';
        else if (discKey === 'hidraulica') discName = 'Hidráulica';
        else if (discKey === 'eletrica') discName = 'Electricidade';
        else if (discKey === 'automacao') discName = 'Especialidades';
        else if (discKey === 'ar_condicionado') discName = 'Especialidades';
        
        d.historico.forEach(h => {
          list.push({
            id: `${ep.id}-${discKey}-v${h.versao}`,
            title: `${ep.nome} - V${h.versao}`,
            discipline: discName,
            file: `Proj-${ep.numero}-${discKey}-V${h.versao}.dwg`,
            updated: h.devolucao || h.recebimento,
            note: h.previsao ? `Previsão Retorno: ${h.previsao}` : 'Em análise',
            status: d.status === 'Compatibilizado' ? 'Aprovado' : (h.devolucao ? 'Sob Revisão' : 'Pendente'),
            size: '4.2 MB',
            author: d.engenheiro || 'Equipa Fpoles'
          });
        });
      });
    });
    return list;
  }, [complementaresProjects]);

  const [tablets, setTablets] = useState<Tablet[]>(() => {
    const saved = localStorage.getItem('fpoles_tablets');
    return saved ? JSON.parse(saved) : INITIAL_TABLETS;
  });

  const [placas, setPlacas] = useState<Placa[]>(() => {
    const saved = localStorage.getItem('fpoles_placas');
    return saved ? JSON.parse(saved) : INITIAL_PLACAS;
  });

  const [clashes, setClashes] = useState<Clash[]>(() => {
    const saved = localStorage.getItem('fpoles_clashes');
    return saved ? JSON.parse(saved) : INITIAL_CLASHES;
  });

  const [credentials, setCredentials] = useState<PrefeituraCredential[]>(() => {
    const saved = localStorage.getItem('fpoles_credentials');
    return saved ? JSON.parse(saved) : INITIAL_CREDENTIALS;
  });

  const [licenses, setLicenses] = useState<SoftwareLicense[]>(() => {
    const saved = localStorage.getItem('fpoles_licenses');
    return saved ? JSON.parse(saved) : INITIAL_LICENSES;
  });

  const [backupRecords, setBackupRecords] = useState<BackupRecord[]>(() => {
    const saved = localStorage.getItem('fpoles_backup_records');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return INITIAL_BACKUP_RECORDS;
  });

  const [revitRequirements, setRevitRequirements] = useState<RevitTemplateRequirement[]>(() => {
    const saved = localStorage.getItem('fpoles_revit_requirements');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return INITIAL_REVIT_TEMPLATE_REQUIREMENTS;
  });

  // Save changes to localStorage
  useEffect(() => { localStorage.setItem('fpoles_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('fpoles_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('fpoles_tablets', JSON.stringify(tablets)); }, [tablets]);
  useEffect(() => { localStorage.setItem('fpoles_placas', JSON.stringify(placas)); }, [placas]);
  useEffect(() => { localStorage.setItem('fpoles_clashes', JSON.stringify(clashes)); }, [clashes]);
  useEffect(() => { localStorage.setItem('fpoles_credentials', JSON.stringify(credentials)); }, [credentials]);
  useEffect(() => { localStorage.setItem('fpoles_licenses', JSON.stringify(licenses)); }, [licenses]);
  useEffect(() => { localStorage.setItem('fpoles_backup_records', JSON.stringify(backupRecords)); }, [backupRecords]);
  useEffect(() => { localStorage.setItem('fpoles_revit_requirements', JSON.stringify(revitRequirements)); }, [revitRequirements]);

  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState<string>('cronograma');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [selectedArchitectId, setSelectedArchitectId] = useState<string>('todos');
  const [clipboardBuffer, setClipboardBuffer] = useState<Task | null>(null);

  const [userRole, setUserRole] = useState<'admin' | 'arquiteto' | 'estagiario'>(() => {
    const saved = localStorage.getItem('fpoles_user_role');
    return (saved as 'admin' | 'arquiteto' | 'estagiario') || 'admin';
  });
  const [roleModalOpen, setRoleModalOpen] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('fpoles_user_role', userRole);
  }, [userRole]);

  // Handle automatic redirect if Estagiário ends up on restricted tabs
  useEffect(() => {
    if (userRole === 'estagiario' && (activeTab === 'senhas' || activeTab === 'licencas' || activeTab === 'backups')) {
      setActiveTab('dashboard');
      triggerToast('Acesso restrito para Estagiários. Redirecionado ao Dashboard.', 'warning');
    }
  }, [userRole, activeTab]);

  const triggerToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3200);
  };

  // --- BACKUP STATE & LOGIC ---
  const [backupSelectedIds, setBackupSelectedIds] = useState<{ [id: string]: boolean }>({});
  const [isBackingUp, setIsBackingUp] = useState<boolean>(false);
  const [backupTerminalLogs, setBackupTerminalLogs] = useState<string[]>([]);
  const [backupProgress, setBackupProgress] = useState<number>(0);

  const getWeekBackupItems = () => {
    const wk = weeks.find(w => w.id === selectedWeekId) || weeks[3] || weeks[0];
    const { startDate, endDate } = wk;
    const weekTasks = tasks.filter(t => t.date >= startDate && t.date <= endDate);
    const weekComp = complementares.filter(c => c.updated >= startDate && c.updated <= endDate);
    const weekPlacas = placas.filter(p => p.updated >= startDate && p.updated <= endDate);

    return [
      ...weekTasks.map(t => ({
        id: `task-${t.id}`,
        origin: 'Cronograma Semanal',
        desc: `${ARCHITECTS.find(a => a.id === t.archId)?.name || 'Arq'} - ${t.project}: ${t.title}`,
        date: t.date,
        meta: `Prioridade: ${t.priority} | Estado: ${t.status}`
      })),
      ...weekComp.map(c => ({
        id: `comp-${c.id}`,
        origin: 'Projetos Complementares',
        desc: `[${c.discipline}] ${c.title} (${c.file})`,
        date: c.updated,
        meta: `Autor: ${c.author} | Estado: ${c.status}`
      })),
      ...weekPlacas.map(p => ({
        id: `placa-${p.id}`,
        origin: 'Logística de Obras',
        desc: `Expedição Placa: Cliente ${p.client} - ${p.local}`,
        date: p.updated,
        meta: `Envio: ${p.carrier} | Estado: ${p.status}`
      }))
    ];
  };

  const weekBackupItems = getWeekBackupItems();

  useEffect(() => {
    const initSelected: { [id: string]: boolean } = {};
    weekBackupItems.forEach(item => { initSelected[item.id] = true; });
    setBackupSelectedIds(initSelected);
  }, [selectedWeekId, tasks, complementares, placas]);

  const toggleSelectAllBackup = (checked: boolean) => {
    const updated: { [id: string]: boolean } = {};
    weekBackupItems.forEach(item => { updated[item.id] = checked; });
    setBackupSelectedIds(updated);
  };

  const toggleSelectBackupItem = (id: string) => {
    setBackupSelectedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const runBackupProcess = () => {
    if (isBackingUp) return;
    setIsBackingUp(true);
    setBackupProgress(0);
    setBackupTerminalLogs([]);
    
    const logs = [
      `[07:05:12] [INICIANDO] Iniciando backup semanal da Semana ${selectedWeekId.toUpperCase()}...`,
      `[07:05:12] [AUDITORIA] Mapeando tarefas concluídas e arquivos complementares atualizados...`,
      `[07:05:13] [COMPACTANDO] Criando arquivo zip temporário: backup_temp_${Date.now()}.zip`,
      `[07:05:14] [AUDITORIA] Compactando ficheiros técnicos de Engenharia Secundária (Complementares)...`,
      `[07:05:14] [LOGÍSTICA] Anexando relatórios de expedição de Placas e Tablets de Obra...`,
      `[07:05:15] [SEGURANÇA] Gerando chave SHA-256 simétrica do lote de backup`,
      `[07:05:17] [SUCESSO] Backup semanal concluído e auditado de forma segura!`
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setBackupTerminalLogs(prev => [...prev, logs[currentLogIndex]]);
        setBackupProgress(Math.min(100, Math.floor((currentLogIndex + 1) * (100 / logs.length))));
        currentLogIndex++;
      } else {
        clearInterval(interval);
        setIsBackingUp(false);
        // Save backup record
        const newRecord: BackupRecord = {
          id: 'b-' + Date.now(),
          year: selectedYear,
          weekId: selectedWeekId,
          project: 'Backup Automático',
          fase: 'Geral',
          progress: '100%',
          status: 'Realizado',
          tecnico: userRole.toUpperCase(),
          desc: `Backup semanal concluído: w${selectedWeekId.toUpperCase()}`
        };
        setBackupRecords(prev => [newRecord, ...prev]);
        triggerToast('Backup concluído com sucesso!');
      }
    }, 800);
  };

  const handleInlineTitleChange = (id: string, newTitle: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, title: newTitle } : t));
  };

  const handleInlineProjectChange = (id: string, newProject: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, project: newProject } : t));
  };

  const handleInlinePriorityChange = (id: string, newPriority: 'Baixa' | 'Média' | 'Alta') => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, priority: newPriority } : t));
  };

  const handleInlineStatusToggle = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'Realizado' ? 'Pendente' : 'Realizado' } : t));
  };

  const handleInlineYellowToggle = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isYellow: !t.isYellow } : t));
  };

  const copyTaskToBuffer = (t: Task) => {
    setClipboardBuffer(t);
    triggerToast('Tarefa copiada para a Área de Transferência!', 'success');
  };

  const pasteTaskFromBuffer = (date: string, archId: string, id: string) => {
    if (!clipboardBuffer) {
      triggerToast('Área de Transferência vazia! Copie uma tarefa primeiro.', 'warning');
      return;
    }
    const newTask: Task = {
      ...clipboardBuffer,
      id: 't-' + Date.now(),
      date,
      archId,
      status: 'Pendente'
    };
    setTasks(prev => [...prev, newTask]);
    triggerToast('Tarefa colada com sucesso!');
  };

  // --- AUTO SCROLL TO CURRENT WEEK WHEN CRONOGRAMA IS OPENED ---
  useEffect(() => {
    if (activeTab === 'cronograma') {
      const handleScroll = () => {
        const target = document.getElementById(`week-block-${weekHojeId}`);
        const desktopContainer = document.getElementById('desktop-scroll-container');
        const mobileContainer = document.getElementById('mobile-scroll-container');
        
        if (target) {
          if (desktopContainer) {
            desktopContainer.scrollTo({
              top: target.offsetTop - 20,
              behavior: 'smooth'
            });
          }
          if (mobileContainer) {
            mobileContainer.scrollTo({
              top: target.offsetTop - 20,
              behavior: 'smooth'
            });
          }
        }
      };
      setTimeout(handleScroll, 200);
    }
  }, [activeTab, weekHojeId]);

  const scrollToToday = () => {
    const target = document.getElementById(`week-block-${weekHojeId}`);
    const desktopContainer = document.getElementById('desktop-scroll-container');
    const mobileContainer = document.getElementById('mobile-scroll-container');
    if (target) {
      if (desktopContainer) desktopContainer.scrollTo({ top: target.offsetTop - 20, behavior: 'smooth' });
      if (mobileContainer) mobileContainer.scrollTo({ top: target.offsetTop - 20, behavior: 'smooth' });
    }
  };

  // --- BIM 3D VIEW PORT LITE CONTROLS ---
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [yaw, setYaw] = useState<number>(0.5);
  const [pitch, setPitch] = useState<number>(0.2);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [selectedClashId, setSelectedClashId] = useState<string | null>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setYaw(prev => prev + dx * 0.007);
    setPitch(prev => Math.max(-1.2, Math.min(1.2, prev - dy * 0.007)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const markClashResolved = (id: string) => {
    setClashes(prev => prev.map(c => c.id === id ? { ...c, status: 'Resolvido' } : c));
    triggerToast('Conflito BIM marcado como resolvido!', 'success');
  };

  // --- PASSWORD REVEAL LOGIC ---
  const [revealedPassIds, setRevealedPassIds] = useState<{ [id: string]: boolean }>({});
  const togglePassReveal = (id: string) => {
    setRevealedPassIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // --- NAVIGATION LIST (NO NUMBERS, SPECIFIC ORDER) ---
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cronograma', label: 'Cronograma', icon: Calendar },
    { id: 'responsaveis', label: 'Responsáveis por Projeto', icon: Users },
    { id: 'complementares', label: 'Projetos Complementares', icon: FileCode },
    { id: 'client_area', label: 'Área do Cliente', icon: User, comingSoon: true },
    { id: 'partners', label: 'Fornecedores e Parceiros', icon: Handshake, comingSoon: true },
    { id: 'backups', label: 'Backup Semanal', icon: Database, restricted: true },
    { id: 'licencas', label: 'Controle de Licenças', icon: ShieldCheck, restricted: true },
    { id: 'senhas', label: 'Senhas', icon: Lock, restricted: true },
    { id: 'bim', label: 'Gestão BIM', icon: Box },
    { id: 'logistica', label: 'Tablets e Placas', icon: Truck },
    ...(userRole === 'admin' ? [{ id: 'projetos', label: 'Projetos (ADM)', icon: Briefcase }] : [])
  ];

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans text-sm text-black">
      
      {/* --- PREMIUM TOASTS (MONOCHROME CAPULES) --- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id} 
            className="p-4 bg-black text-white text-xs font-semibold rounded-2xl shadow-2xl border border-white/20 flex items-center gap-3 pointer-events-auto transform translate-y-0 transition-all duration-300"
          >
            {toast.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-white animate-pulse" /> : <CheckCircle2 className="w-4 h-4 text-white" />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>

      {/* --- SIDEBAR MENU (RETRACTABLE, MONOCHROME SLATE) --- */}
      <aside 
        id="sidebar"
        className={`hidden md:flex flex-col bg-slate-950 text-white transition-all duration-300 shrink-0 ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Brand */}
        <div className="p-6 flex flex-col gap-2 border-b border-white/5">
          <div className="flex items-center justify-between gap-2">
            {!sidebarCollapsed ? (
              <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center justify-between">
                  <img src={fpolesLogo} alt="Fpoles Architects" className="h-7 object-contain" />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-slate-300 leading-tight">
                      {userRole === 'admin' ? 'Filipe Poles' : userRole === 'arquiteto' ? 'Amanda Melo' : 'Thiago Souza'}
                    </span>
                    <span className="text-[9px] text-slate-500 tracking-wider font-mono uppercase mt-0.5 font-bold">
                      {userRole === 'admin' ? 'Administrador' : userRole === 'arquiteto' ? 'Arquiteto' : 'Estagiário'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminPasswordInput('');
                      setPasswordError(false);
                      setRoleModalOpen(true);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    title="Controle de Acessos"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setAdminPasswordInput('');
                  setPasswordError(false);
                  setRoleModalOpen(true);
                }}
                className="w-10 h-10 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer mx-auto"
                title="Controle de Acessos"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isLocked = userRole === 'estagiario' && item.restricted;
            const isActive = activeTab === item.id;
            const isComingSoon = item.comingSoon;
            return (
              <button
                key={item.id}
                id={`btn-nav-${item.id}`}
                onClick={() => {
                  if (isComingSoon) {
                    triggerToast(`Módulo "${item.label}" estará disponível em breve!`, 'info');
                  } else if (isLocked) {
                    triggerToast(`Acesso restrito: O módulo "${item.label}" não está disponível para Estagiários.`, 'warning');
                  } else {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-3 transition-all text-xs font-semibold rounded-xl ${
                  isComingSoon
                    ? 'text-slate-500 hover:text-slate-400 cursor-not-allowed opacity-60'
                    : isLocked 
                      ? 'text-slate-600 hover:text-slate-500 cursor-not-allowed opacity-50'
                      : isActive 
                        ? 'bg-white text-slate-950 shadow-md' 
                        : 'text-slate-400 hover:bg-slate-900/60 hover:text-white cursor-pointer'
                }`}
                title={isComingSoon ? 'Em breve' : isLocked ? `Acesso restrito a Administradores/Arquitetos` : item.label}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isComingSoon || isLocked ? 'opacity-50' : ''}`} />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!sidebarCollapsed && (
                  isComingSoon ? (
                    <span className="text-[8px] bg-slate-800 text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded font-mono uppercase font-bold shrink-0">
                      Em breve
                    </span>
                  ) : isLocked ? (
                    <Lock className="w-3 h-3 text-slate-505 shrink-0" />
                  ) : null
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* --- DESKTOP AND MOBILE CONTENT COLUMN WRAPPER --- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Mobile Header (hidden on desktop) */}
        <header className="md:hidden bg-slate-950 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={fpolesLogo} alt="Fpoles Architects" className="h-6 object-contain" />
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => {
                  setAdminPasswordInput('');
                  setPasswordError(false);
                  setRoleModalOpen(true);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Controle de Acessos"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
              <span className="text-[8px] bg-white/10 px-1.5 py-0.5 rounded font-mono text-slate-300 uppercase">
                {userRole === 'admin' ? 'ADM' : userRole === 'arquiteto' ? 'ARQ' : 'EST'}
              </span>
            </div>
          </div>
          <button 
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="p-1 hover:bg-white/10 rounded-xl"
          >
            <Menu className="w-5 h-5 text-white" />
          </button>
        </header>

        {/* Mobile Nav Links (hidden on desktop) */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-white/5 px-4 py-4 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isLocked = userRole === 'estagiario' && item.restricted;
              const isActive = activeTab === item.id;
              const isComingSoon = item.comingSoon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (isComingSoon) {
                      triggerToast(`Módulo "${item.label}" estará disponível em breve!`, 'info');
                    } else if (isLocked) {
                      triggerToast(`Acesso restrito: O módulo "${item.label}" não está disponível para Estagiários.`, 'warning');
                    } else {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 text-xs font-semibold rounded-xl ${
                    isComingSoon
                      ? 'text-slate-505 hover:text-slate-400 cursor-not-allowed opacity-55'
                      : isLocked 
                        ? 'text-slate-600 cursor-not-allowed opacity-55'
                        : isActive 
                          ? 'bg-white text-slate-950' 
                          : 'text-slate-400 hover:bg-slate-850 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {isComingSoon ? (
                    <span className="text-[8px] bg-slate-850 text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded font-mono uppercase font-bold shrink-0">
                      Em breve
                    </span>
                  ) : isLocked ? (
                    <Lock className="w-3 h-3 text-slate-505 shrink-0" />
                  ) : null}
                </button>
              );
            })}
          </div>
        )}

        {/* Main Content Area (visible on both desktop and mobile) */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6">
          <WorkspaceContent
            userRole={userRole}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tasks={tasks}
            setTasks={setTasks}
            projects={projects}
            setProjects={setProjects}
            complementares={complementares}
            setComplementares={() => {}} // Read-only derived
            tablets={tablets}
            setTablets={setTablets}
            placas={placas}
            setPlacas={setPlacas}
            clashes={clashes}
            setClashes={setClashes}
            credentials={credentials}
            setCredentials={setCredentials}
            licenses={licenses}
            setLicenses={setLicenses}
            selectedArchitectId={selectedArchitectId}
            setSelectedArchitectId={setSelectedArchitectId}
            selectedWeekId={selectedWeekId}
            setSelectedWeekId={setSelectedWeekId}
            weeks={weeks}
            weekHojeId={weekHojeId}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            clipboardBuffer={clipboardBuffer}
            setClipboardBuffer={setClipboardBuffer}
            triggerToast={triggerToast}
            revealedPassIds={revealedPassIds}
            togglePassReveal={togglePassReveal}
            canvasRef={canvasRef}
            handleMouseDown={handleMouseDown}
            handleMouseMove={handleMouseMove}
            handleMouseUpOrLeave={handleMouseUpOrLeave}
            selectedClashId={selectedClashId}
            setSelectedClashId={setSelectedClashId}
            markClashResolved={markClashResolved}
            backupSelectedIds={backupSelectedIds}
            toggleSelectAllBackup={toggleSelectAllBackup}
            toggleSelectBackupItem={toggleSelectBackupItem}
            runBackupProcess={runBackupProcess}
            isBackingUp={isBackingUp}
            backupTerminalLogs={backupTerminalLogs}
            backupProgress={backupProgress}
            weekBackupItems={weekBackupItems}
            backupRecords={backupRecords}
            setBackupRecords={setBackupRecords}
            backupSelectedYear={selectedYear}
            setBackupSelectedYear={setSelectedYear}
            backupSelectedWeekId={selectedWeekId}
            setBackupSelectedWeekId={setSelectedWeekId}
            backupWeeks={weeks}
            handleAddComplementar={() => {}}
            newCompTitle=""
            setNewCompTitle={() => {}}
            newCompDiscipline="Estruturas"
            setNewCompDiscipline={() => {}}
            newCompFile=""
            setNewCompFile={() => {}}
            newCompNote=""
            setNewCompNote={() => {}}
            newCompAuthor=""
            setNewCompAuthor={() => {}}
            newCompSize="2.5 MB"
            setNewCompSize={() => {}}
            scrollToToday={scrollToToday}
            handleInlineTitleChange={handleInlineTitleChange}
            handleInlineProjectChange={handleInlineProjectChange}
            handleInlinePriorityChange={handleInlinePriorityChange}
            handleInlineStatusToggle={handleInlineStatusToggle}
            handleInlineYellowToggle={handleInlineYellowToggle}
            copyTaskToBuffer={copyTaskToBuffer}
            pasteTaskFromBuffer={pasteTaskFromBuffer}
            yaw={yaw} setYaw={setYaw} pitch={pitch} setPitch={setPitch}
            revitRequirements={revitRequirements}
            setRevitRequirements={setRevitRequirements}
            complementaresProjects={complementaresProjects}
            setComplementaresProjects={setComplementaresProjects}
          />
        </main>
      </div>

      {/* Role Selection Modal */}
      {roleModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-slate-900 text-white px-5 py-4 flex justify-between items-center">
              <h3 className="font-bold text-sm md:text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span>Simular Perfil de Acesso</span>
              </h3>
              <button 
                onClick={() => setRoleModalOpen(false)} 
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Selecione o perfil ativo para simular o comportamento e as limitações do App Fpoles.
              </p>

              <div className="space-y-2">
                {/* Admin */}
                <button
                  type="button"
                  onClick={() => {
                    if (adminPasswordInput === 'admin' || userRole === 'admin') {
                      setUserRole('admin');
                      setRoleModalOpen(false);
                      triggerToast('Acesso de Administrador liberado!', 'success');
                    } else {
                      setPasswordError(true);
                      triggerToast('Senha incorreta! Digite "admin".', 'warning');
                    }
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 cursor-pointer ${
                    userRole === 'admin'
                      ? 'border-indigo-600 bg-indigo-50/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <User className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div className="w-full">
                    <span className="font-bold text-slate-800 text-xs uppercase block">Administrador</span>
                    <span className="text-[10px] text-slate-500 mt-1 block leading-normal">
                      Acesso irrestrito a todas as abas. Permissão total para editar, cadastrar e excluir dados (incluindo senhas e licenças).
                    </span>
                    {userRole !== 'admin' && (
                      <div className="mt-2.5">
                        <input
                          type="password"
                          placeholder="Digite a palavra-chave 'admin'..."
                          value={adminPasswordInput}
                          onChange={(e) => {
                            setAdminPasswordInput(e.target.value);
                            setPasswordError(false);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className={`w-full bg-slate-50 border rounded-lg px-2.5 py-1.5 text-xs outline-none focus:bg-white ${
                            passwordError ? 'border-rose-500 focus:border-rose-500' : 'border-slate-200 focus:border-indigo-500'
                          }`}
                        />
                        <span className="text-[9px] text-slate-400 mt-1 block">Dica: digite a palavra-chave admin</span>
                      </div>
                    )}
                  </div>
                </button>

                {/* Arquiteto */}
                <button
                  type="button"
                  onClick={() => {
                    setUserRole('arquiteto');
                    setRoleModalOpen(false);
                    triggerToast('Perfil alterado para Arquiteto!', 'info');
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 cursor-pointer ${
                    userRole === 'arquiteto'
                      ? 'border-indigo-600 bg-indigo-50/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Briefcase className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 text-xs uppercase block">Arquiteto</span>
                    <span className="text-[10px] text-slate-500 mt-1 block leading-normal">
                      Acesso a todas as abas e edição completa, mas **bloqueado para apagar** senhas corporativas e licenças de software.
                    </span>
                  </div>
                </button>

                {/* Estagiário */}
                <button
                  type="button"
                  onClick={() => {
                    setUserRole('estagiario');
                    setRoleModalOpen(false);
                    triggerToast('Perfil alterado para Estagiário!', 'info');
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 cursor-pointer ${
                    userRole === 'estagiario'
                      ? 'border-indigo-600 bg-indigo-50/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-800 text-xs uppercase block">Estagiário</span>
                    <span className="text-[10px] text-slate-500 mt-1 block leading-normal">
                      Visualização básica. **Bloqueado** para apagar itens, e **oculta totalmente** as abas de Senhas, Licenças e Backups semanais.
                    </span>
                  </div>
                </button>
              </div>

              {/* Log Out Button */}
              <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[10px] text-slate-400 font-mono">Sessão: Ativa</span>
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.removeItem('fpoles_auth');
                    setIsAuthenticated(false);
                    setPasswordInput('');
                    setIsUnlocking(false);
                    setRoleModalOpen(false);
                    triggerToast('Sessão encerrada com sucesso!', 'info');
                  }}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-150 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sair do Hub</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Gemini Assistant Panel Overlay */}
      <GeminiAssistant />

      {/* --- PREMIUM TRANSITIONAL LOGIN OVERLAY --- */}
      {!isAuthenticated && (
        <div className={`fixed inset-0 bg-black text-white flex z-[99999] overflow-hidden transition-all duration-700 ${
          isUnlocking ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
        }`}>
          {/* Left locked modules bar (matches style in image) */}
          <div className="w-20 bg-[#0A0A0B] border-r border-white/5 flex flex-col items-center py-6 justify-between select-none shrink-0">
            <div className="flex flex-col items-center gap-8 w-full">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center opacity-40">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col items-center gap-5 w-full">
                {[LayoutDashboard, Calendar, Users, FileCode, Database, Box, Truck].map((Icon, idx) => (
                  <div key={idx} className="w-10 h-10 rounded-xl flex items-center justify-center text-white/30 hover:text-white/40 transition cursor-not-allowed">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                ))}
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center opacity-30">
              <User className="w-4.5 h-4.5 text-white" />
            </div>
          </div>

          {/* Center login panel with glowing light beam */}
          <div className="flex-1 flex flex-col items-center justify-center relative p-6 bg-[#060607]">
            {/* Spotlight blur */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-gradient-to-b from-indigo-500/10 to-transparent blur-[100px] rounded-full pointer-events-none"></div>
            {/* Vertical light beam */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[200px] bg-gradient-to-b from-white/25 via-white/5 to-transparent pointer-events-none"></div>

            <div className={`max-w-xs w-full flex flex-col items-center text-center space-y-6 z-10 transition-all duration-500 ${
              isUnlocking ? 'opacity-0 scale-95 blur-sm' : 'opacity-100 scale-100'
            }`}>
              {/* Logo Fpoles */}
              <img src={fpolesLogo} alt="Fpoles Architects" className="h-8 object-contain mb-2 select-none" />

              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider font-sans text-white">Bem vindo ao Hub Fpoles</h2>
                <p className="text-[11px] text-slate-400 mt-1.5 font-medium leading-relaxed">Digite a senha para continuar</p>
              </div>

              {/* Password field */}
              <div className="w-full space-y-2.5">
                <input 
                  type="password"
                  placeholder="Senha de acesso..."
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setLoginError(false);
                  }}
                  className={`w-full bg-[#141416] border ${
                    loginError ? 'border-red-500/40 focus:border-red-500' : 'border-white/10 focus:border-white/20'
                  } rounded-xl p-3 text-center text-xs font-mono tracking-widest text-white placeholder:text-slate-600 placeholder:font-sans placeholder:tracking-normal outline-none transition-all`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleLoginSubmit();
                  }}
                  autoFocus
                />
                {loginError && (
                  <span className="text-[10px] text-red-500 font-bold block animate-pulse">Senha incorreta. Tente novamente.</span>
                )}
              </div>

              {/* Submit button */}
              <button 
                type="button"
                onClick={handleLoginSubmit}
                className="w-full bg-white hover:bg-neutral-100 text-black font-bold p-3 rounded-xl text-xs transition-all shadow-lg active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isUnlocking ? (
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <>
                    <span>Entrar no Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// --- SUB-PAGES AND DISPATCHER ---
interface WorkspaceContentProps {
  userRole: 'admin' | 'arquiteto' | 'estagiario';
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  complementares: Complementar[];
  setComplementares: React.Dispatch<React.SetStateAction<Complementar[]>>;
  tablets: Tablet[];
  setTablets: React.Dispatch<React.SetStateAction<Tablet[]>>;
  placas: Placa[];
  setPlacas: React.Dispatch<React.SetStateAction<Placa[]>>;
  clashes: Clash[];
  setClashes: React.Dispatch<React.SetStateAction<Clash[]>>;
  credentials: PrefeituraCredential[];
  setCredentials: React.Dispatch<React.SetStateAction<PrefeituraCredential[]>>;
  licenses: SoftwareLicense[];
  setLicenses: React.Dispatch<React.SetStateAction<SoftwareLicense[]>>;
  selectedArchitectId: string;
  setSelectedArchitectId: (id: string) => void;
  selectedWeekId: string;
  setSelectedWeekId: (id: string) => void;
  weeks: Week[];
  weekHojeId: string;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  clipboardBuffer: any;
  setClipboardBuffer: (v: any) => void;
  triggerToast: (msg: string, type?: any) => void;
  revealedPassIds: { [id: string]: boolean };
  togglePassReveal: (id: string) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  handleMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  handleMouseUpOrLeave: () => void;
  selectedClashId: string | null;
  setSelectedClashId: (id: string | null) => void;
  markClashResolved: (id: string) => void;
  backupSelectedIds: { [id: string]: boolean };
  toggleSelectAllBackup: (checked: boolean) => void;
  toggleSelectBackupItem: (id: string) => void;
  runBackupProcess: () => void;
  isBackingUp: boolean;
  backupTerminalLogs: string[];
  backupProgress: number;
  weekBackupItems: any[];
  backupRecords: BackupRecord[];
  setBackupRecords: React.Dispatch<React.SetStateAction<BackupRecord[]>>;
  backupSelectedYear: number;
  setBackupSelectedYear: React.Dispatch<React.SetStateAction<number>>;
  backupSelectedWeekId: string;
  setBackupSelectedWeekId: React.Dispatch<React.SetStateAction<string>>;
  backupWeeks: Week[];
  handleAddComplementar: (e: React.FormEvent) => void;
  newCompTitle: string;
  setNewCompTitle: (v: string) => void;
  newCompDiscipline: 'Estruturas' | 'Hidráulica' | 'Especialidades' | 'Incêndio' | 'Electricidade';
  setNewCompDiscipline: (v: any) => void;
  newCompFile: string;
  setNewCompFile: (v: string) => void;
  newCompNote: string;
  setNewCompNote: (v: string) => void;
  newCompAuthor: string;
  setNewCompAuthor: (v: string) => void;
  newCompSize: string;
  setNewCompSize: (v: string) => void;
  scrollToToday: () => void;
  handleInlineTitleChange: (id: string, v: string) => void;
  handleInlineProjectChange: (id: string, v: string) => void;
  handleInlinePriorityChange: (id: string, v: any) => void;
  handleInlineStatusToggle: (id: string) => void;
  handleInlineYellowToggle: (id: string) => void;
  copyTaskToBuffer: (t: Task) => void;
  pasteTaskFromBuffer: (date: string, archId: string, id: string) => void;
  yaw: number; setYaw: (y: number) => void; pitch: number; setPitch: (p: number) => void;
  revitRequirements: RevitTemplateRequirement[];
  setRevitRequirements: React.Dispatch<React.SetStateAction<RevitTemplateRequirement[]>>;
  complementaresProjects: EngineeringProject[];
  setComplementaresProjects: React.Dispatch<React.SetStateAction<EngineeringProject[]>>;
}

function WorkspaceContent(props: WorkspaceContentProps) {
  switch (props.activeTab) {
    case 'dashboard':
      return (
        <DashboardTab
          userRole={props.userRole}
          setActiveTab={props.setActiveTab}
          complementares={props.complementares}
          licenses={props.licenses}
          tablets={props.tablets}
        />
      );
    case 'cronograma':
      return (
        <CronogramaTab
          userRole={props.userRole}
          tasks={props.tasks}
          setTasks={props.setTasks}
          projects={props.projects}
          selectedArchitectId={props.selectedArchitectId}
          setSelectedArchitectId={props.setSelectedArchitectId}
          selectedWeekId={props.selectedWeekId}
          setSelectedWeekId={props.setSelectedWeekId}
          weeks={props.weeks}
          weekHojeId={props.weekHojeId}
          selectedYear={props.selectedYear}
          setSelectedYear={props.setSelectedYear}
          handleInlineTitleChange={props.handleInlineTitleChange}
          handleInlineProjectChange={props.handleInlineProjectChange}
          handleInlineStatusToggle={props.handleInlineStatusToggle}
          handleInlineYellowToggle={props.handleInlineYellowToggle}
          copyTaskToBuffer={props.copyTaskToBuffer}
          pasteTaskFromBuffer={props.pasteTaskFromBuffer}
          triggerToast={props.triggerToast}
        />
      );
    case 'responsaveis':
      return (
        <ResponsaveisTab
          userRole={props.userRole}
          projects={props.projects}
          setProjects={props.setProjects}
          triggerToast={props.triggerToast}
        />
      );
    case 'projetos':
      return (
        <ProjetosTab
          userRole={props.userRole}
          projects={props.projects}
          setProjects={props.setProjects}
          triggerToast={props.triggerToast}
        />
      );
    case 'complementares':
      return (
        <ComplementaresModule
          complementaresProjects={props.complementaresProjects}
          setComplementaresProjects={props.setComplementaresProjects}
          triggerToast={props.triggerToast}
          userRole={props.userRole}
        />
      );
    case 'bim':
      return (
        <BimTab
          userRole={props.userRole}
          revitRequirements={props.revitRequirements}
          setRevitRequirements={props.setRevitRequirements}
          triggerToast={props.triggerToast}
        />
      );
    case 'logistica':
      return (
        <LogisticaTab
          tablets={props.tablets}
          setTablets={props.setTablets}
          placas={props.placas}
          setPlacas={props.setPlacas}
          projects={props.projects}
          triggerToast={props.triggerToast}
        />
      );
    case 'senhas':
      return (
        <SenhasTab
          userRole={props.userRole}
          credentials={props.credentials}
          setCredentials={props.setCredentials}
          triggerToast={props.triggerToast}
          revealedPassIds={props.revealedPassIds}
          togglePassReveal={props.togglePassReveal}
        />
      );
    case 'licencas':
      return (
        <LicencasTab
          userRole={props.userRole}
          licenses={props.licenses}
          setLicenses={props.setLicenses}
          triggerToast={props.triggerToast}
        />
      );
    case 'backups':
      return (
        <BackupsTab
          backupRecords={props.backupRecords}
          setBackupRecords={props.setBackupRecords}
          backupSelectedYear={props.backupSelectedYear}
          setBackupSelectedYear={props.setBackupSelectedYear}
          backupSelectedWeekId={props.backupSelectedWeekId}
          setBackupSelectedWeekId={props.setBackupSelectedWeekId}
          backupWeeks={props.backupWeeks}
          triggerToast={props.triggerToast}
        />
      );
    default:
      return (
        <div className="flex items-center justify-center h-full text-slate-500 font-bold">
          Aba não implementada ou em desenvolvimento
        </div>
      );
  }
}
