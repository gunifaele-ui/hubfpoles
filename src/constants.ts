import { Architect, Project, Task, Complementar, Tablet, Placa, Clash, PrefeituraCredential, SoftwareLicense, Week, BackupRecord, RevitTemplateRequirement, EngineeringProject } from './types';

export const ARCHITECTS: Architect[] = [
  { id: 'pedro', name: 'Arq. Pedro Antunes', color: 'bg-black text-white' },
  { id: 'claudia', name: 'Arq. Cláudia Silva', color: 'bg-black text-white' },
  { id: 'sofia', name: 'Arq. Sofia Rocha', color: 'bg-black text-white' },
  { id: 'miguel', name: 'Arq. Miguel Sousa', color: 'bg-black text-white' },
  { id: 'ana', name: 'Arq. Ana Oliveira', color: 'bg-black text-white' },
  { id: 'joao', name: 'Arq. João Santos', color: 'bg-black text-white' },
  { id: 'maria', name: 'Arq. Maria Costa', color: 'bg-black text-white' },
  { id: 'ricardo', name: 'Arq. Ricardo Pereira', color: 'bg-black text-white' },
  { id: 'ines', name: 'Arq. Inês Rodrigues', color: 'bg-black text-white' },
  { id: 'andre', name: 'Arq. André Fernandes', color: 'bg-black text-white' },
  { id: 'rita', name: 'Arq. Rita Carvalho', color: 'bg-black text-white' },
  { id: 'paulo', name: 'Arq. Paulo Gomes', color: 'bg-black text-white' },
  { id: 'beatriz', name: 'Arq. Beatriz Martins', color: 'bg-black text-white' },
  { id: 'francisco', name: 'Arq. Francisco Lopes', color: 'bg-black text-white' },
  { id: 'mariana', name: 'Arq. Mariana Teixeira', color: 'bg-black text-white' }
];

export const INITIAL_PROJECTS: Project[] = [
  { id: 'p1', name: 'Residencial Bela Vista', responsavel: 'Arq. Pedro Antunes', secundario: 'Arq. Cláudia Silva', status: 'Ativo', code: '2026-001' },
  { id: 'p2', name: 'Terminal Logístico Norte', responsavel: 'Arq. Sofia Rocha', secundario: 'Arq. Pedro Antunes', status: 'Ativo', code: '2026-002' },
  { id: 'p3', name: 'Reabilitação Palácio Chiado', responsavel: 'Arq. Pedro Antunes', secundario: 'Arq. Sofia Rocha', status: 'Ativo', code: '2026-003' },
  { id: 'p4', name: 'Torre Oriente Office', responsavel: 'Arq. Cláudia Silva', secundario: 'Arq. Ricardo Pereira', status: 'Ativo', code: '2027-001' },
  { id: 'p5', name: 'Parque Escolar Sintra', responsavel: 'Arq. Sofia Rocha', secundario: 'Arq. Cláudia Silva', status: 'Pendente', code: '2027-002' }
];

