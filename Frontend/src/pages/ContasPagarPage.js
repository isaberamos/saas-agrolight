import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ContaForm from '../components/ContaForm';
import { toast } from 'react-toastify';
import './ContasPage.css';

import api, { parseApiError } from '../services/api';

function fmtMoney(n) {
  return `R$ ${Number(n || 0).toFixed(2)}`;
}

function ContasPagarPage() {
  const [contas, setContas] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [contaSelecionada, setContaSelecionada] = useState(null);

  const carregarContas = async () => {
    try {
      const { data } = await api.get('contas-pagar/');
      setContas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao carregar contas a pagar:', err);
      toast.error(`Erro ao carregar contas a pagar: ${parseApiError(err)}`);
      setContas([]);
    }
  };

  useEffect(() => {
    carregarContas();
  }, []);

  const handleSalvarConta = async (payload) => {
    try {
      const id = payload.id || payload.idcontapagar || contaSelecionada?.idcontapagar || contaSelecionada?.id;
      const isEdicao = Boolean(id);

      const url = isEdicao
        ? `contas-pagar/${id}/`
        : 'contas-pagar/';

      const method = isEdicao ? 'put' : 'post';

      const { data } = await api[method](url, payload);

      if (isEdicao) {
        setContas((prev) =>
          prev.map((c) =>
            (c.idcontapagar ?? c.id) === (data.idcontapagar ?? data.id)
              ? data
              : c,
          ),
        );
        toast.success('Conta atualizada!');
      } else {
        setContas((prev) => [...prev, data]);
        toast.success('Conta criada!');
      }

      setMostrarForm(false);
      setContaSelecionada(null);
    } catch (err) {
      console.error('Erro ao salvar conta a pagar:', err);
      toast.error(parseApiError(err) || 'Erro ao salvar conta');
    }
  };

  const handleDeletar = async (conta) => {
    const id = conta.idcontapagar ?? conta.id;
    if (!id) return;

    const confirma = window.confirm(
      'Tem certeza que deseja excluir esta conta a pagar?',
    );
    if (!confirma) return;

    try {
      await api.delete(`contas-pagar/${id}/`);
      setContas((prev) =>
        prev.filter((c) => (c.idcontapagar ?? c.id) !== id),
      );
      toast.success('Conta deletada!');
    } catch (err) {
      console.error('Erro ao deletar conta a pagar:', err);
      toast.error(parseApiError(err) || 'Erro ao deletar conta');
    }
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="supplier-list">
        <div className="list-header">
          <h3>Lista de contas a pagar</h3>
          <button
            className="add-button"
            onClick={() => {
              setContaSelecionada(null);
              setMostrarForm(true);
            }}
          >
            + Nova conta
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Valor da parcela</th>
              <th>Nº de parcelas</th>
              <th>Total (calculado)</th>
              <th>Data venc.</th>
              <th>Data quitação</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {contas.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ color: '#6b7280' }}>
                  Nenhuma conta cadastrada.
                </td>
              </tr>
            ) : (
              contas.map((conta) => {
                const valor = Number(
                  conta.valorparcela ?? conta.valorParcela ?? 0,
                );
                const juros = Number(
                  conta.valorjuros ?? conta.juros ?? 0,
                );
                const desconto = Number(
                  conta.valordesconto ?? conta.desconto ?? 0,
                );
                const parcelas = Number(
                  conta.numeroparcela ?? conta.parcelas ?? 1,
                );
                const totalCalc = (valor + juros - desconto) * parcelas;

                const idRow = conta.idcontapagar ?? conta.id;

                return (
                  <tr key={idRow}>
                    <td>{conta.descricao}</td>
                    <td>{fmtMoney(valor)}</td>
                    <td>{parcelas}</td>
                    <td>{fmtMoney(totalCalc)}</td>
                    <td>{conta.datavencimento ?? conta.vencimento ?? '-'}</td>
                    <td>{conta.dataquitacao ?? conta.quitacao ?? '-'}</td>
                    <td>
                      <button
                        className="acao"
                        onClick={() => {
                          setContaSelecionada(conta);
                          setMostrarForm(true);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="acao danger"
                        onClick={() => handleDeletar(conta)}
                      >
                        Deletar
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {mostrarForm && (
        <div className="form-sidebar">
          <div className="form-header">
            <h3>{contaSelecionada ? 'Editar conta' : 'Nova conta'}</h3>
            <button
              className="fechar"
              onClick={() => setMostrarForm(false)}
            >
              ×
            </button>
          </div>
          <ContaForm
            conta={contaSelecionada}
            tipoConta="pagar"
            onSave={handleSalvarConta}
          />
        </div>
      )}
    </div>
  );
}

export default ContasPagarPage;
