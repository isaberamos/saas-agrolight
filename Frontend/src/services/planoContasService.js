import api from './api';

/**
 * Converte lista plana vinda da API em árvore:
 * usa o código da conta (1, 1.1, 1.1.1) pra inferir conta-pai.
 */
function buildTreeFromFlat(rows) {
  if (!Array.isArray(rows)) return [];

  const byCode = new Map();

  const nodes = rows.map((row) => {
    const codigo = row.conta || '';
    const node = {
      id: row.idplanocontas,
      codigo,
      descricao: row.descricao || '',
      natureza: row.tipofluxocaixa === 2 ? 'C' : 'D', // 1 = Débito, 2 = Crédito
      subcontas: [],
    };
    byCode.set(codigo, node);
    return node;
  });

  const roots = [];

  nodes.forEach((node) => {
    const codigo = node.codigo || '';
    if (codigo.includes('.')) {
      const parentCode = codigo.split('.').slice(0, -1).join('.');
      const parent = byCode.get(parentCode);
      if (parent) {
        parent.subcontas.push(node);
      } else {
        roots.push(node); // órfão: cai na raiz mesmo assim
      }
    } else {
      roots.push(node);
    }
  });

  const sortTree = (list) => {
    list.sort((a, b) => (a.codigo > b.codigo ? 1 : -1));
    list.forEach((n) => {
      if (n.subcontas?.length) sortTree(n.subcontas);
    });
  };
  sortTree(roots);

  return roots;
}

/** Busca tudo no backend e devolve em forma de árvore */
export async function fetchPlanoContasTree() {
  const res = await api.get('plano-contas/');
  const rows = res.data || [];
  return buildTreeFromFlat(rows);
}

/** Cria conta nova no backend (usa apenas código, descrição e tipo D/C) */
export async function createPlanoConta({ descricao, codigo, tipo }) {
  await api.post('plano-contas/', {
    descricao,
    conta: codigo,
    tipofluxocaixa: tipo === 'C' ? 2 : 1,
  });
  return fetchPlanoContasTree();
}

/** Atualiza conta existente */
export async function updatePlanoConta(id, { descricao, codigo, tipo }) {
  await api.put(`plano-contas/${id}/`, {
    descricao,
    conta: codigo,
    tipofluxocaixa: tipo === 'C' ? 2 : 1,
  });
  return fetchPlanoContasTree();
}

/** Remove conta */
export async function deletePlanoConta(id) {
  await api.delete(`plano-contas/${id}/`);
  return fetchPlanoContasTree();
}