export const INITIAL_TASKS: Task[] = [
  // Week 5 (2026-07-13 to 2026-07-19)
  { id: 't1', archId: 'pedro', date: '2026-07-13', title: 'Revisão de Estrutura Metálica', project: 'Terminal Logístico Norte', status: 'Pendente', priority: 'Alta' },
  { id: 't2', archId: 'pedro', date: '2026-07-14', title: 'Ajuste de Caleiras e Cobertura', project: 'Terminal Logístico Norte', status: 'Realizado', priority: 'Média' },
  { id: 't3', archId: 'claudia', date: '2026-07-13', title: 'Desenho de Pormenores de Escadas', project: 'Residencial Bela Vista', status: 'Realizado', priority: 'Média' },
  { id: 't4', archId: 'claudia', date: '2026-07-15', title: 'Corte Geral Bloco B', project: 'Residencial Bela Vista', status: 'Pendente', priority: 'Alta' },
  { id: 't5', archId: 'sofia', date: '2026-07-13', title: 'Sondagem de Cantarias e Vãos', project: 'Reabilitação Palácio Chiado', status: 'Realizado', priority: 'Alta' },
  { id: 't6', archId: 'sofia', date: '2026-07-16', title: 'Reunião de Obra com Fiscalização', project: 'Reabilitação Palácio Chiado', status: 'Pendente', priority: 'Alta' },
  
  // Miguel
  { id: 't_mig1', archId: 'miguel', date: '2026-07-13', title: 'Estudo de Layout de Estacionamento', project: 'Terminal Logístico Norte', status: 'Realizado', priority: 'Média' },
  { id: 't_mig2', archId: 'miguel', date: '2026-07-15', title: 'Dimensionamento de Vagas Especiais', project: 'Terminal Logístico Norte', status: 'Pendente', priority: 'Baixa' },

  // Ana
  { id: 't_ana1', archId: 'ana', date: '2026-07-14', title: 'Modelação de Layout Interno Aptos', project: 'Residencial Bela Vista', status: 'Realizado', priority: 'Alta' },
  { id: 't_ana2', archId: 'ana', date: '2026-07-17', title: 'Revisão de Esquadrias e Vãos', project: 'Residencial Bela Vista', status: 'Pendente', priority: 'Média' },

  // João
  { id: 't_jo1', archId: 'joao', date: '2026-07-13', title: 'Detalhamento de Fachada Glazing', project: 'Torre Oriente Office', status: 'Pendente', priority: 'Alta' },
  { id: 't_jo2', archId: 'joao', date: '2026-07-16', title: 'Modelação dos Perfis de Alumínio', project: 'Torre Oriente Office', status: 'Realizado', priority: 'Média' },

  // Maria
  { id: 't_ma1', archId: 'maria', date: '2026-07-14', title: 'Compatibilização de Infraestrutura', project: 'Parque Escolar Sintra', status: 'Realizado', priority: 'Alta' },
  { id: 't_ma2', archId: 'maria', date: '2026-07-15', title: 'Ajuste de Alturas de Forro Gesso', project: 'Parque Escolar Sintra', status: 'Pendente', priority: 'Média' },

  // Ricardo
  { id: 't_ri1', archId: 'ricardo', date: '2026-07-15', title: 'Memorial Descritivo de Acabamentos', project: 'Torre Oriente Office', status: 'Pendente', priority: 'Baixa' },

  // Previous Week 4 (2026-07-06 to 2026-07-12)
  { id: 't7', archId: 'pedro', date: '2026-07-07', title: 'Modelação BIM Lajes de Fundação', project: 'Residencial Bela Vista', status: 'Realizado', priority: 'Alta' },
  { id: 't8', archId: 'claudia', date: '2026-07-08', title: 'Definição de Cores de Fachada', project: 'Torre Oriente Office', status: 'Realizado', priority: 'Baixa' },
  { id: 't_prev_ana', archId: 'ana', date: '2026-07-09', title: 'Levantamento Métrico no Local', project: 'Residencial Bela Vista', status: 'Realizado', priority: 'Alta' }
];

export const INITIAL_COMPLEMENTARES: Complementar[] = [
  { id: 'c1', title: 'Estudo de Estabilidade Fundações', discipline: 'Estruturas', file: 'EST-FUND-REV03.pdf', updated: '2026-07-14', note: 'Verificar armaduras pilares de canto.', status: 'Aprovado', size: '4.2 MB', author: 'Eng. Ricardo Gomes' },
  { id: 'c2', title: 'Rede de Drenagem de Águas Pluviais', discipline: 'Hidráulica', file: 'HID-PLU-REV02.dwg', updated: '2026-07-13', note: 'Ajustado declive da tubagem principal.', status: 'Sob Revisão', size: '8.7 MB', author: 'Eng. Ana Martins' },
  { id: 'c3', title: 'Projeto de Segurança Contra Incêndios', discipline: 'Incêndio', file: 'INC-MED-REV01.pdf', updated: '2026-07-11', note: 'Vias de evacuação dimensionadas para 200 pax.', status: 'Pendente', size: '12.1 MB', author: 'Eng. Carlos Costa' },
  { id: 'c4', title: 'Esquema de Quadros Elétricos Gerais', discipline: 'Especialidades', file: 'ELET-QE-REV01.dwg', updated: '2026-07-05', note: 'Conforme nova potência pedida.', status: 'Aprovado', size: '3.1 MB', author: 'Eng. José Lemos' }
];

