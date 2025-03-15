import React, { useState, useEffect } from 'react';
import { Divida, Pagamento } from '../types';
import { getDividas, getPagamentos, getPagamentosByDividaId } from '../utils/localStorage';
import DividaForm from '../components/DividaForm';
import DividaList from '../components/DividaList';
import PagamentoForm from '../components/PagamentoForm';
import PagamentoList from '../components/PagamentoList';

const Dividas: React.FC = () => {
  const [dividas, setDividas] = useState<Divida[]>([]);
  const [dividaSelecionada, setDividaSelecionada] = useState<Divida | null>(null);
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [mostrarPagamentoForm, setMostrarPagamentoForm] = useState(false);
  const [mostrarHistoricoPagamentos, setMostrarHistoricoPagamentos] = useState(false);
  
  const carregarDividas = () => {
    setDividas(getDividas());
  };
  
  useEffect(() => {
    carregarDividas();
  }, []);

  const handlePagamento = (dividaId: string) => {
    const divida = dividas.find(d => d.id === dividaId);
    if (divida) {
      setDividaSelecionada(divida);
      setMostrarPagamentoForm(true);
      setMostrarHistoricoPagamentos(true);
      
      // Carregar pagamentos desta dívida
      setPagamentos(getPagamentosByDividaId(dividaId));
    }
  };

  const handleSavePagamento = () => {
    carregarDividas();
    
    if (dividaSelecionada) {
      setPagamentos(getPagamentosByDividaId(dividaSelecionada.id));
    }
    
    setMostrarPagamentoForm(false);
  };

  const handleCancelPagamento = () => {
    setMostrarPagamentoForm(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Controle de Dívidas</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DividaForm onSave={carregarDividas} />
        </div>
        
        <div className="lg:col-span-2">
          <DividaList 
            dividas={dividas} 
            onDelete={carregarDividas} 
            onPagamento={handlePagamento}
          />
        </div>
      </div>
      
      {mostrarPagamentoForm && dividaSelecionada && (
        <div className="mt-6">
          <PagamentoForm 
            divida={dividaSelecionada} 
            onSave={handleSavePagamento} 
            onCancel={handleCancelPagamento} 
          />
        </div>
      )}
      
      {mostrarHistoricoPagamentos && dividaSelecionada && pagamentos.length > 0 && (
        <div className="mt-6">
          <PagamentoList 
            pagamentos={pagamentos} 
            dividaDescricao={dividaSelecionada.descricao} 
          />
        </div>
      )}
    </div>
  );
};

export default Dividas;