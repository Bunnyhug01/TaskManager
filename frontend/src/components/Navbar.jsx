import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import '../themes/Navbar.css';
import { IconContext } from 'react-icons';


function Navbar() {
  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <header class='header'>
      <div class='navbar'>
        <IconContext.Provider value={{ color: '#fff' }}>
          <div>
            <div className='menu-bars'>
              <FaIcons.FaBars onClick={showSidebar} />
              <h1>Task Manager</h1>
            </div>
          </div>
          <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
            <ul className='nav-menu-items'>
              <li className='navbar-toggle'>
                <div className='menu-bars' onClick={showSidebar}>
                  <AiIcons.AiOutlineClose />
                </div>
              </li>
            </ul>
          </nav>
        </IconContext.Provider>
      </div>
    </header>
  );
}

export default Navbar;