export const INITIAL_TABLETS: Tablet[] = [
  { id: 'TAB-01', tecnico: 'Eng. Nuno Marques', project: 'Residencial Bela Vista', status: 'Em Obra', lastSync: '2026-07-13 09:15' },
  { id: 'TAB-02', tecnico: 'Arq. Sofia Rocha', project: 'Reabilitação Palácio Chiado', status: 'Em Obra', lastSync: '2026-07-13 11:30' },
  { id: 'TAB-03', tecnico: 'Eng. Rui Santos', project: 'Terminal Logístico Norte', status: 'Em Obra', lastSync: '2026-07-12 16:45' },
  { id: 'TAB-04', tecnico: 'Armazém Central', project: 'Nenhum', status: 'Em Stock', lastSync: '2026-07-01 10:00' },
  { id: 'TAB-05', tecnico: 'Suporte TI', project: 'Nenhum', status: 'Manutenção', lastSync: '2026-07-10 14:00' }
];

export const INITIAL_PLACAS: Placa[] = [
  { id: 'PLC-001', client: 'Bela Vista S.A.', local: 'Rua das Flores 12, Sintra', carrier: 'DHL Express', status: 'Instalada', updated: '2026-07-14' },
  { id: 'PLC-002', client: 'LogisNorte Transitários', local: 'Zona Industrial Lote 9, Maia', carrier: 'Fpoles Frota', status: 'Em Transporte', updated: '2026-07-13' },
  { id: 'PLC-003', client: 'Município de Lisboa', local: 'Palácio Chiado, Lisboa', carrier: 'CTT Expresso', status: 'Pendente', updated: '2026-07-11' }
];

export const INITIAL_CLASHES: Clash[] = [
  { id: 'clash-1', elementA: 'Conduta Ventilação HVAC', elementB: 'Viga de Betão Armada V204', severity: 'Alta', floor: 'Piso 1', coords: [1.0, 0, 0.8], status: 'Ativo' },
  { id: 'clash-2', elementA: 'Tubo Esgoto Sanitário Ø110', elementB: 'Pilar Metálico PM08', severity: 'Alta', floor: 'Piso 0', coords: [-0.8, -0.8, -0.2], status: 'Ativo' },
  { id: 'clash-3', elementA: 'Calha Apoio Cabos Elétricos', elementB: 'Tubo Águas Pluviais', severity: 'Média', floor: 'Piso 2', coords: [0.5, 0.9, 1.4], status: 'Ativo' },
  { id: 'clash-4', elementA: 'Prumada Gás Natural', elementB: 'Fundação Sapata S02', severity: 'Baixa', floor: 'Piso -1', coords: [1.2, -1.1, -0.9], status: 'Resolvido' }
];

