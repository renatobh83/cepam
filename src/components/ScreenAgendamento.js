import React, { useEffect, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import ModalConfirm from './ModalConfirm';
import InputLabel from './InputLabel';
import { useCallback } from 'react';
import {
  getPacientes,
  getPlanoExames,
  getPlanos,
  rotaTeste,
  getPlanosAgenda,
} from '../services/API';
import { moeda } from '../utils/formatCurrency';
import Loading from '../components/Loading';
import { useAppContext } from '../store/context';

export default function ScreenAgendamento({ isPaciente, pacienteFromForm }) {
  const history = useHistory();
  const [proximo, setProximo] = useState(false);
  const [horarios, setHorarios] = useState([]);
  const [horarioEscolhido, setHorarioEscolhido] = useState([]);

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

  const horariosExames = (e) => {
    if (typeof e === 'number') {
      var array = [...horarios];
      var index = e;
      if (index !== -1) {
        array.splice(index, 1);
        setHorarios(array);
      }
    } else {
      setHorarios([...horarios, e]);
    }
  };
  const HorarioSelecionado = (e) => {
    if (e) {
      setHorarioEscolhido(e);
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
    } else if (!HorarioSelecionado.selected) {
      setHorarioSelecionado({ ...HorarioSelecionado, selected: true });
    }

    setProximo(false);
  };

  const dadosAgendamento = {
    dados: horarioEscolhido,
    paciente: paciente.paciente,
    plano: plano.plano,
  };

  // Cancelar processo de agendamento
  const handleCancelar = () => history.push('/');

  useEffect(() => {
    if (isPaciente) {
      if (pacienteFromForm !== undefined) {
        // console.log(pacienteFromForm);
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
        <Exame
          setExame={ExamesSelecionado}
          plano={plano}
          horariosAgendamento={horariosExames}
        />
      )}
      {plano.selected && exame.selected && !horarioSelecionado.selected && (
        <SelectHorario setHorario={HorarioSelecionado} horarios={horarios} />
      )}
      {horarioSelecionado.selected && (
        <ConcluirAgendamento dados={dadosAgendamento} />
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
  const [pacientes, setPacientes] = useState([]);
  const [searchPaciente, setSearchPaciente] = useState(null);
  const [pSelecionado, setPSelecionado] = useState(null);

  const fetchPacientes = useCallback(async () => {
    await getPacientes().then((res) => {
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
  const [planos, setPlanos] = useState([]);
  const [searchPlano, setSearchPlano] = useState(null);

  const fetchPlanos = useCallback(async () => {
    try {
      const { data: planos } = await getPlanosAgenda();
      setPlanos(planos.message);
    } catch (error) {}
  }, []);

  useEffect(() => {
    fetchPlanos();
  }, []);
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
const Exame = ({ setExame, plano, horariosAgendamento }) => {
  const [exames, setExames] = useState([]);
  const [examesSelecionados, setExamesSelecionados] = useState([]);
  const [searchExame, setSearchExame] = useState(null);
  const [total, setTotal] = useState(0);
  const [particular, setParticular] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const fetchExames = useCallback(async () => {
    const { data: exames } = await getPlanoExames(plano.plano);
    if (exames.message.length > 0) {
      setParticular(exames.message[0].particular);
      setExames(exames.message[0].ex.exames);
      setIsLoading(false);
    }
  });
  useEffect(() => {
    fetchExames();
  }, []);

  let newState = Object.assign([], examesSelecionados);

  const onchangeExame = (e) => {
    if (e.target.checked) {
      for (const ex of exames) {
        if (ex.exame.name === e.target.value) {
          newState.push(ex);
          setIsLoading(true);
          rotaTeste(ex.exame.setor).then((res) => {
            setIsLoading(false);
            if (!res.data.message.setorHorario.length) {
              alert('Sem horarios para esse exame');
            } else {
              setTotal(total + parseFloat(ex.valor));
              // console.log(res.data.message);
              const dados = {
                ex: ex.exame,
                horario: res.data.message.setorHorario,
                horarios: res.data.message.horarios,
              };
              horariosAgendamento(dados);
              setExamesSelecionados([...examesSelecionados, ex]);
            }
          });
        }
      }
      setExame(newState);
      const filterExames = exames.filter(
        (filter) => filter.exame.name !== e.target.value
      );
      setExames(filterExames);
    } else {
      const filterExames = newState.filter(
        (filter) => filter.exame.name !== e.target.value
      );
      setExamesSelecionados(filterExames);
      setExame(filterExames);
    }
  };
  const deleteExame = (e) => {
    const newArray = examesSelecionados.filter(
      (ex) => ex.exame._id !== e.exame._id
    );
    horariosAgendamento(examesSelecionados.indexOf(e));
    setTotal(total - parseFloat(e.valor));
    setExames([...exames, e]);
    setExamesSelecionados(newArray);
    setExame(newArray);
  };

  const handleChangePesquisa = (e) => {
    setSearchExame(e.target.value);
  };

  const filterSearch = !searchExame
    ? exames
    : exames.filter((e) =>
        e.exame.name.toLowerCase().includes(searchExame.toLocaleLowerCase())
      );
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="screenContainer">
      <h1>Exames</h1>
      <div className="screenContent">
        <input
          type="search"
          value={searchExame}
          placeholder="Pesquisa"
          onChange={handleChangePesquisa}
        />
        <ul>
          {filterSearch.map((ex) => (
            <li key={ex.exame._id}>
              <label htmlFor={ex.exame._id}>
                <input
                  type="checkbox"
                  value={ex.exame.name}
                  onClick={(e) => onchangeExame(e)}
                  id={ex.exame._id}
                ></input>
                {ex.exame.name}
              </label>
            </li>
          ))}
        </ul>
        {examesSelecionados.length > 0 && (
          <div className="examesSelecionados">
            <strong>Exames Selecionados</strong>
            {examesSelecionados.map((ex) => (
              <div className="examesSelect" key={ex.exame.name}>
                <div className="delete">
                  <FiTrash2
                    size={15}
                    color={'red'}
                    onClick={() => deleteExame(ex)}
                  />
                </div>
                <div className="content">
                  {ex.exame.name} {particular && ` - ${moeda(ex.valor)}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
const SelectHorario = ({ setHorario, horarios }) => {
  const [limitHorario] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [horariosExame, setHorariosExame] = useState([]);
  const [stop, setStop] = useState(0);
  const [exameAtual, setExameAtual] = useState('');
  const [horarioSelect, setHorarioSelect] = useState([]);
  const [isCloncluir, setIsConcluir] = useState(false);
  const [horario, setHorarioChoose] = useState('');

  const setHorarioSelecionado = (e) => {
    setHorarioChoose(e);
  };
  horarios.sort((a, b) => {
    return new Date(a.horario[0].data) - new Date(b.horario[0].data);
  });
  const getHorarios = () => {
    if (stop < horarios.length) {
      setExameAtual(horarios[stop].ex.name);
      setHorariosExame(
        horarios[stop].horarios.sort((a, b) => {
          return a.periodo.horaInicio - b.periodo.horaInicio;
        })
      );
    }
    if (horarios.length > 1 && horario) {
      let newHorary = [];
      horarios[stop].horarios.forEach((a) => {
        a.periodo.filter((i) => {
          if (i.horaInicio > horario.horaInicio) {
            newHorary.push(i);
          }
        });
        const periodo = [
          {
            periodo: newHorary,
          },
        ];
        setHorariosExame(periodo);
      });
    }
  };

  const handleConcluir = () => {
    const data = [
      {
        exame: horarios[stop].ex,
        horario: horario,
      },
    ];
    if (horarios.length === 1) {
      setHorario(data);
    } else {
      setHorario([...horarioSelect, data]);
    }
    setIsConcluir(true);
  };
  const setProximoExame = () => {
    const data = [
      {
        exame: horarios[stop].ex,
        horario: horario,
      },
    ];

    setHorarioSelect([...horarioSelect, data]);
    setStop(stop + 1);
  };

  useEffect(() => {
    getHorarios();
  }, [stop]);

  //pagination
  const indexOfLastPage = currentPage * limitHorario;
  const indexOfFirstPage = indexOfLastPage - limitHorario;
  // const current = horariosDisponivel.slice(indexOfFirstPage, indexOfLastPage);

  return (
    <>
      <div className="screenContainer">
        <h1>Seleção de horários</h1>
        <h1>{exameAtual}</h1>
        <div className="screenCardContent">
          {horariosExame.map((a) =>
            a.periodo.map((h) => (
              <div className="cardHorarios" key={h.id}>
                <label htmlFor={h.id}>
                  <input
                    name="horario"
                    type="radio"
                    id={h.id}
                    value={h.id}
                    onChange={() => setHorarioSelecionado(h)}
                  />
                  <div className="dados">
                    <div className="day">{h.data}</div>
                    <div className="intervalo">Hora: {h.horaInicio} </div>
                    <div className="intervalo">Duração exame: minutos.</div>
                  </div>
                </label>
              </div>
            ))
          )}
        </div>
        {horarios.length > 1 && horarios.length - 1 !== stop && (
          <button onClick={setProximoExame} className="button">
            Proximo exame
          </button>
        )}
        {horario && !isCloncluir && (
          <button onClick={handleConcluir} className="button">
            Concluir
          </button>
        )}
      </div>
    </>
  );
};
const ConcluirAgendamento = (props) => {
  const { user } = useAppContext();

  return <div>Concluir</div>;
};
