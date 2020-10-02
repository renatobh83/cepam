import React, { Children, useCallback, useEffect, useState } from "react";
import InputForm from "../../components/InputForm";

import "./styles.css";
import InputMask from "react-input-mask";
import { FiSearch, FiTrash2 } from "react-icons/fi";
import { moeda } from "../../utils/formatCurrency";

function Tabelas() {
  const [novaTabela, setNovaTabela] = useState(false);
  const [tabelaSelect, setTabelaSelect] = useState(null);
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
    setTabelas([...tabelas, e]);
    handlelCancel();
  };

  const tabelaSelecionada = (e) => {
    setTabelaSelect(e);
  };

  const handlelCancel = () => {
    setTabelaSelect(null);
    setNovaTabela(false);
  };
  return (
    <div className="mainPage">
      {!novaTabela && (
        <ListTabelas tabelas={tabelas} tabelaSelect={tabelaSelecionada}>
          <button
            className={tabelaSelect ? "button edit" : "button"}
            onClick={() => setNovaTabela(true)}
          >
            {tabelaSelect ? "Editar tabela" : "Nova tabela"}
          </button>
        </ListTabelas>
      )}
      {novaTabela && (
        <FormTabela cancel={handlelCancel} create={handleCriarNovaTabela} />
      )}
    </div>
  );
}

const ListTabelas = ({ children, tabelas, tabelaSelect }) => {
  const [tabelaExames, setTabelaExames] = useState([]);
  const [cadastrar, setCadastrar] = useState(false);
  const handlOnSelect = (e) => {
    const tabela = tabelas.filter((ex) => ex._id === parseInt(e.target.value));
    if (tabela) {
      setTabelaExames(tabela);
      tabelaSelect(tabela);
    }
    if (e.target.value === "#") {
      tabelaSelect(null);
    }
  };
  const handleClose = () => {
    setTabelaExames([]);
    tabelaSelect(null);
    setCadastrar(false);
  };

  return (
    <div className="listPage">
      <h2>Tabelas</h2>

      {children}
      {!cadastrar && (
        <div className="forms">
          <div className="inputGroup">
            <select name="tabela" id="tabela" onChange={handlOnSelect}>
              <option value="#">Selecione uma tabela</option>
              {tabelas.map((tabela) => (
                <option key={tabela._id} value={tabela._id}>
                  {tabela.name}
                </option>
              ))}
            </select>

            {tabelaExames.length > 0 && (
              <button className="button" onClick={() => setCadastrar(true)}>
                Inserir/Excluir exames
              </button>
            )}
          </div>

          {tabelaExames.map((te) =>
            te.exames.map((ex) => (
              <div className="tableProcContent" key={ex.exame._id}>
                <span>{ex.exame.name}</span>
                <span>{moeda(ex.valor)}</span>
              </div>
            ))
          )}
        </div>
      )}
      {cadastrar && <InserirExame tabela={tabelaExames} close={handleClose} />}
    </div>
  );
};

const InserirExame = ({ tabela, close }) => {
  const [exames, setExames] = useState([
    { _id: 1, name: "Rx Torax" },
    { _id: 2, name: "Rx Torax pa" },
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
    close();
  };
  // Carrege exames ja inserido na tabela
  const selectInitialExames = (e) => {
    setExamesSelecionados(tabela[0].exames);
    const getExames = tabela[0].exames.map((e) => e.exame);
    const myArrayFiltered = e.filter((el) => {
      return !getExames.some((f) => {
        return f._id === el._id;
      });
    });
    setExames(getExames.length === 0 ? e : myArrayFiltered);
  };

  const result = !filterSearch
    ? exames
    : exames.filter((exame) =>
        exame.name.toLowerCase().includes(filterSearch.toLocaleLowerCase())
      );
  useEffect(() => {
    selectInitialExames(exames);
  }, []);
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
          <h3>Exames ja inserido na tabela</h3>
          {examesSelecionados.map((exame, index) => (
            <div className="examesSelect" key={index}>
              <div className="delete">
                <button>
                  <FiTrash2
                    size={15}
                    color={"red"}
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
  const [name, setName] = useState("");
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
