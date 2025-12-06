import React, { useMemo, useState } from 'react';
import './PlanoContasModal.css';

/**
 * Campos suportados:
 * - descricao (string)
 * - tipo ( 'C' | 'D' )  // Crédito/Débito
 * - categoria ('Ativo' | 'Passivo' | 'Receita' | 'Despesa' | 'Patrimônio' | 'Outros')
 * - codigo (string)
 * - parentId (number|null) // conta-pai (usado só no modelo detalhado, por enquanto lógico)
 * - modelo (1 simplificado | 2 detalhado) [vem via prop]
 */
function PlanoContasModal({ data, onClose, onSave, modelo, contas = [] }) {
  const isEdit = Boolean(data?.id);

  const [descricao, setDescricao] = useState(data?.descricao ?? '');
  const [tipo, setTipo] = useState(data?.tipo ?? 'D');
  const [categoria, setCategoria] = useState(data?.categoria ?? 'Outros');
  const [codigo, setCodigo] = useState(data?.codigo ?? '');
  const [parentId, setParentId] = useState(data?.parentId ?? '');

  const naturezaToText = (natureza) => {
    if (!natureza) return '';
    const n = String(natureza).toUpperCase();
    if (n === 'C') return 'Crédito';
    if (n === 'D') return 'Débito';
    return '';
  };

  // lista linear de contas para combo "Conta-pai" (só faz sentido no detalhado)
  const flat = useMemo(() => {
    if (modelo !== 2) return []; // simplificado não usa pai

    const out = [];
    const dfs = (nodes, depth = 0) => {
      (nodes || []).forEach((n) => {
        const nat = naturezaToText(n.natureza);
        const labelParts = [];

        if (n.codigo) labelParts.push(`[${n.codigo}]`);
        if (n.descricao) labelParts.push(n.descricao);
        if (nat) labelParts.push(`(${nat})`);

        const baseLabel = labelParts.join(' ');
        const label = `${'— '.repeat(depth)}${baseLabel}`;

        out.push({ id: n.id, label });

        if (Array.isArray(n.subcontas) && n.subcontas.length > 0) {
          dfs(n.subcontas, depth + 1);
        }
      });
    };

    dfs(contas, 0);
    return out;
  }, [contas, modelo]);

  const handleSubmit = () => {
    if (!descricao.trim()) {
      alert('Descrição é obrigatória');
      return;
    }

    const payload = {
      ...(data || {}),
      descricao: descricao.trim(),
      tipo,
      categoria,
      codigo: codigo.trim(),
      parentId: parentId ? Number(parentId) : null,
      modelo,
    };

    onSave(payload);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{isEdit ? 'Editar Conta' : 'Nova Conta'}</h3>

        <label>Descrição *</label>
        <input
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Ex: Caixa, Duplicatas a Receber…"
        />

        <div className="grid-2">
          <div>
            <label>Crédito/Débito *</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="D">Débito</option>
              <option value="C">Crédito</option>
            </select>
          </div>

          <div>
            <label>Código</label>
            <input
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ex: 1.1.01.01"
            />
          </div>
        </div>

        <div className="grid-2">
          <div>
            <label>Categoria *</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
              <option>Ativo</option>
              <option>Passivo</option>
              <option>Patrimônio</option>
              <option>Receita</option>
              <option>Despesa</option>
              <option>Outros</option>
            </select>
          </div>

          {modelo === 2 && (
            <div>
              <label>Conta-pai</label>
              <select
                value={parentId ?? ''}
                onChange={(e) => setParentId(e.target.value)}
              >
                <option value="">(sem pai)</option>
                {flat.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleSubmit}>Salvar</button>
        </div>
      </div>
    </div>
  );
}

export default PlanoContasModal;
