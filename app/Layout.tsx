import { Link } from "@remix-run/react";

export const Layout: React.FC = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>
      <div>
        <ul
          style={{
            flexDirection: "column",
            display: "flex",
            listStyle: "none",
            margin: "1.5rem 2rem 0 0",
          }}
        >
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/posts">Posts</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/logout">Logout</Link>
          </li>
          <li>
            <Link to="/signup">Sign-Up</Link>
          </li>
        </ul>
      </div>
      {children}
    </div>
  );
};
