import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Project } from '../../types';
import { ARCHITECTS } from '../../constants';

interface ProjetosTabProps {
  userRole: 'admin' | 'arquiteto' | 'estagiario';
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  triggerToast: (msg: string, type?: any) => void;
}

export default function ProjetosTab({
  userRole,
  projects,
  setProjects,
  triggerToast
}: ProjetosTabProps) {
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProjCode, setNewProjCode] = useState('');
  const [newProjName, setNewProjName] = useState('');
  const [newProjGestor, setNewProjGestor] = useState('');
  const [newProjProjetista, setNewProjProjetista] = useState('');

  if (userRole !== 'admin') {
    return (
      <div className="p-8 text-center bg-red-50 text-red-700 border border-red-200 rounded-2xl">
        <h3 className="font-bold text-sm">Acesso Restrito</h3>
        <p className="text-xs mt-1">Apenas administradores podem gerenciar o cadastro direto de novos projetos.</p>
      </div>
    );
  }

  const PROFESSIONALS = [
    ...ARCHITECTS.map(a => a.name),
    "Eng. Ricardo Gomes",
    "Eng. Ana Martins",
    "Eng. Carlos Costa",
    "Eng. José Lemos",
    "Eng. Ricardo Pereira"
  ];

  // Suggest code based on existing projects of current year
  const currentYear = new Date().getFullYear();
  const suggestNextCode = () => {
    const yearStr = String(currentYear);
    const yearProjects = projects.filter(p => p.code?.startsWith(yearStr));
    const nextNum = yearProjects.length + 1;
    return `${yearStr}-${String(nextNum).padStart(3, '0')}`;
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) {
      triggerToast('Por favor, indique o nome do projeto.', 'error');
      return;
    }

    const codeClean = newProjCode.trim();
    if (!codeClean) {
      triggerToast('Por favor, indique o código do projeto (ex: 2027-001).', 'error');
      return;
    }

    const codePattern = /^\d{4}-\d{3}$/;
    if (!codePattern.test(codeClean)) {
      triggerToast('O formato do código deve ser ANO-SÉRIE (ex: 2027-001).', 'warning');
    }

    const codeExists = projects.some(p => p.code?.toLowerCase() === codeClean.toLowerCase());
    if (codeExists) {
      triggerToast(`Já existe um projeto cadastrado com o código ${codeClean}!`, 'error');
      return;
    }

    const nextId = 'p-' + Date.now().toString(36);
    const newProject: Project = {
      id: nextId,
      name: newProjName.trim(),
      responsavel: newProjGestor || PROFESSIONALS[0],
      secundario: newProjProjetista || PROFESSIONALS[1],
      status: 'Ativo',
      code: codeClean
    };

    setProjects([...projects, newProject]);
    triggerToast(`Projeto "${newProject.name}" cadastrado com sucesso!`, 'success');

    setNewProjName('');
    setNewProjCode('');
    setShowAddProject(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Main Title Header */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-base font-bold uppercase tracking-tight font-sans">Cadastro de Projetos</h2>
          <p className="text-xs text-slate-300">Módulo exclusivo do Administrador para criar, editar códigos e gerenciar o catálogo global de projetos.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!newProjCode) {
              setNewProjCode(suggestNextCode());
            }
            setShowAddProject(!showAddProject);
          }}
          className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-50 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all self-start md:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {showAddProject ? 'Fechar Cadastro' : 'Cadastrar Novo Projeto'}
        </button>
      </div>

      {/* Add Project Sliding Form */}
      {showAddProject && (
        <form onSubmit={handleCreateProject} className="p-6 bg-slate-50 border border-slate-200/60 rounded-2xl space-y-4 animate-fade-in">
          <h3 className="font-bold text-xs uppercase tracking-wider font-sans text-slate-800">Cadastrar Novo Projeto</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold font-mono uppercase text-slate-500 mb-1">Código do Projeto (ex: YYYY-XXX)</label>
              <input
                type="text"
                value={newProjCode}
                onChange={(e) => setNewProjCode(e.target.value)}
                placeholder={suggestNextCode()}
                className="w-full bg-white border border-slate-200/60 p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-900 uppercase font-mono"
                required
              />
              <span className="text-[9px] text-slate-400 mt-1 block">Escreva no padrão de ano e série: YYYY-XXX</span>
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold font-mono uppercase text-slate-500 mb-1">Nome do Projeto</label>
              <input
                type="text"
                value={newProjName}
                onChange={(e) => setNewProjName(e.target.value)}
                placeholder="Ex: Ampliação Moradia Lote 5..."
                className="w-full bg-white border border-slate-200/60 p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-900"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold font-mono uppercase text-slate-500 mb-1">Responsável Inicial</label>
              <select
                value={newProjGestor}
                onChange={(e) => setNewProjGestor(e.target.value)}
                className="w-full bg-white border border-slate-200/60 p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
              >
                <option value="">-- Selecionar Responsável --</option>
                {PROFESSIONALS.map(prof => (
                  <option key={prof} value={prof}>{prof}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold font-mono uppercase text-slate-500 mb-1">Responsabilidade Secundária Inicial</label>
              <select
                value={newProjProjetista}
                onChange={(e) => setNewProjProjetista(e.target.value)}
                className="w-full bg-white border border-slate-200/60 p-2.5 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-900 cursor-pointer"
              >
                <option value="">-- Selecionar Secundário --</option>
                {PROFESSIONALS.map(prof => (
                  <option key={prof} value={prof}>{prof}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddProject(false)}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer shadow-sm transition-all"
            >
              Confirmar Cadastro
            </button>
          </div>
        </form>
      )}

      {/* Project List / Table */}
      <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50/10 flex flex-col sm:flex-row justify-between items-center gap-3">
          <h3 className="font-bold text-xs uppercase tracking-wider font-sans text-slate-800">Catálogo Completo de Projetos Cadastrados</h3>
          <span className="text-[10px] font-mono text-slate-500 font-bold bg-white px-2.5 py-1 rounded-full border border-slate-200/60">
            Total: {projects.length} projetos
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 uppercase font-mono text-[9px] border-b border-slate-100">
                <th className="p-2.5 px-3 border-r border-slate-100 w-40 text-center whitespace-nowrap">Código Oficial</th>
                <th className="p-2.5 px-3 border-r border-slate-100 min-w-[250px]">Nome do Projeto</th>
                <th className="p-2.5 px-3 border-r border-slate-100 w-40 text-center whitespace-nowrap">Estado</th>
                <th className="p-2.5 px-3 w-32 text-center whitespace-nowrap">Remover</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map((proj) => {
                const isStandby = proj.status.toLowerCase() === 'standby';
                return (
                  <tr
                    key={proj.id}
                    className={`transition-colors text-[11px] hover:bg-slate-50/40 ${
                      isStandby
                        ? 'bg-amber-50 text-amber-900 font-medium'
                        : 'text-slate-800 font-medium'
                    }`}
                  >
                    {/* Project Code */}
                    <td className="p-1.5 px-3 border-r border-slate-100 text-center">
                      <input
                        type="text"
                        value={proj.code || proj.id}
                        onChange={(e) => {
                          const updated = projects.map(p => p.id === proj.id ? { ...p, code: e.target.value } : p);
                          setProjects(updated);
                        }}
                        className="bg-transparent border-none focus:bg-slate-50 p-1 rounded font-mono font-bold w-full text-center focus:outline-none uppercase text-xs text-slate-700"
                      />
                    </td>

                    {/* Project Name */}
                    <td className="p-1.5 px-3 border-r border-slate-100">
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) => {
                          const updated = projects.map(p => p.id === proj.id ? { ...p, name: e.target.value } : p);
                          setProjects(updated);
                        }}
                        className="bg-transparent border-none focus:bg-slate-50 p-1 rounded font-bold font-sans w-full text-xs focus:outline-none text-slate-800"
                      />
                    </td>

                    {/* Status */}
                    <td className="p-1.5 px-3 border-r border-slate-100 text-center">
                      <select
                        value={proj.status}
                        onChange={(e) => {
                          const updated = projects.map(p => p.id === proj.id ? { ...p, status: e.target.value } : p);
                          setProjects(updated);
                          triggerToast(`Projeto "${proj.name}" definido como ${e.target.value}!`, 'info');
                        }}
                        className={`p-1 rounded font-bold text-[9px] uppercase cursor-pointer border text-center ${
                          isStandby 
                            ? 'bg-amber-50 text-amber-700 border-amber-200' 
                            : proj.status === 'Pendente' 
                              ? 'bg-slate-100 text-slate-600 border-slate-200' 
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        <option value="Ativo">Ativo</option>
                        <option value="Standby">Standby</option>
                        <option value="Pendente">Pendente</option>
                      </select>
                    </td>

                    {/* Delete action */}
                    <td className="p-1.5 px-2 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Deseja realmente remover o projeto "${proj.name}" e excluir todas as suas configurações?`)) {
                            const updated = projects.filter(p => p.id !== proj.id);
                            setProjects(updated);
                            triggerToast('Projeto excluído com sucesso!', 'info');
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-slate-50 cursor-pointer transition-colors"
                        title="Remover projeto permanentemente"
                      >
                        <Trash2 className="w-3.5 h-3.5 mx-auto" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {projects.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-xs text-slate-400 font-sans">
                    Nenhum projeto cadastrado no sistema. Use o botão acima para adicionar um novo projeto.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
