import React, { useCallback, useEffect, useState } from 'react';
import InputForm from '../../components/InputForm';

import './styles.css';
import ModalConfirm from '../../components/ModalConfirm';
import {
  getTabelas,
  getPlanos,
  postPlanos,
  putPlanos,
  planosApagar,
} from '../../services/API';

function Planos() {
  const [novoPlano, setNovoPlano] = useState(false);
  const [planoEdit, setPlanoEdit] = useState(null);
  const [planos, setPlanos] = useState([]);

  const fetchPlanos = useCallback(async () => {
    const { data: planos } = await getPlanos();
    if (planos.statusCode === 200) setPlanos(planos.message);
  }, []);
  useEffect(() => {
    fetchPlanos();
  }, []);
  const cancel = () => {
    setNovoPlano(false);
    setPlanoEdit(null);
  };
  const planoForEdit = (e) => {
    setPlanoEdit(e);
    setNovoPlano(true);
  };
  const createPlan = (e) => {
    setPlanos([...planos, e]);
    setPlanoEdit(null);
    cancel();
  };
  const handleDelete = async (e) => {
    try {
      await planosApagar(e);
    } catch (error) {}
    const fitlerPlano = planos.filter((g) => g._id !== e);
    setPlanos(fitlerPlano);
  };
  const propsList = {
    planos,
    edit: (...p) => planoForEdit(...p),
    apagar: (...p) => handleDelete(...p),
  };
  const propsForm = {
    cancel: () => cancel(),
    novoPlano: (...p) => createPlan(...p),
    planoEdit,
  };
  return (
    <div className="mainPage">
      {!novoPlano && (
        <ListPLanos config={propsList}>
          <button
            type="submit"
            className="button"
            onClick={() => setNovoPlano(true)}
          >
            Novo plano
          </button>
        </ListPLanos>
      )}
      {novoPlano && <FormsPlanos config={propsForm} />}
    </div>
  );
}

const ListPLanos = ({ children, config }) => {
  const { planos, edit, apagar } = config;

  return (
    <div className="listPage">
      <h2>Planos</h2>
      {children}
      <ul>
        {planos.map((plano) => (
          <li key={plano._id} style={{ padding: 0 }}>
            <span>{plano.name}</span>

            <button
              type="submit"
              className="button"
              onClick={() => edit(plano)}
            >
              Editar
            </button>
            <ModalConfirm
              title="Confirma"
              description="Confirma a exclusão do plano"
            >
              {(confirm) => (
                <button
                  type="submit"
                  className="button button-danger"
                  onClick={confirm(() => apagar(plano._id))}
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

const FormsPlanos = ({ config }) => {
  const { cancel, novoPlano, planoEdit } = config;

  const [name, setName] = useState('');
  const [tabelas, setTabelas] = useState([]);
  const [tabela, setTabela] = useState(null);
  const [particular, setParticular] = useState(false);
  const [tabelaEdit, setTabelaEdit] = useState(null);

  const fetchTabelas = useCallback(async () => {
    try {
      const { data: tabelas } = await getTabelas();
      if (tabelas.statusCode === 200) setTabelas(tabelas.message);
    } catch (error) {}
  }, []);
  useEffect(() => {
    fetchTabelas();
  }, []);
  const handleSetName = (e) => {
    setName(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name,
      tabela,
      particular,
    };

    if (planoEdit) {
      planoEdit.name = name;
      planoEdit.particular = particular;
      try {
        await putPlanos(planoEdit._id, data);
        cancel();
      } catch (error) {}
    } else {
      try {
        const { data: plano } = await postPlanos(data);
        if (plano.statusCode === 200) {
          novoPlano(plano.message);
        } else {
          alert('Plano ja cadastrado');
        }
      } catch (error) {}
    }
  };
  useEffect(() => {
    if (planoEdit) {
      setName(planoEdit.name);
      setParticular(planoEdit.particular);
      setTabelaEdit(planoEdit.tabela);
    }
  }, []);
  return (
    <div className="forms">
      <h2>Cadastro novo plano</h2>
      <form onSubmit={handleSubmit}>
        <InputForm
          id="plano"
          value={name}
          label="Nome plano"
          onChange={handleSetName}
        />
        <div className="divGroup">
          <select
            name="tabela"
            id="tabela"
            required
            onChange={(e) => setTabela(e.target.value)}
          >
            <option value="">Tabela</option>
            {tabelas.map((tabela) => (
              <option
                key={tabela._id}
                value={tabela._id}
                selected={tabela._id === tabelaEdit}
              >
                {tabela.name}
              </option>
            ))}
          </select>
          <label htmlFor="particular">Particular</label>
          <input
            type="checkbox"
            style={{ display: 'block' }}
            name="particular"
            id="particular"
            defaultChecked={particular}
            onChange={(e) => setParticular(e.target.checked)}
          />
        </div>
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
export default Planos;
