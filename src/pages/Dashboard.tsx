import React, { useEffect, useState } from 'react';
import { Despesa, Investimento, Divida, Salario } from '../types';
import { getDespesas, getInvestimentos, getDividas, getSalario, saveSalario } from '../utils/localStorage';
import { formatCurrency } from '../utils/formatters';
import { BarChart, PieChart, Wallet, CreditCard, PiggyBank, TrendingUp, TrendingDown, DollarSign, Banknote } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [investimentos, setInvestimentos] = useState<Investimento[]>([]);
  const [dividas, setDividas] = useState<Divida[]>([]);
  const [salario, setSalario] = useState<Salario>({ valor: 0 });
  const [editandoSalario, setEditandoSalario] = useState(false);
  const [novoSalario, setNovoSalario] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    setDespesas(getDespesas());
    setInvestimentos(getInvestimentos());
    setDividas(getDividas());
    setSalario(getSalario());
  }, []);
  
  const totalDespesas = despesas.reduce((acc, d) => acc + d.valor, 0);
  const totalInvestimentos = investimentos.reduce((acc, i) => acc + i.valor, 0);
  const totalRendimentos = investimentos.reduce((acc, i) => acc + i.rendimento, 0);
  const totalDividas = dividas.reduce((acc, d) => acc + d.valorTotal, 0);
  const totalPago = dividas.reduce((acc, d) => acc + d.valorPago, 0);
  const saldoDevedor = totalDividas - totalPago;
  const saldoDisponivel = salario.valor - totalDespesas;
  
  // Agrupar despesas por categoria
  const despesasPorCategoria: Record<string, number> = {};
  despesas.forEach(d => {
    if (despesasPorCategoria[d.categoria]) {
      despesasPorCategoria[d.categoria] += d.valor;
    } else {
      despesasPorCategoria[d.categoria] = d.valor;
    }
  });
  
  // Ordenar categorias por valor
  const categoriasOrdenadas = Object.entries(despesasPorCategoria)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const handleSalarioSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const valor = parseFloat(novoSalario.replace(',', '.'));
    if (isNaN(valor)) {
      setError('Por favor, insira um valor válido');
      return;
    }
    if (valor < 0) {
      setError('O salário não pode ser negativo');
      return;
    }

    const novoSalarioObj = { valor };
    saveSalario(novoSalarioObj);
    setSalario(novoSalarioObj);
    setEditandoSalario(false);
    setNovoSalario('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Gerenciamento de Salário */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Banknote className="h-5 w-5 text-green-500" />
            <h2 className="text-lg font-semibold">Seu Salário</h2>
          </div>
          <button
            onClick={() => {
              setEditandoSalario(!editandoSalario);
              setError('');
              setNovoSalario(salario.valor > 0 ? salario.valor.toString() : '');
            }}
            className="text-blue-500 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>{editandoSalario ? 'Cancelar' : 'Editar'}</span>
          </button>
        </div>

        {editandoSalario ? (
          <form onSubmit={handleSalarioSubmit} className="space-y-4">
            <div>
              <label htmlFor="salario" className="block text-sm font-medium text-gray-700">
                Salário Mensal
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">R$</span>
                </div>
                <input
                  type="text"
                  id="salario"
                  value={novoSalario}
                  onChange={(e) => setNovoSalario(e.target.value)}
                  placeholder="0,00"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Salvar
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
            <span className="text-gray-600">Salário Atual:</span>
            <span className="text-xl font-semibold text-green-600">{formatCurrency(salario.valor)}</span>
          </div>
        )}
      </div>
      
      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
          <div className="bg-red-100 p-3 rounded-full">
            <TrendingDown className="h-6 w-6 text-red-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total de Despesas</p>
            <p className="text-xl font-semibold">{formatCurrency(totalDespesas)}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
          <div className="bg-green-100 p-3 rounded-full">
            <PiggyBank className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Investido</p>
            <p className="text-xl font-semibold">{formatCurrency(totalInvestimentos)}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <TrendingUp className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Rendimentos Mensais</p>
            <p className="text-xl font-semibold">{formatCurrency(totalRendimentos)}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
          <div className="bg-yellow-100 p-3 rounded-full">
            <CreditCard className="h-6 w-6 text-yellow-500" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Saldo Devedor</p>
            <p className="text-xl font-semibold">{formatCurrency(saldoDevedor)}</p>
          </div>
        </div>
      </div>

      {/* Saldo Disponível */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center space-x-2 mb-4">
          <Wallet className="h-5 w-5 text-purple-500" />
          <h2 className="text-lg font-semibold">Saldo Disponível</h2>
        </div>
        <div className={`text-2xl font-bold ${saldoDisponivel >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(saldoDisponivel)}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Este é seu saldo após descontar todas as despesas do seu salário
        </p>
      </div>
      
      {/* Gráficos e análises */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Principais Categorias de Despesas</h2>
          </div>
          
          {categoriasOrdenadas.length > 0 ? (
            <div className="space-y-4">
              {categoriasOrdenadas.map(([categoria, valor]) => (
                <div key={categoria}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{categoria}</span>
                    <span className="text-sm font-medium">{formatCurrency(valor)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, (valor / totalDespesas) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">Nenhuma despesa registrada.</p>
          )}
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 mb-4">
            <PieChart className="h-5 w-5 text-purple-500" />
            <h2 className="text-lg font-semibold">Resumo Financeiro</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Wallet className="h-5 w-5 text-gray-500" />
                <span>Balanço de Despesas</span>
              </div>
              <span className={`font-medium ${totalDespesas > 0 ? 'text-red-500' : 'text-gray-500'}`}>
                {formatCurrency(totalDespesas)}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <PiggyBank className="h-5 w-5 text-gray-500" />
                <span>Investimentos</span>
              </div>
              <span className="font-medium text-green-500">{formatCurrency(totalInvestimentos)}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-gray-500" />
                <span>Rendimentos</span>
              </div>
              <span className="font-medium text-blue-500">{formatCurrency(totalRendimentos)}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-gray-500" />
                <span>Dívidas</span>
              </div>
              <span className="font-medium text-yellow-500">{formatCurrency(saldoDevedor)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dicas e informações */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Dicas Financeiras</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-600 mb-2">Controle de Gastos</h3>
            <p className="text-sm text-gray-600">
              Registre todas as suas despesas diárias para ter uma visão clara de para onde seu dinheiro está indo.
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-green-600 mb-2">Investimentos</h3>
            <p className="text-sm text-gray-600">
              Invista regularmente, mesmo que pequenas quantias. O poder dos juros compostos fará seu dinheiro crescer ao longo do tempo.
            </p>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-red-600 mb-2">Dívidas</h3>
            <p className="text-sm text-gray-600">
              Priorize o pagamento de dívidas com juros mais altos para economizar dinheiro a longo prazo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;