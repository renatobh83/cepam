import React, { useCallback, useEffect, useState } from 'react';

import './styles.css';
import ModalConfirm from '../../components/ModalConfirm';
import InputForm from '../../components/InputForm';

function Procedimentos() {
  const [newProcedimento, setNewProcedimento] = useState(false);
  const [procedimetnoEdit, setProcedimentoEdit] = useState(null);
  const [procedimentoSelected, setProcedimentoSelected] = useState(null);
  const [procedimentos, setProcedimentos] = useState([
    { _id: 1, name: 'Rx torax', setor: 1, ativo: true },
    { _id: 2, name: 'Rx Punho', setor: 2, ativo: true },
  ]);
  const [setores, setSetores] = useState([
    { _id: 1, name: 'rx' },
    { _id: 2, name: 'us' },
  ]);
  const handleNewProcedimento = () =>
    procedimentoSelected
      ? setNewProcedimento(!newProcedimento)
      : alert('Selecione um setor');
  const createProcedimento = (e) => {
    setProcedimentos([...procedimentos, e]);
    setProcedimentoSelected(null);
    handleNewProcedimento();
  };
  const handleCancel = () => {
    setProcedimentoEdit(null);
    setProcedimentoSelected(null);
    setNewProcedimento(false);
  };
  const handleDeleteProcedimento = (e) => {
    const filterProcedimento = procedimentos.filter((g) => g._id !== e);
    setProcedimentos(filterProcedimento);
  };
  const selectedSetor = (e) => {
    if (e) setProcedimentoSelected(e);
  };
  const procedimentoToEdit = (e) => {
    console.log(e.target);
    // setProcedimentoSelected(e);
    // setProcedimentoEdit(e);
    // setNewProcedimento(true);
  };
  return (
    <div className="mainPage">
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
    procedimetnoEdit(e);
  };
  const apagarProcedimento = (e) => {
    deleteProcedimento(e);
  };
  const filterChange = (e) => {
    selectSetor(e);
    setProcedimentofilter(e);
  };

  const exibirProcedimentos =
    !procedimentoFilter || procedimentoFilter === '#'
      ? procedimentos
      : procedimentos.filter((id) => id.setor === parseInt(procedimentoFilter));
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
const FormProcedimento = ({ cancel, createProcedimento, editProcedimento }) => {
  const [name, setName] = useState('');
  const handleSetName = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name,
    };
    createProcedimento(data);
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
