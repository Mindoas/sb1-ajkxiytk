import React, { useState } from 'react';
import { Despesa } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';
import { deleteDespesa } from '../utils/localStorage';
import { Trash2 } from 'lucide-react';

interface DespesaListProps {
  despesas: Despesa[];
  onDelete: () => void;
}

const DespesaList: React.FC<DespesaListProps> = ({ despesas, onDelete }) => {
  const [filtroCategoria, setFiltroCategoria] = useState<string>('');
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>('');

  const categorias = [...new Set(despesas.map(d => d.categoria))];
  
  const filteredDespesas = despesas.filter(despesa => {
    const matchCategoria = filtroCategoria ? despesa.categoria === filtroCategoria : true;
    
    if (!filtroPeriodo) return matchCategoria;
    
    const hoje = new Date();
    const despesaDate = new Date(despesa.data);
    
    switch (filtroPeriodo) {
      case 'hoje':
        return matchCategoria && 
          despesaDate.getDate() === hoje.getDate() &&
          despesaDate.getMonth() === hoje.getMonth() &&
          despesaDate.getFullYear() === hoje.getFullYear();
      case 'semana':
        const umaSemanaAtras = new Date();
        umaSemanaAtras.setDate(hoje.getDate() - 7);
        return matchCategoria && despesaDate >= umaSemanaAtras;
      case 'mes':
        return matchCategoria && 
          despesaDate.getMonth() === hoje.getMonth() &&
          despesaDate.getFullYear() === hoje.getFullYear();
      case 'ano':
        return matchCategoria && despesaDate.getFullYear() === hoje.getFullYear();
      default:
        return matchCategoria;
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta despesa?')) {
      deleteDespesa(id);
      onDelete();
    }
  };

  const totalDespesas = filteredDespesas.reduce((acc, despesa) => acc + despesa.valor, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Lista de Despesas</h2>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="w-full md:w-1/2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Filtrar por Categoria
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            <option value="">Todas as Categorias</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        
        <div className="w-full md:w-1/2">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Filtrar por Período
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={filtroPeriodo}
            onChange={(e) => setFiltroPeriodo(e.target.value)}
          >
            <option value="">Todo o Período</option>
            <option value="hoje">Hoje</option>
            <option value="semana">Última Semana</option>
            <option value="mes">Este Mês</option>
            <option value="ano">Este Ano</option>
          </select>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <p className="text-lg font-semibold">
          Total: {formatCurrency(totalDespesas)}
        </p>
      </div>
      
      {filteredDespesas.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Descrição</th>
                <th className="py-3 px-6 text-left">Categoria</th>
                <th className="py-3 px-6 text-left">Data</th>
                <th className="py-3 px-6 text-right">Valor</th>
                <th className="py-3 px-6 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {filteredDespesas.map((despesa) => (
                <tr key={despesa.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left">{despesa.descricao}</td>
                  <td className="py-3 px-6 text-left">{despesa.categoria}</td>
                  <td className="py-3 px-6 text-left">{formatDate(despesa.data)}</td>
                  <td className="py-3 px-6 text-right">{formatCurrency(despesa.valor)}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => handleDelete(despesa.id)}
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
          <p className="text-gray-500">Nenhuma despesa encontrada.</p>
        </div>
      )}
    </div>
  );
};

export default DespesaList;