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
  const [selectedSoftware, setSelectedSoftware] = useState<string>('Revit');
  const [licenseSearchText, setLicenseSearchText] = useState('');
  const [confirmDeleteLicId, setConfirmDeleteLicId] = useState<string | null>(null);

  const totalAssets = (licenses || []).length;

  // Migrate licenses in parent state to include softwaresData structure if missing
  React.useEffect(() => {
    const needsMigration = (licenses || []).some(lic => !lic.softwaresData || Object.keys(lic.softwaresData).length === 0);
    if (needsMigration) {
      const migrated = (licenses || []).map(lic => {
        if (lic.softwaresData && Object.keys(lic.softwaresData).length > 0) return lic;

        const defaultSw = lic.software || 'Revit';
        const initialSoftwaresData: { [key: string]: any } = {
          'Revit': { status: '-', login: '-', key: '-', senha: '-', data: '-' },
          'AutoCAD': { status: '-', login: '-', key: '-', senha: '-', data: '-' },
          'SketchUp Pro': { status: '-', login: '-', key: '-', senha: '-', data: '-' },
          'Archicad': { status: '-', login: '-', key: '-', senha: '-', data: '-' },
          'Lumion': { status: '-', login: '-', key: '-', senha: '-', data: '-' },
          'TQS': { status: '-', login: '-', key: '-', senha: '-', data: '-' },
          'V-Ray': { status: '-', login: '-', key: '-', senha: '-', data: '-' },
        };

        initialSoftwaresData[defaultSw] = {
          status: lic.revitStatus || '-',
          login: lic.revitLogin || '-',
          key: lic.revitId || '-',
          senha: lic.revitSenha || '-',
          data: lic.revitData || '-'
        };

        return {
          ...lic,
          softwaresData: initialSoftwaresData
        };
      });
      setLicenses(migrated);
    }
  }, [licenses, setLicenses]);

  // Ensure every license has softwaresData populated
  const migratedLicenses = React.useMemo(() => {
    return (licenses || []).map(lic => {
      if (lic.softwaresData && Object.keys(lic.softwaresData).length > 0) return lic;

      // Initialize dictionary for all softwares
      const defaultSw = lic.software || 'Revit';
      const initialSoftwaresData: { [key: string]: any } = {
        'Revit': { status: '-', login: '-', key: '-', senha: '-', data: '-' },
        'AutoCAD': { status: '-', login: '-', key: '-', senha: '-', data: '-' },
        'SketchUp Pro': { status: '-', login: '-', key: '-', senha: '-', data: '-' },
        'Archicad': { status: '-', login: '-', key: '-', senha: '-', data: '-' },
        'Lumion': { status: '-', login: '-', key: '-', senha: '-', data: '-' },
        'TQS': { status: '-', login: '-', key: '-', senha: '-', data: '-' },
        'V-Ray': { status: '-', login: '-', key: '-', senha: '-', data: '-' },
      };

      // Populate default software with the values of this row
      initialSoftwaresData[defaultSw] = {
        status: lic.revitStatus || '-',
        login: lic.revitLogin || '-',
        key: lic.revitId || '-',
        senha: lic.revitSenha || '-',
        data: lic.revitData || '-'
      };

      return {
        ...lic,
        softwaresData: initialSoftwaresData
      };
    });
  }, [licenses]);

  // Software Monthly Costs (constants for calculation)
  const SOFTWARE_COSTS: { [key: string]: number } = {
    'Revit': 220,
    'AutoCAD': 140,
    'SketchUp Pro': 30,
    'Archicad': 180,
    'Lumion': 90,
    'TQS': 80,
    'V-Ray': 40
  };

  const getSoftwareCost = (sw: string) => {
    return SOFTWARE_COSTS[sw] || 50;
  };

  const SOFTWARE_COLORS = [
    '#6366F1', // Indigo
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#3B82F6', // Blue
    '#EC4899', // Pink
    '#8B5CF6', // Purple
    '#14B8A6', // Teal
    '#F43F5E', // Rose
    '#94A3B8'  // Slate
  ];

  // Software distribution and cost analysis
  const softwareDistribution: { [key: string]: number } = {};
  const softwareStatsMap: { [key: string]: { active: number, total: number } } = {
    'Revit': { active: 0, total: 0 },
    'AutoCAD': { active: 0, total: 0 },
    'SketchUp Pro': { active: 0, total: 0 },
    'Archicad': { active: 0, total: 0 },
    'Lumion': { active: 0, total: 0 },
    'TQS': { active: 0, total: 0 },
    'V-Ray': { active: 0, total: 0 },
  };

  migratedLicenses.forEach(lic => {
    const swData = lic.softwaresData || {};
    Object.entries(swData).forEach(([sw, details]) => {
      // Consider a license assigned if its status is not '-'
      if (details.status !== '-') {
        if (!softwareStatsMap[sw]) {
          softwareStatsMap[sw] = { active: 0, total: 0 };
        }
        softwareStatsMap[sw].total += 1;
        if (details.status !== 'Sem Licença') {
          softwareStatsMap[sw].active += 1;
        }
        softwareDistribution[sw] = (softwareDistribution[sw] || 0) + 1;
      }
    });
  });
  
  const distinctSoftwaresCount = Object.keys(softwareDistribution).length;
  const distText = Object.entries(softwareDistribution)
    .map(([name, count]) => `${name}: ${count}`)
    .slice(0, 3)
    .join(' | ') + (Object.keys(softwareDistribution).length > 3 ? '...' : '');

  const licensedCount = migratedLicenses.filter(lic => {
    const swData = lic.softwaresData || {};
    return Object.values(swData).some((details: any) => details.status !== 'Sem Licença' && details.status !== '-');
  }).length;
  
  const semLicenca = migratedLicenses.filter(lic => {
    const swData = lic.softwaresData || {};
    return Object.values(swData).some((details: any) => details.status === 'Sem Licença');
  }).length;

  const expiringSoon = migratedLicenses.filter(lic => {
    const swData = lic.softwaresData || {};
    return Object.values(swData).some((details: any) => details.data && details.data !== '-' && String(details.data).toLowerCase().includes('2026'));
  }).length;
  
  const criticalCount = semLicenca + expiringSoon;

  const softwareStats = Object.entries(softwareStatsMap).map(([sw, stats]) => {
    const count = stats.total;
    const utilization = count > 0 ? Math.round((stats.active / count) * 100) : 0;
    const monthlyCost = count * getSoftwareCost(sw);
    return {
      software: sw,
      users: count,
      utilization,
      monthlyCost,
      trend: utilization >= 75 ? 'up' : 'down'
    };
  }).filter(s => s.users > 0).sort((a, b) => b.monthlyCost - a.monthlyCost);

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  const getArcPath = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  const filteredLicenses = migratedLicenses.filter(lic => {
    if (!lic) return false;
    const matchesSearch = 
      (lic.usuario || '').toLowerCase().includes(licenseSearchText.toLowerCase()) ||
      (lic.hardware || '').toLowerCase().includes(licenseSearchText.toLowerCase()) ||
      (lic.configHardware || '').toLowerCase().includes(licenseSearchText.toLowerCase());

    return matchesSearch;
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
    const updated = migratedLicenses.map(item => item.id === id ? { ...item, [field]: val } : item);
    setLicenses(updated);
  };

  const handleSoftwareFieldChange = (id: string, swName: string, field: keyof SoftwareLicenseDetails, val: string) => {
    const updated = migratedLicenses.map(item => {
      if (item.id !== id) return item;
      
      const swData = item.softwaresData ? { ...item.softwaresData } : {};
      const currentSwDetails = swData[swName] || { status: '-', login: '-', key: '-', senha: '-', data: '-' };
      
      swData[swName] = {
        ...currentSwDetails,
        [field]: val
      };
      
      // Sincronizar com os campos originais do Revit se o software selecionado for o Revit,
      // para garantir compatibilidade com o dashboard e outros locais
      const extraUpdates: any = {};
      if (swName === 'Revit') {
        if (field === 'status') extraUpdates.revitStatus = val;
        if (field === 'login') extraUpdates.revitLogin = val;
        if (field === 'key') extraUpdates.revitId = val;
        if (field === 'senha') extraUpdates.revitSenha = val;
        if (field === 'data') extraUpdates.revitData = val;
      }
      
      return {
        ...item,
        ...extraUpdates,
        softwaresData: swData
      };
    });
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

      {/* Usage Insight: License Utilization & Costs Breakdown */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-6">
        <div>
          <h3 className="font-semibold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
            📊 Análise de Utilização & Custos de Software (Usage Insight)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Visão detalhada sobre subscrições ativas, taxa de engajamento do time e custos mensais de licenciamento.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Panel: Donut Chart */}
          <div className="lg:col-span-4 border border-slate-100 rounded-2xl p-5 flex flex-col justify-between items-center text-center bg-slate-50/30">
            <div>
              <h4 className="text-[10px] font-bold text-slate-450 uppercase tracking-wider">Distribuição Financeira</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Participação dos custos por software</p>
            </div>

            {/* Segmented Donut SVG */}
            <div className="relative w-40 h-40 flex items-center justify-center my-4">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {/* Background shadow path */}
                <circle cx="50" cy="50" r="35" fill="none" stroke="#f8fafc" strokeWidth="8" />
                
                {/* Render segments */}
                {(() => {
                  let currentAngle = 0;
                  const gapAngle = 10;
                  const totalCost = softwareStats.reduce((sum, item) => sum + item.monthlyCost, 0);
                  
                  return softwareStats.map((stat, idx) => {
                    const angleLength = totalCost > 0 ? (stat.monthlyCost / totalCost) * 360 : 0;
                    const startAngle = currentAngle + gapAngle / 2;
                    const endAngle = currentAngle + angleLength - gapAngle / 2;
                    currentAngle += angleLength;
                    
                    if (endAngle <= startAngle) return null;
                    
                    return (
                      <path
                        key={stat.software}
                        d={getArcPath(50, 50, 35, startAngle, endAngle)}
                        fill="none"
                        stroke={SOFTWARE_COLORS[idx] || '#94A3B8'}
                        strokeWidth="8"
                        strokeLinecap="round"
                        className="transition-all duration-300 hover:stroke-[10px] cursor-pointer"
                        title={`${stat.software}: $${stat.monthlyCost}`}
                      />
                    );
                  });
                })()}
              </svg>
              
              {/* Overlay center info */}
              <div className="absolute flex flex-col items-center">
                <span className="text-xl font-bold text-slate-900 leading-none">
                  ${softwareStats.reduce((sum, item) => sum + item.monthlyCost, 0)}
                </span>
                <span className="text-[8px] font-mono text-slate-450 uppercase mt-1">custo total</span>
              </div>
            </div>

            <span className="text-[9px] text-slate-400 font-medium">
              Segmentado por proporção de custos
            </span>
          </div>

          {/* Right Panel: Breakdown Table */}
          <div className="lg:col-span-8 border border-slate-100 rounded-2xl overflow-hidden flex flex-col justify-between bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/60 text-slate-400 uppercase font-mono text-[9px] border-b border-slate-100">
                    <th className="p-3 font-semibold">Software</th>
                    <th className="p-3 font-semibold text-center">Usuários</th>
                    <th className="p-3 font-semibold text-center">Utilização</th>
                    <th className="p-3 font-semibold text-right">Custo Mensal</th>
                    <th className="p-3 font-semibold text-center w-24">Tendência</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-[11px] font-medium text-slate-700">
                  {softwareStats.map((stat, idx) => {
                    const color = SOFTWARE_COLORS[idx] || '#94A3B8';
                    const isHigh = stat.utilization >= 75;
                    return (
                      <tr key={stat.software} className="hover:bg-slate-50/30 transition-colors">
                        <td className="p-3 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                          <span className="font-semibold text-slate-900">{stat.software}</span>
                        </td>
                        <td className="p-3 text-center font-mono text-slate-650">{stat.users}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="font-mono">{stat.utilization}%</span>
                            <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden hidden sm:block">
                              <div 
                                className={`h-full rounded-full ${isHigh ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                                style={{ width: `${stat.utilization}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-right font-mono text-slate-900">${stat.monthlyCost}</td>
                        <td className="p-3 text-center w-24">
                          {isHigh ? (
                            <span className="inline-flex items-center gap-0.5 text-emerald-600 font-mono text-[9px] font-bold">
                              ▲ Estável
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-0.5 text-rose-500 font-mono text-[9px] font-bold animate-pulse">
                              ▼ Baixa
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50/50 border-t border-slate-150 text-[11px] font-bold text-slate-900 font-mono">
                    <td className="p-3">Total</td>
                    <td className="p-3 text-center">{softwareStats.reduce((sum, item) => sum + item.users, 0)}</td>
                    <td className="p-3 text-center">
                      {softwareStats.length > 0 
                        ? Math.round(softwareStats.reduce((sum, item) => sum + item.utilization, 0) / softwareStats.length) 
                        : 0}%
                    </td>
                    <td className="p-3 text-right text-slate-950">
                      ${softwareStats.reduce((sum, item) => sum + item.monthlyCost, 0)}
                    </td>
                    <td className="p-3 text-center text-slate-400">-</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
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
                  ipProduto: '-',
                  ipDispositivo: '-',
                  configHardware: '-',
                  software: 'Revit',
                  revitStatus: '-',
                  revitLogin: '-',
                  revitId: '-',
                  revitSenha: '-',
                  revitData: '-',
                  softwaresData: {
                    'Revit': { status: '-', login: '-', key: '-', senha: '-', data: '-' },
                    'AutoCAD': { status: '-', login: '-', key: '-', senha: '-', data: '-' },
                    'SketchUp Pro': { status: '-', login: '-', key: '-', senha: '-', data: '-' },
                    'Archicad': { status: '-', login: '-', key: '-', senha: '-', data: '-' },
                    'Lumion': { status: '-', login: '-', key: '-', senha: '-', data: '-' },
                    'TQS': { status: '-', login: '-', key: '-', senha: '-', data: '-' },
                    'V-Ray': { status: '-', login: '-', key: '-', senha: '-', data: '-' },
                  }
                };
                setLicenses(prev => [...prev, newRow]);
                triggerToast('Nova linha adicionada ao inventário!', 'success');
              }}
              className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Plus className="w-4 h-4" /> Inserir Linha
            </button>
          </div>

          {/* Software selection & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-650">Visualizar/Editar Licenciamento de:</span>
              <select
                value={selectedSoftware}
                onChange={e => setSelectedSoftware(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none hover:bg-slate-100 transition-colors"
              >
                <option value="Revit">Revit</option>
                <option value="AutoCAD">AutoCAD</option>
                <option value="SketchUp Pro">SketchUp Pro</option>
                <option value="Archicad">Archicad</option>
                <option value="Lumion">Lumion</option>
                <option value="TQS">TQS</option>
                <option value="V-Ray">V-Ray</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                value={licenseSearchText}
                onChange={e => setLicenseSearchText(e.target.value)}
                placeholder="Procurar usuário, hardware..."
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
              <tr className="bg-slate-50/50 text-slate-400 uppercase font-mono text-[9px] border-b border-slate-200/60">
                <th className="p-2.5 border-r border-slate-200/60 text-left whitespace-nowrap">Usuário Atual</th>
                <th className="p-2.5 border-r border-slate-200/60 text-left whitespace-nowrap">Hardware</th>
                <th className="p-2.5 border-r border-slate-200/60 text-left whitespace-nowrap">IP Produto</th>
                <th className="p-2.5 border-r border-slate-200/60 text-left whitespace-nowrap">IP Dispositivo</th>
                <th className="p-2.5 border-r border-slate-200/60 text-left whitespace-nowrap">Configuração Hardware</th>
                <th className="p-2.5 border-r border-slate-200/60 text-center whitespace-nowrap w-32 bg-slate-100/50 text-slate-700 font-semibold uppercase">Status/Versão ({selectedSoftware})</th>
                <th className="p-2.5 border-r border-slate-200/60 text-left whitespace-nowrap w-44 bg-slate-100/50 text-slate-700 font-semibold uppercase">Login ({selectedSoftware})</th>
                <th className="p-2.5 border-r border-slate-200/60 text-left whitespace-nowrap w-36 bg-slate-100/50 text-slate-700 font-semibold uppercase">ID / Key ({selectedSoftware})</th>
                <th className="p-2.5 border-r border-slate-200/60 text-left whitespace-nowrap w-32 bg-slate-100/50 text-slate-700 font-semibold uppercase">Senha ({selectedSoftware})</th>
                <th className="p-2.5 border-r border-slate-200/60 text-left whitespace-nowrap w-32 bg-slate-100/50 text-slate-700 font-semibold uppercase">Data Licença ({selectedSoftware})</th>
                <th className="p-2.5 text-center whitespace-nowrap w-16">Remover</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLicenses.map(lic => {
                const swDetails = (lic.softwaresData && lic.softwaresData[selectedSoftware]) || { status: '-', login: '-', key: '-', senha: '-', data: '-' };
                const isNearExpiry = !!(swDetails.data && swDetails.data !== '-' && String(swDetails.data).toLowerCase().includes('2026'));

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

                    {/* Hardware */}
                    <td className="p-1 border-r border-slate-200/60">
                      <input
                        type="text"
                        value={lic.hardware || ''}
                        onChange={e => handleFieldChange(lic.id, 'hardware', e.target.value)}
                        className="w-full bg-transparent border-none p-1 text-slate-700 font-semibold focus:bg-slate-50 focus:ring-0 text-[11px] rounded focus:outline-none"
                        placeholder="Modelo"
                      />
                    </td>

                    {/* IP Produto */}
                    <td className="p-1 border-r border-slate-200/60 font-mono">
                      <input
                        type="text"
                        value={lic.ipProduto || ''}
                        onChange={e => handleFieldChange(lic.id, 'ipProduto', e.target.value)}
                        className="w-full bg-transparent border-none p-1 text-slate-500 font-mono focus:bg-slate-50 focus:ring-0 text-[10px] rounded focus:outline-none"
                        placeholder="Serial"
                      />
                    </td>

                    {/* IP Dispositivo */}
                    <td className="p-1 border-r border-slate-200/60 font-mono">
                      <input
                        type="text"
                        value={lic.ipDispositivo || ''}
                        onChange={e => handleFieldChange(lic.id, 'ipDispositivo', e.target.value)}
                        className="w-full bg-transparent border-none p-1 text-slate-500 font-mono focus:bg-slate-50 focus:ring-0 text-[10px] rounded focus:outline-none"
                        placeholder="GUID / Mac"
                      />
                    </td>

                    {/* Configuração */}
                    <td className="p-1 border-r border-slate-200/60">
                      <input
                        type="text"
                        value={lic.configHardware || ''}
                        onChange={e => handleFieldChange(lic.id, 'configHardware', e.target.value)}
                        className="w-full bg-transparent border-none p-1 text-slate-500 focus:bg-slate-50 focus:ring-0 text-[10px] rounded focus:outline-none"
                        placeholder="CPU / RAM / OS"
                      />
                    </td>

                    {/* Status/Versão */}
                    <td className="p-1 border-r border-slate-200/60 text-center bg-slate-50/20">
                      <select
                        value={swDetails.status}
                        onChange={e => {
                          handleSoftwareFieldChange(lic.id, selectedSoftware, 'status', e.target.value);
                          triggerToast(`Status de ${selectedSoftware} para ${lic.usuario || 'Colaborador'} atualizado!`, 'info');
                        }}
                        className={`p-1 px-2 rounded text-[10px] border focus:ring-0 cursor-pointer focus:outline-none text-center ${getRevitStatusStyle(swDetails.status)}`}
                      >
                        <option value="2021 e 2023">2021 e 2023</option>
                        <option value="2023">2023</option>
                        <option value="Sem Licença">Sem Licença</option>
                        <option value="-">-</option>
                      </select>
                    </td>

                    {/* Login */}
                    <td className="p-1 border-r border-slate-200/60 bg-slate-50/20">
                      <input
                        type="text"
                        value={swDetails.login}
                        onChange={e => handleSoftwareFieldChange(lic.id, selectedSoftware, 'login', e.target.value)}
                        className="w-full bg-transparent border-none p-1 text-slate-650 focus:bg-slate-50 focus:ring-0 text-[10px] rounded focus:outline-none"
                        placeholder="Login"
                      />
                    </td>

                    {/* ID */}
                    <td className="p-1 border-r border-slate-200/60 bg-slate-50/20">
                      <input
                        type="text"
                        value={swDetails.key}
                        onChange={e => handleSoftwareFieldChange(lic.id, selectedSoftware, 'key', e.target.value)}
                        className="w-full bg-transparent border-none p-1 text-slate-650 focus:bg-slate-50 focus:ring-0 text-[10px] rounded focus:outline-none"
                        placeholder="ID / Chave"
                      />
                    </td>

                    {/* Senha */}
                    <td className="p-1 border-r border-slate-200/60 bg-slate-50/20">
                      <input
                        type="text"
                        value={swDetails.senha || ''}
                        onChange={e => handleSoftwareFieldChange(lic.id, selectedSoftware, 'senha', e.target.value)}
                        className="w-full bg-transparent border-none p-1 text-slate-650 focus:bg-slate-50 focus:ring-0 text-[10px] rounded font-mono focus:outline-none"
                        placeholder="Senha"
                      />
                    </td>

                    {/* Data */}
                    <td className="p-1 border-r border-slate-200/60 bg-slate-50/20">
                      <input
                        type="text"
                        value={swDetails.data || ''}
                        onChange={e => handleSoftwareFieldChange(lic.id, selectedSoftware, 'data', e.target.value)}
                        className="w-full bg-transparent border-none p-1 text-slate-650 focus:bg-slate-50 focus:ring-0 text-[10px] rounded focus:outline-none"
                        placeholder="Data Expirar"
                      />
                    </td>

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
          <div className="text-slate-400 font-bold uppercase">PLANILHA VINCULADA POR SOFTWARE ({selectedSoftware})</div>
        </div>
      </div>
    </div>
  );
}
