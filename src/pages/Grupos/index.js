import React, { useState } from 'react';

import './styles.css';
import InputLabel from '../../components/InputLabel';
import InputForm from '../../components/InputForm';

function Grupos() {
  const [newGroup, setNewGroup] = useState(true);
  return (
    <div className="mainGrupos">
      {!newGroup && (
        <ListGroups>
          <button type="submit">Novo Grupo</button>
        </ListGroups>
      )}
      {newGroup && <FormGrupos />}
    </div>
  );
}
const ListGroups = ({ children }) => {
  return (
    <div className="listOfGroups">
      Grupos
      {children}
      <ul>list Groups</ul>
    </div>
  );
};
const FormGrupos = () => {
  const [name, setName] = useState('');
  const handleSetName = (e) => {
    setName(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name,
    };
    console.log(data);
  };
  return (
    <div className="forms">
      <h2>Cadastro novo grupo</h2>
      <form onSubmit={handleSubmit}>
        <InputForm
          id="grupo"
          value={name}
          label="Nome grupo"
          onChange={handleSetName}
        />
        <div className="inputGroup">
          <button type="submit" className="button">
            Gravar
          </button>
          <button type="submit" className="button button-danger">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};
export default Grupos;
