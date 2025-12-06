import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api, { parseApiError } from '../services/api';

function toMoney(n) {
  const v = Number(n || 0);
  return Number.isFinite(v) ? v.toFixed(2) : '0.00';
}

function fkOrNull(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = parseInt(value, 10);
  return Number.isNaN(n) ? null : n;
}

export default function ContaForm({ conta, onSave, tipoConta }) {
  const [form, setForm] = useState({
    idcontapagar: null,
    descricao: '',
    valorParcela: '',
    parcelas: 1,
    total: 0,
    vencimento: '',
    quitacao: '',
    juros: 0,
    desconto: 0,
    propriedade: '',
    fornecedor: '',
    cliente: '',
    planoContas: '',
  });

  const [clientes, setClientes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [propriedades, setPropriedades] = useState([]);
  const [planos, setPlanos] = useState([]);

  useEffect(() => {
    if (conta) {
      setForm({
        idcontapagar:
          conta.idcontapagar ??
          conta.idconta ??
          conta.id ??
          null,
        descricao: conta.descricao ?? '',
        valorParcela: conta.valorparcela ?? conta.valorParcela ?? '',
        parcelas: conta.numeroparcela ?? conta.parcelas ?? 1,
        total: 0,
        vencimento: conta.datavencimento ?? conta.vencimento ?? '',
        quitacao: conta.dataquitacao ?? conta.quitacao ?? '',
        juros: conta.valorjuros ?? conta.juros ?? 0,
        desconto: conta.valordesconto ?? conta.desconto ?? 0,
        propriedade: conta.idpropriedade ?? conta.propriedade ?? '',
        fornecedor: conta.idfornecedor ?? conta.fornecedor ?? '',
        cliente: conta.idcliente ?? conta.cliente ?? '',
        planoContas: conta.idplanocontas ?? conta.planoContas ?? '',
      });
    } else {
      setForm({
        idcontapagar: null,
        descricao: '',
        valorParcela: '',
        parcelas: 1,
        total: 0,
        vencimento: '',
        quitacao: '',
        juros: 0,
        desconto: 0,
        propriedade: '',
        fornecedor: '',
        cliente: '',
        planoContas: '',
      });
    }
  }, [conta]);

  useEffect(() => {
    const valor = parseFloat(form.valorParcela || 0);
    const juros = parseFloat(form.juros || 0);
    const desconto = parseFloat(form.desconto || 0);
    const parcelas = parseInt(form.parcelas || 1, 10);

    const total = (valor + juros - desconto) * parcelas;
    setForm((prev) => ({
      ...prev,
      total: Number.isFinite(total) ? total : 0,
    }));
  }, [form.valorParcela, form.juros, form.desconto, form.parcelas]);

  // Carrega combos do backend (AGORA COM TOKEN via axios)
  useEffect(() => {
    async function carregarCombos() {
      try {
        const [cRes, fRes, pRes, pcRes] = await Promise.all([
          api.get('clientes/'),
          api.get('fornecedores/'),
          api.get('propriedades/'),
          api.get('plano-contas/'),
        ]);

        setClientes(Array.isArray(cRes.data) ? cRes.data : []);
        setFornecedores(Array.isArray(fRes.data) ? fRes.data : []);
        setPropriedades(Array.isArray(pRes.data) ? pRes.data : []);
        setPlanos(Array.isArray(pcRes.data) ? pcRes.data : []);
      } catch (err) {
        console.error(err);
        toast.error(
          parseApiError(err) ||
            'Falha ao carregar clientes/fornecedores/propriedades/plano de contas'
        );
      }
    }

    carregarCombos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const buildPayload = () => {
    const payload = {
      descricao: form.descricao,
      valorparcela: parseFloat(form.valorParcela || 0),
      numeroparcela: parseInt(form.parcelas || 1, 10),
      datavencimento: form.vencimento || null,
      dataquitacao: form.quitacao || null,
      valordesconto: parseFloat(form.desconto || 0),
      valorjuros: parseFloat(form.juros || 0),
      idpropriedade: fkOrNull(form.propriedade),
      idplanocontas: fkOrNull(form.planoContas),
    };

    // id genérico usado pelo front para PUT
    if (form.idcontapagar) {
      payload.id = form.idcontapagar;
    }

    if (tipoConta === 'pagar') {
      payload.idfornecedor = fkOrNull(form.fornecedor);
    } else if (tipoConta === 'receber') {
      payload.idcliente = fkOrNull(form.cliente);
    }

    return payload;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(buildPayload());
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Descrição</label>
      <input
        type="text"
        name="descricao"
        value={form.descricao}
        onChange={handleChange}
        required
      />

      <label>Valor da parcela</label>
      <input
        type="number"
        step="0.01"
        name="valorParcela"
        value={form.valorParcela}
        onChange={handleChange}
        required
      />

      <label>Nº de parcelas</label>
      <input
        type="number"
        name="parcelas"
        min="1"
        value={form.parcelas}
        onChange={handleChange}
      />

      <label>Total</label>
      <input type="text" value={`R$ ${toMoney(form.total)}`} readOnly />

      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label>Data vencimento</label>
          <input
            type="date"
            name="vencimento"
            value={form.vencimento}
            onChange={handleChange}
            required
          />
        </div>
        <div style={{ flex: 1 }}>
          <label>Data quitação</label>
          <input
            type="date"
            name="quitacao"
            value={form.quitacao}
            onChange={handleChange}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <label>Juros</label>
          <input
            type="number"
            step="0.01"
            name="juros"
            value={form.juros}
            onChange={handleChange}
          />
        </div>
        <div style={{ flex: 1 }}>
          <label>Desconto</label>
          <input
            type="number"
            step="0.01"
            name="desconto"
            value={form.desconto}
            onChange={handleChange}
          />
        </div>
      </div>

      <label>Propriedade</label>
      <select
        name="propriedade"
        value={form.propriedade}
        onChange={handleChange}
      >
        <option value="">Selecione</option>
        {propriedades.map((p) => (
          <option key={p.idpropriedade} value={p.idpropriedade}>
            {p.descricao}
          </option>
        ))}
      </select>

      {tipoConta === 'receber' ? (
        <>
          <label>Cliente</label>
          <select
            name="cliente"
            value={form.cliente}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </>
      ) : (
        <>
          <label>Fornecedor</label>
          <select
            name="fornecedor"
            value={form.fornecedor}
            onChange={handleChange}
            required
          >
            <option value="">Selecione</option>
            {fornecedores.map((f) => (
              <option key={f.idfornecedor} value={f.idfornecedor}>
                {f.nome}
              </option>
            ))}
          </select>
        </>
      )}

      <label>Plano de contas</label>
      <select
        name="planoContas"
        value={form.planoContas}
        onChange={handleChange}
      >
        <option value="">Selecione</option>
        {planos.map((pc) => (
          <option key={pc.idplanocontas} value={pc.idplanocontas}>
            {pc.descricao}
          </option>
        ))}
      </select>

      <button type="submit" className="salvar-btn">
        {conta
          ? 'Salvar alterações'
          : `Adicionar conta a ${
              tipoConta === 'receber' ? 'receber' : 'pagar'
            }`}
      </button>
    </form>
  );
}
