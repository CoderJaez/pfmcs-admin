// in src/App.tsx
import React from "react";
import Routers from "./routes/Routers";
import PrimeReact from "primereact/api";
//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";

//core
import "primereact/resources/primereact.min.css";

//icons
import "primeicons/primeicons.css";

const App = () => {
  return (
    <div>
      <Routers />
    </div>
  );
};

export default App;
