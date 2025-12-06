import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { getWeatherByCity, getWeatherByCoords } from '../services/weatherService';
import api, { parseApiError } from '../services/api';
import './DashboardPage.css';

const fmtBRL = (v) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(v || 0));

function mapConta(row) {
  const valorParcela = Number(row.valorparcela ?? 0);
  const juros = Number(row.valorjuros ?? 0);
  const desconto = Number(row.valordesconto ?? 0);
  const parcelas = Number(row.numeroparcela ?? 1);

  const total = (valorParcela + juros - desconto) * parcelas;

  return {
    total,
    datavencimento: row.datavencimento || null,
    dataquitacao: row.dataquitacao || null,
  };
}

function DashboardPage() {
  const [weather, setWeather] = useState(null);
  const [cidade, setCidade] = useState('');
  const [inputCidade, setInputCidade] = useState('');

  const [metricas, setMetricas] = useState({
    totalContasReceberAberto: 0,
    totalContasPagarAberto: 0,
    totalRecebido: 0,
    totalPago: 0,
    qtdPropriedades: 0,
    qtdClientes: 0,
    qtdFornecedores: 0,
    contasAtraso: 0,
  });

  // === CLIMA ===========================================================
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const data = await getWeatherByCoords(
              position.coords.latitude,
              position.coords.longitude,
            );
            setWeather(data);
            setCidade(data.name);
          } catch (error) {
            console.error('Erro ao obter localização automática:', error);
          }
        },
        (error) => {
          console.error('Erro ao obter geolocalização:', error);
        },
      );
    }
  }, []);

  const handleBuscarCidade = async () => {
    if (!inputCidade) return;
    try {
      const data = await getWeatherByCity(inputCidade);
      setWeather(data);
      setCidade(data.name);
      setInputCidade('');
    } catch (error) {
      alert('Cidade não encontrada.');
      console.error(error);
    }
  };

  // === MÉTRICAS DO BANCO ===============================================
  useEffect(() => {
    async function carregarMetricas() {
      try {
        const [
          resReceber,
          resPagar,
          resPropriedades,
          resClientes,
          resFornecedores,
        ] = await Promise.all([
          api.get('contas-receber/'),
          api.get('contas-pagar/'),
          api.get('propriedades/'),
          api.get('clientes/'),
          api.get('fornecedores/'),
        ]);

        const hoje = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

        const contasReceber = (resReceber.data || []).map(mapConta);
        const contasPagar = (resPagar.data || []).map(mapConta);

        const isAberta = (c) => !c.dataquitacao;
        const isPaga = (c) => !!c.dataquitacao;
        const isAtrasada = (c) => {
          if (!c.datavencimento || c.dataquitacao) return false;
          return c.datavencimento < hoje;
        };

        const totalContasReceberAberto = contasReceber
          .filter(isAberta)
          .reduce((acc, c) => acc + c.total, 0);

        const totalContasPagarAberto = contasPagar
          .filter(isAberta)
          .reduce((acc, c) => acc + c.total, 0);

        const totalRecebido = contasReceber
          .filter(isPaga)
          .reduce((acc, c) => acc + c.total, 0);

        const totalPago = contasPagar
          .filter(isPaga)
          .reduce((acc, c) => acc + c.total, 0);

        const contasAtraso =
          contasReceber.filter(isAtrasada).length +
          contasPagar.filter(isAtrasada).length;

        setMetricas({
          totalContasReceberAberto,
          totalContasPagarAberto,
          totalRecebido,
          totalPago,
          qtdPropriedades: Array.isArray(resPropriedades.data)
            ? resPropriedades.data.length
            : 0,
          qtdClientes: Array.isArray(resClientes.data)
            ? resClientes.data.length
            : 0,
          qtdFornecedores: Array.isArray(resFornecedores.data)
            ? resFornecedores.data.length
            : 0,
          contasAtraso,
        });
      } catch (err) {
        console.error('Erro ao carregar métricas do dashboard:', err);
        if (parseApiError) {
          console.error(parseApiError(err));
        }
      }
    }

    carregarMetricas();
  }, []);

  return (
    <div className="app">
      <Sidebar />
      <main className="dashboard-container">
        <div className="dashboard-inner">
          <div className="dashboard-header">
            <div>
              <h2>Dashboard</h2>
              <p className="dashboard-subtitle">
                Resumo geral do AgroLight até a data de hoje.
              </p>
            </div>

            <div className="dashboard-weather">
              <div className="dashboard-search-bar">
                <input
                  type="text"
                  placeholder="Buscar cidade..."
                  value={inputCidade}
                  onChange={(e) => setInputCidade(e.target.value)}
                />
                <button type="button" onClick={handleBuscarCidade}>
                  Buscar
                </button>
              </div>

              {weather && (
                <div className="dashboard-weather-box">
                  <h4>{cidade}</h4>
                  <div className="dashboard-weather-info">
                    <div>
                      <p>
                        <strong>Temp:</strong> {weather.main.temp}°C
                      </p>
                      <p>
                        <strong>Clima:</strong> {weather.weather[0].description}
                      </p>
                    </div>
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                      alt="Ícone do clima"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CARDS ======================================================= */}
          <div className="dashboard-cards-grid">
            <div className="dashboard-card dashboard-card--primary">
              <p>Contas a receber (em aberto)</p>
              <h3>{fmtBRL(metricas.totalContasReceberAberto)}</h3>
            </div>

            <div className="dashboard-card dashboard-card--primary">
              <p>Contas a pagar (em aberto)</p>
              <h3>{fmtBRL(metricas.totalContasPagarAberto)}</h3>
            </div>

            <div className="dashboard-card dashboard-card--secondary">
              <p>Total recebido</p>
              <h3>{fmtBRL(metricas.totalRecebido)}</h3>
            </div>

            <div className="dashboard-card dashboard-card--secondary">
              <p>Total pago</p>
              <h3>{fmtBRL(metricas.totalPago)}</h3>
            </div>

            <div className="dashboard-card dashboard-card--secondary dashboard-card-small">
              <p>Propriedades cadastradas</p>
              <h3>{metricas.qtdPropriedades}</h3>
            </div>

            <div className="dashboard-card dashboard-card--secondary dashboard-card-small">
              <p>Clientes cadastrados</p>
              <h3>{metricas.qtdClientes}</h3>
            </div>

            <div className="dashboard-card dashboard-card--secondary dashboard-card-small">
              <p>Fornecedores cadastrados</p>
              <h3>{metricas.qtdFornecedores}</h3>
            </div>

            <div className="dashboard-card dashboard-card--alert dashboard-card-small">
              <p>Contas em atraso</p>
              <h3>{metricas.contasAtraso}</h3>
              {metricas.contasAtraso > 0 && (
                <span className="dashboard-pill-alert">
                  atenção ao fluxo de caixa
                </span>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
