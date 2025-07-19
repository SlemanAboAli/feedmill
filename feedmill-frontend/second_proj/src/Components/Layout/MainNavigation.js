import { NavLink } from "react-router-dom";
import classes from "./MainNavigation.module.css";
import FavoritesContext from "../../store/favorite-context";
import { useContext } from "react";

function MainNavigation({ headerColor, onChangeColors }) {
  const favoritesCtx=useContext(FavoritesContext);
  const headerStyle = {
    backgroundColor: headerColor,
  };

  return (
    <header className={classes.header} style={headerStyle}>
      <div className={classes.logo}>React Meetups</div>
      <nav className={classes.nav}>
        <ul className={classes.list}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? `${classes.link} ${classes.active}`
                  : classes.link
              }
              end
              onClick={() => onChangeColors("#800040", "#ffffff")} // ألوان خاصة بالزر
            >
              All Meetups
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/new-meetup"
              className={({ isActive }) =>
                isActive
                  ? `${classes.link} ${classes.active}`
                  : classes.link
              }
              onClick={() => onChangeColors("#004466", "#e0f7fa")} // ألوان خاصة بالزر
            >
              New Meetup
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                isActive
                  ? `${classes.link} ${classes.active}`
                  : classes.link
              }
              onClick={() => onChangeColors("#006600", "#fffde7")} // ألوان خاصة بالزر
            >
              Favorites <span className={classes.badge}>{favoritesCtx.totalFavorites}</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
