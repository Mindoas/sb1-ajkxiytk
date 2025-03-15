import React, { useState } from 'react';
import { Divida, Pagamento } from '../types';
import { savePagamento, updateDivida } from '../utils/localStorage';
import { generateId } from '../utils/formatters';

interface PagamentoFormProps {
  divida: Divida;
  onSave: () => void;
  onCancel: () => void;
}

const PagamentoForm: React.FC<PagamentoFormProps> = ({ divida, onSave, onCancel }) => {
  const [valor, setValor] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const saldoDevedor = divida.valorTotal - divida.valorPago;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!valor || !data) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    const valorNumerico = parseFloat(valor.replace(',', '.'));
    
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      setError('Valor inválido');
      return;
    }

    if (valorNumerico > saldoDevedor) {
      setError(`O valor do pagamento não pode ser maior que o saldo devedor (${saldoDevedor.toFixed(2)})`);
      return;
    }

    // Registrar o pagamento
    const novoPagamento: Pagamento = {
      id: generateId(),
      dividaId: divida.id,
      valor: valorNumerico,
      data
    };

    savePagamento(novoPagamento);
    
    // Atualizar o valor pago da dívida
    const dividaAtualizada: Divida = {
      ...divida,
      valorPago: divida.valorPago + valorNumerico
    };
    
    updateDivida(dividaAtualizada);
    
    onSave();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Registrar Pagamento</h2>
      <p className="mb-4">
        <span className="font-semibold">Dívida:</span> {divida.descricao}
      </p>
      <p className="mb-4">
        <span className="font-semibold">Saldo devedor:</span> R$ {saldoDevedor.toFixed(2)}
      </p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="valor">
            Valor do Pagamento (R$)
          </label>
          <input
            id="valor"
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder={`Ex: ${saldoDevedor.toFixed(2)}`}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="data">
            Data do Pagamento
          </label>
          <input
            id="data"
            type="date"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>
        
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Registrar Pagamento
          </button>
        </div>
      </form>
    </div>
  );
};

export default PagamentoForm;