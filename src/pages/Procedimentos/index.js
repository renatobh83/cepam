import React, { useCallback, useEffect, useState } from 'react';

import './styles.css';
import ModalConfirm from '../../components/ModalConfirm';
import InputForm from '../../components/InputForm';
import Loading from '../../components/Loading';
import { FiDownload } from 'react-icons/fi';
import {
  getProcedimentos,
  getSetoresCadastro,
  postProcedimento,
  procedimentoApagar,
  putProcedimento,
} from '../../services/API';
import generatePDF from '../../utils/exportJSPDF';
import ErroPermission from '../../utils/chekPermission';
import { useHistory } from 'react-router-dom';

function Procedimentos() {
  const [newProcedimento, setNewProcedimento] = useState(false);
  const [procedimetnoEdit, setProcedimentoEdit] = useState(null);
  const [setorSelect, setSetorSelect] = useState(null);
  const [procedimentos, setProcedimentos] = useState([]);
  const [setores, setSetores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();
  const fetchSetores = useCallback(async () => {
    const { data: setores } = await getSetoresCadastro();
    setSetores(setores.message);
    setIsLoading(false);
  }, []); // eslint-disable-line

  const fetchProcedimentos = useCallback(async () => {
    try {
      const { data: procedimentos } = await getProcedimentos();
      setProcedimentos(procedimentos.message);
      fetchSetores();
    } catch (error) {
      ErroPermission(error, setIsLoading, history);
    }
  }, []); // eslint-disable-line
  useEffect(() => {
    fetchProcedimentos();
  }, []); // eslint-disable-line
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
    const valueCheck = e.target;
    const data = {
      ativo: value,
    };
    try {
      await putProcedimento(valueCheck.value, data).then((res) => {
        if (res.data.statusCode === 400) {
          valueCheck.checked = true;
          return alert(res.data.message);
        }
      });
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
      procedimetnoEdit(true, e);
    } else {
      procedimetnoEdit(false, e);
    }
  };
  const apagarProcedimento = async (e) => {
    try {
      await procedimentoApagar(e).then((res) => {
        if (res.data.statusCode === 400) {
          return alert(res.data.message);
        } else {
          deleteProcedimento(e);
        }
      });
    } catch (error) {}
  };
  const filterChange = (e) => {
    selectSetor(e);
    setProcedimentofilter(e);
  };

  const exportarPdf = () => {
    setores.filter((s) => {
      return exibirProcedimentos.forEach((a, index) => {
        if (s._id === a.setor) {
          exibirProcedimentos[index].setorName = s.name;
        }
      });
    });
    const data = exibirProcedimentos.map((p) => [p.setorName, p.name, p.ativo]);
    generatePDF([['Setor', 'Exame', 'Ativo']], 'Lista de procedimentos', data);
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
      <FiDownload
        size={20}
        style={{ cursor: 'pointer' }}
        onClick={exportarPdf}
      />
      <ul>
        {exibirProcedimentos.map((procedimento) => (
          <li key={procedimento._id} className="procedimentosLi">
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
  }, []); // eslint-disable-line
  useEffect(() => {
    dateprocedimentoEdit();
  }, []); // eslint-disable-line
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
