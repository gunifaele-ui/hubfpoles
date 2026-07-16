import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Star, Briefcase, Mail, Phone, Save, 
  Trash2, Handshake, ShieldAlert, Award, FileText, ChevronRight 
} from 'lucide-react';
import { Partner, PartnerProject } from '../../types';

// Initial realistic mock data
const INITIAL_PARTNERS: Partner[] = [
  {
    id: 'p-1',
    name: 'Calculus Engenharia Estrutural',
    type: 'Projetista Complementar',
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
    id: 'p-2',
    name: 'HidraSan Saneamento e Hidráulica',
    type: 'Projetista Complementar',
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
    id: 'p-3',
    name: 'DecoGlow Luminotécnica e Interiores',
    type: 'Parceiro',
    recommendationLevel: 'Altamente Recomendado',
    recommendationScore: 4.8,
    projectsCount: 8,
    notes: 'Projetos de iluminação muito detalhados e de altíssimo padrão. Sempre especificam fornecedores com bom custo-benefício e design moderno.',
    contactEmail: 'sofia@decoglow.design',
    contactPhone: '(11) 99887-7665',
    projectsHistory: [
      { projectName: 'Residência Ruas (2023-020)', year: 2024, role: 'Luminotécnico e Automação de Iluminação', status: 'Concluído' },
      { projectName: 'Residência Moron (2025-020)', year: 2025, role: 'Design de Interiores & Iluminação', status: 'Concluído' }
    ]
  },
  {
    id: 'p-4',
    name: 'Marmoraria Granitex',
    type: 'Fornecedor',
    recommendationLevel: 'Regular',
    recommendationScore: 3.5,
    projectsCount: 5,
    notes: 'A qualidade do acabamento é excepcional, porém costumam atrasar a entrega das peças na obra em até 10 dias úteis.',
    contactEmail: 'vendas@marmorariagranitex.com.br',
    contactPhone: '(11) 4004-1234',
    projectsHistory: [
      { projectName: 'Edifício Horizon (2026-010)', year: 2026, role: 'Fornecimento de Mármores e Granitos das Áreas Comuns', status: 'Em andamento' },
      { projectName: 'Residência Ruas (2023-020)', year: 2025, role: 'Fornecimento de Bancadas e Pias', status: 'Concluído' }
    ]
  },
  {
    id: 'p-5',
    name: 'AçoForte Estruturas Metálicas',
    type: 'Fornecedor',
    recommendationLevel: 'Altamente Recomendado',
    recommendationScore: 4.7,
    projectsCount: 6,
    notes: 'Ótimo custo-benefício para estruturas pesadas de galpões e coberturas metálicas residenciais. Montagem rápida e segura em obra.',
    contactEmail: 'projetos@acoforte.com.br',
    contactPhone: '(11) 4567-8901',
    projectsHistory: [
      { projectName: 'Condomínio Horizonte da Mata (2026-004)', year: 2025, role: 'Fabricação e Montagem de Cobertura Metálica', status: 'Concluído' }
    ]
  }
];

interface PartnersTabProps {
  userRole: 'admin' | 'arquiteto' | 'estagiario';
  triggerToast: (msg: string, type?: 'success' | 'info' | 'warning') => void;
}

