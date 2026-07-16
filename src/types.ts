export interface Architect {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  archId: string;
  date: string;
  title: string;
  project: string;
  status: 'Pendente' | 'Realizado';
  priority: 'Baixa' | 'Média' | 'Alta';
  isYellow?: boolean;
}

export interface Project {
  id: string;
  name: string;
  responsavel: string;
  secundario: string;
  status: string;
  code?: string;
  tabletStatus?: 'Não Necessita' | 'Planejado' | 'Encomendado' | 'Entregue';
  placaStatus?: 'Não Necessita' | 'Planejado' | 'Encomendado' | 'Entregue';
  tabletMonth?: string;
  placaMonth?: string;
}

export interface Complementar {
  id: string;
  title: string;
  discipline: 'Estruturas' | 'Hidráulica' | 'Especialidades' | 'Incêndio' | 'Electricidade';
  file: string;
  updated: string; // YYYY-MM-DD
  note: string;
  status: 'Aprovado' | 'Pendente' | 'Sob Revisão';
  size: string;
  author: string;
}

export interface Tablet {
  id: string;
  tecnico: string;
  project: string;
  status: 'Em Obra' | 'Em Stock' | 'Manutenção';
  lastSync: string;
}

export interface Placa {
  id: string;
  client: string;
  local: string;
  carrier: string;
  status: 'Instalada' | 'Em Transporte' | 'Pendente';
  updated: string;
}

export interface Clash {
  id: string;
  elementA: string;
  elementB: string;
  severity: 'Alta' | 'Média' | 'Baixa';
  floor: string;
  coords: [number, number, number]; // 3D coordinates
  status: 'Ativo' | 'Resolvido';
}

export interface PrefeituraCredential {
  id: string;
  prefeitura: string;
  user: string;
  pass: string;
  type?: 'prefeitura' | 'email';
}

export interface SoftwareLicense {
  id: string;
  usuario: string;
  hardware: string;
  ipProduto: string;
  ipDispositivo: string;
  configHardware: string;
  software: string; // e.g. 'Revit', 'AutoCAD', 'SketchUp', etc.
  revitStatus: string; // e.g. '2021 e 2023', '2023', 'Sem Licença', '-'
  revitLogin: string;
  revitId: string;
  revitSenha?: string;
  revitData?: string;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

export interface Week {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  days: string[];
}

export interface BackupRecord {
  id: string;
  year: number;
  weekId: string;
  project: string;
  fase: string;
  progress: string;
  status: 'Realizado' | 'Não Realizado';
  tecnico: string;
  desc: string;
  link?: string;
}

export interface RevitTemplateRequirement {
  id: string;
  title: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  architectId: string;
  dateAdded: string; // YYYY-MM-DD
  status: 'Pendente' | 'Implementado' | 'Em Estudo';
  notes: string;
}

export interface DisciplineHistory {
  versao: number;
  recebimento: string;
  limite: string;
  devolucao: string | null;
  previsao: string | null;
}

export interface EngineeringDiscipline {
  engenheiro: string;
  status: 'Em andamento' | 'Compatibilizado' | 'Não se aplica';
  arqEnviado?: boolean;
  reuniaoApresentacao?: boolean;
  historico: DisciplineHistory[];
}

export interface EngineeringProject {
  id: string;
  numero: string;
  nome: string;
  arquiteto: string;
  disciplinas: {
    estrutural: EngineeringDiscipline;
    hidraulica: EngineeringDiscipline;
    eletrica: EngineeringDiscipline;
    automacao: EngineeringDiscipline;
    ar_condicionado: EngineeringDiscipline;
    [key: string]: EngineeringDiscipline; // Allow indexing
  };
}

export interface PartnerProject {
  projectName: string;
  year: number;
  role: string;
  status: string;
}

export interface Partner {
  id: string;
  name: string;
  type: string; // e.g. 'Projetista Complementar', 'Fornecedor', 'Parceiro', etc.
  recommendationLevel: 'Altamente Recomendado' | 'Recomendado' | 'Regular' | 'Não Recomendado' | string;
  recommendationScore: number;
  projectsCount: number;
  notes: string;
  projectsHistory: PartnerProject[];
  contactEmail?: string;
  contactPhone?: string;
}
