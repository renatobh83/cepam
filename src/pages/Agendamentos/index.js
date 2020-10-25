import React, { useState, useCallback } from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ModalConfirm from '../../components/ModalConfirm';

import {
  cancelaAgendamento,
  getAgendamento,
  updateHorario,
} from '../../services/API';

import { AgendamentosFuturos } from '../../utils/showAgendamentoFuturos';
import './styles.css';

export default function Agendamentos(props) {
  const history = useHistory();

  const [agendamentos, setAgendamentos] = useState([]);
  const paciente = props.location.state.user
    ? props.location.state.user
    : props.location.state._id;
  const fetchAgendamentos = useCallback(async () => {
    try {
      await getAgendamento(paciente).then((res) => {
        setAgendamentos(res.data.message);
        // AgendamentosFuturos(res.data.message, (response) => {
        //   // console.log(response);
        //   setAgendamentos((oldValues) => [...oldValues, response]);
        // });
      });
    } catch (error) {}
  }, []);

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
  }, []);
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
