import React from 'react';
import { Divida } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { deleteDivida } from '../utils/localStorage';
import { Trash2 } from 'lucide-react';

interface DividaListProps {
  dividas: Divida[];
  onDelete: () => void;
  onPagamento: (dividaId: string) => void;
}

const DividaList: React.FC<DividaListProps> = ({ dividas, onDelete, onPagamento }) => {
  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta dívida?')) {
      deleteDivida(id);
      onDelete();
    }
  };

  const totalDividas = dividas.reduce((acc, divida) => acc + divida.valorTotal, 0);
  const totalPago = dividas.reduce((acc, divida) => acc + divida.valorPago, 0);
  const saldoDevedor = totalDividas - totalPago;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Suas Dívidas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total de Dívidas</p>
          <p className="text-lg font-semibold">{formatCurrency(totalDividas)}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total Pago</p>
          <p className="text-lg font-semibold">{formatCurrency(totalPago)}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Saldo Devedor</p>
          <p className="text-lg font-semibold">{formatCurrency(saldoDevedor)}</p>
        </div>
      </div>
      
      {dividas.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Descrição</th>
                <th className="py-3 px-6 text-left">Vencimento</th>
                <th className="py-3 px-6 text-right">Valor Total</th>
                <th className="py-3 px-6 text-right">Valor Pago</th>
                <th className="py-3 px-6 text-right">Saldo Devedor</th>
                <th className="py-3 px-6 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {dividas.map((divida) => (
                <tr key={divida.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left">{divida.descricao}</td>
                  <td className="py-3 px-6 text-left">{formatDate(divida.dataVencimento)}</td>
                  <td className="py-3 px-6 text-right">{formatCurrency(divida.valorTotal)}</td>
                  <td className="py-3 px-6 text-right">{formatCurrency(divida.valorPago)}</td>
                  <td className="py-3 px-6 text-right">{formatCurrency(divida.valorTotal - divida.valorPago)}</td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => onPagamento(divida.id)}
                        className="text-blue-500 hover:text-blue-700 bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded text-xs"
                        title="Registrar Pagamento"
                      >
                        Pagar
                      </button>
                      <button
                        onClick={() => handleDelete(divida.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Excluir"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">Nenhuma dívida encontrada.</p>
        </div>
      )}
    </div>
  );
};

export default DividaList;