import { NavLink } from "react-router";
import type { UserTypes } from "~/constants/routes";
import { routes as mainRoutes } from "~/constants/routes";

type TopBatProps = {
  usertype: UserTypes;
};

export default function TopBar({ usertype }: TopBatProps) {
  const routes = mainRoutes.filter((route) => route.allowed.includes(usertype));
  return (
    <div className="navbar bg-base-100 shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {routes.map((route) => (
              <li key={route.name}>
                <NavLink
                  to={route.path}
                  className={({ isActive }) =>
                    `flex items-center w-full p-3 rounded-md transition-colors duration-500 ${
                      isActive
                        ? "bg-primary text-primary-content"
                        : "hover:bg-base-300"
                    }`
                  }
                >
                  {route.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <NavLink className="btn btn-ghost text-xl" to={"/"}>
          DataDrift
        </NavLink>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {routes.map((route) => (
            <li key={route.name}>
              <NavLink
                to={route.path}
                className={({ isActive }) =>
                  `flex items-center w-full p-3 rounded-md transition-colors duration-500 ${
                    isActive
                      ? "bg-primary text-primary-content"
                      : "hover:bg-base-300"
                  }`
                }
              >
                {route.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      <div className="navbar-end">
        {usertype === "user" ? (
          <NavLink to="login" className="btn">
            Iniciar Sesión
          </NavLink>
        ) : (
          <NavLink to="logout" className="btn">
            Cerrar Sesión
          </NavLink>
        )}
      </div>
    </div>
  );
}
