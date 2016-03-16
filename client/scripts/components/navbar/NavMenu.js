import React, { PropTypes } from 'react'
import NavLink from './NavLink'

// linkNames for navbar
// const linkNames = ['Messages', 'Contact Landlord', 'Finances', 'Chores']

const NavMenu = ({
  currentView,
  isLandlord,
  changeView,
  counters,
  links
}) => (
  <ul className="nav navbar-nav flexbox">
    <li className="flex-children">
      <img src="./images/obie_logo.png" height="30px" />
    </li>
    {links.map(link => 
      <NavLink 
        onClick={() => changeView(link.render)}
        currentView={currentView}
        text={link.text}
        key={link.render}
        count={counters[link.render]}
      />
    )}
    <li>
      <a href="/logout">Logout</a>
    </li>
  </ul>
)

// NavMenu.propTypes = {
//   onClick: PropTypes.func.isRequired,
//   key: PropTypes.string.isRequired,
//   currentView: PropTypes.string.isRequired,
//   text: PropTypes.string.isRequired
// }

export default NavMenu