import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Star, Briefcase, Mail, Phone, Save, 
  Trash2, Handshake, Award, FileText, Lock, X, Heart
} from 'lucide-react';
import { Partner, PartnerProject } from '../../types';

// Initial realistic mock data
const INITIAL_PARTNERS: Partner[] = [
  {
    id: 'p-1',
    name: 'Calculus Engenharia Estrutural',
    type: 'Estrutural',
    recommendationLevel: 'Altamente Recomendado',
    recommendationScore: 4.9,
    projectsCount: 18,
    notes: 'Excelente entrosamento com a equipe Fpoles. Entrega modelos estruturais em BIM com alta qualidade de compatibilização e compatibilidade no Revit.',
    contactEmail: 'roberto@calculus.eng.br',
    contactPhone: '(11) 98765-4321',
    projectsHistory: [
      { projectName: 'Edifício Horizon (2026-010)', year: 2026, role: 'Cálculo Estrutural e Fundação', status: 'Em andamento' },
      { projectName: 'Residencial Bella Vista (2026-015)', year: 2026, role: 'Modelagem Estrutural BIM', status: 'Em andamento' },
      { projectName: 'Residência Moron (2025-020)', year: 2025, role: 'Estruturas de Concreto Armado', status: 'Concluído' }
    ]
  },
  {
    id: 'p-1b',
    name: 'AlfaCálculo Fundações e Solo',
    type: 'Estrutural',
    recommendationLevel: 'Recomendado',
    recommendationScore: 4.5,
    projectsCount: 14,
    notes: 'Especialistas em solo e fundações profundas complexas. Ótimas sondagens e relatórios técnicos precisos.',
    contactEmail: 'projetos@alfacalculo.eng.br',
    contactPhone: '(11) 95544-3322',
    projectsHistory: [
      { projectName: 'Edifício Horizon (2026-010)', year: 2026, role: 'Estudos Geotécnicos e Contenções', status: 'Em andamento' },
      { projectName: 'Condomínio Horizonte da Mata (2026-004)', year: 2025, role: 'Projeto de Fundações por Estacas', status: 'Concluído' }
    ]
  },
  {
    id: 'p-2',
    name: 'HidraSan Saneamento e Hidráulica',
    type: 'Hidráulica',
    recommendationLevel: 'Recomendado',
    recommendationScore: 4.2,
    projectsCount: 12,
    notes: 'Bons prazos de entrega, mas requer acompanhamento próximo na compatibilização com a disciplina de elétrica.',
    contactEmail: 'contato@hidrasan.com.br',
    contactPhone: '(11) 97654-3210',
    projectsHistory: [
      { projectName: 'Edifício Horizon (2026-010)', year: 2026, role: 'Instalações Hidrossanitárias', status: 'Em andamento' },
      { projectName: 'Residencial Bella Vista (2026-015)', year: 2026, role: 'Projeto de Drenagem Pluvial', status: 'Concluído' }
    ]
  },
  {
    id: 'p-2b',
    name: 'PluviaTech Hidrossanitária',
    type: 'Hidráulica',
    recommendationLevel: 'Altamente Recomendado',
    recommendationScore: 4.6,
    projectsCount: 9,
    notes: 'Projetos hidráulicos de alto padrão com detalhamento preciso de prumadas e shafts de manutenção. Excelente suporte.',
    contactEmail: 'eng@pluviatech.com.br',
    contactPhone: '(11) 94455-6677',
    projectsHistory: [
      { projectName: 'Condomínio Horizonte da Mata (2026-004)', year: 2025, role: 'Projetos Hidráulicos e de Reuso de Água', status: 'Concluído' }
    ]
  },
  {
    id: 'p-3',
    name: 'DecoGlow Luminotécnica',
    type: 'Iluminação',
    recommendationLevel: 'Altamente Recomendado',
    recommendationScore: 4.8,
    projectsCount: 8,
    notes: 'Projetos de iluminação muito detalhados e de altíssimo padrão. Sempre especificam fornecedores com bom custo-benefício.',
    contactEmail: 'sofia@decoglow.design',
    contactPhone: '(11) 99887-7665',
    projectsHistory: [
      { projectName: 'Residência Ruas (2023-020)', year: 2024, role: 'Luminotécnico e Automação de Iluminação', status: 'Concluído' },
      { projectName: 'Residência Moron (2025-020)', year: 2025, role: 'Design de Interiores & Iluminação', status: 'Concluído' }
    ]
  },
  {
    id: 'p-3b',
    name: 'LuminaPro Projetos de Iluminação',
    type: 'Iluminação',
    recommendationLevel: 'Recomendado',
    recommendationScore: 4.6,
    projectsCount: 12,
    notes: 'Foco em iluminação comercial e corporativa. Excelentes simulações no Dialux e especificações de luminárias LED homologadas.',
    contactEmail: 'contato@luminapro.com.br',
    contactPhone: '(11) 93322-1100',
    projectsHistory: [
      { projectName: 'Edifício Horizon (2026-010)', year: 2026, role: 'Luminotécnico das Áreas Comuns', status: 'Em andamento' }
    ]
  },
  {
    id: 'p-4',
    name: 'Marmoraria Granitex',
    type: 'Esquadrias',
    recommendationLevel: 'Regular',
    recommendationScore: 3.5,
    projectsCount: 5,
    notes: 'A qualidade do acabamento é excepcional, porém costumam atrasar a entrega das peças na obra.',
    contactEmail: 'vendas@marmorariagranitex.com.br',
    contactPhone: '(11) 4004-1234',
    projectsHistory: [
      { projectName: 'Edifício Horizon (2026-010)', year: 2026, role: 'Fornecimento de Mármores das Áreas Comuns', status: 'Em andamento' },
      { projectName: 'Residência Ruas (2023-020)', year: 2025, role: 'Fornecimento de Bancadas e Pias', status: 'Concluído' }
    ]
  },
  {
    id: 'p-4b',
    name: 'Alumiglass Esquadrias de Alumínio',
    type: 'Esquadrias',
    recommendationLevel: 'Altamente Recomendado',
    recommendationScore: 4.8,
    projectsCount: 15,
    notes: 'Líder em esquadrias de alto padrão na linha Gold e Chroma. Atenuação acústica excelente e montagem impecável.',
    contactEmail: 'orcamentos@alumiglass.com.br',
    contactPhone: '(11) 92211-0099',
    projectsHistory: [
      { projectName: 'Residência Moron (2025-020)', year: 2025, role: 'Fornecimento de Caixilhos e Vidros de Segurança', status: 'Concluído' }
    ]
  },
  {
    id: 'p-5',
    name: 'Atlas Elevadores',
    type: 'Elevadores',
    recommendationLevel: 'Altamente Recomendado',
    recommendationScore: 4.7,
    projectsCount: 4,
    notes: 'Elevada conformidade técnica. Suporte de engenharia excelente durante o projeto de caixa de corrida e poço.',
    contactEmail: 'suporte@atlaselevadores.com.br',
    contactPhone: '(11) 3003-4567',
    projectsHistory: [
      { projectName: 'Edifício Horizon (2026-010)', year: 2026, role: 'Fornecimento de Elevadores e Cabines', status: 'Em andamento' }
    ]
  },
  {
    id: 'p-5b',
    name: 'OtisForte Sistemas de Elevadores',
    type: 'Elevadores',
    recommendationLevel: 'Recomendado',
    recommendationScore: 4.5,
    projectsCount: 6,
    notes: 'Bom custo-benefício para elevadores residenciais de menor porte. Contratos de manutenção preventiva justos.',
    contactEmail: 'comercial@otisforte.com.br',
    contactPhone: '(11) 91155-9988',
    projectsHistory: [
      { projectName: 'Residencial Bella Vista (2026-015)', year: 2026, role: 'Instalação de Elevador Panorâmico', status: 'Em andamento' }
    ]
  },
  {
    id: 'p-6',
    name: 'VoltAmp Instalações Elétricas',
    type: 'Elétrica',
    recommendationLevel: 'Recomendado',
    recommendationScore: 4.3,
    projectsCount: 9,
    notes: 'Projetos elétricos consistentes e entrega de diagramas unifilares bem estruturados.',
    contactEmail: 'projetos@voltamp.eng.br',
    contactPhone: '(11) 91122-3344',
    projectsHistory: [
      { projectName: 'Condomínio Horizonte da Mata (2026-004)', year: 2025, role: 'Projetos Elétricos Internos', status: 'Concluído' }
    ]
  },
  {
    id: 'p-6b',
    name: 'SPDA & Cia Proteção Elétrica',
    type: 'Elétrica',
    recommendationLevel: 'Altamente Recomendado',
    recommendationScore: 4.7,
    projectsCount: 5,
    notes: 'Especialistas em projetos de pára-raios (SPDA) e aterramento elétrico industrial e predial.',
    contactEmail: 'contato@spdaecia.eng.br',
    contactPhone: '(11) 97766-5544',
    projectsHistory: [
      { projectName: 'Edifício Horizon (2026-010)', year: 2026, role: 'Malha de Aterramento e SPDA Predial', status: 'Em andamento' }
    ]
  },
  {
    id: 'p-7',
    name: 'GreenGarden Paisagismo',
    type: 'Paisagismo',
    recommendationLevel: 'Altamente Recomendado',
    recommendationScore: 4.8,
    projectsCount: 11,
    notes: 'Propostas de plantio e paisagismo incríveis. Excelente integração com nossos projetos de arquitetura externa.',
    contactEmail: 'contato@greengarden.com.br',
    contactPhone: '(11) 92233-4455',
    projectsHistory: [
      { projectName: 'Condomínio Horizonte da Mata (2026-004)', year: 2025, role: 'Paisagismo das Áreas Verdes', status: 'Concluído' }
    ]
  },
  {
    id: 'p-7b',
    name: 'FloraLux Jardins e Design',
    type: 'Paisagismo',
    recommendationLevel: 'Recomendado',
    recommendationScore: 4.4,
    projectsCount: 6,
    notes: 'Execução rápida e fornecimento de mudas e árvores adultas de excelente procedência. Prazos pontuais.',
    contactEmail: 'contato@floralux.com.br',
    contactPhone: '(11) 96655-4433',
    projectsHistory: [
      { projectName: 'Residencial Bella Vista (2026-015)', year: 2026, role: 'Implantação do Jardim das Áreas Comuns', status: 'Em andamento' }
    ]
  },
  {
    id: 'p-8',
    name: 'ClimaFrio Refrigeração e HVAC',
    type: 'Refrigeração',
    recommendationLevel: 'Recomendado',
    recommendationScore: 4.5,
    projectsCount: 7,
    notes: 'Projetos de climatização (VRF e split) e ventilação mecânica detalhados com especificações claras.',
    contactEmail: 'hvac@climafrio.eng.br',
    contactPhone: '(11) 93344-5566',
    projectsHistory: [
      { projectName: 'Edifício Horizon (2026-010)', year: 2026, role: 'Projeto de Climatização VRF', status: 'Em andamento' }
    ]
  },
  {
    id: 'p-8b',
    name: 'TermoAir Sistemas de Climatização',
    type: 'Refrigeração',
    recommendationLevel: 'Altamente Recomendado',
    recommendationScore: 4.7,
    projectsCount: 10,
    notes: 'Projetos industriais e comerciais complexos de climatização central e dutada. Altíssima qualidade de entrega.',
    contactEmail: 'engenharia@termoair.com.br',
    contactPhone: '(11) 95533-2211',
    projectsHistory: [
      { projectName: 'Condomínio Horizonte da Mata (2026-004)', year: 2025, role: 'Climatização e Renovação de Ar do Club House', status: 'Concluído' }
    ]
  }
];