export const INITIAL_CREDENTIALS: PrefeituraCredential[] = [
  { id: 'cred-1', prefeitura: 'Câmara Municipal de Lisboa', user: 'fpoles_licenciamento_lx', pass: 'Lx_Arch_Pass2026!', type: 'prefeitura' },
  { id: 'cred-2', prefeitura: 'Câmara Municipal de Sintra', user: 'fpoles_sintra_urb', pass: 'SintraUrbanS789*', type: 'prefeitura' },
  { id: 'cred-3', prefeitura: 'Câmara Municipal do Porto', user: 'fpoles_gestao_porto', pass: 'PortoFpolesSecure44', type: 'prefeitura' },
  { id: 'cred-4', prefeitura: 'Câmara Municipal de Cascais', user: 'fpoles_cascais_projetos', pass: 'CascaisBuild77!', type: 'prefeitura' },
  { id: 'cred-email-1', prefeitura: 'Google Workspace (Geral)', user: 'contato@fpoles.com.br', pass: 'FpGsuiteSecure#2026', type: 'email' },
  { id: 'cred-email-2', prefeitura: 'Outlook (Diretoria)', user: 'pedro.antunes@fpoles.com.br', pass: 'PedAntunesOut2026!', type: 'email' },
  { id: 'cred-email-3', prefeitura: 'HostGator (Webmail)', user: 'financeiro@fpoles.com.br', pass: 'FinFpolesGator99*', type: 'email' }
];

