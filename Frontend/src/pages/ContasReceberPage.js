import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import ContaForm from '../components/ContaForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ContasPage.css';

import api, { parseApiError } from '../services/api';

function ContasReceberPage() {
  const [contas, setContas] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [contaSelecionada, setContaSelecionada] = useState(null);

  const carregarContas = async () => {
    try {
      const { data } = await api.get('contas-receber/');
      setContas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao carregar contas a receber:', err);
      toast.error(`Erro ao carregar contas a receber: ${parseApiError(err)}`);
      setContas([]);
    }
  };

  useEffect(() => {
    carregarContas();
  }, []);

  const handleSalvarConta = async (payload) => {
    try {
      const idExistente =
        contaSelecionada && (contaSelecionada.idconta ?? contaSelecionada.id);
      const isEdicao = Boolean(idExistente);

      const url = isEdicao
        ? `contas-receber/${idExistente}/`
        : 'contas-receber/';

      const method = isEdicao ? 'put' : 'post';

      const { data } = await api[method](url, payload);

      if (isEdicao) {
        setContas((prev) =>
          prev.map((c) =>
            (c.idconta ?? c.id) === (data.idconta ?? data.id) ? data : c,
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
      console.error('Erro ao salvar conta a receber:', err);
      toast.error(parseApiError(err) || 'Erro ao salvar conta');
    }
  };

  const handleDeletar = async (conta) => {
    const id = conta.idconta ?? conta.id;
    if (!id) return;

    if (!window.confirm('Deseja realmente excluir esta conta?')) return;

    try {
      await api.delete(`contas-receber/${id}/`);
      setContas((prev) => prev.filter((c) => (c.idconta ?? c.id) !== id));
      toast.success('Conta excluída!');
    } catch (err) {
      console.error('Erro ao excluir conta a receber:', err);
      toast.error(parseApiError(err) || 'Erro ao excluir conta');
    }
  };

  const fmt = (n) => `R$ ${Number(n || 0).toFixed(2)}`;

  return (
    <div className="app">
      <Sidebar />

      <div className="supplier-list">
        <div className="list-header">
          <h3>Lista de contas a receber</h3>
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
                const total =
                  (Number(conta.valorparcela || 0) +
                    Number(conta.valorjuros || 0) -
                    Number(conta.valordesconto || 0)) *
                  Number(conta.numeroparcela || 1);

                const pk = conta.idconta ?? conta.id;

                return (
                  <tr key={pk}>
                    <td>{conta.descricao}</td>
                    <td>{fmt(conta.valorparcela)}</td>
                    <td>{conta.numeroparcela}</td>
                    <td>{fmt(total)}</td>
                    <td>{conta.datavencimento || '-'}</td>
                    <td>{conta.dataquitacao || '-'}</td>
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
              onClick={() => {
                setMostrarForm(false);
                setContaSelecionada(null);
              }}
            >
              ×
            </button>
          </div>

          <ContaForm
            conta={contaSelecionada}
            tipoConta="receber"
            onSave={handleSalvarConta}
          />
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2500} />
    </div>
  );
}

export default ContasReceberPage;