interface PartnersTabProps {
  userRole: 'admin' | 'arquiteto' | 'estagiario';
  triggerToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export default function PartnersTab({ userRole, triggerToast }: PartnersTabProps) {
  // Load state from localStorage or fallback
  const [partners, setPartners] = useState<Partner[]>(() => {
    const saved = localStorage.getItem('fpoles_partners');
    let parsed: Partner[] = [];
    if (saved) {
      try {
        parsed = JSON.parse(saved);
      } catch (e) {}
    }
    // If the list of partners is empty or contains fewer elements than our comprehensive INITIAL_PARTNERS, reset to use it.
    if (parsed.length < INITIAL_PARTNERS.length) {
      return INITIAL_PARTNERS;
    }
    return parsed;
  });

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('fpoles_partners', JSON.stringify(partners));
  }, [partners]);

  // Load categories from localStorage or defaults
  const [categories, setCategories] = useState<string[]>(() => {
    const saved = localStorage.getItem('fpoles_partner_categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return ['Hidráulica', 'Elétrica', 'Estrutural', 'Paisagismo', 'Refrigeração', 'Iluminação', 'Esquadrias', 'Elevadores'];
  });

  useEffect(() => {
    localStorage.setItem('fpoles_partner_categories', JSON.stringify(categories));
  }, [categories]);

  // Active Category State
  const [activeCategory, setActiveCategory] = useState<string>('Hidráulica');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isNewPartnerModalOpen, setIsNewPartnerModalOpen] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Active notes state inside detail modal
  const [editableNotes, setEditableNotes] = useState('');
  const selectedPartner = partners.find(p => p.id === selectedPartnerId);

  // Sync editableNotes state with selected partner changes
  useEffect(() => {
    if (selectedPartner) {
      setEditableNotes(selectedPartner.notes);
    } else {
      setEditableNotes('');
    }
  }, [selectedPartnerId, partners]);

  // Form state for creating a new partner
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerType, setNewPartnerType] = useState('Hidráulica');
  const [newPartnerRecLevel, setNewPartnerRecLevel] = useState('Recomendado');
  const [newPartnerScore, setNewPartnerScore] = useState(4.0);
  const [newPartnerEmail, setNewPartnerEmail] = useState('');
  const [newPartnerPhone, setNewPartnerPhone] = useState('');
  const [newPartnerNotes, setNewPartnerNotes] = useState('');

  // Project history sub-form state (inside detail modal)
  const [newProjName, setNewProjName] = useState('');
  const [newProjYear, setNewProjYear] = useState<number>(new Date().getFullYear());
  const [newProjRole, setNewProjRole] = useState('');
  const [newProjStatus, setNewProjStatus] = useState('Em andamento');

  // Filter partners: first by category (type) then by search query
  const filteredPartners = partners.filter(p => {
    const categoryMatch = p.type === activeCategory;
    const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        (p.notes && p.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return categoryMatch && searchMatch;
  });

  // Save observations/notes
  const handleSaveNotes = () => {
    if (!selectedPartnerId) return;
    setPartners(prev => prev.map(p => 
      p.id === selectedPartnerId ? { ...p, notes: editableNotes } : p
    ));
    triggerToast('Anotações salvas com sucesso!', 'success');
  };

  // Add a project to history
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartnerId || !newProjName || !newProjRole) {
      triggerToast('Preencha os campos obrigatórios do projeto.', 'warning');
      return;
    }

    const newProject: PartnerProject = {
      projectName: newProjName,
      year: Number(newProjYear),
      role: newProjRole,
      status: newProjStatus
    };

    setPartners(prev => prev.map(p => {
      if (p.id === selectedPartnerId) {
        const newHistory = [...p.projectsHistory, newProject];
        return {
          ...p,
          projectsHistory: newHistory,
          projectsCount: newHistory.length
        };
      }
      return p;
    }));

    setNewProjName('');
    setNewProjRole('');
    setNewProjStatus('Em andamento');
    triggerToast('Projeto adicionado ao histórico!', 'success');
  };

  // Delete a project from history
  const handleDeleteProject = (indexToDelete: number) => {
    if (userRole === 'estagiario') {
      triggerToast('Estagiários não podem excluir dados do histórico.', 'warning');
      return;
    }
    if (!selectedPartnerId) return;

    setPartners(prev => prev.map(p => {
      if (p.id === selectedPartnerId) {
        const newHistory = p.projectsHistory.filter((_, idx) => idx !== indexToDelete);
        return {
          ...p,
          projectsHistory: newHistory,
          projectsCount: newHistory.length
        };
      }
      return p;
    }));
    triggerToast('Projeto removido do histórico.', 'info');
  };

  // Register new partner
  const handleCreatePartner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerName) {
      triggerToast('O nome do parceiro é obrigatório.', 'warning');
      return;
    }

    const newPartner: Partner = {
      id: 'p-' + Date.now(),
      name: newPartnerName,
      type: newPartnerType,
      recommendationLevel: newPartnerRecLevel,
      recommendationScore: Number(newPartnerScore),
      projectsCount: 0,
      notes: newPartnerNotes,
      contactEmail: newPartnerEmail,
      contactPhone: newPartnerPhone,
      projectsHistory: []
    };

    setPartners(prev => [newPartner, ...prev]);
    setIsNewPartnerModalOpen(false);

    // Reset form
    setNewPartnerName('');
    setNewPartnerType(activeCategory);
    setNewPartnerRecLevel('Recomendado');
    setNewPartnerScore(4.0);
    setNewPartnerEmail('');
    setNewPartnerPhone('');
    setNewPartnerNotes('');

    triggerToast('Novo parceiro cadastrado com sucesso!', 'success');
  };

  // Delete partner entirely
  const handleDeletePartner = (id: string) => {
    if (userRole !== 'admin') {
      triggerToast('Apenas administradores podem remover parceiros do sistema.', 'warning');
      return;
    }

    if (window.confirm('Tem certeza de que deseja remover este parceiro permanentemente?')) {
      const remaining = partners.filter(p => p.id !== id);
      setPartners(remaining);
      setIsDetailModalOpen(false);
      setSelectedPartnerId(null);
      triggerToast('Parceiro removido com sucesso.', 'info');
    }
  };

  // Get color for recommendation level badge
  const getRecommendationBadgeColor = (level: string) => {
    switch (level) {
      case 'Altamente Recomendado':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-250';
      case 'Recomendado':
        return 'bg-slate-100 text-slate-800 border border-slate-350';
      case 'Regular':
        return 'bg-amber-50 text-amber-700 border border-amber-250';
      case 'Não Recomendado':
        return 'bg-rose-50 text-rose-700 border border-rose-250';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  };

  // Add a new Category
  const handleAddNewCategory = () => {
    const newCat = window.prompt("Digite o nome do novo gênero de fornecedores:");
    if (newCat && newCat.trim()) {
      const trimmed = newCat.trim();
      if (!categories.includes(trimmed)) {
        setCategories(prev => [...prev, trimmed]);
        setActiveCategory(trimmed);
        triggerToast(`Gênero "${trimmed}" adicionado!`, 'success');
      } else {
        triggerToast("Esse gênero/categoria já existe.", "warning");
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold uppercase tracking-tight text-slate-900 flex items-center gap-2">
            <Handshake className="w-5 h-5 text-slate-800" />
            <span>Fornecedores e Parceiros</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">Gerencie a base de parceiros homologados por categorias, avaliações e histórico de obras conjuntas.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setNewPartnerType(activeCategory);
            setIsNewPartnerModalOpen(true);
          }}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all shadow flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Parceiro</span>
        </button>
      </div>

      {/* Category Tabs Block */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex flex-wrap gap-2 overflow-x-auto max-w-full pb-1 scrollbar-none">
          {categories.map(cat => {
            const isActive = activeCategory === cat;
            const count = partners.filter(p => p.type === cat).length;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSearchQuery('');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  isActive 
                    ? 'bg-slate-950 text-white border-slate-950 shadow-sm' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-850'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono font-bold leading-none ${
                  isActive ? 'bg-slate-850 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
          
          {/* Add Category Button */}
          <button
            onClick={handleAddNewCategory}
            className="px-3 py-1.5 rounded-xl border border-dashed border-slate-350 text-slate-500 hover:text-slate-900 hover:border-slate-800 transition-all text-xs font-semibold flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Gênero
          </button>
        </div>

        {/* Search inside category */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder={`Procurar em ${activeCategory}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-950 placeholder-slate-400"
          />
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
        </div>
      </div>

      {/* Partners Grid List */}
      {filteredPartners.length === 0 ? (
        <div className="bg-white border border-slate-200/60 rounded-3xl p-12 text-center text-slate-400 font-medium">
          Nenhum parceiro cadastrado ou encontrado na categoria de <strong>{activeCategory}</strong>.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map(p => {
            const count = p.projectsHistory ? p.projectsHistory.length : 0;
            return (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedPartnerId(p.id);
                  setIsDetailModalOpen(true);
                }}
                className="bg-white border border-slate-200/60 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-slate-350 transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-4 group relative"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-slate-950 font-sans tracking-tight">
                      {p.name}
                    </h4>
                    
                    <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-200 text-amber-700 px-1.5 py-0.5 rounded-lg text-[9px] font-bold shrink-0">
                      <Star className="w-3 h-3 fill-amber-400 stroke-amber-500 shrink-0" />
                      <span>{p.recommendationScore.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <p className="text-[10px] text-slate-400 font-medium line-clamp-2 leading-relaxed h-7">
                    {p.notes || 'Sem observações cadastradas.'}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-[10px] font-medium text-slate-500">
                  <div className="flex items-center gap-1 font-mono">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span>{count} {count === 1 ? 'projeto' : 'projetos'}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold ${getRecommendationBadgeColor(p.recommendationLevel)}`}>
                    {p.recommendationLevel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAIL MODAL (Opens when clicking a partner) */}
      {isDetailModalOpen && selectedPartner && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-up flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-50 p-5 border-b border-slate-150 flex justify-between items-start gap-4 shrink-0">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[9px] bg-slate-200 text-slate-800 border border-slate-300 px-2 py-0.5 rounded-md font-mono uppercase font-bold">
                    {selectedPartner.type}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${getRecommendationBadgeColor(selectedPartner.recommendationLevel)}`}>
                    {selectedPartner.recommendationLevel}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-slate-955 font-sans tracking-tight">{selectedPartner.name}</h3>
                
                {/* Contact row */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-[10px] pt-1">
                  {selectedPartner.contactEmail && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <a href={`mailto:${selectedPartner.contactEmail}`} className="hover:underline">{selectedPartner.contactEmail}</a>
                    </span>
                  )}
                  {selectedPartner.contactPhone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedPartner.contactPhone}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-3 shrink-0">
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 px-2 py-1 rounded-xl text-xs font-bold shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500 shrink-0" />
                  <span className="text-slate-900">{selectedPartner.recommendationScore.toFixed(1)} / 5.0</span>
                </div>
                
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              
              {/* Internal Comments / Observations */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Observações Internas (Editável)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[9px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Salvar Notas</span>
                  </button>
                </div>
                <textarea
                  value={editableNotes}
                  onChange={(e) => setEditableNotes(e.target.value)}
                  placeholder="Descreva a qualidade do serviço, prazos, comportamento técnico ou facilidade de negociação..."
                  className="w-full min-h-[90px] p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-950 focus:bg-white resize-y placeholder-slate-400"
                />
              </div>

              {/* Projects History Section */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>Histórico de Projetos Conjuntos</span>
                </h4>

                {selectedPartner.projectsHistory.length === 0 ? (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 text-center text-slate-400 text-xs">
                    Nenhum projeto registrado no histórico deste parceiro.
                  </div>
                ) : (
                  <div className="border border-slate-200/60 rounded-xl overflow-hidden shadow-xs bg-white">
                    <table className="w-full text-left border-collapse text-[10.5px]">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 font-mono text-[9px] uppercase border-b border-slate-200/60">
                          <th className="p-2.5 px-3">Projeto</th>
                          <th className="p-2.5 px-3 w-16 text-center">Ano</th>
                          <th className="p-2.5 px-3">Atuação / Função</th>
                          <th className="p-2.5 px-3 w-28 text-center">Estado</th>
                          {userRole !== 'estagiario' && <th className="p-2.5 px-3 w-16 text-center">Ações</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedPartner.projectsHistory.map((proj, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/30 text-slate-700 font-medium">
                            <td className="p-2.5 px-3 font-semibold font-sans">{proj.projectName}</td>
                            <td className="p-2.5 px-3 text-center font-mono text-slate-500">{proj.year}</td>
                            <td className="p-2.5 px-3 text-slate-600">{proj.role}</td>
                            <td className="p-2.5 px-3 text-center">
                              <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-mono font-semibold ${
                                proj.status === 'Concluído' 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                                  : 'bg-amber-50 text-amber-700 border border-amber-100'
                              }`}>
                                {proj.status}
                              </span>
                            </td>
                            {userRole !== 'estagiario' && (
                              <td className="p-1 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProject(idx)}
                                  className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                                  title="Remover projeto"
                                >
                                  <Trash2 className="w-3.5 h-3.5 mx-auto" />
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Add Project Sub-form */}
                {userRole !== 'estagiario' && (
                  <form onSubmit={handleAddProject} className="bg-slate-50/60 border border-slate-200/60 p-4 rounded-xl space-y-3">
                    <span className="text-[9.5px] font-bold text-slate-700 uppercase tracking-tight block">➕ Registrar Novo Projeto Conjunto</span>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                      <div className="md:col-span-5">
                        <input
                          type="text"
                          placeholder="Nome do Projeto..."
                          value={newProjName}
                          onChange={(e) => setNewProjName(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-slate-950 placeholder-slate-400"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <input
                          type="number"
                          placeholder="Ano"
                          value={newProjYear}
                          onChange={(e) => setNewProjYear(Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-slate-950 text-center placeholder-slate-400"
                          required
                        />
                      </div>
                      <div className="md:col-span-3">
                        <input
                          type="text"
                          placeholder="Atuação (ex: Hidráulica)"
                          value={newProjRole}
                          onChange={(e) => setNewProjRole(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-slate-950 placeholder-slate-400"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <select
                          value={newProjStatus}
                          onChange={(e) => setNewProjStatus(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none"
                        >
                          <option value="Em andamento">Em andamento</option>
                          <option value="Concluído">Concluído</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 text-white text-[10px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 uppercase tracking-wide"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar Projeto</span>
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-150 flex items-center justify-between shrink-0">
              <div>
                {userRole === 'admin' && (
                  <button
                    type="button"
                    onClick={() => handleDeletePartner(selectedPartner.id)}
                    className="px-3.5 py-2 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Excluir Parceiro</span>
                  </button>
                )}
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-sm"
              >
                Fechar Painel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER NEW PARTNER MODAL */}
      {isNewPartnerModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up">
            <div className="bg-slate-950 text-white px-5 py-4 flex justify-between items-center">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Handshake className="w-4 h-4 text-slate-300" />
                <span>Cadastrar Novo Fornecedor / Parceiro</span>
              </h3>
              <button 
                onClick={() => setIsNewPartnerModalOpen(false)} 
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreatePartner} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Nome da Empresa / Profissional *</label>
                  <input
                    type="text"
                    placeholder="Ex: Calculus Engenharia Estrutural"
                    value={newPartnerName}
                    onChange={(e) => setNewPartnerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white focus:border-slate-950"
                    required
                  />
                </div>

                {/* Type (Category) */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Gênero / Categoria *</label>
                  <select
                    value={newPartnerType}
                    onChange={(e) => setNewPartnerType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Score */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Nota de Recomendação (1 a 5) *</label>
                  <input
                    type="number"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    placeholder="4.0"
                    value={newPartnerScore}
                    onChange={(e) => setNewPartnerScore(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-700 outline-none"
                    required
                  />
                </div>

                {/* Rec Level */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Nível de Recomendação *</label>
                  <select
                    value={newPartnerRecLevel}
                    onChange={(e) => setNewPartnerRecLevel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                  >
                    <option value="Altamente Recomendado">Altamente Recomendado</option>
                    <option value="Recomendado">Recomendado</option>
                    <option value="Regular">Regular</option>
                    <option value="Não Recomendado">Não Recomendado</option>
                  </select>
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">E-mail de Contato</label>
                  <input
                    type="email"
                    placeholder="contato@empresa.com"
                    value={newPartnerEmail}
                    onChange={(e) => setNewPartnerEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white focus:border-slate-950"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Telefone de Contato</label>
                  <input
                    type="text"
                    placeholder="(11) 99999-9999"
                    value={newPartnerPhone}
                    onChange={(e) => setNewPartnerPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white focus:border-slate-950"
                  />
                </div>

                {/* Notes */}
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Observações Iniciais</label>
                  <textarea
                    placeholder="Informações relevantes sobre este parceiro..."
                    value={newPartnerNotes}
                    onChange={(e) => setNewPartnerNotes(e.target.value)}
                    className="w-full min-h-[80px] bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white focus:border-slate-950 resize-y"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsNewPartnerModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 bg-slate-105 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-900 rounded-xl transition shadow cursor-pointer"
                >
                  Cadastrar Parceiro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
