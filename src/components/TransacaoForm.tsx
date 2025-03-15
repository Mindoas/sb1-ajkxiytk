import React, { useState } from 'react';
import { Transacao } from '../types';
import { saveTransacao } from '../utils/localStorage';
import { generateId } from '../utils/formatters';

interface TransacaoFormProps {
  onSave: () => void;
}

const TransacaoForm: React.FC<TransacaoFormProps> = ({ onSave }) => {
  const [tipo, setTipo] = useState<'deposito' | 'saque'>('deposito');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!valor || !descricao || !data) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    const valorNumerico = parseFloat(valor.replace(',', '.'));
    
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      setError('Valor inválido');
      return;
    }

    const novaTransacao: Transacao = {
      id: generateId(),
      tipo,
      valor: valorNumerico,
      descricao,
      data
    };

    saveTransacao(novaTransacao);
    
    // Limpar formulário
    setTipo('deposito');
    setValor('');
    setDescricao('');
    setData('');
    setError('');
    
    onSave();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Registrar Transação</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tipo de Transação
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="tipo"
                value="deposito"
                checked={tipo === 'deposito'}
                onChange={() => setTipo('deposito')}
              />
              <span className="ml-2">Depósito</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="tipo"
                value="saque"
                checked={tipo === 'saque'}
                onChange={() => setTipo('saque')}
              />
              <span className="ml-2">Saque</span>
            </label>
          </div>
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
            placeholder="Ex: 500,00"
          />
        </div>
        
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
            placeholder="Ex: Depósito adicional"
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
            className={`${
              tipo === 'deposito' ? 'bg-green-500 hover:bg-green-700' : 'bg-red-500 hover:bg-red-700'
            } text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
          >
            {tipo === 'deposito' ? 'Registrar Depósito' : 'Registrar Saque'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransacaoForm;