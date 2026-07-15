import React, { useState, useMemo } from 'react';
import { EngineeringProject, EngineeringDiscipline, DisciplineHistory } from '../types';

interface ComplementaresModuleProps {
  complementaresProjects: EngineeringProject[];
  setComplementaresProjects: React.Dispatch<React.SetStateAction<EngineeringProject[]>>;
  triggerToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  userRole: 'admin' | 'arquiteto' | 'estagiario';
}

const DISCIPLINAS_CONFIG = {
  estrutural: { nome: 'Estrutural', icon: 'fa-solid fa-cubes', bg: 'bg-blue-50', color: 'text-blue-600', border: 'border-blue-200' },
  hidraulica: { nome: 'Hidráulica', icon: 'fa-solid fa-droplet', bg: 'bg-cyan-50', color: 'text-cyan-600', border: 'border-cyan-200' },
  eletrica: { nome: 'Elétrica', icon: 'fa-solid fa-bolt', bg: 'bg-amber-50', color: 'text-amber-500', border: 'border-amber-200' },
  automacao: { nome: 'Automação', icon: 'fa-solid fa-gears', bg: 'bg-purple-50', color: 'text-purple-600', border: 'border-purple-200' },
  ar_condicionado: { nome: 'Ar Condicionado', icon: 'fa-solid fa-wind', bg: 'bg-teal-50', color: 'text-teal-600', border: 'border-teal-200' }
};