export const INITIAL_LICENSES: SoftwareLicense[] = [
  {
    id: 'lic-1',
    usuario: 'Gustavo',
    hardware: 'Lenovo IdeaPad',
    ipProduto: '00342-43345-17315-AAOEM',
    ipDispositivo: 'F254A8C5-F9D1-4420-AABF-F58F9B97D8D8',
    configHardware: 'Processador 11th Geração i5-11300H 3.10GHz / 16GB RAM / Windows 11',
    software: 'Revit',
    revitStatus: '2021 e 2023',
    revitLogin: 'gustavo@fpoles.com.br',
    revitId: 'gustavo.fpoles',
    revitSenha: 'SecPass11300',
    revitData: '30 de setembro de 2026'
  },
  {
    id: 'lic-2',
    usuario: 'Ana',
    hardware: 'Acer Nitro',
    ipProduto: '00342-43472-94912-AAOEM',
    ipDispositivo: '032F34DD-D02D-4504-A8A8-DFC1C2DA6175',
    configHardware: 'Processador 13th Geração i5-13420H 2.10GHz / 16GB RAM / Windows 11',
    software: 'Revit',
    revitStatus: '2023',
    revitLogin: 'ana@fpoles.com.br',
    revitId: 'ana.fpoles',
    revitSenha: 'AcerN7892',
    revitData: '10 de setembro de 2026'
  },
  {
    id: 'lic-3',
    usuario: 'Camila',
    hardware: 'Acer Nitro',
    ipProduto: '00342-43191-93775-AAOEM',
    ipDispositivo: '58183C27-C089-4504-B54C-5968D4EE2091',
    configHardware: 'Processador 13th Geração i5-13420H 2.10GHz / 16GB RAM / Windows 11',
    software: 'SketchUp Pro',
    revitStatus: '2023',
    revitLogin: 'camila@fpoles.com.br',
    revitId: 'camila.fpoles',
    revitSenha: 'CamiAcer991',
    revitData: '30 de setembro de 2026'
  },
  {
    id: 'lic-4',
    usuario: 'Bárbara',
    hardware: 'Lenovo IdeaPad',
    ipProduto: '00342-43365-23704-AAOEM',
    ipDispositivo: '859235D5-FE97-4DC5-BC69-B49D823908DD',
    configHardware: 'Processador 11th Geração i5-11300H 3.10GHz / 16GB RAM / Windows 11',
    software: 'AutoCAD',
    revitStatus: '2023',
    revitLogin: 'barbara@fpoles.com.br',
    revitId: 'barbara.fpoles',
    revitSenha: 'BarbPass237',
    revitData: '30 de setembro de 2026'
  },
  {
    id: 'lic-5',
    usuario: 'Fabinho',
    hardware: 'Alienware',
    ipProduto: '?',
    ipDispositivo: '?',
    configHardware: '?',
    software: 'Lumion',
    revitStatus: '-',
    revitLogin: '-',
    revitId: '-',
    revitSenha: '-',
    revitData: '-'
  },
  {
    id: 'lic-6',
    usuario: 'José',
    hardware: 'PC Desktop',
    ipProduto: '?',
    ipDispositivo: '?',
    configHardware: '?',
    software: 'Revit',
    revitStatus: 'Sem Licença',
    revitLogin: '-',
    revitId: '-',
    revitSenha: '-',
    revitData: '-'
  },
  {
    id: 'lic-7',
    usuario: '-',
    hardware: 'Sony Vaio',
    ipProduto: '00327-30032-72539-AAOEM',
    ipDispositivo: 'DF222C35-3780-48C6-BF79-B127D03857F9',
    configHardware: 'Processador 7th Geração i5-7200H 2.50GHz / 8GB RAM',
    software: 'AutoCAD',
    revitStatus: 'Sem Licença',
    revitLogin: '-',
    revitId: '-',
    revitSenha: '-',
    revitData: '-'
  },
  {
    id: 'lic-8',
    usuario: 'Érika',
    hardware: 'MacBook',
    ipProduto: 'IP: 48:d7:05:cf:a8:c9',
    ipDispositivo: 'IP: 48:d7:05:cf:a8:c9',
    configHardware: '?',
    software: 'Archicad',
    revitStatus: 'Sem Licença',
    revitLogin: '-',
    revitId: '-',
    revitSenha: '-',
    revitData: '-'
  },
  {
    id: 'lic-9',
    usuario: 'Vanessa',
    hardware: 'Lenovo',
    ipProduto: '00342-43566-18900-AAOEM',
    ipDispositivo: 'CB3E1555-2DE4-4D2F-BC39-1CD64216D673',
    configHardware: '12th Gen Intel(R) Core(TM) i7-12650HX (2.00 GHz)',
    software: 'Revit',
    revitStatus: '2023',
    revitLogin: 'vanessa@fpoles.com.br',
    revitId: 'vanessa.fpoles',
    revitSenha: 'VanePass189',
    revitData: '10 de setembro de 2026'
  },
  {
    id: 'lic-10',
    usuario: 'Ellen',
    hardware: 'PC Desktop',
    ipProduto: '?',
    ipDispositivo: '?',
    configHardware: '?',
    software: 'AutoCAD',
    revitStatus: 'Sem Licença',
    revitLogin: '-',
    revitId: '-',
    revitSenha: '-',
    revitData: '-'
  },
  {
    id: 'lic-11',
    usuario: 'Matheus',
    hardware: 'PC Desktop',
    ipProduto: '00331-20300-00000-AA365',
    ipDispositivo: '9F5F0041-D7BA-44B6-A550-CDE3ADA25895',
    configHardware: 'Processador 2th Geração i5-2400H 2.50GHz / 16GB RAM',
    software: 'TQS',
    revitStatus: 'Sem Licença',
    revitLogin: '-',
    revitId: '-',
    revitSenha: '-',
    revitData: '-'
  },
  {
    id: 'lic-12',
    usuario: 'Tiago',
    hardware: 'MacBook',
    ipProduto: '?',
    ipDispositivo: '?',
    configHardware: '?',
    software: 'SketchUp Pro',
    revitStatus: 'Sem Licença',
    revitLogin: '-',
    revitId: '-',
    revitSenha: '-',
    revitData: '-'
  },
  {
    id: 'lic-13',
    usuario: 'Fernando',
    hardware: 'MacBook',
    ipProduto: '?',
    ipDispositivo: '?',
    configHardware: '?',
    software: 'Revit',
    revitStatus: 'Sem Licença',
    revitLogin: '-',
    revitId: '-',
    revitSenha: '-',
    revitData: '-'
  }
];

