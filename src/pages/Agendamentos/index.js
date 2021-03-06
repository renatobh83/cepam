import React, { useState, useCallback } from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ModalConfirm from '../../components/ModalConfirm';
import Loading from '../../components/Loading';
import {
  cancelaAgendamento,
  getAgendamento,
  updateHorario,
} from '../../services/API';

import './styles.css';

export default function Agendamentos(props) {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);
  const [agendamentos, setAgendamentos] = useState([]);
  const paciente = props.location.state.user
    ? props.location.state.user
    : props.location.state._id;
  const fetchAgendamentos = useCallback(async () => {
    try {
      await getAgendamento(paciente).then((res) => {
        setAgendamentos(res.data.message);
        if (!res.data.message.length) close();
        setIsLoading(false);
      });
    } catch (error) {}
  }, []); // eslint-disable-line

  const handleCancelarAgendamento = async (e) => {
    const data = {
      horarios: [e],
      ocupado: false,
    };
    const cancel = {
      horario: e,
    };
    const filter = agendamentos.filter((h) => h.horario.id !== e);
    setAgendamentos(filter);
    await updateHorario(data);
    await cancelaAgendamento(cancel).then((res) => {
      if (res.data.message.deletedCount >= 1) {
        close();
      }
    });
  };

  const close = () => history.push('/');

  useEffect(() => {
    fetchAgendamentos();
  }, []); // eslint-disable-line
  if (isLoading) {
    return <Loading />;
  }
  return (
    <>
      <ul className="agendamentos">
        {agendamentos.map((e) => (
          <li key={e.horario.id}>
            <div className="cardAgendamentos">
              <h2>{e.exame.name} </h2>
              <h2>{e.horario.data}</h2>
              <h2> {e.horario.horaInicio}</h2>
              <ModalConfirm
                title="Confirma"
                description="Tem certeza que deseja cancelar o seu agendamento?"
              >
                {(confirm) => (
                  <button
                    type="submit"
                    className="button"
                    onClick={confirm(() =>
                      handleCancelarAgendamento(e.horario.id)
                    )}
                  >
                    Cancelar
                  </button>
                )}
              </ModalConfirm>
            </div>
          </li>
        ))}
      </ul>
      <button
        type="submit"
        className="button button-danger"
        onClick={() => close()}
      >
        Voltar
      </button>
    </>
  );
}
