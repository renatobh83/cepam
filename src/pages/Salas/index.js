import React, { useCallback, useEffect, useState } from 'react';

import './styles.css';
import ModalConfirm from '../../components/ModalConfirm';
import InputForm from '../../components/InputForm';
import {
  getSalas,
  postSala,
  salaDelete,
  getSetoresCadastro,
} from '../../services/API';
import { create } from '../../utils/actions';
import Loading from '../../components/Loading';
import ErroPermission from '../../utils/chekPermission';
import { useHistory } from 'react-router-dom';

function Salas() {
  const [newSala, setNewSala] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [setorSelected, setSetorSeleted] = useState(null);
  const [salas, setSalas] = useState([]);
  const [setores, setSetores] = useState([]);
  const history = useHistory();

  const fetchSetores = useCallback(async () => {
    const { data: setores } = await getSetoresCadastro();
    setSetores(setores.message);
    setIsLoading(false);
  }, []); // eslint-disable-line

  const fetchSalas = useCallback(async () => {
    try {
      const { data: setores } = await getSalas();
      setSalas(setores.message);
      fetchSetores();
    } catch (error) {
      ErroPermission(error, setIsLoading, history);
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    fetchSalas();
  }, []); // eslint-disable-line

  const handleNewSala = () =>
    setorSelected ? setNewSala(!newSala) : alert('Selecione um setor');

  const createdSala = (e) => {
    create(salas, e, setSalas, setNewSala);
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
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="main">
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
      <ul className="list">
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
