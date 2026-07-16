import React, { useState } from 'react';
import { Search, Plus, Eye, EyeOff, ShieldCheck, Trash2, Lock } from 'lucide-react';
import { PrefeituraCredential } from '../../types';

interface SenhasTabProps {
  userRole: 'admin' | 'arquiteto' | 'estagiario';
  credentials: PrefeituraCredential[];
  setCredentials: React.Dispatch<React.SetStateAction<PrefeituraCredential[]>>;
  triggerToast: (msg: string, type?: any) => void;
  revealedPassIds: { [id: string]: boolean };
  togglePassReveal: (id: string) => void;
}

export default function SenhasTab({
  userRole,
  credentials,
  setCredentials,
  triggerToast,
  revealedPassIds,
  togglePassReveal
}: SenhasTabProps) {
  const [credentialsTab, setCredentialsTab] = useState<'prefeitura' | 'email'>('prefeitura');
  const [credSearchText, setCredSearchText] = useState('');
  const [confirmDeleteCredId, setConfirmDeleteCredId] = useState<string | null>(null);

  const filteredCreds = credentials.filter(cred => {
    const type = cred.type || 'prefeitura';
    return type === credentialsTab;
  });

  const searchedCreds = filteredCreds.filter(cred => 
    cred.prefeitura.toLowerCase().includes(credSearchText.toLowerCase()) ||
    cred.user.toLowerCase().includes(credSearchText.toLowerCase())
  );

  const handleCredChange = (id: string, field: keyof PrefeituraCredential, val: string) => {
    const updated = credentials.map(item => item.id === id ? { ...item, [field]: val } : item);
    setCredentials(updated);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Main Container */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4">
        
        {/* Header with segmented tabs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
          <div>
            <h3 className="font-semibold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
              🔑 Cofre de Acessos e Credenciais
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Gerencie e acesse com segurança as credenciais operacionais da Fpoles.
            </p>
          </div>

          {/* Segmented Tab Control */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/40">
            <button
              type="button"
              onClick={() => {
                setCredentialsTab('prefeitura');
                setCredSearchText('');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                credentialsTab === 'prefeitura'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              🏢 Prefeitura / Portais
            </button>
            <button
              type="button"
              onClick={() => {
                setCredentialsTab('email');
                setCredSearchText('');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                credentialsTab === 'email'
                  ? 'bg-white text-slate-800 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              ✉️ Contas de E-mail
            </button>
          </div>
        </div>

        {/* Sub-header controls (Search & Add Button) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder={credentialsTab === 'prefeitura' ? "Buscar portal ou prefeitura..." : "Buscar domínio ou e-mail..."}
              value={credSearchText}
              onChange={e => setCredSearchText(e.target.value)}
              className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200/60 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 rounded-xl text-xs text-slate-800"
            />
            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
          </div>

          {/* Add Credential Button */}
          <button
            type="button"
            onClick={() => {
              const newId = 'cred-' + Date.now();
              const newCred: PrefeituraCredential = {
                id: newId,
                prefeitura: credentialsTab === 'prefeitura' ? 'Nova Câmara Municipal' : 'Google Workspace (Novo)',
                user: credentialsTab === 'prefeitura' ? 'fpoles_user' : 'novo.email@fpoles.com.br',
                pass: credentialsTab === 'prefeitura' ? 'LxSecure2026' : 'MailPass2026',
                type: credentialsTab
              };
              setCredentials(prev => [...prev, newCred]);
              triggerToast(
                credentialsTab === 'prefeitura' 
                  ? 'Novo portal de prefeitura adicionado!' 
                  : 'Nova credencial de e-mail adicionada!',
                'success'
              );
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow"
          >
            <Plus className="w-4 h-4" /> 
            {credentialsTab === 'prefeitura' ? 'Adicionar Portal' : 'Adicionar E-mail'}
          </button>
        </div>

        {/* Normal Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px] min-w-[600px] border border-slate-200/60">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 uppercase font-mono text-[9px] border-b border-slate-100">
                <th className="p-2.5 px-3 border-r border-slate-200/60">
                  {credentialsTab === 'prefeitura' ? 'Portal Técnico / Prefeitura' : 'Serviço / Domínio de E-mail'}
                </th>
                <th className="p-2.5 px-3 border-r border-slate-200/60">
                  {credentialsTab === 'prefeitura' ? 'Nome de Usuário / Login' : 'Endereço de E-mail'}
                </th>
                <th className="p-2.5 px-3 border-r border-slate-200/60">Senha de Acesso</th>
                <th className="p-2.5 px-3 border-r border-slate-200/60 text-center w-20">Visualizar</th>
                <th className="p-2.5 px-3 text-center w-16">Remover</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {searchedCreds.map(cred => {
                const isRevealed = revealedPassIds[cred.id] || false;

                return (
                  <tr key={cred.id} className="hover:bg-slate-50/40 transition-colors">
                    {/* Service / Prefeitura */}
                    <td className="p-1 px-3 border-r border-slate-200/60 font-semibold">
                      <input
                        type="text"
                        value={cred.prefeitura}
                        onChange={e => handleCredChange(cred.id, 'prefeitura', e.target.value)}
                        className="w-full bg-transparent border-none p-1 font-semibold text-slate-800 focus:bg-slate-50 focus:ring-0 text-[11px] rounded focus:outline-none"
                        placeholder={credentialsTab === 'prefeitura' ? "Câmara Municipal" : "Gmail, Outlook, etc."}
                      />
                    </td>
                    {/* Username */}
                    <td className="p-1 px-3 border-r border-slate-200/60 font-mono">
                      <input
                        type="text"
                        value={cred.user}
                        onChange={e => handleCredChange(cred.id, 'user', e.target.value)}
                        className="w-full bg-transparent border-none p-1 text-slate-500 font-mono focus:bg-slate-50 focus:ring-0 text-[11px] rounded focus:outline-none"
                        placeholder="username@fpoles.com.br"
                      />
                    </td>
                    {/* Password */}
                    <td className="p-1 px-3 border-r border-slate-200/60 font-mono">
                      <input
                        type={isRevealed ? "text" : "password"}
                        value={cred.pass}
                        onChange={e => handleCredChange(cred.id, 'pass', e.target.value)}
                        className="w-full bg-transparent border-none p-1 text-slate-700 font-mono focus:bg-slate-50 focus:ring-0 text-[11px] rounded focus:outline-none"
                        placeholder="Senha"
                      />
                    </td>
                    {/* Reveal Toggle */}
                    <td className="p-1 px-3 border-r border-slate-200/60 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          togglePassReveal(cred.id);
                          if (!isRevealed) triggerToast('Senha exibida temporariamente!', 'info');
                        }}
                        className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer transition-colors"
                      >
                        {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                    {/* Remove with double confirmation */}
                    <td className="p-1 px-3 text-center">
                      {userRole !== 'admin' ? (
                        <button
                          type="button"
                          disabled
                          className="p-1 text-slate-300 rounded-lg cursor-not-allowed"
                          title="Apenas o Administrador pode apagar credenciais"
                        >
                          <Lock className="w-3.5 h-3.5 mx-auto text-slate-400" />
                        </button>
                      ) : confirmDeleteCredId === cred.id ? (
                        <div className="flex items-center justify-center gap-1 bg-slate-900 text-white p-1 rounded-lg">
                          <span className="text-[8px] font-semibold uppercase tracking-wider">Apagar?</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = credentials.filter(item => item.id !== cred.id);
                              setCredentials(updated);
                              triggerToast('Credencial removida!', 'warning');
                              setConfirmDeleteCredId(null);
                            }}
                            className="px-1 py-0.5 bg-white text-slate-900 hover:bg-slate-50 rounded text-[9px] font-semibold cursor-pointer"
                          >
                            Sim
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteCredId(null)}
                            className="px-1 py-0.5 bg-slate-800 text-white hover:text-white rounded text-[9px] font-semibold cursor-pointer"
                          >
                            Não
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteCredId(cred.id)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Remover Registro (Dupla Confirmação)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {searchedCreds.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 text-xs font-sans">
                    Nenhum registro encontrado nesta categoria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-slate-700 shrink-0" />
            <span>Cofre criptografado localmente e pronto para uso operacional.</span>
          </div>
          <div className="hidden sm:block text-slate-400 text-[10px]">
            {filteredCreds.length} itens salvos
          </div>
        </div>
      </div>
    </div>
  );
}
