import { addMinutes } from 'date-fns/';

export const filterHorariosMesmoSetor = (h1, h2) => {
  const d1 = new Date(
    '1970/01/01 ' +
      h1.periodo.horaInicio.slice(0, -2) +
      ' ' +
      h1.periodo.horaInicio.slice(-2)
  );
  const d2 = new Date(
    '1970/01/01 ' + h2.horaInicio.slice(0, -2) + ' ' + h2.horaInicio.slice(-2)
  );
  if (d1.getTime() > d2.getTime()) {
    return h1;
  }
};

export const proximoIntervalo = (horario, horarios) => {
  let horarioDisponivel = [];
  const d2 = new Date(
    '1970/01/01 ' +
      horario.horaInicio.slice(0, -2) +
      ' ' +
      horario.horaInicio.slice(-2)
  );
  const next = addMinutes(d2, horario.timeInterval);
  horarios.forEach((h) => {
    if (stringToTime(h.periodo.horaInicio) > next.getTime()) {
      horarioDisponivel.push(h);
    }
  });
  return horarioDisponivel;
};
// ordernar horarios
export const compare = (a, b) => {
  return (
    Date.parse(
      a.data +
        a.periodo.horaInicio.slice(0, -2) +
        ' ' +
        a.periodo.horaInicio.slice(-2)
    ) -
    Date.parse(
      b.data +
        b.periodo.horaInicio.slice(0, -2) +
        ' ' +
        b.periodo.horaInicio.slice(-2)
    )
  );
};
const stringToTime = (a) => {
  const date = new Date('1970/01/01 ' + a.slice(0, -2) + ' ' + a.slice(-2));
  return date.getTime();
};
