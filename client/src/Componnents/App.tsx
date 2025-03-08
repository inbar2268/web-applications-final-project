import "./App.css";

import UserDetails from "./userDetails";
import Home from "./Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import GPTGeneratorPage from "./gptGenerator";
import { Provider } from "react-redux";
import { store } from "../Redux/store";

function App() {
  return (
    <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/generate-recipe" element={< GPTGeneratorPage/>} />
          <Route path="/Profile/:_id" element={<UserDetails />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
    </Provider>
  );
}

export default App;
