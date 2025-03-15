import React from 'react';
import { Pagamento } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface PagamentoListProps {
  pagamentos: Pagamento[];
  dividaDescricao: string;
}

const PagamentoList: React.FC<PagamentoListProps> = ({ pagamentos, dividaDescricao }) => {
  const totalPagamentos = pagamentos.reduce((acc, p) => acc + p.valor, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Histórico de Pagamentos</h2>
      <p className="mb-4">
        <span className="font-semibold">Dívida:</span> {dividaDescricao}
      </p>
      <p className="mb-4">
        <span className="font-semibold">Total pago:</span> {formatCurrency(totalPagamentos)}
      </p>
      
      {pagamentos.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Data</th>
                <th className="py-3 px-6 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {pagamentos.map((pagamento) => (
                <tr key={pagamento.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left">{formatDate(pagamento.data)}</td>
                  <td className="py-3 px-6 text-right">{formatCurrency(pagamento.valor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">Nenhum pagamento registrado.</p>
        </div>
      )}
    </div>
  );
};

export default PagamentoList;