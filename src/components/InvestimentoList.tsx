import React from 'react';
import { Investimento } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { deleteInvestimento } from '../utils/localStorage';
import { Trash2 } from 'lucide-react';

interface InvestimentoListProps {
  investimentos: Investimento[];
  onDelete: () => void;
}

const InvestimentoList: React.FC<InvestimentoListProps> = ({ investimentos, onDelete }) => {
  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este investimento?')) {
      deleteInvestimento(id);
      onDelete();
    }
  };

  const totalInvestido = investimentos.reduce((acc, inv) => acc + inv.valor, 0);
  const totalRendimento = investimentos.reduce((acc, inv) => acc + inv.rendimento, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Seus Investimentos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Investido</p>
          <p className="text-lg font-semibold">{formatCurrency(totalInvestido)}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Rendimento Mensal (10%)</p>
          <p className="text-lg font-semibold">{formatCurrency(totalRendimento)}</p>
        </div>
      </div>
      
      {investimentos.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Descrição</th>
                <th className="py-3 px-6 text-left">Data</th>
                <th className="py-3 px-6 text-right">Valor Investido</th>
                <th className="py-3 px-6 text-right">Rendimento Mensal</th>
                <th className="py-3 px-6 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {investimentos.map((investimento) => (
                <tr key={investimento.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left">{investimento.descricao}</td>
                  <td className="py-3 px-6 text-left">{formatDate(investimento.data)}</td>
                  <td className="py-3 px-6 text-right">{formatCurrency(investimento.valor)}</td>
                  <td className="py-3 px-6 text-right">{formatCurrency(investimento.rendimento)}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => handleDelete(investimento.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">Nenhum investimento encontrado.</p>
        </div>
      )}
    </div>
  );
};

export default InvestimentoList;