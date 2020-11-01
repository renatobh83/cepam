import React, { useCallback, useEffect, useState } from 'react';

import InputForm from '../../components/InputForm';
import ModalConfirm from '../../components/ModalConfirm';

import {
  postGrupo,
  getGrupos,
  apagarGrupo,
  putGrupo,
} from '../../services/API';
import Loading from '../../components/Loading';
import { setToEdit, create, update } from '../../utils/actions';
import PermissoesGrupo from '../PermissaoGrupo/';
import { useHistory } from 'react-router-dom';
import ErroPermission from '../../utils/chekPermission';

function Grupos() {
  const history = useHistory();
  const [newGroup, setNewGroup] = useState(false);
  const [groupEdit, setGroupEdit] = useState(null);
  const [grupoSelect, setGrupoSelect] = useState(null);
  const [permissao, setPermissao] = useState(false);
  const [grupos, setGrupos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fethcGrupos = useCallback(async () => {
    try {
      const { data: grupos } = await getGrupos();
      setGrupos(grupos.message);
      setIsLoading(false);
    } catch (error) {
      ErroPermission(error, setIsLoading, history);
    }
  }, []);
  useEffect(() => {
    fethcGrupos();
  }, []);
  const permissaoGrupo = (e) => {
    setPermissao(true);
    setGrupoSelect(e);
  };
  const closeSetPermissao = () => {
    setPermissao(false);
    fethcGrupos();
  };
  const handleCancelar = () => {
    setGroupEdit(null);
    setNewGroup(false);
  };
  const handleNewGroup = () => setNewGroup(!newGroup);

  const createdGroup = (e) => {
    create(grupos, e, setGrupos, setNewGroup, setGroupEdit);
  };

  const handleDeletGroup = (e) => {
    const filterGroup = grupos.filter((g) => g._id !== e);
    setGrupos(filterGroup);
  };
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="main">
      {!newGroup && !permissao && (
        <ListGroups
          grupos={grupos}
          editGroup={permissaoGrupo}
          history
          deleteGrupo={handleDeletGroup}
        >
          <button type="submit" onClick={handleNewGroup} className="button">
            Novo Grupo
          </button>
        </ListGroups>
      )}
      {newGroup && !permissao && (
        <FormGrupos
          cancel={handleCancelar}
          newGroup={createdGroup}
          editGroup={groupEdit}
        />
      )}
      {permissao && (
        <PermissoesGrupo grupo={grupoSelect} close={closeSetPermissao} />
      )}
    </div>
  );
}
const ListGroups = ({ grupos, children, editGroup, deleteGrupo, history }) => {
  const groupForEdit = (e) => {
    editGroup(e);
  };
  const grupoApagar = async (e) => {
    try {
      await apagarGrupo(e);
    } catch (error) {
      ErroPermission(error, history);
    }
    deleteGrupo(e);
  };
  return (
    <div className="listPage">
      <h2>Grupos</h2>
      {children}

      <ul>
        {grupos.map((grupo) => (
          <li key={grupo._id}>
            <span className="descGrupo" style={{ textTransform: 'uppercase' }}>
              {grupo.name}
            </span>

            <button
              style={{ width: '30%' }}
              className="button f-1"
              onClick={() => groupForEdit(grupo)}
            >
              Permissoes
            </button>
            <ModalConfirm
              title="Confirma"
              description="Confirma a exclusão do grupo"
            >
              {(confirm) => (
                <button
                  className="button button-danger f-1"
                  onClick={confirm(() => grupoApagar(grupo._id))}
                >
                  Apagar
                </button>
              )}
            </ModalConfirm>
          </li>
        ))}
      </ul>
    </div>
  );
};
const FormGrupos = ({ cancel, newGroup, editGroup }) => {
  const [name, setName] = useState('');
  const history = useHistory();
  const handleSetName = (e) => {
    setName(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name,
    };
    if (editGroup) {
      try {
        editGroup.name = name;
        await putGrupo(editGroup._id, data);
        cancel();
      } catch (error) {
        ErroPermission(error, history);
      }
    } else {
      try {
        const { data: grupo } = await postGrupo(data);
        newGroup(grupo.message);
      } catch (error) {
        ErroPermission(error, history);
      }
    }
  };
  const dateGroupEdit = useCallback(() => {
    if (editGroup) {
      setName(editGroup.name);
    }
  }, []);
  useEffect(() => {
    dateGroupEdit();
  }, []);
  return (
    <div className="forms">
      <h2>Cadastro novo grupo</h2>
      <form onSubmit={handleSubmit}>
        <InputForm
          id="grupo"
          value={name}
          label="Nome grupo"
          onChange={handleSetName}
        />
        <div className="inputGroup">
          <button type="submit" className="button">
            Gravar
          </button>
          <button
            type="submit"
            className="button button-danger"
            onClick={cancel}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
export default Grupos;
