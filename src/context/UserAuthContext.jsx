import React, { useState, createContext, useEffect, useRef } from "react";
import { UserService } from "../service/userService";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { Toast } from "primereact/toast";

export const UserAuthContext = createContext();

export const UserAuthContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const config = useRef(null);
  const navigate = useNavigate();
  const userRef = useRef(null);
  const toast = useRef(null);
  const checkToken = async () => {
    let token = sessionStorage.getItem("token");
    if (token) {
      const decode = jwtDecode(token);
      setUser(decode);
      userRef.current = decode.data;
      config.current = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
    } else {
      logout();
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  async function login(email, passwword) {
    let result;
    await UserService.login(email, passwword)
      .then((res) => {
        if (res.success) {
          const decode = jwtDecode(res.token);
          setUser(decode);
          sessionStorage.clear();
          sessionStorage.setItem("token", res.token);
          config.current = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${res.token}`,
            },
          };
        }

        result = res;
      })
      .catch((err) => console.error("Auth error", err.data.message));

    return result;
  }
  function toggleToken() {
    checkToken();
  }

  function logout() {
    userRef.current = null;
    sessionStorage.clear();
    navigate("/login");
  }

  return (
    <UserAuthContext.Provider
      value={{ user, login, logout, config, userRef, toggleToken }}
    >
      <Toast ref={toast} />
      {children}
    </UserAuthContext.Provider>
  );
};

export default UserAuthContextProvider;
