import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  let user = null;

  try {
    if (userStr) user = JSON.parse(userStr);
  } catch (e) {
    console.error(e);
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (user && user.role !== "ADMIN") {
    return <Navigate to="/home" replace />;
  }

  return children;
}
