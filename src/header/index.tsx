import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

export const Header = () => (
  <div className="header">
    <NavLink exact to="/" className="navItem" title="Main page">
      Home
    </NavLink>
    <NavLink to="/chart" className="navItem" title="Sales distribution demo">
      Sales
    </NavLink>
    <NavLink
      exact
      to="/comments"
      className="navItem"
      title="Coral talk comments plugin demo"
    >
      Talk
    </NavLink>
  </div>
);
