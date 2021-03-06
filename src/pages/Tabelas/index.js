import React, { useCallback, useEffect, useState } from 'react';
import InputForm from '../../components/InputForm';

import './styles.css';
import InputMask from 'react-input-mask';
import { FiSearch, FiTrash2, FiDownload } from 'react-icons/fi';
import { moeda } from '../../utils/formatCurrency';
import ModalConfirm from '../../components/ModalConfirm';
import Loading from '../../components/Loading';
import {
  procedimentoTabela,
  postTabelas,
  putNomeTabela,
  tabelaApagar,
  putTabelas,
  getTabelas,
} from '../../services/API';
import generatePDF from '../../utils/exportJSPDF';
import ErroPermission from '../../utils/chekPermission';
import { useHistory } from 'react-router-dom';

function Tabelas() {
  const [novaTabela, setNovaTabela] = useState(false);
  const [tabelaSelect, setTabelaSelect] = useState(null);
  const [tabelas, setTabelas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const handleCriarNovaTabela = (e) => {
    setTabelas([...tabelas, e]);
    handlelCancel();
  };

  const fetchTabelas = useCallback(async () => {
    try {
      const { data: tabelas } = await getTabelas();

      setTabelas(tabelas.message);
      setIsLoading(false);
    } catch (error) {
      ErroPermission(error, setIsLoading, history);
    }
  }, []); // eslint-disable-line
  useEffect(() => {
    fetchTabelas();
  }, []); // eslint-disable-line
  const tabelaSelecionada = (e) => {
    setTabelaSelect(e);
  };

  const handlelCancel = () => {
    setTabelaSelect(null);
    setNovaTabela(false);
  };
  const propsForm = {
    cancel: () => handlelCancel(),
    create: (...p) => handleCriarNovaTabela(...p),
    edit: tabelaSelect,
    tabelas: tabelas,
  };
  const propsList = {
    Tabelas: tabelas,
    tabelaSelecionada: (...p) => tabelaSelecionada(...p),
  };
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="main">
      {!novaTabela && (
        <ListTabelas configList={propsList}>
          <button
            className={tabelaSelect ? 'button edit' : 'button'}
            onClick={() => setNovaTabela(true)}
          >
            {tabelaSelect ? 'Editar tabela' : 'Nova tabela'}
          </button>
        </ListTabelas>
      )}
      {novaTabela && <FormTabela configProp={propsForm} />}
    </div>
  );
}

const ListTabelas = ({ children, configList }) => {
  const { Tabelas: tabelas, tabelaSelecionada: tabelaSelect } = configList;
  const [tabelaExames, setTabelaExames] = useState([]);
  const [cadastrar, setCadastrar] = useState(false);
  const handlOnSelect = (e) => {
    const tabela = tabelas.filter((ex) => ex._id === e.target.value);

    if (tabela) {
      setTabelaExames(tabela);
      tabelaSelect(tabela);
    }
    if (e.target.value === '#') {
      tabelaSelect(null);
    }
  };
  const exportPdf = () => {
    const data = tabelaExames[0].exames.map((e) => [
      e.exame.name,
      moeda(e.valor),
    ]);

    const info = `Relatório tabela ${tabelaExames[0].name}`;
    generatePDF([['Exames', 'Valor']], info, data);
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
            <select
              name="tabela"
              id="tabela"
              onChange={handlOnSelect}
              style={{ margin: 0, padding: 0 }}
            >
              <option value="#">Selecione uma tabela</option>
              {tabelas.map((tabela) => (
                <option key={tabela._id} value={tabela._id}>
                  {tabela.name}
                </option>
              ))}
            </select>

            {tabelaExames.length > 0 && (
              <>
                <span>
                  <FiDownload
                    size={20}
                    style={{ cursor: 'pointer' }}
                    onClick={exportPdf}
                  />
                </span>
                <button className="button" onClick={() => setCadastrar(true)}>
                  Exames
                </button>
              </>
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
  const [exames, setExames] = useState([]);

  const fetchExames = useCallback(async () => {
    const { data: proc } = await procedimentoTabela();
    setExames(proc.message);
    selectInitialExames(proc.message);
  }, []); // eslint-disable-line
  useEffect(() => {
    fetchExames();
  }, []); // eslint-disable-line

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
  const handleSubmit = async () => {
    tabela[0].exames = examesSelecionados;
    try {
      await putTabelas(tabela[0]._id, examesSelecionados);
      close();
    } catch (error) {}
  };
  // Carrega exames ja inserido na tabela
  const selectInitialExames = (e) => {
    setExamesSelecionados(tabela[0].exames);
    const getExames = tabela[0].exames.map((ex) => ex.exame);

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
            <label htmlFor={exame._id} style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                id={exame._id}
                name="exames"
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
                  required
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
const FormTabela = ({ configProp }) => {
  const [name, setName] = useState('');
  const handleSetName = (e) => {
    setName(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name,
      exames: [],
    };
    if (configProp.edit) {
      configProp.edit[0].name = name;
      try {
        await putNomeTabela(configProp.edit[0]._id, data);
        configProp.cancel();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const { data: tabela } = await postTabelas(data);
        if (tabela.statusCode === 409) {
          alert('Tabela ja cadastrada');
        } else {
          configProp.create(tabela.message);
        }
      } catch (error) {}
    }
  };
  const apagarTabela = async () => {
    try {
      await tabelaApagar(configProp.edit[0]._id);
    } catch (error) {}
    const index = configProp.tabelas.findIndex(
      (element) => element._id === configProp.edit[0]._id
    );
    configProp.tabelas.splice(index, 1);
    configProp.cancel();
  };
  useEffect(() => {
    if (configProp.edit) setName(configProp.edit[0].name);
  }, []); // eslint-disable-line
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
            onClick={configProp.cancel}
          >
            Cancelar
          </button>
        </div>
      </form>
      {configProp.edit && (
        <ModalConfirm
          title="Confirma"
          description="Confirma a exclusão da tabela"
        >
          {(confirm) => (
            <button
              className="button button-danger"
              onClick={confirm(apagarTabela)}
            >
              Apagar tabela
            </button>
          )}
        </ModalConfirm>
      )}
    </div>
  );
};
export default Tabelas;
