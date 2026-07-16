import React, { useState } from 'react';
import { Plus, Trash2, Lock } from 'lucide-react';
import { SoftwareLicense } from '../../types';

interface LicencasTabProps {
  userRole: 'admin' | 'arquiteto' | 'estagiario';
  licenses: SoftwareLicense[];
  setLicenses: React.Dispatch<React.SetStateAction<SoftwareLicense[]>>;
  triggerToast: (msg: string, type?: any) => void;
}

export default function LicencasTab({
  userRole,
  licenses,
  setLicenses,
  triggerToast
}: LicencasTabProps) {
  const [licenseViewMode, setLicenseViewMode] = useState<'complete' | 'hardware' | 'software' | 'expiring'>('complete');
  const [licenseSearchText, setLicenseSearchText] = useState('');
  const [confirmDeleteLicId, setConfirmDeleteLicId] = useState<string | null>(null);

  const totalAssets = (licenses || []).length;
  
  // Software distribution
  const softwareDistribution: { [key: string]: number } = {};
  (licenses || []).forEach(lic => {
    if (!lic) return;
    const sw = lic.software || 'Revit';
    softwareDistribution[sw] = (softwareDistribution[sw] || 0) + 1;
  });
  const distinctSoftwaresCount = Object.keys(softwareDistribution).length;
  const distText = Object.entries(softwareDistribution)
    .map(([name, count]) => `${name}: ${count}`)
    .slice(0, 3)
    .join(' | ') + (Object.keys(softwareDistribution).length > 3 ? '...' : '');

  const licensedCount = (licenses || []).filter(lic => lic && lic.revitStatus !== 'Sem Licença' && lic.revitStatus !== '-').length;
  
  const semLicenca = (licenses || []).filter(lic => lic && lic.revitStatus === 'Sem Licença').length;
  const expiringSoon = (licenses || []).filter(lic => lic && lic.revitData && lic.revitData !== '-' && String(lic.revitData).toLowerCase().includes('2026')).length;
  const criticalCount = semLicenca + expiringSoon;

  const filteredLicenses = (licenses || []).filter(lic => {
    if (!lic) return false;
    const matchesSearch = 
      (lic.usuario || '').toLowerCase().includes(licenseSearchText.toLowerCase()) ||
      (lic.software || 'Revit').toLowerCase().includes(licenseSearchText.toLowerCase()) ||
      (lic.hardware || '').toLowerCase().includes(licenseSearchText.toLowerCase()) ||
      (lic.configHardware || '').toLowerCase().includes(licenseSearchText.toLowerCase());

    if (!matchesSearch) return false;

    if (licenseViewMode === 'expiring') {
      const hasDate = lic.revitData && lic.revitData !== '-' && lic.revitData !== '';
      const isSemLicenca = lic.revitStatus === 'Sem Licença';
      return hasDate || isSemLicenca;
    }

    return true;
  });

  const getRevitStatusStyle = (status: string) => {
    if (status === '2021 e 2023' || status === '2023') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
    } else if (status === 'Sem Licença') {
      return 'bg-rose-50 text-rose-700 border-rose-200 font-semibold';
    } else {
      return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const handleFieldChange = (id: string, field: keyof SoftwareLicense, val: string) => {
    const updated = licenses.map(item => item.id === id ? { ...item, [field]: val } : item);
    setLicenses(updated);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Mini Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex flex-col justify-between hover:shadow-sm transition-all">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">🖥️ Total de Ativos</span>
          <div className="my-2 text-2xl font-semibold text-slate-800">{totalAssets}</div>
          <span className="text-[9px] font-mono text-slate-400">Máquinas e utilizadores registrados</span>
        </div>
        
        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex flex-col justify-between hover:shadow-sm transition-all">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">💿 Mix de Softwares</span>
          <div className="my-2 text-2xl font-semibold text-slate-800">{distinctSoftwaresCount}</div>
          <span className="text-[9px] font-mono text-slate-400 truncate" title={distText}>{distText || 'Nenhum software'}</span>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex flex-col justify-between hover:shadow-sm transition-all">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">✅ Licenciados</span>
          <div className="my-2 text-2xl font-semibold text-slate-800">{licensedCount}</div>
          <span className="text-[9px] font-mono text-slate-400">Instalações ativas regulares</span>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-2xl p-5 flex flex-col justify-between hover:shadow-sm transition-all">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">⚠️ Alertas / Breves</span>
          <div className="my-2 text-2xl font-semibold text-slate-800">{criticalCount}</div>
          <span className="text-[9px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded-md inline-block self-start mt-1">
            {semLicenca} sem licença | {expiringSoon} expiram em 2026
          </span>
        </div>
      </div>

      {/* Table: Revit and Hardware Inventory */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between space-y-4">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
                🖥️ Inventário de Hardware e Controle de Licenciamento
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Painel unificado de ativos de hardware e subscrições de softwares por colaborador, com edição direta estilo planilha compacta.
              </p>
            </div>
            <button
              onClick={() => {
                const newId = 'lic-' + Date.now();
                const newRow: SoftwareLicense = {
                  id: newId,
                  usuario: 'Novo Colaborador',
                  hardware: 'Notebook',
                  ipProduto: '?',
                  ipDispositivo: '?',
                  configHardware: '?',
                  software: 'Revit',
                  revitStatus: '2023',
                  revitLogin: '-',
                  revitId: '-',
                  revitSenha: '-',
                  revitData: '31/12/2026'
                };
                setLicenses(prev => [...prev, newRow]);
                triggerToast('Nova linha adicionada ao inventário!', 'success');
              }}
              className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Plus className="w-4 h-4" /> Inserir Linha
            </button>
          </div>

          {/* View models filter & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'complete', label: '📋 Tabela Completa' },
                { id: 'hardware', label: '🖥️ Foco em Máquinas / TI' },
                { id: 'software', label: '🔑 Foco em Softwares' },
                { id: 'expiring', label: '⚠️ Alertas de Expiração' }
              ].map(mode => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setLicenseViewMode(mode.id as any);
                    setConfirmDeleteLicId(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-all cursor-pointer border ${
                    licenseViewMode === mode.id 
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
                      : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                value={licenseSearchText}
                onChange={e => setLicenseSearchText(e.target.value)}
                placeholder="Procurar usuário, software, hardware..."
                className="w-full bg-white border border-slate-200 p-1.5 px-3 rounded-xl text-[11px] placeholder-slate-400 font-semibold focus:outline-none focus:ring-1 focus:ring-slate-900 text-slate-800"
              />
              {licenseSearchText && (
                <button
                  onClick={() => setLicenseSearchText('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 font-semibold text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[11px] border border-slate-200/60">
            <thead>
              {licenseViewMode === 'complete' && (
                <>
                  <tr className="bg-slate-50/50 text-slate-400 uppercase font-mono text-[9px] border-b border-slate-200/60">
                    <th rowSpan={2} className="p-2 border-r border-slate-200/60 text-left whitespace-nowrap">Usuário Atual</th>
                    <th rowSpan={2} className="p-2 border-r border-slate-200/60 text-left whitespace-nowrap">Hardware</th>
                    <th rowSpan={2} className="p-2 border-r border-slate-200/60 text-left whitespace-nowrap">IP Produto</th>
                    <th rowSpan={2} className="p-2 border-r border-slate-200/60 text-left whitespace-nowrap">IP Dispositivo</th>
                    <th rowSpan={2} className="p-2 border-r border-slate-200/60 text-left whitespace-nowrap">Configuração Hardware</th>
                    <th colSpan={6} className="p-1.5 border-b border-r border-slate-200/60 text-center font-semibold tracking-wider bg-slate-100 text-slate-600">Licenciamento de Softwares</th>
                    <th rowSpan={2} className="p-2 text-center whitespace-nowrap w-16">Remover</th>
                  </tr>
                  <tr className="bg-slate-50/50 text-slate-400 uppercase font-mono text-[9px] border-b border-slate-200/60">
                    <th className="p-2 border-r border-slate-200/60 text-left whitespace-nowrap w-40">Software</th>
                    <th className="p-2 border-r border-slate-200/60 text-center whitespace-nowrap w-32">Status/Versão</th>
                    <th className="p-2 border-r border-slate-200/60 text-left whitespace-nowrap w-44">Login</th>
                    <th className="p-2 border-r border-slate-200/60 text-left whitespace-nowrap w-36">ID / Key</th>
                    <th className="p-2 border-r border-slate-200/60 text-left whitespace-nowrap w-32">Senha</th>
                    <th className="p-2 border-r border-slate-200/60 text-left whitespace-nowrap w-32">Data Licença</th>
                  </tr>
                </>
              )}
              {licenseViewMode === 'hardware' && (
                <tr className="bg-slate-50/50 text-slate-400 uppercase font-mono text-[9px] border-b border-slate-200/60">
                  <th className="p-2.5 px-3 border-r border-slate-200/60 text-left whitespace-nowrap">Usuário Atual</th>
                  <th className="p-2.5 px-3 border-r border-slate-200/60 text-left whitespace-nowrap">Hardware</th>
                  <th className="p-2.5 px-3 border-r border-slate-200/60 text-left whitespace-nowrap">IP Produto</th>
                  <th className="p-2.5 px-3 border-r border-slate-200/60 text-left whitespace-nowrap">IP Dispositivo</th>
                  <th className="p-2.5 px-3 border-r border-slate-200/60 text-left whitespace-nowrap">Configuração Hardware</th>
                  <th className="p-2.5 px-3 border-r border-slate-200/60 text-left whitespace-nowrap">Software Ativo</th>
                  <th className="p-2.5 px-3 text-center w-16">Remover</th>
                </tr>
              )}
              {licenseViewMode === 'software' && (
                <tr className="bg-slate-50/50 text-slate-400 uppercase font-mono text-[9px] border-b border-slate-200/60">
                  <th className="p-2.5 px-3 border-r border-slate-200/60 text-left whitespace-nowrap">Usuário Atual</th>
                  <th className="p-2.5 px-3 border-r border-slate-200/60 text-left whitespace-nowrap w-40">Software</th>
                  <th className="p-2.5 px-3 border-r border-slate-200/60 text-center whitespace-nowrap w-32">Status/Versão</th>
                  <th className="p-2.5 px-3 border-r border-slate-200/60 text-left whitespace-nowrap w-44">Login</th>
                  <th className="p-2.5 px-3 border-r border-slate-200/60 text-left whitespace-nowrap w-36">ID / Key</th>
                  <th className="p-2.5 px-3 border-r border-slate-200/60 text-left whitespace-nowrap w-32">Senha</th>
                  <th className="p-2.5 px-3 border-r border-slate-200/60 text-left whitespace-nowrap w-32">Data Licença</th>
                  <th className="p-2.5 px-3 text-center w-16">Remover</th>
                </tr>
              )}
              {licenseViewMode === 'expiring' && (
                <tr className="bg-slate-50/50 text-slate-400 uppercase font-mono text-[9px] border-b border-slate-200/60">
                  <th className="p-2.5 px-3 border-r border-slate-200/60 text-left whitespace-nowrap">Usuário Atual</th>
                  <th className="p-2.5 px-3 border-r border-slate-200/60 text-left whitespace-nowrap w-40">Software</th>
                  <th className="p-2.5 px-3 border-r border-slate-200/60 text-center whitespace-nowrap w-32">Status/Versão</th>
                  <th className="p-2.5 px-3 border-r border-slate-200/60 text-left whitespace-nowrap w-44">Login</th>
                  <th className="p-2.5 px-3 border-r border-slate-200/60 text-left whitespace-nowrap w-32">Data de Expiração</th>
                  <th className="p-2.5 px-3 border-r border-slate-200/60 text-center w-36">Estado do Alerta</th>
                  <th className="p-2.5 px-3 text-center w-16">Remover</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLicenses.map(lic => {
                const isNearExpiry = !!(lic.revitData && lic.revitData !== '-' && String(lic.revitData).toLowerCase().includes('2026'));

                return (
                  <tr key={lic.id} className="hover:bg-slate-50/40 transition-colors">
                    {/* Usuario */}
                    <td className="p-1 border-r border-slate-200/60">
                      <input
                        type="text"
                        value={lic.usuario || ''}
                        onChange={e => handleFieldChange(lic.id, 'usuario', e.target.value)}
                        className="w-full bg-transparent border-none p-1 font-semibold text-slate-800 focus:bg-slate-50 focus:ring-0 text-[11px] rounded focus:outline-none"
                        placeholder="Nome"
                      />
                    </td>

                    {/* Complete & Hardware: Hardware */}
                    {(licenseViewMode === 'complete' || licenseViewMode === 'hardware') && (
                      <td className="p-1 border-r border-slate-200/60">
                        <input
                          type="text"
                          value={lic.hardware || ''}
                          onChange={e => handleFieldChange(lic.id, 'hardware', e.target.value)}
                          className="w-full bg-transparent border-none p-1 text-slate-700 font-semibold focus:bg-slate-50 focus:ring-0 text-[11px] rounded focus:outline-none"
                          placeholder="Modelo"
                        />
                      </td>
                    )}

                    {/* Complete & Hardware: IP Produto */}
                    {(licenseViewMode === 'complete' || licenseViewMode === 'hardware') && (
                      <td className="p-1 border-r border-slate-200/60 font-mono">
                        <input
                          type="text"
                          value={lic.ipProduto || ''}
                          onChange={e => handleFieldChange(lic.id, 'ipProduto', e.target.value)}
                          className="w-full bg-transparent border-none p-1 text-slate-500 font-mono focus:bg-slate-50 focus:ring-0 text-[10px] rounded focus:outline-none"
                          placeholder="Serial"
                        />
                      </td>
                    )}

                    {/* Complete & Hardware: IP Dispositivo */}
                    {(licenseViewMode === 'complete' || licenseViewMode === 'hardware') && (
                      <td className="p-1 border-r border-slate-200/60 font-mono">
                        <input
                          type="text"
                          value={lic.ipDispositivo || ''}
                          onChange={e => handleFieldChange(lic.id, 'ipDispositivo', e.target.value)}
                          className="w-full bg-transparent border-none p-1 text-slate-500 font-mono focus:bg-slate-50 focus:ring-0 text-[10px] rounded focus:outline-none"
                          placeholder="GUID / Mac"
                        />
                      </td>
                    )}

                    {/* Complete & Hardware: Configuração */}
                    {(licenseViewMode === 'complete' || licenseViewMode === 'hardware') && (
                      <td className="p-1 border-r border-slate-200/60">
                        <input
                          type="text"
                          value={lic.configHardware || ''}
                          onChange={e => handleFieldChange(lic.id, 'configHardware', e.target.value)}
                          className="w-full bg-transparent border-none p-1 text-slate-500 focus:bg-slate-50 focus:ring-0 text-[10px] rounded focus:outline-none"
                          placeholder="CPU / RAM / OS"
                        />
                      </td>
                    )}

                    {/* Software */}
                    {(licenseViewMode === 'complete' || licenseViewMode === 'software' || licenseViewMode === 'expiring' || licenseViewMode === 'hardware') && (
                      <td className="p-1 border-r border-slate-200/60">
                        <div className="flex flex-col gap-1">
                          <select
                            value={['Revit', 'AutoCAD', 'SketchUp Pro', 'Archicad', 'Lumion', 'TQS', 'V-Ray'].includes(lic.software || '') ? (lic.software || '') : 'Outro'}
                            onChange={e => {
                              const v = e.target.value;
                              if (v !== 'Outro') {
                                handleFieldChange(lic.id, 'software', v);
                              }
                            }}
                            className="bg-transparent border-none p-1 rounded cursor-pointer text-[11px] font-semibold focus:ring-0 focus:bg-slate-50 focus:outline-none text-slate-700"
                          >
                            <option value="Revit">Revit</option>
                            <option value="AutoCAD">AutoCAD</option>
                            <option value="SketchUp Pro">SketchUp Pro</option>
                            <option value="Archicad">Archicad</option>
                            <option value="Lumion">Lumion</option>
                            <option value="TQS">TQS</option>
                            <option value="V-Ray">V-Ray</option>
                            <option value="Outro">Outro...</option>
                          </select>
                          {(!['Revit', 'AutoCAD', 'SketchUp Pro', 'Archicad', 'Lumion', 'TQS', 'V-Ray'].includes(lic.software || '') || !lic.software) && (
                            <input
                              type="text"
                              value={lic.software || ''}
                              onChange={e => handleFieldChange(lic.id, 'software', e.target.value)}
                              className="bg-slate-50 border-none p-1 rounded font-semibold text-[10px] w-full focus:outline-none"
                              placeholder="Nome do Software"
                            />
                          )}
                        </div>
                      </td>
                    )}

                    {/* Complete, Software, Expiring: Status/Versão */}
                    {(licenseViewMode === 'complete' || licenseViewMode === 'software' || licenseViewMode === 'expiring') && (
                      <td className="p-1 border-r border-slate-200/60 text-center">
                        <select
                          value={lic.revitStatus || '-'}
                          onChange={e => {
                            handleFieldChange(lic.id, 'revitStatus', e.target.value);
                            triggerToast(`Status de ${lic.usuario || 'Colaborador'} atualizado!`, 'info');
                          }}
                          className={`p-1 px-2 rounded text-[10px] border focus:ring-0 cursor-pointer focus:outline-none text-center ${getRevitStatusStyle(lic.revitStatus || '-')}`}
                        >
                          <option value="2021 e 2023">2021 e 2023</option>
                          <option value="2023">2023</option>
                          <option value="Sem Licença">Sem Licença</option>
                          <option value="-">-</option>
                        </select>
                      </td>
                    )}

                    {/* Complete, Software, Expiring: Login */}
                    {(licenseViewMode === 'complete' || licenseViewMode === 'software' || licenseViewMode === 'expiring') && (
                      <td className="p-1 border-r border-slate-200/60">
                        <input
                          type="text"
                          value={lic.revitLogin || ''}
                          onChange={e => handleFieldChange(lic.id, 'revitLogin', e.target.value)}
                          className="w-full bg-transparent border-none p-1 text-slate-600 focus:bg-slate-50 focus:ring-0 text-[10px] rounded focus:outline-none"
                          placeholder="Login"
                        />
                      </td>
                    )}

                    {/* Complete, Software: ID */}
                    {(licenseViewMode === 'complete' || licenseViewMode === 'software') && (
                      <td className="p-1 border-r border-slate-200/60">
                        <input
                          type="text"
                          value={lic.revitId || ''}
                          onChange={e => handleFieldChange(lic.id, 'revitId', e.target.value)}
                          className="w-full bg-transparent border-none p-1 text-slate-600 focus:bg-slate-50 focus:ring-0 text-[10px] rounded focus:outline-none"
                          placeholder="ID / Chave"
                        />
                      </td>
                    )}

                    {/* Complete, Software: Senha */}
                    {(licenseViewMode === 'complete' || licenseViewMode === 'software') && (
                      <td className="p-1 border-r border-slate-200/60">
                        <input
                          type="text"
                          value={lic.revitSenha || ''}
                          onChange={e => handleFieldChange(lic.id, 'revitSenha', e.target.value)}
                          className="w-full bg-transparent border-none p-1 text-slate-600 focus:bg-slate-50 focus:ring-0 text-[10px] rounded font-mono focus:outline-none"
                          placeholder="Senha"
                        />
                      </td>
                    )}

                    {/* Complete, Software, Expiring: Data */}
                    {(licenseViewMode === 'complete' || licenseViewMode === 'software' || licenseViewMode === 'expiring') && (
                      <td className="p-1 border-r border-slate-200/60">
                        <input
                          type="text"
                          value={lic.revitData || ''}
                          onChange={e => handleFieldChange(lic.id, 'revitData', e.target.value)}
                          className="w-full bg-transparent border-none p-1 text-slate-600 focus:bg-slate-50 focus:ring-0 text-[10px] rounded focus:outline-none"
                          placeholder="Data Expirar"
                        />
                      </td>
                    )}

                    {/* Expiring: Alerta Badge */}
                    {licenseViewMode === 'expiring' && (
                      <td className="p-1.5 border-r border-slate-200/60 text-center">
                        {lic.revitStatus === 'Sem Licença' ? (
                          <span className="px-2 py-0.5 rounded text-[8px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                            🚨 Sem Licença
                          </span>
                        ) : isNearExpiry ? (
                          <span className="px-2 py-0.5 rounded text-[8px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 uppercase animate-pulse">
                            ⏳ Expira Breve (2026)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[8px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                            ✅ Regular
                          </span>
                        )}
                      </td>
                    )}

                    {/* Double confirmation delete cell */}
                    <td className="p-1 text-center">
                      {userRole !== 'admin' ? (
                        <button
                          type="button"
                          disabled
                          className="p-1 text-slate-300 rounded-lg cursor-not-allowed"
                          title="Apenas o Administrador pode apagar licenças"
                        >
                          <Lock className="w-3.5 h-3.5 mx-auto text-slate-400" />
                        </button>
                      ) : confirmDeleteLicId === lic.id ? (
                        <div className="flex items-center justify-center gap-1 bg-slate-900 text-white p-1 rounded-lg">
                          <span className="text-[8px] font-semibold uppercase tracking-wider">Apagar?</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = licenses.filter(item => item.id !== lic.id);
                              setLicenses(updated);
                              triggerToast('Linha de licença removida!', 'warning');
                              setConfirmDeleteLicId(null);
                            }}
                            className="px-1 py-0.5 bg-white text-slate-900 hover:bg-slate-50 rounded text-[9px] font-semibold cursor-pointer"
                          >
                            Sim
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteLicId(null)}
                            className="px-1 py-0.5 bg-slate-800 text-white hover:text-white rounded text-[9px] font-semibold cursor-pointer"
                          >
                            Não
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteLicId(lic.id)}
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
            </tbody>
          </table>
        </div>

        <div className="bg-slate-900 text-white p-3.5 px-5 font-mono text-[9px] flex flex-col sm:flex-row items-center justify-between gap-2 rounded-xl">
          <div>COLABORADORES ATIVOS: <span className="font-semibold">{licenses.length} REGISTROS</span></div>
          <div className="text-slate-400">ESTILO SPREADSHEET AUTOMATIZADA</div>
        </div>
      </div>
    </div>
  );
}
