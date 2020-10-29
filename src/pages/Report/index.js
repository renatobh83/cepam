import React, { useCallback, useState, useEffect } from 'react';

import Loading from '../../components/Loading';
import { Chart } from 'react-google-charts';
import { reportGet } from '../../services/API';
import './styles.css';
import { addMonths, format, subMonths } from 'date-fns';
import brasilLocal from 'date-fns/locale/pt-BR';
import { ExportCSV } from '../../utils/xlsExport';
import generatePDF from '../../utils/exportJSPDF';

function Report() {
  const [detalhes, setDetalhes] = useState(false);
  const [valueDetalhes, setValueDetalhes] = useState('');
  const [mesAtual, setMesAtual] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  const [withoutAnnotation, setWithoutAnnotation] = useState([]);
  const [state, setState] = useState({
    data: null,
    pdf: null,
  });

  const changeMonth = async () => {
    const next = addMonths(mesAtual, 1);

    setMesAtual(next);
    await reportGet(next).then((res) => processReport(res.data.message, next));
  };
  const prevMonth = async () => {
    const prev = subMonths(mesAtual, 1);

    setMesAtual(prev);
    await reportGet(prev).then((res) => processReport(res.data.message, prev));
  };

  const fetchReports = useCallback(async () => {
    const response = await reportGet();
    processReport(response.data.message, mesAtual);
  }, []);

  const processReport = (response, mes) => {
    const totalMes =
      response.mesAgendamentos.length > 0
        ? [['Mes', 'Total', { role: 'annotation' }]].concat(
            response.mesAgendamentos.map((t) => [
              `${format(mes, 'MMMM', { locale: brasilLocal })}`,
              t.count,
              t.count,
            ])
          )
        : [
            ['Mes', 'Total'],
            [0, 0],
          ];

    const detalhesMes =
      response.detalhesAgendadoMes.length > 0
        ? [['Setor', 'Total']].concat(
            response.detalhesAgendadoMes.map((t) => [t._id.name, t.count])
          )
        : [
            ['Setor', 'Total'],
            [0, 0],
          ];
    const withoutAnnotation = [['Mes', 'Total']].concat(
      response.mesAgendamentos.map((t) => [
        `${format(mes, 'MMMM', { locale: brasilLocal })}`,

        t.count,
      ])
    );
    setWithoutAnnotation(withoutAnnotation);
    setState({ ...state, data: [totalMes, detalhesMes] });
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

  const info = (title) => `Relatório ${title} periodo ${format(
    mesAtual,
    'MMMM/yyyy',
    {
      locale: brasilLocal,
    }
  )}
`;
  const exportaPdf = (e, value) => {
    const head = value[0];
    value.shift();
    generatePDF([head], info(e), value);
  };
  const exportaXLSX = (value) => {
    return (
      <ExportCSV
        csvData={value}
        fileName={format(mesAtual, 'MMMM/yyyy', {
          locale: brasilLocal,
        })}
      />
    );
  };
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="main">
      {detalhes && (
        <Detalhes
          value={valueDetalhes}
          close={fechar}
          report={state}
          exportarPdf={exportaPdf}
          exportarExcel={exportaXLSX}
        />
      )}
      {!detalhes && (
        <>
          <h2>
            {`Periodo ${format(mesAtual, 'MMMM/yyyy', {
              locale: brasilLocal,
            })}`}
          </h2>
          <div className="btn_group">
            <button onClick={prevMonth} className="button">
              Mes Anterior
            </button>
            <button onClick={changeMonth} className="button">
              Proximo Mes
            </button>
          </div>

          <div className="charts">
            <div className="chart">
              <div id="agendamento">
                <h2>Total agendamentos mês</h2>
                <Chart
                  chartType="BarChart"
                  loader={<div>Loading Chart</div>}
                  data={state.data[0]}
                  options={{
                    legend: 'none',
                    hAxis: {
                      title: 'Total',
                      minValue: 0,
                    },

                    vAxis: {
                      title: 'Mes',
                    },
                  }}
                />
              </div>
              <div className="grupExport">
                <button
                  className="button"
                  type="submit"
                  onClick={() => handleDetalhes('agendamento')}
                >
                  Detalhes
                </button>
                <button
                  className="button"
                  type="submit"
                  onClick={() =>
                    exportaPdf('Agendamento Mes', withoutAnnotation)
                  }
                >
                  Pdf
                </button>
                {exportaXLSX(withoutAnnotation)}
              </div>
            </div>
            <div className="chart"> </div>
          </div>
        </>
      )}
    </div>
  );
}
const Detalhes = ({ value, close, report, exportarPdf, exportarExcel }) => {
  if (value === 'agendamento') {
    return (
      <>
        <div id="chart">
          Agendamentos dia
          <Chart
            chartType="ColumnChart"
            loader={<div>Loading Chart</div>}
            data={report.data[1]}
            options={{
              legend: 'none',
              hAxis: {
                title: 'Setor',
              },
              vAxis: {
                title: 'Total',
                minValue: 0,
              },
            }}
          />
        </div>
        <div className="detalhesGrupo">
          <button type="submit" className="button" onClick={close}>
            Voltar
          </button>
          <button
            type="submit"
            className="button"
            onClick={() => exportarPdf('Agendamento setor', report.data[1])}
          >
            Pdf
          </button>
          {exportarExcel(report.data[1])}
        </div>
      </>
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
