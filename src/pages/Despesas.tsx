import React, { useState, useEffect } from 'react';
import { Despesa } from '../types';
import { getDespesas } from '../utils/localStorage';
import DespesaForm from '../components/DespesaForm';
import DespesaList from '../components/DespesaList';

const Despesas: React.FC = () => {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  
  const carregarDespesas = () => {
    setDespesas(getDespesas());
  };
  
  useEffect(() => {
    carregarDespesas();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Controle de Despesas</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DespesaForm onSave={carregarDespesas} />
        </div>
        
        <div className="lg:col-span-2">
          <DespesaList 
            despesas={despesas} 
            onDelete={carregarDespesas} 
          />
        </div>
      </div>
    </div>
  );
};

export default Despesas;