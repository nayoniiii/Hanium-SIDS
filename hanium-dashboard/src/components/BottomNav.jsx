import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaVideo,
  FaHistory,
  FaCog,
} from "react-icons/fa";

import "../css/Components.css";

function BottomNav() {
  return (
    <nav className="bottomNav">

      <NavLink
        to="/home"
        className={({ isActive }) =>
          isActive ? "navItem active" : "navItem"
        }
      >
        <FaHome />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/camera"
        className={({ isActive }) =>
          isActive ? "navItem active" : "navItem"
        }
      >
        <FaVideo />
        <span>Camera</span>
      </NavLink>

      <NavLink
        to="/history"
        className={({ isActive }) =>
          isActive ? "navItem active" : "navItem"
        }
      >
        <FaHistory />
        <span>History</span>
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          isActive ? "navItem active" : "navItem"
        }
      >
        <FaCog />
        <span>Settings</span>
      </NavLink>

    </nav>
  );
}

export default BottomNav;