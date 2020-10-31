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
            response.detalhesAgendadoMes.map((t) => [t._id, t.count])
          )
        : [
            ['Setor', 'Total'],
            [0, 0],
          ];
    const agendamentoPorPlano =
      response.detalhesAgendadoMes.length > 0
        ? [['Plano', 'Total']].concat(
            response.agendadoPlano.map((p) => [p._id, p.count])
          )
        : [
            ['Plano', 'Total'],
            [0, 0],
          ];

    const examesAgendados =
      response.ExamesAgendado.length > 0
        ? [['Exame', 'Total']].concat(
            response.ExamesAgendado.map((p) => [p._id, p.count])
          )
        : [
            ['Exame', 'Total'],
            [0, 0],
          ];
    const horariosVsAgendado =
      response.HorarioXAgendamento.length > 0
        ? [['Setor', 'Total Horario', 'Total Agendado']].concat(
            response.HorarioXAgendamento.map((p) => p)
          )
        : [
            ['Setor', 'Total Horario', 'Total Agendado'],
            [0, 0, 0],
          ];

    const txOcupacao =
      response.TaxaOcupacao.length > 0
        ? [['Setor', '%']].concat(
            response.TaxaOcupacao.map((t) => [t.setor, parseFloat(t.taxa)])
          )
        : [
            ['Setor', '%'],
            [0, 0],
          ];

    const txOcupacaoGeral =
      response.TaxaOcupacaoGeral.length > 0
        ? [['Mes', '%']].concat([
            [
              `${format(mes, 'MMMM', {
                locale: brasilLocal,
              })}`,
              parseFloat(response.TaxaOcupacaoGeral),
            ],
          ])
        : [
            ['Mes', '%'],
            [0, 0],
          ];
    const periodo =
      response.Periodo.length > 0
        ? [['Mes', 'Horarios Gerados', 'Agendamentos']].concat(
            response.Periodo.map((p) => [p.mes, p.horarios, p.agendados])
          )
        : [
            ['Mes', 'Horarios Gerados', 'Agendamentos'],
            [0, 0, 0],
          ];

    const withoutAnnotation = [['Mes', 'Total']].concat(
      response.mesAgendamentos.map((t) => [
        `${format(mes, 'MMMM', { locale: brasilLocal })}`,

        t.count,
      ])
    );
    setWithoutAnnotation(withoutAnnotation);
    setState({
      ...state,
      data: [
        totalMes,
        detalhesMes,
        agendamentoPorPlano,
        examesAgendados,
        horariosVsAgendado,
        txOcupacao,
        txOcupacaoGeral,
        periodo,
      ],
    });
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
            <div className="chart">
              <div id="Horarios">
                <h2>Horário gerado/Agendado</h2>
                <Chart
                  chartType="ScatterChart"
                  loader={<div>Loading Chart</div>}
                  data={state.data[4]}
                  options={{
                    legend: 'none',
                  }}
                />
              </div>
              <div className="grupExport">
                <button
                  className="button"
                  type="submit"
                  onClick={() => handleDetalhes('MaxHvsA')}
                >
                  Maximizar
                </button>
                <button
                  className="button"
                  type="submit"
                  onClick={() =>
                    exportaPdf('Horarios Gerados X Agendado ', state.data[4])
                  }
                >
                  Pdf
                </button>
                {exportaXLSX(state.data[4])}
              </div>
            </div>
            <div className="chart">
              <div id="tx">
                <h2>Taxa ocupção setor</h2>
                <Chart
                  chartType="AreaChart"
                  loader={<div>Loading Chart</div>}
                  data={state.data[5]}
                  options={{
                    legend: 'none',
                  }}
                />
              </div>
              <div className="grupExport">
                <button
                  className="button"
                  type="submit"
                  onClick={() => handleDetalhes('MaxTx')}
                >
                  Maximizar
                </button>
                <button
                  className="button"
                  type="submit"
                  onClick={() =>
                    exportaPdf('Taxa ocupacao setores', state.data[5])
                  }
                >
                  Pdf
                </button>
                {exportaXLSX(state.data[5])}
              </div>
            </div>
            <div className="chart">
              <div id="txGeral">
                <h2>Taxa ocupção mês</h2>
                <Chart
                  chartType="ColumnChart"
                  loader={<div>Loading Chart</div>}
                  data={state.data[6]}
                  options={{
                    legend: 'none',
                    vAxis: {
                      minValue: 0,
                      maxValue: 100,
                    },
                  }}
                />
              </div>
              <div className="grupExport">
                <button
                  className="button"
                  type="submit"
                  onClick={() =>
                    exportaPdf('Taxa ocupacao Geral ', state.data[6])
                  }
                >
                  Pdf
                </button>
                {exportaXLSX(state.data[6])}
              </div>
            </div>
            <div className="chart">
              <div id="Periodo">
                <h2>Período</h2>
                <Chart
                  chartType="ColumnChart"
                  loader={<div>Loading Chart</div>}
                  data={state.data[7]}
                  options={{
                    legend: 'bottom',
                    hAxis: { viewWindow: { max: 12, min: 1 } },
                  }}
                />
              </div>
              <div className="grupExport">
                <button
                  className="button"
                  type="submit"
                  onClick={() =>
                    exportaPdf('Taxa ocupacao Geral ', state.data[7])
                  }
                >
                  Pdf
                </button>
                {exportaXLSX(state.data[7])}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
