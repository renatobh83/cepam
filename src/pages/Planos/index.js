import React, { useCallback, useEffect, useState } from 'react';
import InputForm from '../../components/InputForm';

import './styles.css';
import ModalConfirm from '../../components/ModalConfirm';
import Loading from '../../components/Loading';

import {
  getTabelasCadastro,
  getPlanos,
  postPlanos,
  putPlanos,
  planosApagar,
} from '../../services/API';
import ErroPermission from '../../utils/chekPermission';
import { useHistory } from 'react-router-dom';

function Planos() {
  const history = useHistory();
  const [novoPlano, setNovoPlano] = useState(false);
  const [planoEdit, setPlanoEdit] = useState(null);
  const [planos, setPlanos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPlanos = useCallback(async () => {
    try {
      const { data: planos } = await getPlanos();

      if (planos.statusCode === 200) setPlanos(planos.message);
      setIsLoading(false);
    } catch (error) {
      ErroPermission(error, setIsLoading, history);
    }
  }, []); // eslint-disable-line
  useEffect(() => {
    fetchPlanos();
  }, []); // eslint-disable-line
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
    } catch (error) {
      ErroPermission(error, setIsLoading, history);
    }
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
    history,
  };
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="main">
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
      <ul className="planos">
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
  const { cancel, novoPlano, planoEdit, history } = config;

  const [name, setName] = useState('');
  const [tabelas, setTabelas] = useState([]);
  const [tabela, setTabela] = useState(null);
  const [particular, setParticular] = useState(false);

  const fetchTabelas = useCallback(async () => {
    try {
      const { data: tabelas } = await getTabelasCadastro();
      if (tabelas.statusCode === 200) {
        setTabelas(tabelas.message);
      }
    } catch (error) {}
  }, []); // eslint-disable-line

  const handleSetName = (e) => {
    setName(e.target.value);
  };
  // const inputCheck = (e) => {
  //   console.log(e.target);
  //   setParticular(e.target.checked);
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name,
      tabela,
      particular,
    };

    if (planoEdit) {
      planoEdit.tabela = tabela;
      planoEdit.name = name;
      planoEdit.particular = particular;

      try {
        await putPlanos(planoEdit._id, data);
        cancel();
      } catch (error) {
        ErroPermission(error, history);
      }
    } else {
      try {
        const { data: plano } = await postPlanos(data);
        if (plano.statusCode === 200) {
          novoPlano(plano.message);
        } else {
          alert('Plano ja cadastrado');
        }
      } catch (error) {
        ErroPermission(error, history);
      }
    }
  };
  const handleEditPlano = (e) => {
    if (e !== null) {
      setName(e.name);
      setParticular(e.particular);
      setTabela(e.tabela);
    }
  };
  useEffect(() => {
    fetchTabelas();
    handleEditPlano(planoEdit);
  }, []); // eslint-disable-line
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
          <label>Tabela</label>
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
                selected={planoEdit ? tabela._id === planoEdit.tabela : null}
              >
                {tabela.name}
              </option>
            ))}
          </select>
          <label htmlFor="particular">Particular</label>
          <input
            type="checkbox"
            style={{ display: 'block' }}
            id="particular"
            defaultChecked={planoEdit ? planoEdit.particular : particular}
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
