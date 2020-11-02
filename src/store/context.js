import createAuth0Client from '@auth0/auth0-spa-js';
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { setToken } from '../utils/LoginToken';
import {
  getGrupoPermissoes,
  getPermissoes,
  loginGetUserDate,
} from '../services/API';

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

export const AppContext = createContext();
export const useAppContext = () => useContext(AppContext);

export default function Provider({
  children,
  onRedirectCAllback = DEFAULT_REDIRECT_CALLBACK,
  ...initOption
}) {
  const [auth0Client, setAuth0] = useState();
  const [isLoading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState('');
  const [stateMenuOpt, setStateMenuOpt] = useState({
    USUARIOS: false,
    GRUPOS: false,
    SETORES: false,
    SALAS: false,
    PROCEDIMENTOS: false,
    TABELAS: false,
    PLANOS: false,
    HORARIOS: false,
    RELATORIOS: false,
    GERARHORARIOS: false,
    mFAturamento: false,
    mCadastro: false,
  });

  const init = useCallback(async () => {
    console.log('init');
    const auth0FromHook = await createAuth0Client(initOption);

    setAuth0(auth0FromHook);

    if (window.location.search.includes('code=')) {
      const { appState } = await auth0FromHook.handleRedirectCallback();
      onRedirectCAllback(appState);
    }
    const isAuthenticated = await auth0FromHook.isAuthenticated();
    if (isAuthenticated) {
      const { __raw: token } = await auth0FromHook.getIdTokenClaims();

      setToken(token);
      await loginGetUserDate().then(async (res) => {
        const user = res.data.message;
        setUser(res.data.message);
        if (!res.data.message.paciente) {
          const idPermissao = await getPermissoes();
          const grupo = await getGrupoPermissoes(user.grupoId);
          if (grupo && idPermissao) {
            const permissaoFiltered = idPermissao.data.message.filter((el) => {
              return grupo.data.message.permissaoId.some((f) => {
                return f === el._id;
              });
            });

            let newState = Object.assign({}, stateMenuOpt.menu);
            permissaoFiltered.map((p) => {
              switch (p.name) {
                case 'GRUPOS':
                  newState.GRUPOS = true;
                  newState.mCadastro = true;
                  break;
                case 'USUARIOS':
                  newState.USUARIOS = true;
                  newState.mCadastro = true;
                  break;
                case 'SETORES':
                  newState.SETORES = true;
                  newState.mCadastro = true;
                  break;
                case 'SALAS':
                  newState.SALAS = true;
                  newState.mCadastro = true;
                  break;
                case 'PROCEDIMENTOS':
                  newState.mFAturamento = true;
                  newState.PROCEDIMENTOS = true;
                  break;

                case 'TABELAS':
                  newState.mFAturamento = true;
                  newState.TABELAS = true;
                  break;

                case 'PLANOS':
                  newState.mFAturamento = true;
                  newState.PLANOS = true;
                  break;

                case 'HORARIOS':
                  newState.HORARIOS = true;
                  break;
                case 'RELATORIOS':
                  newState.RELATORIOS = true;
                  break;
                case 'GERARHORARIOS':
                  newState.GERARHORARIOS = true;
                  break;
                default:
                  break;
              }
            });
            setStateMenuOpt(newState);
          }
        }
      });
    }
    setIsAuthenticated(isAuthenticated);

    setLoading(false);
    console.log('End init context');
  }, []); // eslint-disable-line
  const menuOptions = {
    menu: stateMenuOpt,
    set: (...p) => setStateMenuOpt(...p),
  };
  useEffect(() => {
    init();
  }, []); // eslint-disable-line
  const configObject = {
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    user,
    menuOptions,
    loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
    logout: (...p) => auth0Client.logout(...p),
  };

  return (
    <AppContext.Provider value={configObject}>{children}</AppContext.Provider>
  );
}