export default function ComplementaresModule({
  complementaresProjects,
  setComplementaresProjects,
  triggerToast,
  userRole
}: ComplementaresModuleProps) {
  // Navigation: 'dashboard' | 'projetos'
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'projetos'>('dashboard');
  
  // Expanded project IDs in the linear list
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);
  
  // Filter settings
  const [filters, setFilters] = useState({
    search: '',
    orderBy: 'codigo_desc',
    discipline: '',      // Bottle neck filter from dashboard
    statusFilter: '',    // Status filter from dashboard: 'naArq', 'comProj', 'atrasados'
    architect: '',
    statusScope: 'ativos' // 'ativos' | 'todos'
  });

  // Modal control states
  const [modalProjectOpen, setModalProjectOpen] = useState(false);
  const [modalProjectData, setModalProjectData] = useState<EngineeringProject | null>(null);
  const [selectedDiscKey, setSelectedDiscKey] = useState<string>('estrutural');
  
  const [newVersionFormOpen, setNewVersionFormOpen] = useState(false);
  const [newVersionFormData, setNewVersionFormData] = useState({
    versao: 1,
    recebimento: '',
    limite: '',
    computedDays: 0
  });

  const [modalNewProjectOpen, setModalNewProjectOpen] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState({
    numero: '',
    nome: '',
    arquiteto: ''
  });

  // Custom alert/confirm popups
  const [customAlert, setCustomAlert] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
  const [customConfirm, setCustomConfirm] = useState<{ show: boolean; message: string; onConfirm: (() => void) | null }>({
    show: false,
    message: '',
    onConfirm: null
  });

  // --- HELPER FUNCTIONS ---
  
  const calculateBusinessDays = (startDateStr: string, days: number): string => {
    if (!startDateStr) return '';
    let date = new Date(startDateStr + 'T12:00:00');
    let addedDays = 0;
    while (addedDays < days) {
      date.setDate(date.getDate() + 1);
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        addedDays++;
      }
    }
    return date.toISOString().split('T')[0];
  };

  const calculateBusinessDaysDifference = (startDateStr: string, endDateStr: string): number => {
    let start = new Date(startDateStr + 'T12:00:00');
    let end = new Date(endDateStr + 'T12:00:00');
    if (start > end) return 0;
    
    let days = 0;
    let current = new Date(start);
    while (current < end) {
      current.setDate(current.getDate() + 1);
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        days++;
      }
    }
    return days;
  };

  const getLastVersion = (disc: EngineeringDiscipline): DisciplineHistory | null => {
    if (!disc.historico || disc.historico.length === 0) return null;
    return disc.historico[disc.historico.length - 1];
  };

  const getLastVersionNumber = (disc: EngineeringDiscipline): number => {
    const last = getLastVersion(disc);
    return last ? last.versao : 0;
  };

  const uniqueArchitects = useMemo(() => {
    const archs = complementaresProjects.map(p => p.arquiteto).filter(Boolean);
    return Array.from(new Set(archs)).sort();
  }, [complementaresProjects]);

  const getDisciplineStatusBadge = (disc: EngineeringDiscipline) => {
    if (disc.status === 'Não se aplica') {
      return { label: 'Inativo', bg: 'bg-slate-100', text: 'text-slate-400' };
    }
    if (disc.status === 'Compatibilizado') {
      return { label: 'Aprovado', bg: 'bg-emerald-100', text: 'text-emerald-600' };
    }
    
    const last = getLastVersion(disc);
    if (!last) {
      return { label: 'Sem Versão', bg: 'bg-slate-100', text: 'text-slate-500' };
    }

    const today = new Date().toISOString().split('T')[0];

    if (last.recebimento && !last.devolucao) {
      if (today > last.limite) {
        return { label: 'Atrasado Arq', bg: 'bg-rose-100 text-rose-700', text: 'text-rose-600' };
      }
      return { label: 'Na Arquitetura', bg: 'bg-slate-900 text-white', text: 'text-black font-semibold' };
    }

    if (last.devolucao) { 
      if (last.previsao && today > last.previsao) {
        return { label: 'Atrasado Eng', bg: 'bg-rose-100 text-rose-700', text: 'text-rose-600' };
      }
      return { label: 'No Projetista', bg: 'bg-amber-100 text-amber-800', text: 'text-amber-600' };
    }

    return { label: 'Em Análise', bg: 'bg-blue-100 text-blue-800', text: 'text-blue-600' };
  };

  const getDisciplineIconStyles = (disc: EngineeringDiscipline) => {
    if (disc.status === 'Não se aplica') {
      return 'bg-slate-50 text-slate-300 border-slate-100 opacity-40';
    }
    if (disc.status === 'Compatibilizado') {
      return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
    }
    const badge = getDisciplineStatusBadge(disc);
    if (badge.label && badge.label.includes('Atrasado')) {
      return 'bg-rose-500 text-white border-rose-650 font-bold animate-pulse';
    }
    if (badge.label === 'Na Arquitetura') {
      return 'bg-slate-950 text-white border-black font-bold';
    }
    if (badge.label === 'No Projetista') {
      return 'bg-amber-400 text-amber-950 border-amber-500 font-bold';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getDisciplineCardBorder = (disc: EngineeringDiscipline) => {
    const badge = getDisciplineStatusBadge(disc);
    if (badge.label.includes('Atrasado')) return 'border-rose-300 ring-1 ring-rose-50';
    if (badge.label === 'Na Arquitetura') return 'border-indigo-300 ring-1 ring-indigo-50 bg-indigo-50/5';
    if (badge.label === 'No Projetista') return 'border-amber-200';
    if (badge.label === 'Aprovado') return 'border-emerald-200 bg-emerald-50/5';
    return 'border-slate-200';
  };

  const getFooterDateLabel = (disc: EngineeringDiscipline) => {
    if (disc.status !== 'Em andamento') return { title: '', date: '' };
    const last = getLastVersion(disc);
    if (!last) return { title: 'Sem histórico', date: '' };

    if (last.recebimento && !last.devolucao) {
      return { title: 'Prazo até:', date: formatDate(last.limite) };
    }
    if (last.devolucao) {
      return { title: 'Previsão Retorno:', date: formatDate(last.previsao) || 'Sem data' };
    }
    return { title: '', date: '' };
  };

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  // --- FILTERING AND SORTING ---

  const filteredProjects = useMemo(() => {
    let list = [...complementaresProjects];

    // Status Scope (Active vs All)
    if (filters.statusScope === 'ativos') {
      list = list.filter(p => {
        return Object.values(p.disciplinas).some(d => d.status === 'Em andamento');
      });
    }

    // Architect Filter
    if (filters.architect) {
      list = list.filter(p => p.arquiteto === filters.architect);
    }

    // Status Filter (from dashboard counters)
    if (filters.statusFilter) {
      list = list.filter(p => {
        return Object.values(p.disciplinas).some(d => {
          if (d.status !== 'Em andamento') return false;
          const last = getLastVersion(d);
          const today = new Date().toISOString().split('T')[0];

          if (filters.statusFilter === 'naArq') {
            return last && last.recebimento && !last.devolucao;
          }
          if (filters.statusFilter === 'comProj') {
            return last && last.devolucao;
          }
          if (filters.statusFilter === 'atrasados') {
            if (!last) return false;
            if (last.recebimento && !last.devolucao && today > last.limite) return true;
            if (last.devolucao && last.previsao && today > last.previsao) return true;
            return false;
          }
          return true;
        });
      });
    }

    // Discipline Filter (from dashboard specialty circles)
    if (filters.discipline) {
      list = list.filter(p => {
        const d = p.disciplinas[filters.discipline];
        if (!d) return false;
        const last = getLastVersion(d);
        return d.status === 'Em andamento' && last && last.recebimento && !last.devolucao;
      });
    }

    // Search Query
    if (filters.search.trim()) {
      const s = filters.search.toLowerCase();
      list = list.filter(p => 
        p.nome.toLowerCase().includes(s) || 
        p.numero.toLowerCase().includes(s) || 
        p.arquiteto.toLowerCase().includes(s)
      );
    }

    // Ordering
    return list.sort((a, b) => {
      if (filters.orderBy === 'codigo_desc') {
        return b.numero.localeCompare(a.numero);
      }
      if (filters.orderBy === 'nome') {
        return a.nome.localeCompare(b.nome);
      }
      if (filters.orderBy === 'codigo') {
        return a.numero.localeCompare(b.numero);
      }
      if (filters.orderBy === 'arquiteto') {
        return a.arquiteto.localeCompare(b.arquiteto);
      }
      if (filters.orderBy === 'urgencia') {
        const getMinDate = (proj: EngineeringProject) => {
          let min = '9999-12-31';
          Object.values(proj.disciplinas).forEach(d => {
            const last = getLastVersion(d);
            if (d.status === 'Em andamento' && last && last.recebimento && !last.devolucao && last.limite) {
              if (last.limite < min) min = last.limite;
            }
          });
          return min;
        };
        return getMinDate(a).localeCompare(getMinDate(b));
      }
      return 0;
    });
  }, [complementaresProjects, filters]);

  // --- DASHBOARD METRICS ---

  const metrics = useMemo(() => {
    let ativos = 0;
    let naArq = 0;
    let comProj = 0;
    let atrasados = 0;
    const today = new Date().toISOString().split('T')[0];

    complementaresProjects.forEach(p => {
      let isProjectActive = false;
      Object.values(p.disciplinas).forEach(d => {
        if (d.status === 'Em andamento') {
          isProjectActive = true;
          const last = getLastVersion(d);
          if (last) {
            if (last.recebimento && !last.devolucao) {
              naArq++;
              if (today > last.limite) atrasados++;
            } else if (last.devolucao) {
              comProj++;
              if (last.previsao && today > last.previsao) atrasados++;
            }
          }
        }
      });
      if (isProjectActive) ativos++;
    });

    return { ativos, naArq, comProj, atrasados };
  }, [complementaresProjects]);

  const getPendingCountByDiscipline = (discKey: string): number => {
    let count = 0;
    complementaresProjects.forEach(p => {
      const d = p.disciplinas[discKey];
      if (d && d.status === 'Em andamento') {
        const last = getLastVersion(d);
        if (last && last.recebimento && !last.devolucao) {
          count++;
        }
      }
    });
    return count;
  };

  const criticalDelays = useMemo(() => {
    const critical: Array<{
      projectId: string;
      projectName: string;
      arquiteto: string;
      discKey: string;
      limite: string;
      daysDelayed: number;
    }> = [];
    const today = new Date().toISOString().split('T')[0];

    complementaresProjects.forEach(p => {
      Object.entries(p.disciplinas).forEach(([discKey, d]) => {
        if (d.status === 'Em andamento') {
          const last = getLastVersion(d);
          if (last && last.recebimento && !last.devolucao && today > last.limite) {
            const diff = calculateBusinessDaysDifference(last.limite, today);
            critical.push({
              projectId: p.id,
              projectName: p.nome,
              arquiteto: p.arquiteto,
              discKey: discKey,
              limite: last.limite,
              daysDelayed: diff
            });
          }
        }
      });
    });

    return critical.sort((a, b) => b.daysDelayed - a.daysDelayed);
  }, [complementaresProjects]);

  // --- ACTIONS ---

  const handleToggleExpandProject = (id: string) => {
    setExpandedProjects(prev =>
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  const filterByDashboardMetric = (metricType: string) => {
    setFilters(prev => ({
      ...prev,
      statusFilter: metricType,
      discipline: '',
      statusScope: 'todos'
    }));
    setCurrentTab('projetos');
  };

  const filterByDisciplineOnTab = (discKey: string) => {
    setFilters(prev => ({
      ...prev,
      discipline: discKey,
      statusFilter: '',
      statusScope: 'ativos'
    }));
    setCurrentTab('projetos');
  };

  const formatProjectCodeInput = (val: string): string => {
    let clean = val.replace(/[^0-9]/g, '');
    if (clean.length > 4) {
      return clean.slice(0, 4) + '-' + clean.slice(4, 7);
    }
    return clean;
  };

  const handleOpenNewProjectModal = () => {
    if (userRole === 'estagiario') {
      setCustomAlert({ show: true, message: 'Perfil de Estagiário não possui permissão para cadastrar empreendimentos.' });
      return;
    }
    setNewProjectForm({ numero: '', nome: '', arquiteto: '' });
    setModalNewProjectOpen(true);
  };

  const handleCreateProject = () => {
    const f = newProjectForm;
    if (!f.numero || !f.nome || !f.arquiteto) {
      setCustomAlert({ show: true, message: 'Por favor, preencha todos os campos do projeto.' });
      return;
    }

    const formatRegex = /^\d{4}-\d{3}$/;
    if (!formatRegex.test(f.numero)) {
      setCustomAlert({ show: true, message: 'O código do projeto precisa seguir o formato YYYY-XXX (ex: 2026-001).' });
      return;
    }

    const newProj: EngineeringProject = {
      id: Date.now().toString(),
      numero: f.numero,
      nome: f.nome,
      arquiteto: f.arquiteto,
      disciplinas: {
        estrutural: { engenheiro: '', status: 'Em andamento', arqEnviado: false, reuniaoApresentacao: false, historico: [] },
        hidraulica: { engenheiro: '', status: 'Em andamento', arqEnviado: false, reuniaoApresentacao: false, historico: [] },
        eletrica: { engenheiro: '', status: 'Em andamento', arqEnviado: false, reuniaoApresentacao: false, historico: [] },
        automacao: { engenheiro: '', status: 'Em andamento', arqEnviado: false, reuniaoApresentacao: false, historico: [] },
        ar_condicionado: { engenheiro: '', status: 'Em andamento', arqEnviado: false, reuniaoApresentacao: false, historico: [] }
      }
    };

    setComplementaresProjects(prev => [...prev, newProj]);
    setModalNewProjectOpen(false);
    triggerToast('Empreendimento cadastrado com sucesso!', 'success');
    setCurrentTab('projetos');
  };

  const handleConfirmDeleteProject = (project: EngineeringProject) => {
    if (userRole === 'estagiario') {
      setCustomAlert({ show: true, message: 'Perfil de Estagiário não possui permissão para excluir empreendimentos.' });
      return;
    }
    setCustomConfirm({
      show: true,
      message: `Tem certeza de que deseja excluir o empreendimento "${project.nome}" e todo o histórico?`,
      onConfirm: () => {
        setComplementaresProjects(prev => prev.filter(p => p.id !== project.id));
        setModalProjectOpen(false);
        triggerToast('Empreendimento removido permanentemente.', 'success');
      }
    });
  };

  const handleOpenProjectModal = (proj: EngineeringProject) => {
    setModalProjectData(proj);
    setSelectedDiscKey('estrutural');
    setNewVersionFormOpen(false);
    setModalProjectOpen(true);
  };

  const handleOpenDisciplineModal = (proj: EngineeringProject, discKey: string) => {
    setModalProjectData(proj);
    setSelectedDiscKey(discKey);
    setNewVersionFormOpen(false);
    setModalProjectOpen(true);
  };

  const handleDisciplineStatusChange = (discKey: string, newStatus: any) => {
    if (!modalProjectData) return;
    const updated = complementaresProjects.map(p => {
      if (p.id === modalProjectData.id) {
        const disc = p.disciplinas[discKey];
        return {
          ...p,
          disciplinas: {
            ...p.disciplinas,
            [discKey]: { ...disc, status: newStatus }
          }
        };
      }
      return p;
    });

    setComplementaresProjects(updated);
    setModalProjectData(prev => prev ? {
      ...prev,
      disciplinas: {
        ...prev.disciplinas,
        [discKey]: { ...prev.disciplinas[discKey], status: newStatus }
      }
    } : null);

    triggerToast(`Status de ${DISCIPLINAS_CONFIG[discKey as keyof typeof DISCIPLINAS_CONFIG].nome} atualizado para: ${newStatus}`, 'success');
  };

  const handleEngineerChange = (discKey: string, engName: string) => {
    if (!modalProjectData) return;
    const updated = complementaresProjects.map(p => {
      if (p.id === modalProjectData.id) {
        const disc = p.disciplinas[discKey];
        return {
          ...p,
          disciplinas: {
            ...p.disciplinas,
            [discKey]: { ...disc, engenheiro: engName }
          }
        };
      }
      return p;
    });
    setComplementaresProjects(updated);
    setModalProjectData(prev => prev ? {
      ...prev,
      disciplinas: {
        ...prev.disciplinas,
        [discKey]: { ...prev.disciplinas[discKey], engenheiro: engName }
      }
    } : null);
  };

  const handleCheckboxChange = (discKey: string, field: 'arqEnviado' | 'reuniaoApresentacao', checked: boolean) => {
    if (!modalProjectData) return;
    const updated = complementaresProjects.map(p => {
      if (p.id === modalProjectData.id) {
        const disc = p.disciplinas[discKey];
        return {
          ...p,
          disciplinas: {
            ...p.disciplinas,
            [discKey]: { ...disc, [field]: checked }
          }
        };
      }
      return p;
    });
    setComplementaresProjects(updated);
    setModalProjectData(prev => prev ? {
      ...prev,
      disciplinas: {
        ...prev.disciplinas,
        [discKey]: { ...prev.disciplinas[discKey], [field]: checked }
      }
    } : null);
    
    const label = field === 'arqEnviado' ? 'Status do arquitetônico atualizado!' : 'Status da reunião de alinhamento atualizado!';
    triggerToast(label, 'success');
  };

  // --- NEW VERSION FORM ACTIONS ---

  const handleInitNewVersionForm = () => {
    if (!modalProjectData) return;
    const disc = modalProjectData.disciplinas[selectedDiscKey];
    const nextVersion = disc.historico.length + 1;
    const todayStr = new Date().toISOString().split('T')[0];
    const days = nextVersion === 1 ? 15 : 5;
    
    setNewVersionFormData({
      versao: nextVersion,
      recebimento: todayStr,
      limite: calculateBusinessDays(todayStr, days),
      computedDays: days
    });
    setNewVersionFormOpen(true);
  };

  const handleNewVersionDateChange = (field: 'recebimento' | 'limite', value: string) => {
    setNewVersionFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'recebimento') {
        const days = prev.versao === 1 ? 15 : 5;
        updated.limite = calculateBusinessDays(value, days);
        updated.computedDays = days;
      } else {
        if (updated.recebimento && value) {
          updated.computedDays = calculateBusinessDaysDifference(updated.recebimento, value);
        }
      }
      return updated;
    });
  };

  const handleSaveNewVersion = () => {
    if (!modalProjectData) return;
    const form = newVersionFormData;
    if (!form.recebimento) {
      setCustomAlert({ show: true, message: 'Selecione uma data de recebimento válida.' });
      return;
    }

    const newHist: DisciplineHistory = {
      versao: form.versao,
      recebimento: form.recebimento,
      limite: form.limite,
      devolucao: null,
      previsao: null
    };

    const updated = complementaresProjects.map(p => {
      if (p.id === modalProjectData.id) {
        const disc = p.disciplinas[selectedDiscKey];
        return {
          ...p,
          disciplinas: {
            ...p.disciplinas,
            [selectedDiscKey]: {
              ...disc,
              historico: [...disc.historico, newHist]
            }
          }
        };
      }
      return p;
    });

    setComplementaresProjects(updated);
    setModalProjectData(prev => prev ? {
      ...prev,
      disciplinas: {
        ...prev.disciplinas,
        [selectedDiscKey]: {
          ...prev.disciplinas[selectedDiscKey],
          historico: [...prev.disciplinas[selectedDiscKey].historico, newHist]
        }
      }
    } : null);

    setNewVersionFormOpen(false);
    triggerToast(`Entrada da Versão V${form.versao} registrada!`, 'success');
  };

  const handleHistoryFieldChange = (versao: number, field: 'devolucao' | 'previsao', value: string | null) => {
    if (!modalProjectData) return;
    const updated = complementaresProjects.map(p => {
      if (p.id === modalProjectData.id) {
        const disc = p.disciplinas[selectedDiscKey];
        return {
          ...p,
          disciplinas: {
            ...p.disciplinas,
            [selectedDiscKey]: {
              ...disc,
              historico: disc.historico.map(h => h.versao === versao ? { ...h, [field]: value || null } : h)
            }
          }
        };
      }
      return p;
    });

    setComplementaresProjects(updated);
    setModalProjectData(prev => prev ? {
      ...prev,
      disciplinas: {
        ...prev.disciplinas,
        [selectedDiscKey]: {
          ...prev.disciplinas[selectedDiscKey],
          historico: prev.disciplinas[selectedDiscKey].historico.map(h => h.versao === versao ? { ...h, [field]: value || null } : h)
        }
      }
    } : null);

    const toastMsg = field === 'devolucao' ? 'Data de Devolução atualizada!' : 'Nova previsão de retorno salva!';
    triggerToast(toastMsg, 'success');
  };

  return (
    <div className="flex flex-col gap-6 text-sm text-black">
      
      {/* SELETOR DE SUB-ABAS SUPERIOR */}
      <div className="flex justify-between items-center bg-white px-6 py-3.5 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex gap-4">
          <button 
            onClick={() => {
              setCurrentTab('dashboard');
              setFilters(prev => ({ ...prev, statusFilter: '', discipline: '' }));
            }}
            className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition cursor-pointer ${
              currentTab === 'dashboard' ? 'bg-[#1A1A1A] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <i className="fa-solid fa-chart-line"></i>
            <span>Dashboard</span>
          </button>
          
          <button 
            onClick={() => setCurrentTab('projetos')}
            className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-2 transition cursor-pointer ${
              currentTab === 'projetos' ? 'bg-[#1A1A1A] text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <i className="fa-solid fa-folder-open"></i>
            <span>Empreendimentos</span>
          </button>
        </div>

        {currentTab === 'projetos' && (
          <button 
            onClick={handleOpenNewProjectModal}
            className="bg-[#1A1A1A] hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition cursor-pointer"
          >
            <i className="fa-solid fa-plus text-[10px]"></i>
            <span>Cadastrar Projeto</span>
          </button>
        )}
      </div>

      {/* TELA DE DASHBOARD */}
      {currentTab === 'dashboard' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* PANORAMA GERAL CARDS */}
          <div>
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">Panorama Geral</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Com Arquitetura */}
              <div 
                onClick={() => filterByDashboardMetric('naArq')}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex items-center justify-between group"
              >
                <div>
                  <span class="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Com Arquitetura</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-bold text-black group-hover:scale-105 transition">{metrics.naArq}</span>
                    <span className="text-xs text-slate-500 font-medium">projetos na mesa</span>
                  </div>
                </div>
                <div className="bg-slate-100 text-black p-3 rounded-xl">
                  <i className="fa-solid fa-file-signature text-xl"></i>
                </div>
              </div>

              {/* Com Projetista */}
              <div 
                onClick={() => filterByDashboardMetric('comProj')}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-300 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex items-center justify-between group"
              >
                <div>
                  <span class="text-xs font-semibold text-amber-600 uppercase tracking-wider block">Com Engenheiro</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-bold text-amber-650 group-hover:scale-105 transition">{metrics.comProj}</span>
                    <span className="text-xs text-amber-655 font-medium font-semibold">aguardando retorno</span>
                  </div>
                </div>
                <div className="bg-amber-50 text-amber-600 p-3 rounded-xl">
                  <i className="fa-solid fa-user-gear text-xl"></i>
                </div>
              </div>

              {/* Atrasados */}
              <div 
                onClick={() => filterByDashboardMetric('atrasados')}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-rose-300 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex items-center justify-between group"
              >
                <div>
                  <span class="text-xs font-semibold text-rose-600 uppercase tracking-wider block font-bold">Prazos Estourados</span>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-3xl font-bold text-rose-600 group-hover:scale-105 transition">{metrics.atrasados}</span>
                    <span className="text-xs text-rose-650 font-medium font-semibold">revisões em atraso</span>
                  </div>
                </div>
                <div className="bg-rose-50 text-rose-600 p-3 rounded-xl">
                  <i className="fa-solid fa-clock-rotate-left text-xl"></i>
                </div>
              </div>
            </div>
          </div>

          {/* GARGALOS POR ESPECIALIDADE */}
          <div>
            <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">Gargalos Pendentes por Especialidade</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
              {Object.entries(DISCIPLINAS_CONFIG).map(([key, config]) => (
                <div 
                  key={key}
                  onClick={() => filterByDisciplineOnTab(key)}
                  className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 flex flex-col justify-between relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100"></div>
                  
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className={`p-2 rounded-xl text-sm ${config.bg} ${config.color}`}>
                      <i className={`${config.icon} text-base`}></i>
                    </span>
                    <span className="text-xs font-bold text-slate-700 group-hover:text-black transition">{config.nome}</span>
                  </div>

                  <div className="flex items-baseline justify-between mt-1">
                    <span className="text-2xl font-bold text-slate-900">{getPendingCountByDiscipline(key)}</span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Pendentes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* QUADRO DE ATENÇÃO CRÍTICA */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <i className="fa-solid fa-triangle-exclamation text-amber-500"></i>
                Atenção Crítica (Atrasos da Arquitetura)
              </h3>
            </div>

            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
              {criticalDelays.map(item => (
                <div key={`${item.projectId}-${item.discKey}`} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{item.projectName}</span>
                    <div className="flex gap-2 mt-1 items-center">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${DISCIPLINAS_CONFIG[item.discKey as keyof typeof DISCIPLINAS_CONFIG].bg} ${DISCIPLINAS_CONFIG[item.discKey as keyof typeof DISCIPLINAS_CONFIG].color}`}>
                        {DISCIPLINAS_CONFIG[item.discKey as keyof typeof DISCIPLINAS_CONFIG].nome}
                      </span>
                      <span className="text-slate-400">Resp: <span className="font-medium text-slate-600">{item.arquiteto}</span></span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-rose-600 font-bold block">Atrasado há {item.daysDelayed} dias úteis</span>
                    <span className="text-[10px] text-slate-400">Prazo era: {formatDate(item.limite)}</span>
                  </div>
                </div>
              ))}

              {criticalDelays.length === 0 && (
                <div className="py-6 text-center text-slate-400">
                  <i className="fa-solid fa-circle-check text-emerald-500 text-2xl mb-2 block"></i>
                  <span className="font-medium">Nenhum prazo atrasado na arquitetura! Parabéns!</span>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* TELA DE EMPREENDIMENTOS */}
      {currentTab === 'projetos' && (
        <div className="space-y-4 animate-fade-in">
          
          {/* BOX DE FILTROS */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              
              {/* Segmented active/all filter */}
              <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-64">
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, statusScope: 'ativos' }))}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                    filters.statusScope === 'ativos' ? 'bg-white text-black shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Projetos Ativos
                </button>
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, statusScope: 'todos' }))}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                    filters.statusScope === 'todos' ? 'bg-white text-black shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Todos
                </button>
              </div>

              {/* Active filters indicators */}
              <div className="flex flex-wrap gap-2">
                {filters.discipline && (
                  <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 py-1 rounded-xl text-xs text-indigo-800 font-semibold animate-pulse">
                    <span>Gargalo: <strong>{DISCIPLINAS_CONFIG[filters.discipline as keyof typeof DISCIPLINAS_CONFIG].nome}</strong></span>
                    <button onClick={() => setFilters(prev => ({ ...prev, discipline: '' }))} className="hover:text-indigo-950 ml-1 cursor-pointer">
                      <i className="fa-solid fa-circle-xmark text-sm"></i>
                    </button>
                  </div>
                )}
                {filters.statusFilter && (
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-250 px-3 py-1 rounded-xl text-xs text-amber-800 font-semibold">
                    <span>Status: <strong>{filters.statusFilter === 'naArq' ? 'Com Arq' : (filters.statusFilter === 'comProj' ? 'Com Eng' : 'Atrasados')}</strong></span>
                    <button onClick={() => setFilters(prev => ({ ...prev, statusFilter: '' }))} className="hover:text-amber-955 ml-1 cursor-pointer">
                      <i className="fa-solid fa-circle-xmark text-sm"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                <input 
                  type="text" 
                  placeholder="Buscar por nome, código ou responsável..." 
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs md:text-sm pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-400 outline-none transition"
                />
              </div>

              {/* Architect filter */}
              <div className="flex items-center gap-2 min-w-[180px]">
                <span className="text-xs font-semibold text-slate-400 whitespace-nowrap"><i class="fa-solid fa-user-circle"></i> Arquiteto:</span>
                <select 
                  value={filters.architect}
                  onChange={(e) => setFilters(prev => ({ ...prev, architect: e.target.value }))}
                  className="w-full bg-slate-50 hover:bg-slate-100/70 border border-slate-200 text-xs py-2.5 px-3 rounded-xl focus:border-indigo-500 outline-none transition font-medium"
                >
                  <option value="">Todos</option>
                  {uniqueArchitects.map(arch => (
                    <option key={arch} value={arch}>{arch}</option>
                  ))}
                </select>
              </div>

              {/* Order selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 whitespace-nowrap"><i class="fa-solid fa-arrow-down-wide-short"></i> Ordenar:</span>
                <select 
                  value={filters.orderBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, orderBy: e.target.value }))}
                  className="bg-slate-50 hover:bg-slate-100/70 border border-slate-200 text-xs py-2.5 px-3 rounded-xl focus:border-indigo-500 outline-none transition font-medium"
                >
                  <option value="codigo_desc">Código (Mais Novo)</option>
                  <option value="nome">Nome do Projeto</option>
                  <option value="codigo">Código (Crescente)</option>
                  <option value="urgencia">Mais Urgente (Prazo)</option>
                  <option value="arquiteto">Arquiteto Responsável</option>
                </select>
              </div>
            </div>
          </div>

          {/* PROJECT LIST */}
          <div className="space-y-3">
            {filteredProjects.map(proj => {
              const isExpanded = expandedProjects.includes(proj.id);
              return (
                <div key={proj.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                  
                  {/* Linear Card Header */}
                  <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Info */}
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <div className="bg-slate-100 border border-slate-250 text-black px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider whitespace-nowrap shadow-sm">
                        {proj.numero}
                      </div>
                      <div className="truncate">
                        <h3 
                          onClick={() => handleOpenProjectModal(proj)}
                          className="font-bold text-slate-900 text-sm md:text-base hover:text-black cursor-pointer flex items-center gap-1.5"
                        >
                          {proj.nome}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <i className="fa-solid fa-user-circle text-slate-400 text-xs"></i>
                          <span className="text-xs font-medium text-slate-500">Arq. Responsável: {proj.arquiteto}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Specialty circles & expand btn */}
                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-150">
                      <div className="flex items-center gap-2">
                        {Object.entries(proj.disciplinas).map(([discKey, d]) => (
                          <button 
                            key={discKey}
                            onClick={() => handleOpenDisciplineModal(proj, discKey)}
                            className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center relative transition-all duration-150 hover:scale-105 active:scale-95 shadow-sm border cursor-pointer ${getDisciplineIconStyles(d)}`}
                            title={DISCIPLINAS_CONFIG[discKey as keyof typeof DISCIPLINAS_CONFIG].nome}
                          >
                            <i className={`${DISCIPLINAS_CONFIG[discKey as keyof typeof DISCIPLINAS_CONFIG].icon} text-base md:text-lg`}></i>
                            {d.status !== 'Não se aplica' && (
                              <span 
                                className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getDisciplineStatusBadge(d).bg}`}
                              ></span>
                            )}
                          </button>
                        ))}
                      </div>

                      <button 
                        onClick={() => handleToggleExpandProject(proj.id)}
                        className="bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 w-10 h-10 rounded-xl flex items-center justify-center transition border border-slate-200 cursor-pointer"
                        title={isExpanded ? 'Recolher detalhes' : 'Expandir detalhes'}
                      >
                        <i className={`fa-solid ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Expanded detail panel */}
                  {isExpanded && (
                    <div className="border-t border-slate-150 bg-slate-50/20 p-4 animate-fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                        {Object.entries(proj.disciplinas).map(([discKey, d]) => (
                          <div 
                            key={discKey}
                            onClick={() => handleOpenDisciplineModal(proj, discKey)}
                            className={`border rounded-xl p-3 cursor-pointer transition-all hover:bg-white relative flex flex-col justify-between h-28 ${getDisciplineCardBorder(d)}`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                                {DISCIPLINAS_CONFIG[discKey as keyof typeof DISCIPLINAS_CONFIG].nome}
                              </span>
                              <span className={`text-[10px] font-bold ${getDisciplineStatusBadge(d).text}`}>
                                <i className={DISCIPLINAS_CONFIG[discKey as keyof typeof DISCIPLINAS_CONFIG].icon}></i>
                              </span>
                            </div>

                            <div className="flex-1 flex flex-col justify-center">
                              {d.status === 'Não se aplica' && (
                                <span className="text-xs text-slate-400 italic font-medium">Não se aplica</span>
                              )}
                              
                              {d.status === 'Compatibilizado' && (
                                <div className="text-emerald-600 font-bold text-xs flex items-center gap-1">
                                  <i className="fa-regular fa-circle-check"></i>
                                  <span>Aprovado</span>
                                </div>
                              )}

                              {d.status === 'Em andamento' && (
                                <div>
                                  <div className="flex items-center justify-between text-xs font-semibold">
                                    <span className="text-slate-700">Versão {getLastVersionNumber(d)}</span>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${getDisciplineStatusBadge(d).bg} ${getDisciplineStatusBadge(d).text}`}>
                                      {getDisciplineStatusBadge(d).label.replace('Atrasado ', 'Atras.')}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-400 mt-1 truncate">
                                    {d.engenheiro ? `Eng: ${d.engenheiro}` : 'Sem engenheiro'}
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="text-[9px] text-slate-400 border-t border-slate-100 pt-1.5 flex justify-between items-center mt-1">
                              <span>{getFooterDateLabel(d).title}</span>
                              <span className="font-bold text-slate-600">{getFooterDateLabel(d).date}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-3 flex justify-end">
                        <button 
                          onClick={() => handleOpenProjectModal(proj)} 
                          className="bg-slate-100 hover:bg-indigo-50 text-black text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <i className="fa-solid fa-timeline"></i>
                          <span>Fluxo Completo & Configurações</span>
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}

            {filteredProjects.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl py-12 px-4 text-center shadow-sm animate-fade-in">
                <div className="bg-slate-50 text-slate-400 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <i className="fa-regular fa-folder-open text-2xl"></i>
                </div>
                <h4 class="font-bold text-slate-700 text-base">Nenhum projeto encontrado</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  {filters.statusScope === 'ativos' 
                    ? 'Tente alterar os filtros de busca, alternar para a aba "Todos" ou cadastrar um novo projeto.'
                    : 'Tente alterar os termos da busca.'}
                </p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ======================================================= */}
      {/* JANELAS MODAIS */}
      
      {/* 1. MODAL DE DETALHES E TIMELINE DO EMPREENDIMENTO */}
      {modalProjectOpen && modalProjectData && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col animate-scale-up">
            
            {/* Header Modal */}
            <div className="bg-indigo-900 text-white px-6 py-5 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-black text-indigo-100 font-bold px-2.5 py-0.5 rounded text-xs">{modalProjectData.numero}</span>
                  <h3 className="text-lg font-bold">{modalProjectData.nome}</h3>
                </div>
                <p className="text-xs text-indigo-200 mt-1.5 flex items-center gap-3">
                  <span><i class="fa-solid fa-user-circle mr-1"></i> Arquiteto Responsável: <span class="font-bold">{modalProjectData.arquiteto}</span></span>
                </p>
              </div>
              <button 
                onClick={() => setModalProjectOpen(false)} 
                className="text-indigo-200 hover:text-white transition text-lg bg-indigo-950 p-2 rounded-xl cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Corpo Modal */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coluna 1: Lista de Disciplinas */}
              <div className="lg:col-span-1 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Disciplinas do Prédio</h4>
                {Object.entries(modalProjectData.disciplinas).map(([discKey, d]) => (
                  <div 
                    key={discKey}
                    onClick={() => {
                      setSelectedDiscKey(discKey);
                      setNewVersionFormOpen(false);
                    }}
                    className={`p-3 bg-white border rounded-xl cursor-pointer hover:border-indigo-300 transition flex items-center justify-between ${
                      selectedDiscKey === discKey ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`p-2 rounded-lg text-sm ${DISCIPLINAS_CONFIG[discKey as keyof typeof DISCIPLINAS_CONFIG].bg} ${DISCIPLINAS_CONFIG[discKey as keyof typeof DISCIPLINAS_CONFIG].color}`}>
                        <i className={`${DISCIPLINAS_CONFIG[discKey as keyof typeof DISCIPLINAS_CONFIG].icon} text-base`}></i>
                      </span>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">{DISCIPLINAS_CONFIG[discKey as keyof typeof DISCIPLINAS_CONFIG].nome}</span>
                        <span className="text-[10px] text-slate-400 font-semibold">{d.status}</span>
                      </div>
                    </div>
                    <i className={`fa-solid fa-chevron-right text-xs text-slate-300 transition-transform ${selectedDiscKey === discKey ? 'text-black translate-x-1' : ''}`}></i>
                  </div>
                ))}
              </div>

              {/* Colunas 2-3: Linha do tempo e Controles da Disciplina Selecionada */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 flex flex-col h-full min-h-[400px]">
                {selectedDiscKey && modalProjectData.disciplinas[selectedDiscKey] && (() => {
                  const d = modalProjectData.disciplinas[selectedDiscKey];
                  return (
                    <div className="flex-1 flex flex-col justify-between h-full">
                      <div>
                        {/* Editor de Responsável e Status */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-3">
                          <div>
                            <h4 className="font-bold text-slate-900 text-base">{DISCIPLINAS_CONFIG[selectedDiscKey as keyof typeof DISCIPLINAS_CONFIG].nome}</h4>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-xs text-slate-400 font-semibold">Eng. Projetista:</span>
                              <input 
                                type="text" 
                                value={d.engenheiro}
                                onChange={(e) => handleEngineerChange(selectedDiscKey, e.target.value)}
                                placeholder="Definir responsável..."
                                disabled={userRole === 'estagiario'}
                                className="text-xs font-bold text-black bg-slate-50 border border-slate-200 focus:bg-white rounded px-2 py-0.5 outline-none transition w-44"
                              />
                            </div>
                            <div className="mt-2.5 flex flex-col sm:flex-row gap-3 bg-slate-50 p-2 rounded-lg border border-slate-200">
                              <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={d.arqEnviado || false}
                                  onChange={(e) => handleCheckboxChange(selectedDiscKey, 'arqEnviado', e.target.checked)}
                                  disabled={userRole === 'estagiario'}
                                  className="rounded text-black focus:ring-indigo-400 w-3.5 h-3.5 cursor-pointer"
                                />
                                <span>Arq. Enviado para o Projetista</span>
                              </label>
                              <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 cursor-pointer">
                                <input 
                                  type="checkbox" 
                                  checked={d.reuniaoApresentacao || false}
                                  onChange={(e) => handleCheckboxChange(selectedDiscKey, 'reuniaoApresentacao', e.target.checked)}
                                  disabled={userRole === 'estagiario'}
                                  className="rounded text-black focus:ring-indigo-400 w-3.5 h-3.5 cursor-pointer"
                                />
                                <span>Reunião de Alinhamento Realizada</span>
                              </label>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400 font-semibold">Status:</span>
                            <select 
                              value={d.status}
                              onChange={(e) => handleDisciplineStatusChange(selectedDiscKey, e.target.value)}
                              disabled={userRole === 'estagiario'}
                              className="bg-slate-100 border border-slate-250 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:border-indigo-500 focus:bg-white outline-none"
                            >
                              <option value="Em andamento">Em andamento</option>
                              <option value="Compatibilizado">Compatibilizado / Aprovado</option>
                              <option value="Não se aplica">Não se aplica</option>
                            </select>
                          </div>
                        </div>

                        {/* HISTÓRICO DE REVISÕES */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-extrabold text-slate-450 uppercase tracking-wider">Histórico de Versões</span>
                            {d.status === 'Em andamento' && !newVersionFormOpen && (
                              <button 
                                onClick={handleInitNewVersionForm}
                                disabled={userRole === 'estagiario'}
                                className="text-xs bg-slate-100 hover:bg-indigo-50 text-black font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                              >
                                <i className="fa-solid fa-plus"></i>
                                <span>Entrada de Versão</span>
                              </button>
                            )}
                          </div>

                          {/* FORMULÁRIO DE NOVA REVISÃO */}
                          {newVersionFormOpen && (
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-350 mb-5 animate-scale-up">
                              <h5 className="font-bold text-xs text-slate-700 mb-3 flex items-center gap-1.5">
                                <span className="bg-[#1A1A1A] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]">{newVersionFormData.versao}</span>
                                Registrando Nova Entrada de Revisão
                              </h5>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1">Data de Recebimento</label>
                                  <input 
                                    type="date" 
                                    value={newVersionFormData.recebimento}
                                    onChange={(e) => handleNewVersionDateChange('recebimento', e.target.value)}
                                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold outline-none focus:border-indigo-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1">Prazo de Devolução</label>
                                  <div className="flex gap-2">
                                    <input 
                                      type="date" 
                                      value={newVersionFormData.limite}
                                      onChange={(e) => handleNewVersionDateChange('limite', e.target.value)}
                                      className="flex-1 bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold text-slate-700 outline-none focus:border-indigo-500"
                                    />
                                    <div className="bg-slate-100 border border-slate-250 text-black px-2.5 py-1 rounded-lg flex items-center justify-center text-[10px] font-extrabold whitespace-nowrap">
                                      {newVersionFormData.computedDays} d úteis
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => setNewVersionFormOpen(false)}
                                  className="px-3 py-1.5 border rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-100 cursor-pointer"
                                >
                                  Cancelar
                                </button>
                                <button 
                                  onClick={handleSaveNewVersion}
                                  className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-black text-white rounded-lg text-xs font-bold cursor-pointer"
                                >
                                  Registrar Entrada
                                </button>
                              </div>
                            </div>
                          )}

                          {/* LINHA DO TEMPO */}
                          <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                            {d.historico.slice().reverse().map(h => (
                              <div key={h.versao} className="border-l-2 border-indigo-200 pl-4 relative py-1">
                                <div className="absolute -left-[7px] top-1.5 bg-[#1A1A1A] text-white w-3 h-3 rounded-full flex items-center justify-center"></div>
                                
                                <div className="flex justify-between items-start text-xs">
                                  <div className="w-full">
                                    <span className="font-extrabold text-slate-800 text-sm">Versão {h.versao}</span>
                                    
                                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-slate-400">
                                      <span>Recebido: <strong className="text-slate-650">{formatDate(h.recebimento)}</strong></span>
                                      <span>Prazo: <strong className="text-slate-650">{formatDate(h.limite)}</strong></span>
                                    </div>

                                    {/* Date selectors inline */}
                                    <div className="mt-2.5 flex flex-wrap gap-3">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Devolvido em:</span>
                                        <input 
                                          type="date" 
                                          value={h.devolucao || ''}
                                          onChange={(e) => handleHistoryFieldChange(h.versao, 'devolucao', e.target.value || null)}
                                          disabled={userRole === 'estagiario'}
                                          className="bg-slate-50 border border-slate-200 hover:bg-white focus:bg-white text-[11px] font-medium p-1 rounded-md outline-none"
                                        />
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Previsão Retorno:</span>
                                        <input 
                                          type="date" 
                                          value={h.previsao || ''}
                                          onChange={(e) => handleHistoryFieldChange(h.versao, 'previsao', e.target.value || null)}
                                          disabled={userRole === 'estagiario'}
                                          className="bg-slate-50 border border-slate-200 hover:bg-white focus:bg-white text-[11px] font-medium p-1 rounded-md outline-none"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}

                            {d.historico.length === 0 && (
                              <div className="py-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
                                <i className="fa-solid fa-timeline text-lg mb-1 block"></i>
                                <span className="text-xs font-medium">Nenhuma versão registrada para esta especialidade.</span>
                              </div>
                            )}
                          </div>

                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Rodapé Modal */}
            <div className="border-t border-slate-100 p-4 bg-slate-50 flex justify-between">
              <button 
                onClick={() => handleConfirmDeleteProject(modalProjectData)} 
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <i className="fa-regular fa-trash-can"></i>
                <span>Excluir Projeto</span>
              </button>
              <button 
                onClick={() => setModalProjectOpen(false)} 
                className="bg-[#1A1A1A] hover:bg-black text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-md cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. MODAL CADASTRAR NOVO PROJETO */}
      {modalNewProjectOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-scale-up">
            <div className="bg-slate-900 text-white px-5 py-4 flex justify-between items-center">
              <h3 className="font-bold text-sm md:text-base"><i className="fa-solid fa-folder-plus text-indigo-400 mr-2"></i>Novo Empreendimento</h3>
              <button onClick={() => setModalNewProjectOpen(false)} className="text-slate-400 hover:text-white transition cursor-pointer">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-450 uppercase mb-1">Código de Controle</label>
                <input 
                  type="text" 
                  value={newProjectForm.numero}
                  onChange={(e) => setNewProjectForm(prev => ({ ...prev, numero: formatProjectCodeInput(e.target.value) }))}
                  placeholder="Ex: 2026-001"
                  maxLength={8}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs md:text-sm font-semibold outline-none focus:border-black focus:bg-white transition uppercase"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">O código será formatado automaticamente como YYYY-XXX</span>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-450 uppercase mb-1">Nome do Empreendimento</label>
                <input 
                  type="text" 
                  value={newProjectForm.nome}
                  onChange={(e) => setNewProjectForm(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Residencial Vista Bella"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs md:text-sm font-semibold outline-none focus:border-black focus:bg-white transition"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-455 uppercase mb-1">Arquiteto Responsável</label>
                <input 
                  type="text" 
                  value={newProjectForm.arquiteto}
                  onChange={(e) => setNewProjectForm(prev => ({ ...prev, arquiteto: e.target.value }))}
                  placeholder="Ex: Clara Mendes"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs md:text-sm font-semibold outline-none focus:border-black focus:bg-white transition"
                />
              </div>

              <p className="text-[10px] text-slate-400 leading-relaxed">
                <i className="fa-solid fa-info-circle mr-1"></i> Por padrão, todos os novos empreendimentos começam com as 5 disciplinas complementares ativas e em andamento. Você poderá desativar ou dar andamento individual após a criação.
              </p>
            </div>

            <div className="bg-slate-55 border-t p-4 flex justify-end gap-2.5">
              <button 
                onClick={() => setModalNewProjectOpen(false)} 
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                onClick={handleCreateProject} 
                className="px-5 py-2 bg-[#1A1A1A] hover:bg-black text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-50 cursor-pointer"
              >
                Criar Prédio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================= */}
      {/* 3. DIALOGS CUSTOMIZADOS (ALERT/CONFIRM) */}
      
      {/* ALERT CUSTOM */}
      {customAlert.show && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-55 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-5 animate-scale-up">
            <h4 className="font-bold text-slate-950 text-sm md:text-base flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation text-indigo-500"></i>
              Atenção
            </h4>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              {customAlert.message}
            </p>
            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => setCustomAlert({ show: false, message: '' })}
                className="bg-slate-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM CUSTOM */}
      {customConfirm.show && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-55 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-5 animate-scale-up">
            <h4 className="font-bold text-slate-950 text-sm flex items-center gap-2">
              <i className="fa-solid fa-circle-question text-indigo-500"></i>
              Confirmação
            </h4>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">
              {customConfirm.message}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button 
                onClick={() => setCustomConfirm({ show: false, message: '', onConfirm: null })}
                className="px-4 py-2 border rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  if (customConfirm.onConfirm) customConfirm.onConfirm();
                  setCustomConfirm({ show: false, message: '', onConfirm: null });
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
