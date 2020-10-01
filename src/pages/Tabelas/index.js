import React, { Children, useCallback, useEffect, useState } from 'react';
import InputForm from '../../components/InputForm';

import './styles.css';

function Tabelas() {
  const [novaTabela, setNovaTabela] = useState(false);

  const [tabelas, setTabelas] = useState([
    {
      _id: 1,
      name: 'UNIMED',
      exames: [{ name: 'Rx Torax' }, { name: 'Rx Punho' }],
    },
    { _id: 2, name: 'UNIMED-rio', exames: [] },
  ]);
  const handleCriarNovaTabela = (e) => {
    setTabelas([...tabelas, e]);
    handlelCancel();
  };
  const handlelCancel = () => setNovaTabela(false);
  return (
    <div className="mainPage">
      {!novaTabela && (
        <ListTabelas tabelas={tabelas}>
          <button className="button" onClick={() => setNovaTabela(true)}>
            Nova tabela
          </button>
        </ListTabelas>
      )}
      {novaTabela && (
        <FormTabela cancel={handlelCancel} create={handleCriarNovaTabela} />
      )}
    </div>
  );
}

const ListTabelas = ({ children, tabelas }) => {
  const [tabelaExames, setTabelaExames] = useState([]);
  const [cadastrar, setCadastrar] = useState(false);
  const handlOnSelect = (e) => {
    const tabela = tabelas.filter((ex) => ex._id === parseInt(e.target.value));
    if (tabela) {
      setTabelaExames(tabela);
    }
  };

  return (
    <div className="listPage">
      <h2>Tabelas</h2>

      {children}
      {!cadastrar && (
        <div className="forms">
          <div className="inputGroup">
            <select name="tabela" id="tabela" onChange={handlOnSelect}>
              <option value="">Selecione uma tabela</option>
              {tabelas.map((tabela) => (
                <option key={tabela._id} value={tabela._id}>
                  {tabela.name}
                </option>
              ))}
            </select>

            {tabelaExames.length > 0 && (
              <button className="button" onClick={() => setCadastrar(true)}>
                Inserir/Excluir/Editar
              </button>
            )}
          </div>

          <ul>
            {tabelaExames.map((te) =>
              te.exames.map((ex) => <li>{ex.name}</li>)
            )}
          </ul>
        </div>
      )}
      {cadastrar && <InserirExame tabela={tabelaExames} />}
    </div>
  );
};

const InserirExame = ({ tabela }) => {
  console.log(tabela[0]);
  return <>Ls</>;
};
const FormTabela = ({ cancel, create }) => {
  const [name, setName] = useState('');
  const handleSetName = (e) => {
    setName(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      _id: 3,
      name,
      exames: [],
    };
    create(data);
  };

  return (
    <div className="forms">
      <h2>Cadastro nova tabela</h2>
      <form onSubmit={handleSubmit}>
        <InputForm
          id="tabela"
          value={name}
          label="Nome tabela"
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
export default Tabelas;
