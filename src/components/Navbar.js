import React from 'react'
import farmer from '../farmer.png'

const Navbar = ({ account }) => {
    return (
      <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 mr-0"
          href="https://github.com/baystef"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={farmer} width="30" height="30" className="d-inline-block align-top" alt="" />
          &nbsp; MMooreToken Token Farm
        </a>

        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-secondary">
              <small id="account">{account}</small>
            </small>
          </li>
        </ul>
      </nav>
    );
}

export default Navbar;
