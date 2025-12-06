import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import PlanoContasTree from '../components/PlanoContasTree';
import PlanoContasModal from '../components/PlanoContasModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './PlanoContasPage.css';
import {
  fetchPlanoContasTree,
  createPlanoConta,
  updatePlanoConta,
  deletePlanoConta,
} from '../services/planoContasService';

function PlanoContasPage() {
  const [modelo, setModelo] = useState(1); // 1 = Simplificado, 2 = Detalhado
  const [contasTree, setContasTree] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [userTipo] = useState(1); // 1 = Admin, 2 = Colaborador

  // Carrega do backend
  useEffect(() => {
    (async () => {
      try {
        const tree = await fetchPlanoContasTree();
        setContasTree(tree);
      } catch (err) {
        console.error('Erro ao carregar plano de contas:', err);
        toast.error('Erro ao carregar plano de contas do servidor.');
      }
    })();
  }, []);

  const handleModeloChange = (novo) => {
    setModelo(novo);
    toast.info(novo === 1 ? 'Visualizando: Simplificado' : 'Visualizando: Detalhado');
  };

  // O que vai pra árvore, dependendo do modelo
  const contasVisiveis = useMemo(() => {
    if (modelo === 1) {
      // Simplificado = só raízes, sem filhos (igual Conta Azul)
      return contasTree.map((root) => ({
        ...root,
        subcontas: [],
      }));
    }
    // Detalhado = árvore completa
    return contasTree;
  }, [modelo, contasTree]);

  const handleSave = async (payload) => {
    try {
      let novaArvore;
      if (payload.id) {
        novaArvore = await updatePlanoConta(payload.id, {
          descricao: payload.descricao,
          codigo: payload.codigo,
          tipo: payload.tipo,
        });
        toast.success('Conta atualizada com sucesso.');
      } else {
        novaArvore = await createPlanoConta({
          descricao: payload.descricao,
          codigo: payload.codigo,
          tipo: payload.tipo,
        });
        toast.success('Conta criada com sucesso.');
      }
      setContasTree(novaArvore);
      setOpenModal(false);
    } catch (err) {
      console.error('Erro ao salvar conta:', err);
      toast.error('Erro ao salvar conta no servidor.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta conta?')) return;
    try {
      const novaArvore = await deletePlanoConta(id);
      setContasTree(novaArvore);
      toast.success('Conta excluída com sucesso.');
    } catch (err) {
      console.error('Erro ao excluir conta:', err);
      toast.error('Erro ao excluir conta no servidor.');
    }
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="plano-container">
        <h2>
          Plano de Contas ({modelo === 1 ? 'Simplificado' : 'Detalhado'})
          <span style={{ marginLeft: 12, fontSize: 12, color: '#6b7280' }}>
            {contasTree.length} raiz(es)
          </span>
        </h2>

        {userTipo === 1 && (
          <div className="modelo-toggle">
            <button
              className={modelo === 1 ? 'active' : ''}
              onClick={() => handleModeloChange(1)}
              type="button"
            >
              Simplificado
            </button>
            <button
              className={modelo === 2 ? 'active' : ''}
              onClick={() => handleModeloChange(2)}
              type="button"
            >
              Detalhado
            </button>
          </div>
        )}

        {contasVisiveis.length === 0 ? (
          <div style={{ marginTop: 16, color: '#6b7280' }}>Nenhuma conta para mostrar.</div>
        ) : (
          <PlanoContasTree
            contas={contasVisiveis}
            onEdit={(data) => {
              setEditData(data);
              setOpenModal(true);
            }}
            onDelete={handleDelete}
          />
        )}

        {userTipo === 1 && (
          <button
            className="add-button"
            type="button"
            onClick={() => {
              setEditData(null);
              setOpenModal(true);
            }}
          >
            + Nova conta
          </button>
        )}

        {openModal && (
          <PlanoContasModal
            modelo={modelo}
            data={editData}
            contas={contasTree}
            onClose={() => setOpenModal(false)}
            onSave={handleSave}
          />
        )}

        <ToastContainer position="top-right" autoClose={2500} />
      </div>
    </div>
  );
}

export default PlanoContasPage;

