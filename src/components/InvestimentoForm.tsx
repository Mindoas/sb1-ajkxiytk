import React, { useState } from 'react';
import { Investimento, Transacao } from '../types';
import { saveInvestimento, saveTransacao } from '../utils/localStorage';
import { generateId } from '../utils/formatters';

interface InvestimentoFormProps {
  onSave: () => void;
}

const InvestimentoForm: React.FC<InvestimentoFormProps> = ({ onSave }) => {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [data, setData] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!descricao || !valor || !data) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    const valorNumerico = parseFloat(valor.replace(',', '.'));
    
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      setError('Valor inválido');
      return;
    }

    const novoInvestimento: Investimento = {
      id: generateId(),
      descricao,
      valor: valorNumerico,
      data,
      rendimento: valorNumerico * 0.1 // 10% de rendimento mensal
    };

    saveInvestimento(novoInvestimento);
    
    // Registrar a transação de depósito
    const transacao: Transacao = {
      id: generateId(),
      tipo: 'deposito',
      valor: valorNumerico,
      data,
      descricao: `Investimento inicial: ${descricao}`
    };
    
    saveTransacao(transacao);
    
    // Limpar formulário
    setDescricao('');
    setValor('');
    setData('');
    setError('');
    
    onSave();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Adicionar Novo Investimento</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="descricao">
            Descrição
          </label>
          <input
            id="descricao"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Ex: Tesouro Direto"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="valor">
            Valor (R$)
          </label>
          <input
            id="valor"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Ex: 1000,00"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="data">
            Data
          </label>
          <input
            id="data"
            type="date"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Adicionar Investimento
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvestimentoForm;