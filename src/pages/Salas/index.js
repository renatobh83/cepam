import React, { useCallback, useEffect, useState } from 'react';

import './styles.css';
import ModalConfirm from '../../components/ModalConfirm';
import InputForm from '../../components/InputForm';

function Salas() {
  const [newSala, setNewSala] = useState(false);
  const [salaEdit, setSalaEdit] = useState(null);
  const [setorSelected, setSetorSeleted] = useState(null);
  const [salas, setSalas] = useState([
    { _id: 1, name: 'sala1', setor: 1 },
    { _id: 2, name: 'sala2', setor: 2 },
  ]);
  const [setores, setSetores] = useState([
    { _id: 1, name: 'rx' },
    { _id: 2, name: 'us' },
  ]);
  const handleNewSala = () =>
    setorSelected ? setNewSala(!newSala) : alert('Selecione um setor');
  const createdSala = (e) => {
    setSalas([...salas, e]);
    handleNewSala();
  };
  const handleCancel = () => {
    setSalaEdit(null);
    setSetorSeleted(null);
    setNewSala(false);
  };
  const handleDeleteSala = (e) => {
    const filteSalas = salas.filter((g) => g._id !== e);
    setSalas(filteSalas);
  };
  const selectedSetor = (e) => {
    if (e) setSetorSeleted(e);
  };
  const salaToEdit = (e) => {
    setSalaEdit(e);
    setNewSala(true);
  };
  return (
    <div className="mainPage">
      {!newSala && (
        <ListSalas
          salas={salas}
          salaEdit={salaToEdit}
          setores={setores}
          deleteSala={handleDeleteSala}
          selectSetor={selectedSetor}
        >
          <button type="submit" className="button" onClick={handleNewSala}>
            Nova sala
          </button>
        </ListSalas>
      )}
      {newSala && (
        <FormSalas
          cancel={handleCancel}
          newSala={createdSala}
          editSala={salaEdit}
        />
      )}
    </div>
  );
}
const ListSalas = ({
  children,
  salas,
  salaEdit,
  deleteSala,
  setores,
  selectSetor,
}) => {
  const [salaFilter, setsalaFilter] = useState(null);
  const salaToEdit = (e) => {
    salaEdit(e);
  };
  const apagarSala = (e) => {
    deleteSala(e);
  };
  const filterChange = (e) => {
    selectSetor(e);
    setsalaFilter(e);
  };
  const exibirSalas =
    !salaFilter || salaFilter === '#'
      ? salas
      : salas.filter((id) => id.setor === parseInt(salaFilter));
  return (
    <div className="listPage">
      <h2>Salas</h2>
      {children}
      <select
        name="setor"
        id="setor"
        onChange={(e) => filterChange(e.target.value)}
      >
        <option value="">Setor</option>
        {setores.map((setor) => (
          <option value={setor._id} key={setor._id}>
            {setor.name}
          </option>
        ))}
      </select>
      <ul>
        {exibirSalas.map((sala) => (
          <li key={sala._id}>
            <span>{sala.name}</span>
            <button
              type="submit"
              className="button"
              onClick={() => salaToEdit(sala)}
            >
              Editar
            </button>
            <ModalConfirm
              title="Confirma"
              description="Confirma a exclusão da sala"
            >
              {(confirm) => (
                <button
                  type="submit"
                  className="button button-danger"
                  onClick={confirm(() => apagarSala(sala._id))}
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
const FormSalas = ({ cancel, newSala, editSala }) => {
  const [name, setName] = useState('');
  const handleSetName = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name,
    };
    if (editSala) {
      editSala.name = name;
      cancel();
    } else {
      newSala(data);
    }
  };
  const dateSalaEdit = useCallback(() => {
    if (editSala) {
      setName(editSala.name);
    }
  }, []);
  useEffect(() => {
    dateSalaEdit();
  }, []);
  return (
    <div className="forms">
      <h2>Cadastro nova sala</h2>
      <form onSubmit={handleSubmit}>
        <InputForm
          id="sala"
          value={name}
          label="Nome sala"
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
export default Salas;
