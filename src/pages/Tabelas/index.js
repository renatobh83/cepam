import React, { Children, useCallback, useEffect, useState } from 'react';
import InputForm from '../../components/InputForm';

import './styles.css';
import InputMask from 'react-input-mask';
import { FiSearch, FiTrash2 } from 'react-icons/fi';

function Tabelas() {
  const [novaTabela, setNovaTabela] = useState(false);

  const [tabelas, setTabelas] = useState([
    // {
    //   _id: 1,
    //   name: 'UNIMED',
    //   exames: [
    //     { _id: 1, name: 'Rx Torax' },
    //     { _id: 2, name: 'Rx Punho' },
    //   ],
    // },
    // { _id: 2, name: 'UNIMED-rio', exames: [] },
  ]);
  const handleCriarNovaTabela = (e) => {
    console.log(typeof e);
    e.forEach((a) => console.log(a));
    setTabelas([...tabelas, e]);
    handlelCancel();
  };
  const handlelCancel = () => setNovaTabela(false);
  return (
    <div className="mainPage">
      {!novaTabela && (
        <ListTabelas tabelas={tabelas} att={handleCriarNovaTabela}>
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

const ListTabelas = ({ children, tabelas, att }) => {
  const [tabelaExames, setTabelaExames] = useState([]);
  const [cadastrar, setCadastrar] = useState(false);
  const handlOnSelect = (e) => {
    const tabela = tabelas.filter((ex) => ex._id === parseInt(e.target.value));
    if (tabela) {
      setTabelaExames(tabela);
    }
  };
  const handleClose = () => {
    setTabelaExames([]);
    setCadastrar(false);
  };

  const atualizaTabela = (e) => {
    att(e);
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
              te.exames.map((ex) => <li key={ex._id}>{ex.name}</li>)
            )}
          </ul>
        </div>
      )}
      {cadastrar && (
        <InserirExame
          tabela={tabelaExames}
          close={handleClose}
          atualiza={atualizaTabela}
        />
      )}
    </div>
  );
};

const InserirExame = ({ tabela, close, atualiza }) => {
  const [exames, setExames] = useState([
    { _id: 1, name: 'Rx Torax' },
    { _id: 2, name: 'Rx Torax pa' },
  ]);
  const [examesSelecionados, setExamesSelecionados] = useState([]);
  const [filterSearch, setFilterSearch] = useState(null);

  // cadastrar exame na tabela
  const insertExame = (e, x) => {
    if (x.target.checked) {
      setExamesSelecionados([...examesSelecionados, { exame: e, valor: null }]);
      const filterES = exames.filter((exame) => exame.name !== e.name);
      setExames(filterES);
    } else {
      deleteExame(e);
    }
  };

  // pegar valor da pesquisa
  const handleChange = (e) => {
    setFilterSearch(e.target.value);
  };

  // apagar exame da tabela
  const deleteExame = (e) => {
    const newArray = examesSelecionados.filter(
      (ex) => ex.exame.name !== e.exame.name
    );
    setExames([...exames, e.exame]);
    setExamesSelecionados(newArray);
  };
  // Pegar preco do exame
  const handleChangeInput = (e, index) => {
    examesSelecionados[index].valor = e.target.value;
  };
  const handleSubmit = () => {
    tabela[0].exames = examesSelecionados;
    console.log(tabela);
    atualiza(tabela);
    close();
  };

  const result = !filterSearch
    ? exames
    : exames.filter((exame) =>
        exame.name.toLowerCase().includes(filterSearch.toLocaleLowerCase())
      );

  return (
    <div className="examesList">
      <div className="buscarExame">
        <input
          type="search"
          defaultValue={filterSearch}
          placeholder="Procura"
          onChange={handleChange}
        />
        <div className="icon">
          <FiSearch size={30} />
        </div>
      </div>
      <ul>
        {result.map((exame) => (
          <li key={exame._id}>
            <label htmlFor={exame._id}>
              <input
                type="checkbox"
                id={exame._id}
                name="exames"
                className="exames-check"
                defaultValue={exame._id}
                onClick={(e) => insertExame(exame, e)}
              />
              {exame.name}
            </label>
          </li>
        ))}
      </ul>
      {examesSelecionados.length > 0 && (
        <div className="examesSelecionados">
          {examesSelecionados.map((exame, index) => (
            <div className="examesSelect" key={index}>
              <div className="delete">
                <button>
                  <FiTrash2
                    size={15}
                    color={'red'}
                    onClick={() => deleteExame(exame)}
                  />
                </button>
              </div>
              <div className="contentExamInTable">
                <span> {exame.exame.name}</span>
                <InputMask
                  type="text"
                  id="valor"
                  inputMode="decimal"
                  defaultValue={examesSelecionados[index].valor}
                  placeholder="Valor"
                  onChange={(e) => handleChangeInput(e, index)}
                  // onKeyPress={(e) => moeda(e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="inputGroup">
        <button type="submit" className="button" onClick={handleSubmit}>
          Gravar
        </button>
        <button type="submit" className="button button-danger" onClick={close}>
          Cancelar
        </button>
      </div>
    </div>
  );
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
