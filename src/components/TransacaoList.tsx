import React from 'react';
import { Transacao } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface TransacaoListProps {
  transacoes: Transacao[];
}

const TransacaoList: React.FC<TransacaoListProps> = ({ transacoes }) => {
  const totalDepositos = transacoes
    .filter(t => t.tipo === 'deposito')
    .reduce((acc, t) => acc + t.valor, 0);
    
  const totalSaques = transacoes
    .filter(t => t.tipo === 'saque')
    .reduce((acc, t) => acc + t.valor, 0);
    
  const saldo = totalDepositos - totalSaques;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Histórico de Transações</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total de Depósitos</p>
          <p className="text-lg font-semibold">{formatCurrency(totalDepositos)}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Total de Saques</p>
          <p className="text-lg font-semibold">{formatCurrency(totalSaques)}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Saldo</p>
          <p className="text-lg font-semibold">{formatCurrency(saldo)}</p>
        </div>
      </div>
      
      {transacoes.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Tipo</th>
                <th className="py-3 px-6 text-left">Descrição</th>
                <th className="py-3 px-6 text-left">Data</th>
                <th className="py-3 px-6 text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {transacoes.map((transacao) => (
                <tr key={transacao.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left">
                    <div className="flex items-center">
                      {transacao.tipo === 'deposito' ? (
                        <ArrowUpCircle className="text-green-500 mr-2" size={18} />
                      ) : (
                        <ArrowDownCircle className="text-red-500 mr-2" size={18} />
                      )}
                      {transacao.tipo === 'deposito' ? 'Depósito' : 'Saque'}
                    </div>
                  </td>
                  <td className="py-3 px-6 text-left">{transacao.descricao}</td>
                  <td className="py-3 px-6 text-left">{formatDate(transacao.data)}</td>
                  <td className={`py-3 px-6 text-right ${
                    transacao.tipo === 'deposito' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(transacao.valor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">Nenhuma transação encontrada.</p>
        </div>
      )}
    </div>
  );
};

export default TransacaoList;