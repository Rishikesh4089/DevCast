import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/home' },
    { name: 'Profile', path: '/profile' },
    { name: 'Settings', path: '/settings' }, // add this page if needed
    { name: 'Cost Estimation', path: '/cost-estimation' },
    { name: 'Model Panel', path: '/model-panel' } // add this page if needed
  ];

  return (
    <nav className="main-navbar">
      <div className="navbar-brand" onClick={() => navigate('/home')}>
        DevCast
      </div>
      <ul className="navbar-links">
        {navItems.map((item) => (
          <li
            key={item.name}
            className={location.pathname === item.path ? 'active' : ''}
            onClick={() => navigate(item.path)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;
