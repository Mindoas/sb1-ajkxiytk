export interface Despesa {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  data: string;
}

export interface Investimento {
  id: string;
  descricao: string;
  valor: number;
  data: string;
  rendimento: number;
}

export interface Transacao {
  id: string;
  tipo: 'deposito' | 'saque';
  valor: number;
  data: string;
  descricao: string;
}

export interface Divida {
  id: string;
  descricao: string;
  valorTotal: number;
  valorPago: number;
  dataCriacao: string;
  dataVencimento: string;
}

export interface Pagamento {
  id: string;
  dividaId: string;
  valor: number;
  data: string;
}

export interface Salario {
  valor: number;
}