export const WEEKS: Week[] = [
  { id: 'w1', label: 'Semana 26 (22/06 a 28/06)', startDate: '2026-06-22', endDate: '2026-06-28', days: ['2026-06-22', '2026-06-23', '2026-06-24', '2026-06-25', '2026-06-26', '2026-06-27', '2026-06-28'] },
  { id: 'w2', label: 'Semana 27 (29/06 a 05/07)', startDate: '2026-06-29', endDate: '2026-07-05', days: ['2026-06-29', '2026-06-30', '2026-07-01', '2026-07-02', '2026-07-03', '2026-07-04', '2026-07-05'] },
  { id: 'w3', label: 'Semana 28 (06/07 a 12/07)', startDate: '2026-07-06', endDate: '2026-07-12', days: ['2026-07-06', '2026-07-07', '2026-07-08', '2026-07-09', '2026-07-10', '2026-07-11', '2026-07-12'] },
  { id: 'w4', label: 'Semana 29 (13/07 a 19/07) - HOJE', startDate: '2026-07-13', endDate: '2026-07-19', days: ['2026-07-13', '2026-07-14', '2026-07-15', '2026-07-16', '2026-07-17', '2026-07-18', '2026-07-19'] },
  { id: 'w5', label: 'Semana 30 (20/07 a 26/07)', startDate: '2026-07-20', endDate: '2026-07-26', days: ['2026-07-20', '2026-07-21', '2026-07-22', '2026-07-23', '2026-07-24', '2026-07-25', '2026-07-26'] },
  { id: 'w6', label: 'Semana 31 (27/07 a 02/08)', startDate: '2026-07-27', endDate: '2026-08-02', days: ['2026-07-27', '2026-07-28', '2026-07-29', '2026-07-30', '2026-07-31', '2026-08-01', '2026-08-02'] }
];

export const WEEK_HOJE_ID = 'w4';

export const PORTUGUESE_DAYS = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo'
];

