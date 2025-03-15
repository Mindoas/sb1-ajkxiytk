import React, { useState, useEffect } from 'react';
import { Investimento, Transacao } from '../types';
import { getInvestimentos, getTransacoes } from '../utils/localStorage';
import InvestimentoForm from '../components/InvestimentoForm';
import InvestimentoList from '../components/InvestimentoList';
import TransacaoForm from '../components/TransacaoForm';
import TransacaoList from '../components/TransacaoList';

const Investimentos: React.FC = () => {
  const [investimentos, setInvestimentos] = useState<Investimento[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  
  const carregarDados = () => {
    setInvestimentos(getInvestimentos());
    setTransacoes(getTransacoes());
  };
  
  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Gestão de Investimentos</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InvestimentoForm onSave={carregarDados} />
        <TransacaoForm onSave={carregarDados} />
      </div>
      
      <InvestimentoList 
        investimentos={investimentos} 
        onDelete={carregarDados} 
      />
      
      <TransacaoList transacoes={transacoes} />
    </div>
  );
};

export default Investimentos;