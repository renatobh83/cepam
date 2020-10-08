import React, { useEffect, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import ModalConfirm from './ModalConfirm';
import InputLabel from './InputLabel';
import { useCallback } from 'react';
import { getPacientes } from '../services/API';

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
  const [horarioSelecionado, setHorarioSelecionado] = useState({
    horario: [],
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
    if (e.length > 0) {
      setExame({ ...exame, exames: e });
      setProximo(true);
    } else {
      setProximo(false);
    }
  };
  const HorarioSelecionado = (e) => {
    if (e) {
      setHorarioSelecionado({ ...horarioSelecionado, horario: e });
      setProximo(true);
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
    console.log(dadosAgendamento);
    setProximo(false);
  };
  const dadosAgendamento = {
    exames: exame.exames,
    hoarios: horarioSelecionado.horario,
    paciente: paciente.paciente,
    plano: plano.plano,
  };
  // Cancelar processo de agendamento
  const handleCancelar = () => history.push('/');

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
      {plano.selected && exame.selected && (
        <SelecetHorario setHorario={HorarioSelecionado} />
      )}
      {horarioSelecionado.selected && <div>Concluir</div>}
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
  const [pacientes, setPacientes] = useState([]);
  const [searchPaciente, setSearchPaciente] = useState(null);
  const [pSelecionado, setPSelecionado] = useState(null);

  const fetchPacientes = useCallback(async () => {
    await getPacientes().then((res) => {
      console.log(res.data.message);
      if (res.data.statusCode === 200) setPacientes(res.data.message);
    });
  }, []);

  useEffect(() => {
    fetchPacientes();
  }, []);
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
    let pacienteEdit;
    if (pSelecionado) {
      pacienteEdit = pacientes.find((i) => i._id === pSelecionado);
    }

    history.push('/pacienteForm', { pacienteEdit });
  };
  const filterSearch = !searchPaciente
    ? pacientes
    : pacientes.filter((paciente) =>
        paciente.name.toLowerCase().includes(searchPaciente.toLocaleLowerCase())
      );
  return (
    <div className="screenContainer">
      <h1>Pesquisa de paciente</h1>
      <div className="screenContent">
        <InputLabel
          value={searchPaciente}
          onchange={handleChangePesquisa}
          filter={filterSearch}
          onchangeInFilter={onChangePaciente}
          typeInput="radio"
          name="paciente"
        />
        <button
          type="submit"
          className="button"
          onClick={handleEditNewPaciente}
        >
          {pSelecionado !== null ? 'Editar Cadastro ' : 'Novo cadastro'}
        </button>
      </div>
    </div>
  );
};

//Component  pesquisa Plano
const Plano = ({ setPlano }) => {
  const [planos, setPlanos] = useState([
    { _id: 1, name: 'Unimed' },
    { _id: 2, name: 'Bradesco' },
  ]);
  const [searchPlano, setSearchPlano] = useState(null);
  const handleChangePesquisa = (e) => {
    setSearchPlano(e.target.value);
  };

  const onchangePlano = (e) => {
    if (e.target.checked) {
      setPlano(e.target.value);
    } else {
      setPlano(null);
    }
  };
  const filterSearch = !searchPlano
    ? planos
    : planos.filter((plano) =>
        plano.name.toLowerCase().includes(searchPlano.toLocaleLowerCase())
      );
  return (
    <div className="screenContainer">
      <h1>Planos</h1>
      <div className="screenContent">
        <InputLabel
          value={searchPlano}
          onchange={handleChangePesquisa}
          filter={filterSearch}
          onchangeInFilter={onchangePlano}
          typeInput="radio"
          name="planos"
        />
      </div>
    </div>
  );
};

// Component pesquisa exame
const Exame = ({ setExame }) => {
  const [exames, setExames] = useState([
    { _id: 1, name: 'Rx Torax PA' },
    { _id: 2, name: 'Rx Torax Perfil' },
    { _id: 3, name: 'Rx Torax PA LA' },
  ]);
  const [examesSelecionados, setExamesSelecionados] = useState([]);
  const [searchExame, setSearchExame] = useState(null);

  let newState = Object.assign([], examesSelecionados);
  const onchangeExame = (e) => {
    if (e.target.checked) {
      exames.forEach((ex) => {
        if (ex._id === parseInt(e.target.value)) {
          newState.push(ex);
          setExamesSelecionados([...examesSelecionados, ex]);
        }
      });
      setExame(newState);
      const filterExames = exames.filter(
        (filter) => filter._id !== parseInt(e.target.value)
      );
      setExames(filterExames);
    } else {
      const filterExames = newState.filter(
        (filter) => filter._id !== parseInt(e.target.value)
      );
      setExamesSelecionados(filterExames);
      setExame(filterExames);
    }
  };
  const deleteExame = (e) => {
    const newArray = examesSelecionados.filter((ex) => ex._id !== e._id);
    // setTotal(total - parseFloat(e.valor));
    setExames([...exames, e]);
    setExamesSelecionados(newArray);
    setExame(newArray);
  };
  const handleChangePesquisa = (e) => {
    setSearchExame(e.target.value);
  };

  const filterSearch = !searchExame
    ? exames
    : exames.filter((exame) =>
        exame.name.toLowerCase().includes(searchExame.toLocaleLowerCase())
      );
  return (
    <div className="screenContainer">
      <h1>Exames</h1>
      <div className="screenContent">
        <InputLabel
          value={searchExame}
          onchange={handleChangePesquisa}
          filter={filterSearch}
          onchangeInFilter={onchangeExame}
          typeInput="checkbox"
          name="exames"
        />
        {examesSelecionados.length > 0 && (
          <div className="examesSelecionados">
            <strong>Exames Selecionados</strong>
            {examesSelecionados.map((ex) => (
              <div className="examesSelect" key={ex.name}>
                <div className="delete">
                  <FiTrash2
                    size={15}
                    color={'red'}
                    onClick={() => deleteExame(ex)}
                  />
                </div>
                <div className="content">{ex.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
const SelecetHorario = ({ setHorario }) => {
  const setHorarioSelecionado = (e) => {
    setHorario([e]);
  };
  return (
    <div className="screenContainer">
      <h1>Seleção de horários</h1>
      <div className="screenCardContent">
        <div className="cardHorarios">
          <label htmlFor="horario" id="lb">
            <input
              type="radio"
              name="horario"
              id="horario"
              value="horario.id"
              onChange={(e) => setHorarioSelecionado(e.target.value)}
            />
            <div className="dados">
              <div className="day">horario.data</div>
              <div className="intervalo">Hora: </div>
              <div className="intervalo">Duração exame: minutos.</div>
            </div>
          </label>
        </div>
        <div className="cardHorarios">Horario</div>
        <div className="cardHorarios">Horario</div>
        <div className="cardHorarios">Horario</div>
        <div className="cardHorarios">Horario</div>
        <div className="cardHorarios">Horario</div>
        <div className="cardHorarios">Horario</div>
      </div>
    </div>
  );
};
