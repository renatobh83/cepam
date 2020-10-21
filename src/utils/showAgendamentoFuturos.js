import { addHours, differenceInDays, differenceInHours } from 'date-fns';

const today = new Date();
export const AgendamentosFuturos = (value, callback) => {
  value[0].dados.forEach((a) => {
    const horaAgendamento = addHours(new Date(a.hora.time), 3);
    const diff = differenceInDays(today, horaAgendamento);
    const difHora = differenceInHours(today, horaAgendamento);
    const difMinu = differenceInHours(today, horaAgendamento);

    if (diff <= 0) {
      if (difHora <= -0 && difMinu <= -0) {
        callback(a);
      }
    }
  });
};
