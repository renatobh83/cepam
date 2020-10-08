import React from 'react';

import './styles.css';
import ModalConfirm from '../../components/ModalConfirm';
import Loading from '../../components/Loading';
import { useState } from 'react';
import { useCallback } from 'react';
import { getSalasCadastro } from '../../services/API';

function Horarios() {
  const [isLoading, setIsLoading] = useState(true);
  const [salas, setSalas] = useState([]);
  const [sala, setSala] = useState(null);
  const [horarios, setHorarios] = useState([]);

  const fetchSalas = useCallback(async () => {
    await getSalasCadastro().then((res) => {
      if (res.data.statusCode === 200) {
        setSalas(res.data.message);
        setIsLoading(false);
      }
    });
  }, []);
  const handleHorarios = useCallback(async () => {
    if (sala !== null && sala !== '#') {
      console.log(sala);
    }
  }, [sala]);

  handleHorarios();
  useState(() => {
    fetchSalas();
  }, []);
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div className="main">
      <h2>Horarios</h2>
      <div className="listPage">
        <div className="horarioGroup">
          <label htmlFor="sala">Sala</label>
          <select
            name="sala"
            id="sala"
            onChange={(e) => setSala(e.target.value)}
          >
            <option value="#">Selecione uma sala</option>
            {salas.map((sala) => (
              <option key={sala._id} value={sala._id}>
                {sala.name}
              </option>
            ))}
          </select>
        </div>
        <div className="header">
          <span>Data</span>
          <span>Dia Sem.</span>
          <span>Intervalo</span>
        </div>
        <ul>
          <li>
            <div className="interval">
              <span>horario</span>
              <span>setDiaS</span>
              <span>horario</span>
              <ModalConfirm
                title="Confirma"
                description="Desaja apagar o intervalo"
              >
                {(confirm) => (
                  <button
                    className="button button-danger"
                    type="submit"
                    // onClick={confirm(apagarHorario(horario.id))}
                  >
                    Apagar
                  </button>
                )}
              </ModalConfirm>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Horarios;
