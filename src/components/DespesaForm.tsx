import React, { useState } from 'react';
import { Despesa } from '../types';
import { saveDespesa, getCategories, saveCategory } from '../utils/localStorage';
import { generateId } from '../utils/formatters';
import { Plus } from 'lucide-react';

interface DespesaFormProps {
  onSave: () => void;
}

const DespesaForm: React.FC<DespesaFormProps> = ({ onSave }) => {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [data, setData] = useState('');
  const [error, setError] = useState('');
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const categorias = getCategories();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!descricao || !valor || !categoria || !data) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    const valorNumerico = parseFloat(valor.replace(',', '.'));
    
    if (isNaN(valorNumerico) || valorNumerico <= 0) {
      setError('Valor inválido');
      return;
    }

    const novaDespesa: Despesa = {
      id: generateId(),
      descricao,
      valor: valorNumerico,
      categoria,
      data
    };

    saveDespesa(novaDespesa);
    
    // Limpar formulário
    setDescricao('');
    setValor('');
    setCategoria('');
    setData('');
    setError('');
    
    onSave();
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      setError('O nome da categoria é obrigatório');
      return;
    }

    if (categorias.includes(newCategory.trim())) {
      setError('Esta categoria já existe');
      return;
    }

    saveCategory(newCategory.trim());
    setCategoria(newCategory.trim());
    setNewCategory('');
    setShowNewCategory(false);
    setError('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Adicionar Nova Despesa</h2>
      
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
            placeholder="Ex: Conta de luz"
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
            placeholder="Ex: 120,50"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="categoria">
            Categoria
          </label>
          {!showNewCategory ? (
            <div className="flex gap-2">
              <select
                id="categoria"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="">Selecione uma categoria</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewCategory(true)}
                className="bg-green-500 hover:bg-green-600 text-white rounded px-3 py-2 flex items-center"
                title="Adicionar nova categoria"
              >
                <Plus size={20} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Nome da nova categoria"
              />
              <button
                type="button"
                onClick={handleAddCategory}
                className="bg-green-500 hover:bg-green-600 text-white rounded px-4 py-2"
              >
                Adicionar
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNewCategory(false);
                  setNewCategory('');
                  setError('');
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white rounded px-4 py-2"
              >
                Cancelar
              </button>
            </div>
          )}
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
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Adicionar Despesa
          </button>
        </div>
      </form>
    </div>
  );
};

export default DespesaForm;