export const INITIAL_BACKUP_RECORDS: BackupRecord[] = [
  // Semana 06/07/2026 (corresponds to 2026-w28 in our generateWeeksForYear)
  {
    id: 'b-1',
    year: 2026,
    weekId: '2026-w28',
    project: '2025_008_LaurenKlas',
    fase: '05_Executivo',
    progress: 'Em Desenvolvimento',
    status: 'Realizado',
    tecnico: 'ANA',
    desc: 'REVIT EXECUTIVO',
    link: 'https://drive.google.com/drive/folders/1IpvBMt9-LGbfn3cBiFDJZSn_5om9ep3'
  },
  {
    id: 'b-2',
    year: 2026,
    weekId: '2026-w28',
    project: '2025_008_LaurenKlas',
    fase: '06_Detalhamentos',
    progress: 'Em Desenvolvimento',
    status: 'Realizado',
    tecnico: 'ANA',
    desc: 'REVIT EXECUTIVO INTERIORES',
    link: 'https://drive.google.com/drive/folders/10Py-Vrr7_JjPDaOFpHE0XyL_95yzexnh'
  },
  {
    id: 'b-3',
    year: 2026,
    weekId: '2026-w28',
    project: '2026-008_Arza2_LagoAzul2',
    fase: '01_Levantamentos',
    progress: 'Em Desenvolvimento',
    status: 'Realizado',
    tecnico: 'ÉRIKA',
    desc: 'MATRÍCULA ATUALIZADA',
    link: ''
  },
  {
    id: 'b-4',
    year: 2026,
    weekId: '2026-w28',
    project: '2026-008_Arza2_LagoAzul2',
    fase: '04_Prefeitura',
    progress: 'Em Desenvolvimento',
    status: 'Realizado',
    tecnico: 'ÉRIKA',
    desc: 'REVIT APROVAÇÃO',
    link: ''
  },
  {
    id: 'b-5',
    year: 2026,
    weekId: '2026-w28',
    project: 'Template Padrão Revit',
    fase: 'N/D',
    progress: 'Em Desenvolvimento',
    status: 'Realizado',
    tecnico: 'GUSTAVO',
    desc: 'TEMPLATE PADRÃO REVIT',
    link: ''
  },
  {
    id: 'b-6',
    year: 2026,
    weekId: '2026-w28',
    project: '2025-020_ResidenciaMoron_LagoAzul2',
    fase: '04_Prefeitura',
    progress: 'Em Desenvolvimento',
    status: 'Realizado',
    tecnico: 'GUSTAVO',
    desc: 'REVIT (APROVAÇÃO)',
    link: ''
  },
  {
    id: 'b-7',
    year: 2026,
    weekId: '2026-w28',
    project: '2025-020_ResidenciaMoron_LagoAzul2',
    fase: '04_Prefeitura',
    progress: 'Em Desenvolvimento',
    status: 'Realizado',
    tecnico: 'GUSTAVO',
    desc: 'PDFs Pranchas Aprovação',
    link: ''
  },
  {
    id: 'b-8',
    year: 2026,
    weekId: '2026-w28',
    project: '2025-020_ResidenciaMoron_LagoAzul2',
    fase: '04_Prefeitura',
    progress: 'Em Desenvolvimento',
    status: 'Realizado',
    tecnico: 'GUSTAVO',
    desc: 'PDFs Anexos Aprovação',
    link: ''
  },
  {
    id: 'b-9',
    year: 2026,
    weekId: '2026-w28',
    project: '2023-020_ResidenciaRuas_Alphaville2',
    fase: '05_Executivo',
    progress: 'Em Desenvolvimento',
    status: 'Não Realizado',
    tecnico: 'GUSTAVO',
    desc: 'REVIT EXECUTIVO + PDF EXECUTIVO',
    link: ''
  },
  // Semana 13/07/2026 (corresponds to 2026-w29 in our generateWeeksForYear)
  {
    id: 'b-10',
    year: 2026,
    weekId: '2026-w29',
    project: '2026-004_CondomínioHorizontedaMata_AraçoiabadaSerra',
    fase: '05_Executivo',
    progress: 'Em Desenvolvimento',
    status: 'Não Realizado',
    tecnico: 'GUSTAVO',
    desc: 'REVIT EXECUTIVO',
    link: ''
  },
  {
    id: 'b-11',
    year: 2026,
    weekId: '2026-w29',
    project: '2023-020_ResidenciaRuas_Alphaville2',
    fase: '06_Detalhamentos',
    progress: 'Em Desenvolvimento',
    status: 'Não Realizado',
    tecnico: 'ANA',
    desc: 'REVIT EXECUTIVO INTERIORES',
    link: ''
  },
  {
    id: 'b-12',
    year: 2026,
    weekId: '2026-w29',
    project: '2025-020_ResidenciaMoron_LagoAzul2',
    fase: '04_Prefeitura',
    progress: 'Em Desenvolvimento',
    status: 'Realizado',
    tecnico: 'GUSTAVO',
    desc: 'REVIT (APROVAÇÃO)',
    link: ''
  },
  {
    id: 'b-13',
    year: 2026,
    weekId: '2026-w29',
    project: '2025-020_ResidenciaMoron_LagoAzul2',
    fase: '04_Prefeitura',
    progress: 'Em Desenvolvimento',
    status: 'Realizado',
    tecnico: 'GUSTAVO',
    desc: 'PDFs Pranchas Aprovação',
    link: ''
  }
];

