import React from 'react';

import './styles.css';
import ModalConfirm from '../../components/ModalConfirm';

function Horarios() {
  return (
    <div className="mainPage">
      <h2>Horarios</h2>
      <div className="listPage">
        <div className="horarioGroup">
          <label htmlFor="sala">Sala</label>
          {/* <select
                name="sala"
                id="sala"
                onChange={(e) => setSala(e.target.value)}
              >
                <option value="null">Selecione uma sala</option>
                {salas.map((sala) => (
                  <option key={sala._id} value={sala._id}>
                    {sala.nome}
                  </option>
                ))}
              </select> */}
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