export default function PartnersTab({ userRole, triggerToast }: PartnersTabProps) {
  // Load state from localStorage
  const [partners, setPartners] = useState<Partner[]>(() => {
    const saved = localStorage.getItem('fpoles_partners');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore and fallback
      }
    }
    return INITIAL_PARTNERS;
  });

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('fpoles_partners', JSON.stringify(partners));
  }, [partners]);

  // UI state
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(() => {
    return partners.length > 0 ? partners[0].id : null;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('todos');
  const [recommendationFilter, setRecommendationFilter] = useState('todos');

  // Active notes state
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerType, setNewPartnerType] = useState('Projetista Complementar');
  const [newPartnerRecLevel, setNewPartnerRecLevel] = useState('Recomendado');
  const [newPartnerScore, setNewPartnerScore] = useState(4.0);
  const [newPartnerEmail, setNewPartnerEmail] = useState('');
  const [newPartnerPhone, setNewPartnerPhone] = useState('');
  const [newPartnerNotes, setNewPartnerNotes] = useState('');

  // Project history sub-form state
  const [newProjName, setNewProjName] = useState('');
  const [newProjYear, setNewProjYear] = useState<number>(new Date().getFullYear());
  const [newProjRole, setNewProjRole] = useState('');
  const [newProjStatus, setNewProjStatus] = useState('Em andamento');

  // Filter partners
  const filteredPartners = partners.filter(p => {
    const nameMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                      p.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const typeMatch = typeFilter === 'todos' || p.type === typeFilter;
    const recMatch = recommendationFilter === 'todos' || p.recommendationLevel === recommendationFilter;
    return nameMatch && typeMatch && recMatch;
  });

  // Save observations
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
    setSelectedPartnerId(newPartner.id);
    setIsModalOpen(false);

    // Reset form
    setNewPartnerName('');
    setNewPartnerType('Projetista Complementar');
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
      setSelectedPartnerId(remaining.length > 0 ? remaining[0].id : null);
      triggerToast('Parceiro removido com sucesso.', 'info');
    }
  };

  // Get color for recommendation level badge
  const getRecommendationBadgeColor = (level: string) => {
    switch (level) {
      case 'Altamente Recomendado':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-250';
      case 'Recomendado':
        return 'bg-slate-100 text-slate-800 border border-slate-300';
      case 'Regular':
        return 'bg-amber-50 text-amber-700 border border-amber-250';
      case 'Não Recomendado':
        return 'bg-rose-50 text-rose-700 border border-rose-250';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200';
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
          <p className="text-xs text-slate-500 mt-1">Gerencie a base de parceiros homologados, níveis de recomendação e histórico de obras conjuntas.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Parceiro</span>
        </button>
      </div>

      {/* Filters & Search Block */}
      <div className="bg-white border border-slate-200/60 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
          {/* Search input */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Pesquisar por nome ou anotação..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-950 focus:bg-white"
            />
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-white border border-slate-205 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none hover:bg-slate-50 transition-colors"
            >
              <option value="todos">🛠️ Todos os Tipos</option>
              <option value="Projetista Complementar">Projetista Complementar</option>
              <option value="Fornecedor">Fornecedor</option>
              <option value="Parceiro">Parceiro</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          {/* Recommendation Filter */}
          <div className="flex items-center gap-1">
            <select
              value={recommendationFilter}
              onChange={(e) => setRecommendationFilter(e.target.value)}
              className="bg-white border border-slate-205 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none hover:bg-slate-50 transition-colors"
            >
              <option value="todos">🎖️ Recomendações</option>
              <option value="Altamente Recomendado">Altamente Recomendado</option>
              <option value="Recomendado">Recomendado</option>
              <option value="Regular">Regular</option>
              <option value="Não Recomendado">Não Recomendado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Split Screen Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Partners List (5 cols) */}
        <div className="lg:col-span-5 space-y-3 max-h-[700px] overflow-y-auto pr-1">
          {filteredPartners.length === 0 ? (
            <div className="bg-white border border-slate-200/60 rounded-2xl p-8 text-center text-slate-400 font-medium">
              Nenhum parceiro encontrado com os filtros aplicados.
            </div>
          ) : (
            filteredPartners.map(p => {
              const isSelected = p.id === selectedPartnerId;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPartnerId(p.id)}
                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between relative group ${
                    isSelected 
                      ? 'border-slate-900 bg-slate-950 text-white shadow-md' 
                      : 'border-slate-250 bg-white hover:border-slate-350 hover:shadow-sm text-slate-800'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className={`text-[9px] font-mono font-semibold uppercase ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                          {p.type}
                        </span>
                        <h4 className="text-xs font-semibold font-sans line-clamp-1">{p.name}</h4>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 px-1.5 py-0.5 rounded-lg text-[10px] font-semibold shrink-0">
                        <Star className="w-3 h-3 fill-amber-400 stroke-amber-500 shrink-0" />
                        <span>{p.recommendationScore.toFixed(1)}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mt-2">
                      <span className={`px-2 py-0.5 rounded-full border text-[9px] font-semibold ${getRecommendationBadgeColor(p.recommendationLevel)}`}>
                        {p.recommendationLevel}
                      </span>
                      <span className={`text-[10px] font-mono flex items-center gap-1 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>{p.projectsCount} {p.projectsCount === 1 ? 'projeto' : 'projetos'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Desktop Right Chevron */}
                  <ChevronRight className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-all opacity-0 group-hover:opacity-100 ${
                    isSelected ? 'text-white' : 'text-slate-400 group-hover:translate-x-0.5'
                  }`} />
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed View (7 cols) */}
        <div className="lg:col-span-7">
          {!selectedPartner ? (
            <div className="bg-slate-100/60 border border-slate-200 border-dashed rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
              <Handshake className="w-12 h-12 text-slate-300 stroke-[1.5] mb-3 animate-pulse" />
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Nenhum Parceiro Selecionado</h3>
              <p className="text-[11px] text-slate-400 mt-2 max-w-xs leading-normal">
                Selecione um parceiro na lista ao lado para ver o histórico de projetos, dados de contato e gerenciar observações internas.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden divide-y divide-slate-100">
              {/* Partner Detail Header */}
              <div className="p-5 bg-slate-50 flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] bg-slate-200 text-slate-800 border border-slate-300 px-2 py-0.5 rounded-md font-mono uppercase font-semibold">
                      {selectedPartner.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full border text-[9px] font-semibold ${getRecommendationBadgeColor(selectedPartner.recommendationLevel)}`}>
                      {selectedPartner.recommendationLevel}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 font-sans tracking-tight">{selectedPartner.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-[11px] pt-1">
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

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 px-2 py-1 rounded-xl text-xs font-semibold shadow-sm">
                    <Star className="w-4 h-4 fill-amber-400 stroke-amber-500 shrink-0" />
                    <span className="text-slate-900">{selectedPartner.recommendationScore.toFixed(1)} / 5.0</span>
                  </div>
                  {userRole === 'admin' && (
                    <button
                      type="button"
                      onClick={() => handleDeletePartner(selectedPartner.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Excluir parceiro"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Editable Notes Section */}
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Observações Internas (Editável)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[10px] font-semibold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-3 h-3" />
                    <span>Salvar Observações</span>
                  </button>
                </div>
                <textarea
                  value={editableNotes}
                  onChange={(e) => setEditableNotes(e.target.value)}
                  placeholder="Insira detalhes sobre a qualidade do trabalho, prazos, formas de contato preferidas ou problemas identificados..."
                  className="w-full min-h-[100px] p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-950 focus:bg-white resize-y"
                />
              </div>

              {/* Projects History Section */}
              <div className="p-5 space-y-4">
                <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>Histórico de Projetos Conjuntos</span>
                </h4>

                {selectedPartner.projectsHistory.length === 0 ? (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 text-center text-slate-400 text-xs">
                    Nenhum projeto registrado no histórico deste parceiro.
                  </div>
                ) : (
                  <div className="border border-slate-200/60 rounded-xl overflow-hidden shadow-xs">
                    <table className="w-full text-left border-collapse text-[11px]">
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
                          <tr key={idx} className="hover:bg-slate-50/50 text-slate-700 font-medium">
                            <td className="p-2.5 px-3 font-semibold font-sans">{proj.projectName}</td>
                            <td className="p-2.5 px-3 text-center font-mono text-slate-500">{proj.year}</td>
                            <td className="p-2.5 px-3 text-slate-600">{proj.role}</td>
                            <td className="p-2.5 px-3 text-center">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold ${
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
                                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                                  title="Remover projeto"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
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
                    <span className="text-[10px] font-semibold text-slate-700 uppercase tracking-tight block">➕ Registrar Novo Projeto Conjunto</span>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                      <div className="md:col-span-5">
                        <input
                          type="text"
                          placeholder="Nome do Projeto..."
                          value={newProjName}
                          onChange={(e) => setNewProjName(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-slate-950"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <input
                          type="number"
                          placeholder="Ano"
                          value={newProjYear}
                          onChange={(e) => setNewProjYear(Number(e.target.value))}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-slate-950 text-center"
                          required
                        />
                      </div>
                      <div className="md:col-span-3">
                        <input
                          type="text"
                          placeholder="Atuação (ex: Hidráulica)"
                          value={newProjRole}
                          onChange={(e) => setNewProjRole(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-slate-950"
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
                      className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Adicionar Projeto</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Register New Partner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scale-up">
            <div className="bg-slate-950 text-white px-5 py-4 flex justify-between items-center">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Handshake className="w-4 h-4 text-slate-300" />
                <span>Cadastrar Novo Fornecedor / Parceiro</span>
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreatePartner} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">Nome da Empresa / Profissional *</label>
                  <input
                    type="text"
                    placeholder="Ex: Calculus Engenharia Estrutural"
                    value={newPartnerName}
                    onChange={(e) => setNewPartnerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:bg-white focus:border-slate-950"
                    required
                  />
                </div>

                {/* Type */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">Tipo *</label>
                  <select
                    value={newPartnerType}
                    onChange={(e) => setNewPartnerType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                  >
                    <option value="Projetista Complementar">Projetista Complementar</option>
                    <option value="Fornecedor">Fornecedor</option>
                    <option value="Parceiro">Parceiro</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                {/* Score */}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">Nota de Recomendação (1 a 5) *</label>
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
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">Nível de Recomendação *</label>
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
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">E-mail de Contato</label>
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
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">Telefone de Contato</label>
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
                  <label className="text-[10px] font-semibold text-slate-500 uppercase">Observações Iniciais</label>
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
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-950 hover:bg-slate-900 rounded-xl transition shadow-sm cursor-pointer"
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
