import React, { useState } from 'react';
import { Link, NavLink as RouterNavLink } from 'react-router-dom';
import {
  Button,
  Collapse,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavLink,
  NavbarBrand,
  NavbarText,
  NavbarToggler,
  NavItem,
  UncontrolledDropdown,
} from 'reactstrap';
import { useAppContext } from '../../store/context';
import { FiHeart, FiLogOut, FiUser } from 'react-icons/fi';

function Header() {
  const { logout, isAuthenticated } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
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
            <NavLink>
              <Link className="link" tag={RouterNavLink} to="/">
                Home
              </Link>
            </NavLink>
          </NavItem>

          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              Cadastros
            </DropdownToggle>
            <DropdownMenu right style={{ font: '600 1.3rem Archivo' }}>
              <DropdownItem>
                <NavLink>
                  <Link className="link" tag={RouterNavLink} to="/usuarios">
                    Usuarios
                  </Link>
                </NavLink>
              </DropdownItem>
              <DropdownItem>
                <NavLink>
                  <Link className="link" tag={RouterNavLink} to="/grupos">
                    Grupos
                  </Link>
                </NavLink>
              </DropdownItem>
              <DropdownItem>
                <NavLink>
                  <Link className="link" tag={RouterNavLink} to="/setor">
                    Setores
                  </Link>
                </NavLink>
              </DropdownItem>
              <DropdownItem>
                <NavLink>
                  <Link className="link" tag={RouterNavLink} to="/salas">
                    Salas
                  </Link>
                </NavLink>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <UncontrolledDropdown>
            <DropdownToggle nav caret>
              Faturamento
            </DropdownToggle>
            <DropdownMenu right style={{ font: '600 1.3rem Archivo' }}>
              <DropdownItem>
                <NavLink>
                  <Link
                    className="link"
                    tag={RouterNavLink}
                    to="/procedimentos"
                  >
                    Procedimentos
                  </Link>
                </NavLink>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        <Nav navbar>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              Profile
            </DropdownToggle>
            <DropdownMenu right style={{ font: '600 1.2rem Archivo' }}>
              <DropdownItem>
                <FiUser size={30} className="mr-2" />
                Profile
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
