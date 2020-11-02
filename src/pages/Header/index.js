import React, { useState } from 'react';
import { NavLink as RouterNavLink } from 'react-router-dom';
import {
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavLink,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  UncontrolledDropdown,
} from 'reactstrap';
import { useAppContext } from '../../store/context';
import { FiHeart, FiLogOut, FiUser } from 'react-icons/fi';
import { useEffect } from 'react';

function Header() {
  const { logout, user, menuOptions } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [stateMenuOpt, setSate] = useState({
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
  const toggle = () => setIsOpen(!isOpen);
  // const userPermissoes = async () => {
  //   if (!user.paciente) {
  //     const idPermissao = await getPermissoes();
  //     const grupo = await getGrupoPermissoes(user.grupoId);
  //     if (grupo && idPermissao) {
  //       const permissaoFiltered = idPermissao.data.message.filter((el) => {
  //         return grupo.data.message.permissaoId.some((f) => {
  //           return f === el._id;
  //         });
  //       });
  //       let newState = Object.assign({}, stateMenuOpt);

  //       permissaoFiltered.map((p) => {
  //         switch (p.name) {
  //           case 'GRUPOS':
  //             newState.GRUPOS = true;
  //             newState.mCadastro = true;
  //             break;
  //           case 'USUARIOS':
  //             newState.USUARIOS = true;
  //             newState.mCadastro = true;
  //             break;
  //           case 'SETORES':
  //             newState.SETORES = true;
  //             newState.mCadastro = true;
  //             break;
  //           case 'SALAS':
  //             newState.SALAS = true;
  //             newState.mCadastro = true;
  //             break;
  //           case 'PROCEDIMENTOS':
  //             newState.mFAturamento = true;
  //             newState.PROCEDIMENTOS = true;
  //             break;

  //           case 'TABELAS':
  //             newState.mFAturamento = true;
  //             newState.TABELAS = true;
  //             break;

  //           case 'PLANOS':
  //             newState.mFAturamento = true;
  //             newState.PLANOS = true;
  //             break;

  //           case 'HORARIOS':
  //             newState.HORARIOS = true;
  //             break;
  //           case 'RELATORIOS':
  //             newState.RELATORIOS = true;
  //             break;
  //           case 'GERARHORARIOS':
  //             newState.GERARHORARIOS = true;
  //             break;

  //           default:
  //             break;
  //         }
  //       });

  //       // setSate(newState);
  //     }
  //   }
  // };

  useEffect(() => {
    setSate(menuOptions.menu);
  }, []); // eslint-disable-line
  return (
    <Navbar
      color="#f5f5f5"
      light
      expand="md"
      style={{ fontSize: '1.9rem', width: `100%` }}
    >
      <NavbarBrand>
        <FiHeart size={35} />
      </NavbarBrand>

      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="mr-auto" navbar>
          <NavItem>
            <NavLink className="link" tag={RouterNavLink} to="/">
              Home
            </NavLink>
          </NavItem>
          {!user.paciente && (
            <>
              {stateMenuOpt.mCadastro && (
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Cadastros
                  </DropdownToggle>
                  <DropdownMenu right style={{ font: '600 1.3rem Archivo' }}>
                    {stateMenuOpt.USUARIOS && (
                      <DropdownItem>
                        <NavLink
                          className="link"
                          tag={RouterNavLink}
                          to="/usuarios"
                        >
                          Usuarios
                        </NavLink>
                      </DropdownItem>
                    )}
                    {stateMenuOpt.GRUPOS && (
                      <DropdownItem>
                        <NavLink
                          className="link"
                          tag={RouterNavLink}
                          to="/grupos"
                        >
                          Grupos
                        </NavLink>
                      </DropdownItem>
                    )}
                    {stateMenuOpt.SETORES && (
                      <DropdownItem>
                        <NavLink
                          className="link"
                          tag={RouterNavLink}
                          to="/setor"
                        >
                          Setores
                        </NavLink>
                      </DropdownItem>
                    )}
                    {stateMenuOpt.SALAS && (
                      <DropdownItem>
                        <NavLink
                          className="link"
                          tag={RouterNavLink}
                          to="/salas"
                        >
                          Salas
                        </NavLink>
                      </DropdownItem>
                    )}
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
              {stateMenuOpt.mFAturamento && (
                <UncontrolledDropdown>
                  <DropdownToggle nav caret>
                    Faturamento
                  </DropdownToggle>
                  <DropdownMenu right style={{ font: '600 1.3rem Archivo' }}>
                    {stateMenuOpt.PROCEDIMENTOS && (
                      <DropdownItem>
                        <NavLink
                          className="link"
                          tag={RouterNavLink}
                          to="/procedimentos"
                        >
                          Procedimentos
                        </NavLink>
                      </DropdownItem>
                    )}
                    {stateMenuOpt.TABELAS && (
                      <DropdownItem>
                        <NavLink
                          className="link"
                          tag={RouterNavLink}
                          to="/tabelas"
                        >
                          Tabelas
                        </NavLink>
                      </DropdownItem>
                    )}
                    {stateMenuOpt.PLANOS && (
                      <DropdownItem>
                        <NavLink
                          className="link"
                          tag={RouterNavLink}
                          to="/planos"
                        >
                          Planos
                        </NavLink>
                      </DropdownItem>
                    )}
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
              <UncontrolledDropdown>
                <DropdownToggle nav caret>
                  Agenda
                </DropdownToggle>
                <DropdownMenu right style={{ font: '600 1.3rem Archivo' }}>
                  {stateMenuOpt.GERARHORARIOS && (
                    <DropdownItem>
                      <NavLink
                        className="link"
                        tag={RouterNavLink}
                        to="/gerarHorarios"
                      >
                        Gerar horarios
                      </NavLink>
                    </DropdownItem>
                  )}
                  <DropdownItem>
                    <NavLink
                      className="link"
                      tag={RouterNavLink}
                      to="/horarios"
                    >
                      Horarios
                    </NavLink>
                  </DropdownItem>
                  <DropdownItem>
                    <NavLink className="link" tag={RouterNavLink} to="/agenda">
                      Consulta agenda
                    </NavLink>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              {stateMenuOpt.RELATORIOS && (
                <NavItem>
                  <NavLink
                    className="link"
                    tag={RouterNavLink}
                    to="/relatorios"
                  >
                    Relatorios
                  </NavLink>
                </NavItem>
              )}
              <NavItem>
                <NavLink className="link" tag={RouterNavLink} to="/permissoes">
                  Permissoes
                </NavLink>
              </NavItem>
            </>
          )}
        </Nav>
        <Nav navbar>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              Profile
            </DropdownToggle>
            <DropdownMenu right style={{ font: '600 1.2rem Archivo' }}>
              <DropdownItem>
                <NavLink className="link" tag={RouterNavLink} to="/profile">
                  <FiUser size={30} className="mr-2" />
                  Profile
                </NavLink>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem fontSize={32} onClick={() => logout()}>
                <FiLogOut size={30} className="mr-2" />
                Logout
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Collapse>
    </Navbar>
  );
}

export default Header;