export const INITIAL_REVIT_TEMPLATE_REQUIREMENTS: RevitTemplateRequirement[] = [
  {
    id: 'req-1',
    title: 'Adicionar nova família de caixilharia de alumínio com parâmetros de largura/altura dinâmicos',
    priority: 'Alta',
    architectId: 'ana',
    dateAdded: '2026-07-06',
    status: 'Pendente',
    notes: 'Necessário para detalhamento executivo uniforme.'
  },
  {
    id: 'req-2',
    title: 'Ajustar espessura das linhas nos View Templates de prefeitura (escala 1:100)',
    priority: 'Média',
    architectId: 'pedro',
    dateAdded: '2026-07-08',
    status: 'Implementado',
    notes: 'As linhas de parede estavam demasiado grossas na impressão física.'
  },
  {
    id: 'req-3',
    title: 'Criar tabelas automáticas para quantitativos de áreas comuns e privadas conforme NBR 12721',
    priority: 'Alta',
    architectId: 'claudia',
    dateAdded: '2026-07-10',
    status: 'Em Estudo',
    notes: 'Agilizará a fase de estudo prévio dos grandes residenciais.'
  },
  {
    id: 'req-4',
    title: 'Padronizar anotações de cotas altimétricas nos cortes longitudinais',
    priority: 'Baixa',
    architectId: 'sofia',
    dateAdded: '2026-07-12',
    status: 'Pendente',
    notes: 'Substituir o bloco genérico pelo símbolo predefinido da Fpoles.'
  }
];

export const INITIAL_ENGINEERING_PROJECTS: EngineeringProject[] = [
  {
    id: '1',
    numero: '2026-010',
    nome: 'Edifício Horizon',
    arquiteto: 'Clara Mendes',
    disciplinas: {
      estrutural: {
        engenheiro: 'Roberto Silva',
        status: 'Em andamento',
        historico: [
          { versao: 1, recebimento: '2026-06-01', limite: '2026-06-22', devolucao: '2026-06-18', previsao: '2026-06-25' },
          { versao: 2, recebimento: '2026-06-26', limite: '2026-07-03', devolucao: null, previsao: null }
        ]
      },
      hidraulica: {
        engenheiro: 'Mariana Lima',
        status: 'Em andamento',
        historico: [
          { versao: 1, recebimento: '2026-06-10', limite: '2026-07-01', devolucao: '2026-06-29', previsao: '2026-07-08' }
        ]
      },
      eletrica: {
        engenheiro: 'Luiz Santos',
        status: 'Compatibilizado',
        historico: [
          { versao: 1, recebimento: '2026-05-15', limite: '2026-06-05', devolucao: '2026-06-01', previsao: null }
        ]
      },
      automacao: {
        engenheiro: '',
        status: 'Não se aplica',
        historico: []
      },
      ar_condicionado: {
        engenheiro: 'Ana Julia',
        status: 'Em andamento',
        historico: [
          { versao: 1, recebimento: '2026-07-01', limite: '2026-07-22', devolucao: null, previsao: null }
        ]
      }
    }
  },
  {
    id: '2',
    numero: '2026-015',
    nome: 'Residencial Bella Vista',
    arquiteto: 'Bruno Costa',
    disciplinas: {
      estrutural: {
        engenheiro: 'Roberto Silva',
        status: 'Em andamento',
        historico: [
          { versao: 1, recebimento: '2026-06-15', limite: '2026-07-06', devolucao: null, previsao: null }
        ]
      },
      hidraulica: {
        engenheiro: 'Mariana Lima',
        status: 'Em andamento',
        historico: [
          { versao: 1, recebimento: '2026-06-01', limite: '2026-06-22', devolucao: '2026-06-20', previsao: '2026-06-28' },
          { versao: 2, recebimento: '2026-06-29', limite: '2026-07-06', devolucao: '2026-07-03', previsao: '2026-07-15' }
        ]
      },
      eletrica: {
        engenheiro: 'Luiz Santos',
        status: 'Em andamento',
        historico: []
      },
      automacao: {
        engenheiro: 'Lucas Neves',
        status: 'Em andamento',
        historico: []
      },
      ar_condicionado: {
        engenheiro: 'Ana Julia',
        status: 'Compatibilizado',
        historico: [
          { versao: 1, recebimento: '2026-05-10', limite: '2026-05-31', devolucao: '2026-05-25', previsao: null }
        ]
      }
    }
  }
];


