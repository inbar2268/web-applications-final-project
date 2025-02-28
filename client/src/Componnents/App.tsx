import "./App.css";

import UserDetails from "./userDetails";
import Home from "./Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/User" element={<UserDetails />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
