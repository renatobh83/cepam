import React, { useCallback, useEffect, useState } from 'react';
import InputForm from '../../components/InputForm';

import './styles.css';

function Usuarios() {
  const [users, setUsers] = useState([
    { name: 'Renato', ativo: true },
    { name: 'user', ativo: true },
    { name: 'gabriel', ativo: true },
    { name: 'veronica', ativo: false },
  ]);
  const [newUser, setNewUser] = useState(false);
  const [userEdit, setUserEdit] = useState(null);
  const [filter, setFilter] = useState(true);
  const userToEdit = (e) => {
    setUserEdit(e);
    setNewUser(true);
  };
  const handleNewUser = (e) => {
    setUsers([...users, e]);
    setNewUser(false);
  };
  const closeForm = () => {
    setUserEdit(null);
    setNewUser(false);
  };
  const filterUsers = (e) => {
    setFilter(e.target.value);
  };
  useEffect(() => {
    setFilter(true);
  }, [userEdit]);
  return (
    <div className="mainUsuarios">
      {!newUser && (
        <ListUsers users={users} editUser={userToEdit} filter={filter}>
          <div className="children">
            <button
              type="submit"
              className="button"
              onClick={() => setNewUser(true)}
            >
              Novo Ususario
            </button>
            <label htmlFor="ativo">Ativo</label>
            <select name="ativo" id="ativo" onChange={filterUsers}>
              <option value="true" defaultValue>
                Sim
              </option>
              <option value="false">Nao</option>
            </select>
          </div>
        </ListUsers>
      )}
      {newUser && (
        <FormUser
          close={closeForm}
          newUser={handleNewUser}
          editUser={userEdit}
        />
      )}
    </div>
  );
}
const ListUsers = ({ users, children, editUser, filter }) => {
  const showUsers = users.filter((u) => u.ativo === JSON.parse(filter));

  const handleEdit = (e) => {
    editUser(e);
  };
  return (
    <div className="listOfPatients">
      <h2>Usuarios</h2>
      {children}
      <div className="cardUsers">
        {showUsers.map((user) => (
          <div className="userContent">
            {user.name}
            <button
              type="submit"
              className="button"
              onClick={() => handleEdit(user)}
            >
              Editar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const FormUser = ({ close, newUser, editUser }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [senha, setSenha] = useState('');
  const [grupo, setGrupo] = useState('');
  const [username, setUsername] = useState('');
  const [userAtivo, setAtivo] = useState(true);
  const [grupos, setGrupos] = useState([]);
  const handleSubmit = (e) => {
    e.preventDefault();
    let data;
    if (senha) {
      data = {
        name,
        grupoId: grupo,
        nickname: username,
        email,
        password: senha,
        ativo: userAtivo,
      };
    } else {
      data = {
        name,
        grupoId: grupo,
        nickname: username,
        email,
        ativo: userAtivo,
      };
    }

    newUser(data);
  };
  const closeForm = () => close();
  const dateUserEdit = useCallback(() => {
    if (editUser) {
      setName(editUser.name);
      setEmail(editUser.email);
      setUsername(editUser.nickname);
      setGrupo(editUser.grupoId);
    }
  }, []);
  useEffect(() => {
    dateUserEdit();
  }, []);
  return (
    <form className="forms" onSubmit={handleSubmit}>
      <h2>Cadastro novo usuario</h2>
      {editUser && (
        <div className="flagAtivo">
          <input
            type="checkbox"
            defaultChecked={editUser.ativo}
            id="ativo"
            onChange={(e) => setAtivo(e.target.checked)}
          />
          <label htmlFor="ativo">Ativo</label>
        </div>
      )}

      <div className="inputGroup">
        <InputForm
          id="nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="Nome completo"
        />
      </div>
      <div className="inputGroup">
        <InputForm
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          label="Ususario"
        />
      </div>
      <div className="inputGroup">
        <InputForm
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label="email"
        />
      </div>

      <div className="inputGroup">
        {/* <select */}
        {/* // name="grupo" */}
        {/* // id="grupo" */}
        {/* // onChange={(e) => setGrupo(e.target.value)} */}
        {/* // > */}
        {/* <option value="000"> Selecione um grupo</option>
            {grupos.map((g) => (
              <option value={g._id} key={g._id} selected={g._id === grupo}>
                {g.nome}
              </option>
            ))} */}
        {/* </select> */}
        {/* {!u && ( */}
        <div className="floating-label-input">
          <InputForm
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            label="senha"
          />
        </div>
        {/* )} */}
      </div>
      <div className="inputGroup">
        <button type="submit" className="button">
          Gravar
        </button>
        <button
          type="submit"
          className="button button-danger"
          onClick={closeForm}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};
export default Usuarios;
