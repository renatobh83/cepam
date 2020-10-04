import React, { useCallback, useEffect, useState } from 'react';

import './styles.css';
import ModalConfirm from '../../components/ModalConfirm';
import InputForm from '../../components/InputForm';
import {
  getSetores,
  getSalas,
  postSala,
  putSala,
  salaDelete,
} from '../../services/API';
import actions, { setToEdit } from '../../utils/actions.js';

function Salas() {
  const [newSala, setNewSala] = useState(false);

  const [setorSelected, setSetorSeleted] = useState(null);
  const [salas, setSalas] = useState([]);
  const [setores, setSetores] = useState([]);

  const fetchSetores = useCallback(async () => {
    const { data: setores } = await getSetores();
    setSetores(setores.message);
  }, []);

  const fetchSalas = useCallback(async () => {
    const { data: setores } = await getSalas();
    setSalas(setores.message);
  }, []);

  useEffect(() => {
    fetchSetores();
    fetchSalas();
  }, []);

  const handleNewSala = () =>
    setorSelected ? setNewSala(!newSala) : alert('Selecione um setor');

  const createdSala = (e) => {
    actions.create(salas, e, setSalas, setNewSala);
  };
  const handleCancel = () => {
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

  return (
    <div className="mainPage">
      {!newSala && (
        <ListSalas
          salas={salas}
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
          setor={setorSelected}
        />
      )}
    </div>
  );
}
const ListSalas = ({ children, salas, deleteSala, setores, selectSetor }) => {
  const [salaFilter, setsalaFilter] = useState(null);

  const apagarSala = async (e) => {
    try {
      await salaDelete(e);
      deleteSala(e);
    } catch (error) {}
  };
  const filterChange = (e) => {
    selectSetor(e);
    setsalaFilter(e);
  };

  const exibirSalas =
    !salaFilter || salaFilter === '#'
      ? salas
      : salas.filter((id) => id.setor === salaFilter);
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
const FormSalas = ({ cancel, newSala, setor }) => {
  const [name, setName] = useState('');
  const handleSetName = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name,
      setor,
    };

    try {
      const { data: sala } = await postSala(data);
      newSala(sala.message);
    } catch (error) {}
  };

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
