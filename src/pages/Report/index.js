import React, { useCallback, useState, useEffect } from 'react';

import Loading from '../../components/Loading';
import { Chart } from 'react-google-charts';
import { reportGet } from '../../services/API';
import './styles.css';
import { addMonths, format, subMonths } from 'date-fns';
import brasilLocal from 'date-fns/locale/pt-BR';
function Report() {
  const [detalhes, setDetalhes] = useState(false);
  const [valueDetalhes, setValueDetalhes] = useState('');
  const [mesAtual, setMesAtual] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [changeMes, setChangeMes] = useState('');
  const [state, setState] = useState({
    data: null,
  });

  const changeMonth = async () => {
    const next = addMonths(mesAtual, 1);
    setMesAtual(next);
    await reportGet(next).then((res) => processReport(res.data.message));
  };
  const prevMonth = async () => {
    const prev = subMonths(mesAtual, 1);
    setMesAtual(prev);
    await reportGet(prev).then((res) => processReport(res.data.message));
  };

  const fetchReports = useCallback(async () => {
    const response = await reportGet();
    processReport(response.data.message);
  }, []);

  const processReport = (response) => {
    const totalMes =
      response.mesAgendamentos.length > 0
        ? [['Mes', 'Total', { role: 'annotation' }]].concat(
            response.mesAgendamentos.map((t) => [
              `${format(mesAtual, 'MMMM', { locale: brasilLocal })}`,
              t.count,
              t.count,
            ])
          )
        : [
            ['Mes', 'Total'],
            [0, 0],
          ];
    setState({ ...state, data: [totalMes] });
    setIsLoading(false);
  };
  useEffect(() => {
    fetchReports();
  }, []);
  const handleDetalhes = (value) => {
    setValueDetalhes(value);
    setDetalhes(true);
  };
  const fechar = () => setDetalhes(false);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="main">
      {detalhes && <Detalhes value={valueDetalhes} close={fechar} />}
      {!detalhes && (
        <div className="charts">
          <div className="chart" id="agendamento">
            <h2>
              {`Agendamentos ${format(mesAtual, 'MMMM/yyyy', {
                locale: brasilLocal,
              })}`}
            </h2>
            <div
              className="btn_group"
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <button onClick={prevMonth}>Mes Anterior</button>
              <button onClick={changeMonth}>Proximo Mes</button>
            </div>
            <Chart
              width={'100%'}
              height={200}
              chartType="BarChart"
              loader={<div>Loading Chart</div>}
              data={state.data[0]}
              options={{
                legend: 'none',
                hAxis: {
                  title: 'Total',
                },
                vAxis: {
                  title: 'Mes',
                },
              }}
            />
            <div className="grupExport">
              <button
                type="submit"
                onClick={() => handleDetalhes('agendamento')}
              >
                Detalhes
              </button>
              <button type="submit">Pdf</button>
              <button type="submit">excel</button>
            </div>
          </div>
          <div className="chart" id="horario">
            <h2>Horarios</h2>
            <div className="grupExport">
              <button type="submit" onClick={() => handleDetalhes('horarios')}>
                Detalhes
              </button>
              <button type="submit">Pdf</button>
              <button type="submit">excel</button>
            </div>
          </div>
          <div className="chart">
            <h2>Horarios</h2>
            <div className="grupExport">
              <button type="submit">Detalhes</button>
              <button type="submit">Pdf</button>
              <button type="submit">excel</button>
            </div>
          </div>
          <div className="chart">
            <h2>Horarios</h2>
            <div className="grupExport">
              <button type="submit">Detalhes</button>
              <button type="submit">Pdf</button>
              <button type="submit">excel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
const Detalhes = ({ value, close, report }) => {
  if (value === 'agendamento') {
    return (
      <div>
        Agendamentos dia
        <button type="submit" onClick={close}>
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div>
      <button type="submit" onClick={close}>
        Voltar
      </button>
    </div>
  );
};

export default Report;
