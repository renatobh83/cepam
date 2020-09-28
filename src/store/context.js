import createAuth0Client from '@auth0/auth0-spa-js';
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';

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
      //   const { __raw: token } = await auth0FromHook.getIdTokenClaims();
      //   setToken(token);
      //   await getUserInMongo();
    }
    setIsAuthenticated(isAuthenticated);

    setLoading(false);
  }, []);

  useEffect(() => {
    init();
  }, []);
  const configObject = {
    isLoading,
    isAuthenticated,
    loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
    logout: (...p) => auth0Client.logout(...p),
  };

  return (
    <AppContext.Provider value={configObject}>{children}</AppContext.Provider>
  );
}
