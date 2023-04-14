// in src/App.tsx
import React, { useState, useEffect } from "react";
import Routers from "./routes/Routers";
import { ThresholdProvider } from "./context/thresholdContext";
import { UserAuthContextProvider } from "./context/UserAuthContext";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";

//icons
import "primeicons/primeicons.css";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    console.log("App rendered.");
    if (!token) {
      navigate("/login");
    }
  }, []);
  return (
    <UserAuthContextProvider>
      <ThresholdProvider>
        <Routers />
      </ThresholdProvider>
    </UserAuthContextProvider>
  );
};

export default App;
