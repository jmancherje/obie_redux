import React, { PropTypes } from 'react'

const NavLink = ({
  onClick,
  currentView,
  text,
  key,
  count
}) => (
  <li 
    className="inner-flex"
    >
    <a 
      onClick={onClick} 
      style={{
        fontWeight: currentView.text === text ? 'bold' : 'normal'
      }}
      >
      {text}
      <span className="notification-count">
        {count}
      </span>
    </a>
  </li>
)

export default NavLink