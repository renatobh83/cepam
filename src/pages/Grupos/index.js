import React, { useCallback, useEffect, useState } from 'react';

import './styles.css';
import InputLabel from '../../components/InputLabel';
import InputForm from '../../components/InputForm';
import ModalConfirm from '../../components/ModalConfirm';

function Grupos() {
  const [newGroup, setNewGroup] = useState(false);
  const [groupEdit, setGroupEdit] = useState(null);
  const [grupos, setGrupos] = useState([
    { _id: 1, name: 'Admin' },
    { _id: 2, name: 'User' },
  ]);
  const groupToEdit = (e) => {
    setGroupEdit(e);
    setNewGroup(true);
  };
  const handleCancelar = () => {
    setGroupEdit(null);
    setNewGroup(false);
  };
  const handleNewGroup = () => setNewGroup(!newGroup);
  const createdGroup = (e) => {
    setGrupos([...grupos, e]);
    handleNewGroup();
  };
  const handleDeletGroup = (e) => {
    const filterGroup = grupos.filter((g) => g._id !== e);
    setGrupos(filterGroup);
  };
  return (
    <div className="mainPage">
      {!newGroup && (
        <ListGroups
          grupos={grupos}
          editGroup={groupToEdit}
          deleteGrupo={handleDeletGroup}
        >
          <button type="submit" onClick={handleNewGroup} className="button ">
            Novo Grupo
          </button>
        </ListGroups>
      )}
      {newGroup && (
        <FormGrupos
          cancel={handleCancelar}
          newGroup={createdGroup}
          editGroup={groupEdit}
        />
      )}
    </div>
  );
}
const ListGroups = ({ grupos, children, editGroup, deleteGrupo }) => {
  const groupForEdit = (e) => {
    editGroup(e);
  };
  const apagarGrupo = (e) => {
    deleteGrupo(e);
  };
  return (
    <div className="listPage">
      <h2>Grupos</h2>
      {children}

      <ul>
        {grupos.map((grupo) => (
          <li key={grupo._id}>
            <span className="descGrupo">{grupo.name}</span>

            <button className="button" onClick={() => groupForEdit(grupo)}>
              Editar
            </button>
            <ModalConfirm
              title="Confirma"
              description="Confirma a exclusão do grupo"
            >
              {(confirm) => (
                <button
                  className="button button-danger"
                  onClick={confirm(() => apagarGrupo(grupo._id))}
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
  const handleSetName = (e) => {
    setName(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name,
    };
    newGroup(data);
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
