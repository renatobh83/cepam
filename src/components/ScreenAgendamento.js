import React, { useEffect, useState } from "react";
import { FiCloudLightning } from "react-icons/fi";
import { useHistory } from "react-router-dom";
import ModalConfirm from "./ModalConfirm";

export default function ScreenAgendamento({ isPaciente, pacienteFromForm }) {
  const history = useHistory();
  const [proximo, setProximo] = useState(false);
  const [paciente, setPaciente] = useState({
    paciente: null,
    selected: false,
  });
  const [plano, setPlano] = useState({
    plano: null,
    selected: false,
  });

  const [exame, setExame] = useState({
    exames: [],
    selected: false,
  });
  // Func selecionar plano
  const planoSelecionado = (e) => {
    if (e) {
      setPlano({ ...plano, plano: e });
      setProximo(true);
    } else {
      setPlano({ ...plano, plano: e });
      setProximo(false);
    }
  };

  // Func selecionar paciente
  const pacienteSelecionado = (e) => {
    if (e) {
      setPaciente({ ...paciente, paciente: e });
      setProximo(true);
    } else {
      setPaciente({ ...paciente, paciente: e });
      setProximo(false);
    }
  };

  // Func selecionar Exame
  const ExamesSelecionado = (e) => {
    if (e) {
      setExame({ ...exame, exame: e });
      setProximo(true);
    } else {
      setExame({ ...exame, exame: e });
      setProximo(false);
    }
  };
  // Ativa butao avancar
  const buttonProximo = () => {
    if (!paciente.selected) {
      setPaciente({ ...paciente, selected: true });
    } else if (!plano.selected) {
      setPlano({ ...plano, selected: true });
    } else if (!exame.selected) {
      setExame({ ...exame, selected: true });
    }
    // console.log(plano, exame, paciente);
    setProximo(false);
  };

  // Cancelar processo de agendamento
  const handleCancelar = () => history.push("/");

  useEffect(() => {
    if (isPaciente) {
      if (pacienteFromForm !== undefined) {
        console.log(pacienteFromForm);
      }
      setPaciente({ ...paciente, selected: true });
    }
  }, []);
  return (
    <div className="agendamentoContainer">
      {!isPaciente && !paciente.selected && (
        <ChoosePaciente setPaciente={pacienteSelecionado} />
      )}

      {!plano.selected && paciente.selected && (
        <Plano setPlano={planoSelecionado} />
      )}
      {!exame.selected && plano.selected && (
        <Exame setExame={ExamesSelecionado} />
      )}
      <div className="grupo-btn">
        {proximo && (
          <button className="button" onClick={buttonProximo}>
            Proximo
          </button>
        )}
        <ModalConfirm
          tile="Confirmação"
          description="Tem certeza que deseja cancelar"
        >
          {(confirm) => (
            <button
              className="button button-danger"
              onClick={confirm(handleCancelar)}
            >
              Cancelar
            </button>
          )}
        </ModalConfirm>
      </div>
    </div>
  );
}
// Component pesquisa paciente
const ChoosePaciente = ({ setPaciente }) => {
  const history = useHistory();
  const [pacientes, setPacientes] = useState([
    { _id: 1, name: "Renato" },
    { _id: 2, name: "Gabriel" },
  ]);
  const [searchPaciente, setSearchPaciente] = useState(null);
  const [pSelecionado, setPSelecionado] = useState(null);
  const onChangePaciente = (e) => {
    if (e.target.checked) {
      setPaciente(e.target.value);
      setPSelecionado(e.target.value);
    } else {
      setPaciente(null);
      setPSelecionado(null);
    }
  };

  const handleChangePesquisa = (e) => {
    setSearchPaciente(e.target.value);
  };
  const handleEditNewPaciente = () => {
    history.push("/pacienteForm", { paciente: pSelecionado });
  };
  const filterSearch = !searchPaciente
    ? pacientes
    : pacientes.filter((paciente) =>
        paciente.name.toLowerCase().includes(searchPaciente.toLocaleLowerCase())
      );
  return (
    <div className="pacienteContainer">
      <h1>Pesquisa de paciente</h1>
      <div className="pacienteContent">
        <input
          type="search"
          value={searchPaciente}
          name="pesquisapaciente"
          id="pesquisapaciente"
          placeholder="Pesquisa"
          onChange={handleChangePesquisa}
        />
        <ul>
          {filterSearch.map((paciente) => (
            <li key={paciente._id}>
              <input
                type="radio"
                name="paciente"
                id={paciente._id}
                className="regular-radio"
                value={paciente._id}
                onChange={onChangePaciente}
              />

              <label htmlFor={paciente._id}>{paciente.name}</label>
            </li>
          ))}
        </ul>
        <button
          type="submit"
          className="button"
          onClick={handleEditNewPaciente}
        >
          {pSelecionado !== null ? "Editar Cadastro " : "Novo cadastro"}
        </button>
      </div>
    </div>
  );
};

//Component  pesquisa Plano
const Plano = ({ setPlano }) => {
  const onchangePlano = (e) => {
    if (e.target.checked) {
      setPlano(e.target.value);
    } else {
      setPlano(null);
    }
  };
  return (
    <div>
      List Of Plans
      <ul>
        <label htmlFor="plano">Plano A</label>
        <input
          type="checkbox"
          name="plano"
          id="plano"
          value="Plan"
          onChange={onchangePlano}
        />
      </ul>
    </div>
  );
};

// Component pesquisa exame
const Exame = ({ setExame }) => {
  const onchangeExame = (e) => {
    if (e.target.checked) {
      setExame(e.target.value);
    } else {
      setExame([]);
    }
  };
  return (
    <div>
      List Of Exams
      <ul>
        <label htmlFor="plano">Exame</label>
        <input
          type="checkbox"
          name="plano"
          id="plano"
          value="Plan"
          onChange={onchangeExame}
        />
      </ul>
    </div>
  );
};
