import React, { useCallback, useEffect, useState } from 'react';

import './styles.css';

import ModalConfirm from '../../components/ModalConfirm';
import InputForm from '../../components/InputForm';
import InputMask from 'react-input-mask';
import { setToEdit, create, update } from '../../utils/actions';
import {
  getSetores,
  postSetores,
  putSetores,
  setorDelete,
} from '../../services/API';
import Loading from '../../components/Loading';
import ErroPermission from '../../utils/chekPermission';
import { useHistory } from 'react-router-dom';

function Setores() {
  const [newSetor, setNewSetor] = useState(false);
  const [setorEdit, setSetorEdit] = useState(null);
  const [setores, setSetores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const setorToEdit = (e) => {
    setToEdit(e, setSetorEdit, setNewSetor);
  };
  const fetchSetores = useCallback(async () => {
    try {
      const { data: setor } = await getSetores();
      setSetores(setor.message);
      setIsLoading(false);
    } catch (error) {
      ErroPermission(error, setIsLoading, history);
    }
  }, []);
  useEffect(() => {
    fetchSetores();
  }, []);
  const handleNewSetor = () => setNewSetor(!newSetor);
  const createdSetor = (e) => {
    create(setores, e, setSetores, setNewSetor, setSetorEdit);
  };
  const handleCancel = () => {
    setSetorEdit(null);
    setNewSetor(false);
  };
  const handleDeletSetor = (e) => {
    const filterSetor = setores.filter((g) => g._id !== e);
    setSetores(filterSetor);
  };
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="main">
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
  const apagarSetor = async (e) => {
    try {
      await setorDelete(e).then((res) => {
        if (res.data.statusCode === 400) {
          return alert(res.data.message);
        } else {
          deleteSetor(e);
        }
      });
    } catch (error) {}
  };
  return (
    <div className="listPage setor">
      <h2>Setores</h2>
      {children}
      <ul>
        {setores.map((setor) => (
          <li key={setor._id}>
            <div className="infoSetor">
              <span>{setor.name}</span>
              <h5>Tempo {setor.time}</h5>
            </div>
            <div className="grpBtn">
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
            </div>
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name,
      time,
    };
    if (editSetor) {
      editSetor.name = name;
      try {
        await putSetores(editSetor._id, data);
      } catch (error) {}
      cancel();
    } else {
      try {
        const { data: setor } = await postSetores(data);
        newSetor(setor.message);
      } catch (error) {}
    }
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
