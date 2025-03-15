import React, { useState } from 'react';
import { Divida } from '../types';
import { saveDivida } from '../utils/localStorage';
import { generateId } from '../utils/formatters';

interface DividaFormProps {
  onSave: () => void;
}

const DividaForm: React.FC<DividaFormProps> = ({ onSave }) => {
  const [descricao, setDescricao] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!descricao || !valorTotal || !dataVencimento) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    const valorNumerico = parseFloat(valorTotal.replace(',', '.'));
    
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      setError('Valor inválido');
      return;
    }

    const novaDivida: Divida = {
      id: generateId(),
      descricao,
      valorTotal: valorNumerico,
      valorPago: 0,
      dataCriacao: new Date().toISOString().split('T')[0],
      dataVencimento
    };

    saveDivida(novaDivida);
    
    // Limpar formulário
    setDescricao('');
    setValorTotal('');
    setDataVencimento('');
    setError('');
    
    onSave();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Adicionar Nova Dívida</h2>
      
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
            placeholder="Ex: Empréstimo bancário"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="valorTotal">
            Valor Total (R$)
          </label>
          <input
            id="valorTotal"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={valorTotal}
            onChange={(e) => setValorTotal(e.target.value)}
            placeholder="Ex: 5000,00"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dataVencimento">
            Data de Vencimento
          </label>
          <input
            id="dataVencimento"
            type="date"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={dataVencimento}
            onChange={(e) => setDataVencimento(e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Adicionar Dívida
          </button>
        </div>
      </form>
    </div>
  );
};

export default DividaForm;