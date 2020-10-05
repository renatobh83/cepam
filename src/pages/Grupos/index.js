import React, { useCallback, useEffect, useState } from "react";

import InputForm from "../../components/InputForm";
import ModalConfirm from "../../components/ModalConfirm";
import {
  postGrupo,
  getGrupos,
  apagarGrupo,
  putGrupo,
} from "../../services/API";
import Loading from "../../components/Loading";
import { setToEdit, create, update } from "../../utils/actions";

function Grupos() {
  const [newGroup, setNewGroup] = useState(false);
  const [groupEdit, setGroupEdit] = useState(null);
  const [grupos, setGrupos] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const fethcGrupos = useCallback(async () => {
    const { data: grupos } = await getGrupos();
    setGrupos(grupos.message);
    setIsloading(false);
  }, []);
  useEffect(() => {
    fethcGrupos();
  }, []);
  const groupToEdit = (e) => {
    setToEdit(e, setGroupEdit, setNewGroup);
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
      {!newGroup && (
        <ListGroups
          grupos={grupos}
          editGroup={groupToEdit}
          deleteGrupo={handleDeletGroup}
        >
          <button type="submit" onClick={handleNewGroup} className="button">
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
  const grupoApagar = async (e) => {
    try {
      await apagarGrupo(e);
    } catch (error) {}
    deleteGrupo(e);
  };
  return (
    <div className="listPage">
      <h2>Grupos</h2>
      {children}

      <ul>
        {grupos.map((grupo) => (
          <li key={grupo._id}>
            <span className="descGrupo" style={{ textTransform: "uppercase" }}>
              {grupo.name}
            </span>

            <button className="button f-1" onClick={() => groupForEdit(grupo)}>
              Editar
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
  const [name, setName] = useState("");
  const handleSetName = (e) => {
    setName(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name,
    };
    if (editGroup) {
      editGroup.name = name;
      await putGrupo(editGroup._id, data);
      cancel();
    } else {
      const { data: grupo } = await postGrupo(data);
      newGroup(grupo.message);
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
