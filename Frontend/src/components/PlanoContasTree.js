import React from 'react';

/**
 * Árvore simples sem dependências (usa <details>/<summary>).
 * Mostra qualquer estrutura (plana ou hierárquica).
 */
function NodeItem({ node, onEdit }) {
  const hasChildren = Array.isArray(node.subcontas) && node.subcontas.length > 0;

  const naturezaTxt = node.natureza
    ? (String(node.natureza).toUpperCase() === 'C' ? 'Crédito' : 'Débito')
    : null;

  const labelText = [
    node.codigo ? `[${node.codigo}]` : null,
    node.descricao,
    naturezaTxt ? `(${naturezaTxt})` : null,
  ].filter(Boolean).join(' ');

 const Label = (
  <div className="tree-node" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
    <span>{labelText}</span>
    {onEdit && (
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onEdit(node); }}
      >
        Editar
      </button>
    )}
  </div>
);


  if (!hasChildren) {
    // folha
    return (
      <div className="tree-leaf" style={{ padding: '4px 0 4px 8px' }}>
        {Label}
      </div>
    );
  }

  // nó com filhos
  return (
    <details open style={{ paddingLeft: 4 }}>
      <summary style={{ listStyle: 'none', cursor: 'pointer' }}>{Label}</summary>
      <div style={{ paddingLeft: 16 }}>
        {node.subcontas.map((child) => (
          <NodeItem key={String(child.id)} node={child} onEdit={onEdit} />
        ))}
      </div>
    </details>
  );
}

export default function PlanoContasTree({ contas = [], onEdit }) {
  const list = Array.isArray(contas) ? contas : [];
  if (!list.length) return null;

  return (
    <div className="tree-wrapper" style={{ marginTop: 8, minHeight: 200 }}>
      {list.map((n) => (
        <NodeItem key={String(n.id)} node={n} onEdit={onEdit} />
      ))}
    </div>
  );
}
