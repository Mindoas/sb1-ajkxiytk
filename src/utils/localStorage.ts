import { Despesa, Investimento, Divida, Pagamento, Transacao, Salario } from '../types';

// Categories
export const getCategories = (): string[] => {
  const categories = localStorage.getItem('categories');
  return categories ? JSON.parse(categories) : [
    'Alimentação',
    'Moradia',
    'Transporte',
    'Saúde',
    'Educação',
    'Lazer',
    'Vestuário',
    'Utilidades',
    'Outros'
  ];
};

export const saveCategory = (category: string): void => {
  const categories = getCategories();
  if (!categories.includes(category)) {
    localStorage.setItem('categories', JSON.stringify([...categories, category]));
  }
};

// Despesas
export const getDespesas = (): Despesa[] => {
  const despesas = localStorage.getItem('despesas');
  return despesas ? JSON.parse(despesas) : [];
};

export const saveDespesa = (despesa: Despesa): void => {
  const despesas = getDespesas();
  localStorage.setItem('despesas', JSON.stringify([...despesas, despesa]));
};

export const updateDespesa = (despesa: Despesa): void => {
  const despesas = getDespesas();
  const updatedDespesas = despesas.map(d => d.id === despesa.id ? despesa : d);
  localStorage.setItem('despesas', JSON.stringify(updatedDespesas));
};

export const deleteDespesa = (id: string): void => {
  const despesas = getDespesas();
  const filteredDespesas = despesas.filter(d => d.id !== id);
  localStorage.setItem('despesas', JSON.stringify(filteredDespesas));
};

// Investimentos
export const getInvestimentos = (): Investimento[] => {
  const investimentos = localStorage.getItem('investimentos');
  return investimentos ? JSON.parse(investimentos) : [];
};

export const saveInvestimento = (investimento: Investimento): void => {
  const investimentos = getInvestimentos();
  localStorage.setItem('investimentos', JSON.stringify([...investimentos, investimento]));
};

export const updateInvestimento = (investimento: Investimento): void => {
  const investimentos = getInvestimentos();
  const updatedInvestimentos = investimentos.map(i => i.id === investimento.id ? investimento : i);
  localStorage.setItem('investimentos', JSON.stringify(updatedInvestimentos));
};

export const deleteInvestimento = (id: string): void => {
  const investimentos = getInvestimentos();
  const filteredInvestimentos = investimentos.filter(i => i.id !== id);
  localStorage.setItem('investimentos', JSON.stringify(filteredInvestimentos));
};

// Transações de Investimentos
export const getTransacoes = (): Transacao[] => {
  const transacoes = localStorage.getItem('transacoes');
  return transacoes ? JSON.parse(transacoes) : [];
};

export const saveTransacao = (transacao: Transacao): void => {
  const transacoes = getTransacoes();
  localStorage.setItem('transacoes', JSON.stringify([...transacoes, transacao]));
};

// Dívidas
export const getDividas = (): Divida[] => {
  const dividas = localStorage.getItem('dividas');
  return dividas ? JSON.parse(dividas) : [];
};

export const saveDivida = (divida: Divida): void => {
  const dividas = getDividas();
  localStorage.setItem('dividas', JSON.stringify([...dividas, divida]));
};

export const updateDivida = (divida: Divida): void => {
  const dividas = getDividas();
  const updatedDividas = dividas.map(d => d.id === divida.id ? divida : d);
  localStorage.setItem('dividas', JSON.stringify(updatedDividas));
};

export const deleteDivida = (id: string): void => {
  const dividas = getDividas();
  const filteredDividas = dividas.filter(d => d.id !== id);
  localStorage.setItem('dividas', JSON.stringify(filteredDividas));
};

// Pagamentos
export const getPagamentos = (): Pagamento[] => {
  const pagamentos = localStorage.getItem('pagamentos');
  return pagamentos ? JSON.parse(pagamentos) : [];
};

export const savePagamento = (pagamento: Pagamento): void => {
  const pagamentos = getPagamentos();
  localStorage.setItem('pagamentos', JSON.stringify([...pagamentos, pagamento]));
};

export const getPagamentosByDividaId = (dividaId: string): Pagamento[] => {
  const pagamentos = getPagamentos();
  return pagamentos.filter(p => p.dividaId === dividaId);
};

// Salário
export const getSalario = (): Salario => {
  const salario = localStorage.getItem('salario');
  return salario ? JSON.parse(salario) : { valor: 0 };
};

export const saveSalario = (salario: Salario): void => {
  localStorage.setItem('salario', JSON.stringify(salario));
};