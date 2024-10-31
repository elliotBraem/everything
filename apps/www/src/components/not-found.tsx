import { Link } from "@tanstack/react-router";

export const NotFound = () => {
  return (
    <div>
      <p>404 not found</p>
      <Link to="/">Go home</Link>
    </div>
  );
};
