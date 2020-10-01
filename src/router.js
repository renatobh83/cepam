import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Loading from './components/Loading';

import Login from './pages/Login/';
import { useAppContext } from './store/context';
import Main from './pages/Main/index';
import Header from './pages/Header';
import Agendamento from './pages/Agendamento';
import Pacientes from './pages/Pacientes';
import Usuarios from './pages/Ususarios/index';
import Callback from './utils/callback';
import Grupos from './pages/Grupos/index';
import Setores from './pages/Setores/index';
import Salas from './pages/Salas/index';
import Procedimentos from './pages/Procedimentos/index';
import Tabelas from './pages/Tabelas/index';

function Router() {
  const { isLoading, isAuthenticated } = useAppContext();

  const PrivateRoute = ({ component: Component, auth, ...rest }) => (
    <Route
      {...rest}
      render={(props) => (auth === true ? <Component {...props} /> : <Login />)}
    />
  );
  if (isLoading) {
    return <Loading />;
  }

  const RouteWithNav = () => {
    return (
      <>
        <Header />
        <Route path="/callback" exact component={Callback} />
        <Route path="/" exact component={Main} />
        <Route path="/agendar" exact component={Agendamento} />
        <Route path="/pacienteForm" exact component={Pacientes} />
        <Route path="/usuarios" exact component={Usuarios} />
        <Route path="/grupos" exact component={Grupos} />
        <Route path="/setor" exact component={Setores} />
        <Route path="/salas" exact component={Salas} />
        <Route path="/procedimentos" exact component={Procedimentos} />
        <Route path="/tabelas" exact component={Tabelas} />
      </>
    );
  };

  return (
    <BrowserRouter>
      <Switch>
        <PrivateRoute auth={isAuthenticated} component={RouteWithNav} />
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
