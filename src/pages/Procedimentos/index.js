import React, { useCallback, useEffect, useState } from 'react';

import './styles.css';
import ModalConfirm from '../../components/ModalConfirm';
import InputForm from '../../components/InputForm';
import Loading from '../../components/Loading';
import {
  getProcedimentos,
  getSetoresCadastro,
  postProcedimento,
  procedimentoApagar,
  putProcedimento,
} from '../../services/API';

function Procedimentos() {
  const [newProcedimento, setNewProcedimento] = useState(false);
  const [procedimetnoEdit, setProcedimentoEdit] = useState(null);
  const [setorSelect, setSetorSelect] = useState(null);
  const [procedimentos, setProcedimentos] = useState([]);
  const [setores, setSetores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchSetores = useCallback(async () => {
    const { data: setores } = await getSetoresCadastro();
    setSetores(setores.message);
    setIsLoading(false);
  }, []);

  const fetchProcedimentos = useCallback(async () => {
    const { data: procedimentos } = await getProcedimentos();
    setProcedimentos(procedimentos.message);
  }, []);
  useEffect(() => {
    fetchSetores();
    fetchProcedimentos();
  }, []);
  const handleNewProcedimento = () =>
    setorSelect
      ? setNewProcedimento(!newProcedimento)
      : alert('Selecione um setor');
  const createProcedimento = (e) => {
    setProcedimentos([...procedimentos, e]);
    setSetorSelect(null);
    handleNewProcedimento();
  };
  const handleCancel = () => {
    setProcedimentoEdit(null);
    setSetorSelect(null);
    setNewProcedimento(false);
  };
  const handleDeleteProcedimento = (e) => {
    const filterProcedimento = procedimentos.filter((g) => g._id !== e);
    setProcedimentos(filterProcedimento);
  };
  const selectedSetor = (e) => {
    if (e) setSetorSelect(e);
  };
  const procedimentoToEdit = async (value, e) => {
    const data = {
      ativo: value,
    };
    try {
      await putProcedimento(e, data);
    } catch (error) {}
  };
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="main">
      {!newProcedimento && (
        <ListProcedimentos
          procedimentos={procedimentos}
          procedimetnoEdit={procedimentoToEdit}
          setores={setores}
          deleteProcedimento={handleDeleteProcedimento}
          selectSetor={selectedSetor}
        >
          <button
            type="submit"
            className="button"
            onClick={handleNewProcedimento}
          >
            Novo procedimento
          </button>
        </ListProcedimentos>
      )}
      {newProcedimento && (
        <FormProcedimento
          cancel={handleCancel}
          createProcedimento={createProcedimento}
          editProcedimento={procedimetnoEdit}
          setor={setorSelect}
        />
      )}
    </div>
  );
}
const ListProcedimentos = ({
  children,
  procedimentos,
  procedimetnoEdit,
  deleteProcedimento,
  setores,
  selectSetor,
}) => {
  const [procedimentoFilter, setProcedimentofilter] = useState(null);

  const desativarProcedimento = (e) => {
    if (e.target.checked) {
      procedimetnoEdit(true, e.target.value);
    } else {
      procedimetnoEdit(false, e.target.value);
    }
  };
  const apagarProcedimento = async (e) => {
    try {
      await procedimentoApagar(e);
      deleteProcedimento(e);
    } catch (error) {}
  };
  const filterChange = (e) => {
    selectSetor(e);
    setProcedimentofilter(e);
  };

  const exibirProcedimentos =
    !procedimentoFilter || procedimentoFilter === '#'
      ? procedimentos
      : procedimentos.filter((id) => id.setor === procedimentoFilter);
  return (
    <div className="listPage">
      <h2>Procedimentos</h2>
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
        {exibirProcedimentos.map((procedimento) => (
          <li key={procedimento._id}>
            <span>{procedimento.name}</span>
            <div
              className="label"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto',
              }}
            >
              <label htmlFor={procedimento._id}>Ativo</label>
              <input
                type="checkbox"
                style={{ display: 'block', marginLeft: '2px' }}
                id={procedimento._id}
                defaultChecked={procedimento.ativo}
                onChange={(e) => desativarProcedimento(e)}
                value={procedimento._id}
              />
            </div>
            <ModalConfirm
              title="Confirma"
              description="Confirma a exclusão da procedimento"
            >
              {(confirm) => (
                <button
                  type="submit"
                  className="button button-danger"
                  onClick={confirm(() => apagarProcedimento(procedimento._id))}
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
const FormProcedimento = ({
  cancel,
  createProcedimento,
  editProcedimento,
  setor,
}) => {
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
      const { data: procedimento } = await postProcedimento(data);
      createProcedimento(procedimento.message);
    } catch (error) {}
  };
  const dateprocedimentoEdit = useCallback(() => {
    if (editProcedimento) {
      setName(editProcedimento.name);
    }
  }, []);
  useEffect(() => {
    dateprocedimentoEdit();
  }, []);
  return (
    <div className="forms">
      <h2>Cadastro novo procedimento</h2>
      <form onSubmit={handleSubmit}>
        <InputForm
          id="procedimento"
          value={name}
          label="Nome procedimento"
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
export default Procedimentos;
