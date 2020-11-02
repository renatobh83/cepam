import React, { useEffect, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import ModalConfirm from './ModalConfirm';
import InputLabel from './InputLabel';
import { useCallback } from 'react';
import {
  getPacientes,
  getPlanoExames,
  searchHorario,
  getPlanosAgenda,
  postAgendamento,
  updateHorario,
  getAgendamento,
} from '../services/API';
import { moeda } from '../utils/formatCurrency';
import Loading from '../components/Loading';
import { useAppContext } from '../store/context';
import {
  compare,
  filterHorariosMesmoSetor,
  proximoIntervalo,
} from '../utils/filterHorariosAgendamento';
import Pagination from './Pagination';

export default function ScreenAgendamento({ isPaciente, close }) {
  const history = useHistory();
  const [proximo, setProximo] = useState(false);
  const [horarios, setHorarios] = useState([]);
  const [horarioEscolhido, setHorarioEscolhido] = useState([]);
  const [horarioUpdate, setHorarioUpdate] = useState([]);

  const [dadosParticular, setDadosPaticular] = useState({
    isParticular: false,
    total: 0,
  });

  // pega o paciente selecionado
  const [paciente, setPaciente] = useState({
    paciente: null,
    selected: false,
  });
  //pega plano do paciente
  const [plano, setPlano] = useState({
    plano: null,
    selected: false,
  });

  //pega os exames para agendamento
  const [exame, setExame] = useState({
    exames: [],
    selected: false,
  });

  //pega os horarios escolhido
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
  // Fun selecionar horarios
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

  const horarioForUpdate = (e) => {
    setHorarioUpdate([...horarioUpdate, e]);
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

  // dados para conclusao do agendamento
  const dadosAgendamento = {
    dados: horarioEscolhido,
    paciente: paciente.paciente,
    plano: plano.plano,
    dadosParticular,
  };

  // Cancelar processo de agendamento
  const handleCancelar = () => {
    history.push('/');
    if (close) {
      close();
    }
  };

  useEffect(() => {
    if (isPaciente) {
      if (isPaciente.paciente) {
        setPaciente({ paciente: isPaciente._id, selected: true });
      }
    }
  }, []); // eslint-disable-line
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
          particularSet={setDadosPaticular}
        />
      )}
      {plano.selected && exame.selected && !horarioSelecionado.selected && (
        <SelectHorario
          setHorario={HorarioSelecionado}
          horarios={horarios}
          update={horarioForUpdate}
        />
      )}
      {horarioSelecionado.selected && (
        <ConcluirAgendamento
          agendamento={dadosAgendamento}
          update={horarioUpdate}
        />
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
  const [searchPaciente, setSearchPaciente] = useState('');
  const [pSelecionado, setPSelecionado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAgendamentos, setIsAgendamentos] = useState(false);

  const fetchPacientes = useCallback(async () => {
    await getPacientes().then((res) => {
      setIsLoading(false);
      if (res.data.statusCode === 200) setPacientes(res.data.message);
    });
  }, []); // eslint-disable-line

  const consultaAgendamento = useCallback(async (paciente) => {
    await getAgendamento(paciente).then((res) => {
      if (res.data.message.length) {
        setIsAgendamentos(true);
      } else {
        setIsAgendamentos(false);
      }
    });
  }, []); // eslint-disable-line
  const handleConsultaAgandamento = () =>
    history.push({ pathname: '/agendamentos', state: { user: pSelecionado } });

  useEffect(() => {
    fetchPacientes();
  }, []); // eslint-disable-line

  const onChangePaciente = (e) => {
    if (e.target.checked) {
      consultaAgendamento(e.target.value);
      setPaciente(e.target.value);
      setPSelecionado(e.target.value);
    } else {
      e.target.removeAttr('checked');
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

  if (isLoading) {
    return <Loading />;
  }

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
          otp={'dtNascimento'}
        />
        {!isAgendamentos && (
          <button
            type="submit"
            className="button"
            onClick={handleEditNewPaciente}
          >
            {pSelecionado !== null ? 'Editar Cadastro ' : 'Novo cadastro'}
          </button>
        )}
        {isAgendamentos && (
          <div className="grupo-btn">
            <button
              type="submit"
              className="button"
              onClick={handleEditNewPaciente}
            >
              {pSelecionado !== null ? 'Editar Cadastro ' : 'Novo cadastro'}
            </button>

            <button className="button" onClick={handleConsultaAgandamento}>
              Consulta Agendamentos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

//Component  pesquisa Plano
const Plano = ({ setPlano }) => {
  const [planos, setPlanos] = useState([]);
  const [searchPlano, setSearchPlano] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const fetchPlanos = useCallback(async () => {
    try {
      const { data: planos } = await getPlanosAgenda();
      setPlanos(planos.message);
      setIsLoading(false);
    } catch (error) {}
  }, []); // eslint-disable-line

  useEffect(() => {
    fetchPlanos();
  }, []); // eslint-disable-line
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

  if (isLoading) {
    return <Loading />;
  }
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
const Exame = ({ setExame, plano, horariosAgendamento, particularSet }) => {
  const [exames, setExames] = useState([]);
  const [examesSelecionados, setExamesSelecionados] = useState([]);
  const [searchExame, setSearchExame] = useState('');
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
  }, []); //eslint-disable-line
  useEffect(() => {
    fetchExames();
  }, []); // eslint-disable-line

  let newState = Object.assign([], examesSelecionados);

  // selecao de exames
  const onchangeExame = (e) => {
    if (e.target.checked) {
      for (const ex of exames) {
        if (ex.exame.name === e.target.value) {
          newState.push(ex);
          setIsLoading(true);
          searchHorario(ex.exame.setor).then((res) => {
            setIsLoading(false);

            if (!res.data.message.setorHorario.length) {
              alert('Sem horarios para esse exame');
            } else {
              setTotal(total + parseFloat(ex.valor));
              if (particular) {
                particularSet({
                  isParticular: particular,
                  total: total + parseFloat(ex.valor),
                });
              }
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

  // apagar exame selecionado
  const deleteExame = (e) => {
    const newArray = examesSelecionados.filter(
      (ex) => ex.exame._id !== e.exame._id
    );
    horariosAgendamento(examesSelecionados.indexOf(e));
    setTotal(total - parseFloat(e.valor));
    if (particular) {
      particularSet({
        isParticular: particular,
        total: total - parseFloat(e.valor),
      });
    }
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
const SelectHorario = ({ setHorario, horarios, update }) => {
  const [limitHorario] = useState(5);
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
  // ordernar data de horario
  horarios.sort((a, b) => {
    return new Date(a.horario[0].data) - new Date(b.horario[0].data);
  });
  const getHorarios = () => {
    if (stop < horarios.length) {
      setExameAtual(horarios[stop].ex.name);
      setHorariosExame(horarios[stop].horarios.sort(compare));
    }

    if (horarios.length > 1 && horario) {
      let newHorary = [];
      if (horarios[stop - 1].ex.setor === horarios[stop].ex.setor) {
        horarios[stop].horarios.forEach((a) => {
          const diff = filterHorariosMesmoSetor(a, horario);
          newHorary.push(diff);
        });
        const removeUndefined = newHorary.filter((a) => a !== undefined);
        setHorariosExame(removeUndefined);
        setCurrentPage(1);
      } else {
        const horarioLivre = proximoIntervalo(horario, horarios[stop].horarios);
        setHorariosExame(horarioLivre);
      }
    }
  };

  //Paginacao
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleConcluir = () => {
    const data = {
      exame: horarios[stop].ex,
      horario: horario,
    };

    setHorario([...horarioSelect, data]);
    update(horario.id);
    setIsConcluir(true);
  };
  const setProximoExame = () => {
    const data = {
      exame: horarios[stop].ex,
      horario: horario,
    };
    update(horario.id);
    setHorarioSelect([...horarioSelect, data]);
    setStop(stop + 1);
  };

  useEffect(() => {
    getHorarios();
  }, [stop]); //eslint-disable-line

  //pagination
  const indexOfLastPage = currentPage * limitHorario;
  const indexOfFirstPage = indexOfLastPage - limitHorario;
  const current = horariosExame.slice(indexOfFirstPage, indexOfLastPage);

  return (
    <>
      <div className="screenContainer">
        <h1>Seleção de horários</h1>
        <h1>{exameAtual}</h1>
        <div className="screenCardContent">
          {current.map((a) => (
            <div className="cardHorarios" key={a.periodo.id}>
              <label htmlFor={a.periodo.id}>
                <input
                  name="horario"
                  type="radio"
                  id={a.periodo.id}
                  value={a.periodo.id}
                  onChange={() => setHorarioSelecionado(a.periodo)}
                />
                <div className="dados">
                  <div className="day">{a.periodo.data}</div>
                  <div className="intervalo">Hora: {a.periodo.horaInicio}</div>
                  <div className="intervalo">Duração exame: minutos.</div>
                </div>
              </label>
            </div>
          ))}
        </div>
        <>
          <Pagination
            limitHorario={limitHorario}
            totalHorarios={horariosExame.length}
            paginate={paginate}
          />
        </>
        {horarios.length > 1 && horarios.length - 1 !== stop && (
          <button onClick={setProximoExame} className="button">
            Proximo exame
          </button>
        )}
        {horarios.length - 1 === stop && !isCloncluir && (
          <button onClick={handleConcluir} className="button">
            Concluir
          </button>
        )}
      </div>
    </>
  );
};
const ConcluirAgendamento = ({ agendamento, update }) => {
  const { user } = useAppContext();
  const { dadosParticular, paciente, plano, dados } = agendamento;
  const history = useHistory();
  const [active, setActive] = useState(true);

  const handleConfirma = useCallback(async () => {
    setActive(false);
    const dadosForAgandamento = {
      paciente,
      agent: user.nickname,
      plano,
      dados,
    };
    const horarioUpdate = {
      horarios: update,
      ocupado: true,
    };

    try {
      await updateHorario(horarioUpdate).then(async () => {
        await postAgendamento(dadosForAgandamento).then(() => {
          history.push('/');
        });
      });
    } catch (error) {}
  }, []); // eslint-disable-line

  return (
    <div className="screenContainer concluiragendamento">
      <ul>
        {agendamento.dados.map((dado) => (
          <li key={agendamento.paciente}>
            {dado.exame.name} - {dado.horario.data} - {dado.horario.horaInicio}
          </li>
        ))}
        <li>
          {dadosParticular.isParticular &&
            `Total a pagar: ${moeda(dadosParticular.total)}`}
        </li>
      </ul>
      {active && (
        <button className="button" onClick={handleConfirma}>
          Confirma agendamento
        </button>
      )}
    </div>
  );
};
