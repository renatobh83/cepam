import React, { useState, useEffect, useCallback } from 'react';
import { getPermissoes, postPermissao, permissaoApagar } from '../services/API';

// import "./styles.css";

export default function Permissoes() {
  const [permissoes, setPermissoes] = useState([]);
  const [permissao, setPermissao] = useState('');

  const handleNewPermission = async (e) => {
    e.preventDefault();
    const data = {
      name: permissao,
    };
    await postPermissao(data).then((res) => {
      if (res.data.statusCode === 400) alert(res.data.message);
      setPermissao('');
    });
  };
  const handleApagar = async (e) => {
    try {
      await permissaoApagar(e);
      const filterPermissao = permissoes.filter((p) => p._id !== e);
      setPermissoes(filterPermissao);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchPermissions = useCallback(async () => {
    const response = await getPermissoes();

    setPermissoes(response.data.message);
  }, []); // eslint-disable-line
  useEffect(() => {
    fetchPermissions();
  }, []); // eslint-disable-line
  return (
    <div className="main">
      <form className="forms" onSubmit={handleNewPermission}>
        <div className="floating-label-input">
          <input
            name="nome_permissao"
            id="nome_permissao"
            required
            value={permissao}
            onChange={(e) => setPermissao(e.target.value)}
          />
          <label htmlFor="nome_permissao">Permissão</label>
          <span className="line"></span>
        </div>
        <button
          type="submit"
          className="button"
          style={{ marginBottom: '3rem' }}
        >
          Gravar
        </button>
      </form>
      <div className="listPage">
        <ul>
          {permissoes.map((permissao) => (
            <li key={permissao._id}>
              {permissao.name}
              <button
                type="submit"
                className="button button-danger"
                onClick={() => handleApagar(permissao._id)}
              >
                Apagar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