const Detalhes = ({ value, close, report, exportarPdf, exportarExcel }) => {
  const [title, setTitle] = useState('Setor');
  const [index, setIndex] = useState(1);
  const onChangeFilter = (e) => {
    if (e !== '#') {
      setIndex(e);
      switch (e) {
        case '1':
          setTitle('Setor');
          break;
        case '2':
          setTitle('Plano');
          break;
        case '3':
          setTitle('Exame');
          break;

        default:
          break;
      }
    }
  };

  if (value === 'agendamento') {
    return (
      <>
        <div id="chart">
          <select
            name="filter"
            className="selectFilter"
            onChange={(e) => onChangeFilter(e.target.value)}
          >
            <option value="#">Filtro</option>
            <option value="1">Setor</option>
            <option value="2">Plano</option>
            <option value="3">Exame</option>
          </select>
          <h2> {title} </h2>
          <Chart
            chartType="Bar"
            loader={<div>Loading Chart</div>}
            data={report.data[index]}
            options={{
              chartArea: { width: '50%' },
              hAxis: {
                title,
              },
              vAxis: {
                title: 'Total',
                minValue: 0,
              },
              bars: 'horizontal',
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
            onClick={() => exportarPdf('Agendamento setor', report.data[index])}
          >
            Pdf
          </button>
          {exportarExcel(report.data[index])}
        </div>
      </>
    );
  } else if (value === 'MaxHvsA') {
    return (
      <>
        <Chart
          chartType="ScatterChart"
          loader={<div>Loading Chart</div>}
          data={report.data[4]}
          options={{
            legend: 'none',
          }}
        />
        <div className="detalhesGrupo">
          <button type="submit" className="button" onClick={close}>
            Voltar
          </button>
          <button
            type="submit"
            className="button"
            onClick={() => exportarPdf('Agendamento setor', report.data[4])}
          >
            Pdf
          </button>
          {exportarExcel(report.data[4])}
        </div>
      </>
    );
  } else if (value === 'MaxTx') {
    return (
      <>
        <Chart
          chartType="AreaChart"
          loader={<div>Loading Chart</div>}
          data={report.data[5]}
          options={{
            legend: 'none',
          }}
        />
        <div className="detalhesGrupo">
          <button type="submit" className="button" onClick={close}>
            Voltar
          </button>
          <button
            type="submit"
            className="button"
            onClick={() => exportarPdf('Agendamento setor', report.data[5])}
          >
            Pdf
          </button>
          {exportarExcel(report.data[5])}
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
