import React, { useState } from 'react';
import { Dialog } from '@reach/dialog';
import '@reach/dialog/styles.css';
import { PDFDownloadLink } from '@react-pdf/renderer';

export default function ModalExport(props) {
  const [state, setState] = useState({
    open: false,
    callback: null,
  });

  const show = (callback) => (e) => {
    e.preventDefault();
    e = {
      ...e,
      target: { ...e.target, value: e.target.value },
    };

    setState({
      open: true,
      callback: () => callback(e),
    });
  };
  const hide = () => setState({ open: false, callback: null });

  const confirm = () => {
    state.callback();
    hide();
  };

  return (
    <>
      {props.children(show)}
      {state.open && (
        <Dialog>
          <div className="ModalConfirmContent">
            <h1>{props.title}</h1>
            <p>{props.description}</p>
            {/* <button onClick={confirm} className="button button-danger">
              Sim
            </button> */}

            <PDFDownloadLink document={props.value} fileName={'relatorio.pdf'}>
              {({ blob, url, loading, error }) =>
                loading ? 'Carregando documento...' : 'Download'
              }
            </PDFDownloadLink>
            <button onClick={hide} className="button">
              Cancelar
            </button>
          </div>
        </Dialog>
      )}
    </>
  );
}
