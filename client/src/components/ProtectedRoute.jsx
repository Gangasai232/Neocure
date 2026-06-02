import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "@/utils/api";

// Accept `children` and optional `roles` prop
const ProtectedRoute = ({ children, roles = [] }) => {
  const [status, setStatus] = useState({ loading: true, allowed: false });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setStatus({ loading: false, allowed: false });
      return;
    }

    const verify = async () => {
      try {
        const res = await api.get("/user"); // expected to return user object
        const user = res.data.data;

        if (roles.length === 0 || roles.includes(user.role)) {
          setStatus({ loading: false, allowed: true });
        } else {
          setStatus({ loading: false, allowed: false });
        }
      } catch (err) {
        setStatus({ loading: false, allowed: false });
      }
    };

    verify();
  }, [roles]);

  if (status.loading) return null;
  if (!status.allowed) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
