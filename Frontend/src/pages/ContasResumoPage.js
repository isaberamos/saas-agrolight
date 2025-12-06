import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import Sidebar from '../components/Sidebar';
import GraficoPedidosPeriodo from '../components/GraficoPedidosPeriodo';
import GraficoAnaliseResumo from '../components/GraficoAnaliseResumo';
import api, { parseApiError } from '../services/api';
import './ContasResumoPage.css';

const fmtBRL = (v) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    Number(v || 0),
  );

function mapApiContaToResumoRow(apiRow, tipo) {
  const valorParcela = Number(apiRow.valorparcela ?? 0);
  const juros = Number(apiRow.valorjuros ?? 0);
  const desconto = Number(apiRow.valordesconto ?? 0);
  const parcelas = Number(apiRow.numeroparcela ?? 1);

  const total = (valorParcela + juros - desconto) * parcelas;

  return {
    id: tipo === 'pagar' ? apiRow.idcontapagar : apiRow.idconta,
    descricao: apiRow.descricao,
    valorParcela,
    parcelas,
    total,
  };
}

function ContasResumoPage() {
  const [abaAtiva, setAbaAtiva] = useState('pagar'); // 'pagar' | 'receber'
  const [items, setItems] = useState([]);
  const [totalReceber, setTotalReceber] = useState(0); // total contas a receber

  // carrega contas da aba atual
  useEffect(() => {
    async function carregar() {
      try {
        const endpoint = abaAtiva === 'pagar' ? 'contas-pagar/' : 'contas-receber/';
        const res = await api.get(endpoint);
        const raw = Array.isArray(res.data) ? res.data : [];
        const mapped = raw.map((row) => mapApiContaToResumoRow(row, abaAtiva));
        setItems(mapped);
      } catch (err) {
        const msg = parseApiError ? parseApiError(err) : 'Erro ao carregar contas';
        toast.error(msg);
      }
    }

    carregar();
  }, [abaAtiva]);

  // calcula total de contas a receber (usado como "Total vendido")
  useEffect(() => {
    async function carregarTotalReceber() {
      try {
        const res = await api.get('contas-receber/');
        const raw = Array.isArray(res.data) ? res.data : [];
        const mapped = raw.map((row) => mapApiContaToResumoRow(row, 'receber'));
        const total = mapped.reduce(
          (acc, it) => acc + Number(it.total || 0),
          0,
        );
        setTotalReceber(total);
      } catch (err) {
        console.error('Erro ao calcular total vendido (contas a receber)', err);
      }
    }

    carregarTotalReceber();
  }, []);

  const totalAba = useMemo(
    () => (items || []).reduce((acc, it) => acc + Number(it.total || 0), 0),
    [items],
  );

  return (
    <div className="app">
      <Sidebar />
      <div className="contas-resumo-container">
        <div className="header-resumo">
          <h2>Contas</h2>
          <div className="aba-toggle">
            <button
              className={abaAtiva === 'pagar' ? 'ativo' : ''}
              onClick={() => setAbaAtiva('pagar')}
              type="button"
            >
              A pagar
            </button>
            <button
              className={abaAtiva === 'receber' ? 'ativo' : ''}
              onClick={() => setAbaAtiva('receber')}
              type="button"
            >
              A receber
            </button>
          </div>
        </div>

        <div className="cards-resumo">
          <div className="card">
            <p>Total vendido (contas a receber)</p>
            <h3>{fmtBRL(totalReceber)}</h3>
          </div>
          <div className="card">
            <p>Total {abaAtiva === 'pagar' ? 'a pagar' : 'a receber'}</p>
            <h3>{fmtBRL(totalAba)}</h3>
          </div>
        </div>

        <div className="graficos-resumo">
          <div className="grafico-card">
            <h3>Contas do período</h3>
            <GraficoPedidosPeriodo tipo={abaAtiva} />
          </div>

          <div className="grafico-card">
            <h3>Análise geral</h3>
            <GraficoAnaliseResumo tipo={abaAtiva} />
          </div>
        </div>

        <div className="listagem-resumo">
          <h3>
            Lista de contas {abaAtiva === 'pagar' ? 'a pagar' : 'a receber'}
          </h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Descrição</th>
                  <th>Valor parcela</th>
                  <th>Parcelas</th>
                  <th>Total (calculado)</th>
                </tr>
              </thead>
              <tbody>
                {(items || []).map((row, idx) => (
                  <tr key={row.id || idx}>
                    <td>{idx + 1}</td>
                    <td>{row.descricao}</td>
                    <td>{fmtBRL(row.valorParcela)}</td>
                    <td>{row.parcelas}</td>
                    <td style={{ color: '#166534', fontWeight: 600 }}>
                      {fmtBRL(row.total)}
                    </td>
                  </tr>
                ))}
                {(!items || items.length === 0) && (
                  <tr>
                    <td colSpan={5} style={{ color: '#6b7280' }}>
                      Nenhum registro.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ContasResumoPage;
