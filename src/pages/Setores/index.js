import React, { useCallback, useEffect, useState } from 'react';

import './styles.css';

import ModalConfirm from '../../components/ModalConfirm';
import InputForm from '../../components/InputForm';
import InputMask from 'react-input-mask';

function Setores() {
  const [newSetor, setNewSetor] = useState(false);
  const [setorEdit, setSetorEdit] = useState(null);
  const [setores, setSetores] = useState([
    { _id: 1, name: 'Raio-x', time: '00:10' },
    { _id: 2, name: 'Us', time: '00:20' },
  ]);
  const setorToEdit = (e) => {
    setSetorEdit(e);
    setNewSetor(true);
  };
  const handleNewSetor = () => setNewSetor(!newSetor);
  const createdSetor = (e) => {
    setSetores([...setores, e]);
    handleNewSetor();
  };
  const handleCancel = () => {
    setSetorEdit(null);
    setNewSetor(false);
  };
  const handleDeletSetor = (e) => {
    const filterSetor = setores.filter((g) => g._id !== e);
    setSetores(filterSetor);
  };
  return (
    <div className="mainPage">
      {!newSetor && (
        <ListSetor
          setores={setores}
          editSetor={setorToEdit}
          deleteSetor={handleDeletSetor}
        >
          <button className="button" onClick={handleNewSetor}>
            Novo setor
          </button>
        </ListSetor>
      )}
      {newSetor && (
        <FormSetor
          cancel={handleCancel}
          newSetor={createdSetor}
          editSetor={setorEdit}
        />
      )}
    </div>
  );
}
const ListSetor = ({ children, setores, editSetor, deleteSetor }) => {
  const setorForEdit = (e) => {
    editSetor(e);
  };
  const apagarSetor = (e) => {
    deleteSetor(e);
  };
  return (
    <div className="listPage">
      <h2>Setores</h2>
      {children}
      <ul>
        {setores.map((setor) => (
          <li key={setor._id}>
            <span>{setor.name}</span>
            <h5>Tempo {setor.time}</h5>
            <button
              type="submit"
              className="button"
              onClick={() => setorForEdit(setor)}
            >
              Editar
            </button>
            <ModalConfirm
              title="Confirma"
              description="Confirma a exclusão do setor"
            >
              {(confirm) => (
                <button
                  type="submit"
                  className="button button-danger"
                  onClick={confirm(() => apagarSetor(setor._id))}
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
const FormSetor = ({ cancel, newSetor, editSetor }) => {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');

  const handleSetName = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name,
      time,
    };
    newSetor(data);
  };
  const dateSetorEdit = useCallback(() => {
    if (editSetor) {
      setName(editSetor.name);
      setTime(editSetor.time);
    }
  }, []);
  useEffect(() => {
    dateSetorEdit();
  }, []);
  return (
    <div className="forms">
      <h2>Cadastro novo setor</h2>
      <form onSubmit={handleSubmit}>
        <InputForm
          id="setor"
          value={name}
          label="Nome setor"
          onChange={handleSetName}
        />
        <div className="floating-label-input">
          <InputMask
            mask="99:99"
            id="time"
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <label htmlFor="time">tempo </label>
          <span className="line"></span>
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
export default Setores;
